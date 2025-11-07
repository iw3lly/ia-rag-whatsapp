import { VercelRequest, VercelResponse } from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {

  if (req.method === 'GET') {
    return res.status(200).json({
      id: 1,
      openrouter_api_key: '********',
      openrouter_model: 'mock/modelo-falso',
      system_prompt: 'Eu sou um assistente mockado. Meu backend real está quebrado.'
    });
  }

  if (req.method === 'POST') {
    return res.status(200).json(req.body);
  }
  
  res.status(405).json({ error: 'Method not allowed' });
};