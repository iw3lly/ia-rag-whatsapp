import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! 
);

export default async (req: VercelRequest, res: VercelResponse) => {

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1) 
        .single();

      if (error) {
        if (error.code === 'PGRST116') { 
            return res.status(200).json({ openrouter_model: 'openai/gpt-3.5-turbo', system_prompt: 'Você é um assistente prestativo.' });
        }
        throw error;
      }
      return res.status(200).json(data);

    } catch (error: any) {
      console.error('ERRO INTERNO DO GET:', error.message);
      return res.status(500).json({ error: 'Erro de conexão com o Supabase: ' + error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { openrouter_api_key, openrouter_model, system_prompt } = req.body;

      const { data, error } = await supabase
        .from('settings')
        .update({ 
          openrouter_api_key, 
          openrouter_model, 
          system_prompt 
        })
        .eq('id', 1) 
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);

    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};