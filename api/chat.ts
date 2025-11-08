import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { OpenAI } from 'openai';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
const getEmbeddingsClient = (apiKey: string) => new OpenAIEmbeddings({
    openAIApiKey: apiKey,
    modelName: 'openai/text-embedding-ada-002',
    configuration: {
      baseURL: "https://openrouter.api/api/v1",
    },
  });

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sessionId } = req.body;

  try {
    const { data: settings, error: settingsError } = await supabase
      .from('settings').select('*').eq('id', 1).single();
    if (settingsError || !settings?.openrouter_api_key) {
       
        return res.status(400).json({ error: 'Configurações de IA (API Key) não foram definidas no Painel.' });
    }
    
    const { openrouter_api_key, openrouter_model, system_prompt } = settings;

    const embeddingsClient = getEmbeddingsClient(openrouter_api_key);
    const queryEmbedding = await embeddingsClient.embedQuery(message);

    const { data: contextChunks, error: contextError } = await supabase.rpc('match_document_chunks', {
      query_embedding: queryEmbedding,
      match_threshold: 0.75,
      match_count: 5,
    });
    
    if (contextError) {
        console.error('RAG Error:', contextError);
    }
    
    const contextText = contextChunks 
        ? contextChunks.map((chunk: any) => chunk.content).join('\n\n---\n\n')
        : 'Nenhum contexto de documento encontrado para esta consulta.';

    const systemInstruction = `${system_prompt} Sua resposta deve ser baseada **EXCLUSIVAMENTE** nos documentos de contexto fornecidos. --- CONTEXTO DOS DOCUMENTOS --- ${contextText} ---`;

    const { data: history } = await supabase
        .from('chat_history')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(5);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemInstruction },
        ...(history || []).map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
        { role: 'user', content: message },
    ];

    const openrouter = new OpenAI({
      apiKey: openrouter_api_key,
      baseURL: "https://openrouter.api/api/v1",
    });

    const completion = await openrouter.chat.completions.create({
      model: openrouter_model,
      messages: messages,
      temperature: 0.2,
    });

    const aiResponse = completion.choices[0].message.content || 'Não consegui gerar uma resposta coerente com o contexto.';

    await supabase.from('chat_history').insert([
        { session_id: sessionId, role: 'user', content: message },
        { session_id: sessionId, role: 'assistant', content: aiResponse },
    ]);

    return res.status(200).json({ response: aiResponse });

  } catch (e: any) {
    console.error('Erro no processamento do Chat:', e);
    return res.status(500).json({ error: 'Erro interno ao processar a IA. Causa: ' + e.message });
  }
};