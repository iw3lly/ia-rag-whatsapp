import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import formidable from 'formidable';
import fs from 'fs';
import pdf from 'pdf-parse';
export const config = {
  api: { bodyParser: false },
};

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

const parseForm = (
  req: VercelRequest,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const getEmbeddingsClient = (apiKey: string) =>
  new OpenAIEmbeddings({
    openAIApiKey: apiKey,
    modelName: 'openai/text-embedding-ada-002',
    configuration: {
      baseURL: 'https://openrouter.api/api/v1',
    },
  });

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('documents')
      .select('id, file_name, status, created_at');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const { error: doc_error } = await supabase.from('documents').delete().eq('id', id);
    if (doc_error) return res.status(500).json({ error: doc_error.message });
    return res.status(200).json({ message: 'Documento deletado.' });
  }

  if (req.method === 'POST') {
    let documentId = '';
    try {
      const { data: settings } = await supabase
        .from('settings')
        .select('openrouter_api_key')
        .eq('id', 1)
        .single();
      if (!settings?.openrouter_api_key) {
        return res.status(400).json({ error: 'API Key da OpenRouter não configurada no Painel.' });
      }

      const { files } = await parseForm(req);
      const file = files.file as formidable.File;
      const filePath = file.filepath;
      const fileName = file.originalFilename || 'unknown';
      const fileType = file.mimetype;

      const fileBuffer = fs.readFileSync(filePath);
      const storagePath = `public/${fileName.replace(/ /g, '_')}_${Date.now()}`;
      await supabase.storage
        .from('documents')
        .upload(storagePath, fileBuffer, { contentType: fileType });

      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({ file_name: fileName, storage_path: storagePath, status: 'PROCESSING' })
        .select()
        .single();
      if (docError) throw new Error(`DB Error: ${docError.message}`);
      documentId = docData.id;

      let textContent = '';
      if (fileType === 'application/pdf') {
        const data = await pdf(fileBuffer);
        textContent = data.text;
      } else {
        textContent = fileBuffer.toString('utf-8');
      }

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const chunks = await splitter.createDocuments([textContent]);

      const embeddingsClient = getEmbeddingsClient(settings.openrouter_api_key);
      const chunksToInsert = [];

      for (const chunk of chunks) {
        const embedding = await embeddingsClient.embedQuery(chunk.pageContent);
        chunksToInsert.push({
          document_id: docData.id,
          content: chunk.pageContent,
          embedding: embedding,
        });
      }

      await supabase.from('document_chunks').insert(chunksToInsert);

      await supabase.from('documents').update({ status: 'READY' }).eq('id', docData.id);

      return res.status(201).json(docData);
    } catch (e: any) {
      console.error('Erro no upload/RAG:', e);
      if (documentId) {
        await supabase.from('documents').update({ status: 'ERROR' }).eq('id', documentId);
      }
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
};
