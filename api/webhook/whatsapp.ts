import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const CHAT_API_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/chat` : 'http://localhost:3000/api/chat';

const EVO_API_URL = process.env.EVOLUTION_API_URL || 'https://evodevs.cordex.ai';
const EVO_API_KEY = process.env.EVOLUTION_API_KEY!;
const INSTANCE_NAME = 'default'; 

const sendWhatsAppReply = async (recipient: string, message: string) => {
  try {
    await axios.post(
      `${EVO_API_URL}/message/sendText/${INSTANCE_NAME}`, 
      {
        number: recipient,
        textMessage: { text: message },
      },
      { headers: { 'apiKey': EVO_API_KEY } }
    );
  } catch (e: any) {
    console.error('Erro ao enviar p/ Evolution:', e.response?.data?.message || e.message);
  }
};

export default async (req: VercelRequest, res: VercelResponse) => {
 
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

 
  const isMessage = req.body.event === 'messages.upsert';
  const isFromUser = !req.body.data?.key?.fromMe;

  if (isMessage && isFromUser) {
    const messageData = req.body.data;
    const senderJid = messageData.key.remoteJid;

    const messageText = messageData.message?.conversation || messageData.message?.extendedTextMessage?.text;

    if (!messageText) {
      return res.status(200).send('Mensagem sem texto, ignorando.');
    }

    const sessionId = senderJid; 
    
    try {
      const chatResponse = await axios.post(CHAT_API_URL, {
        message: messageText,
        sessionId: sessionId, 
      });

      const aiReply = chatResponse.data.response;

      await sendWhatsAppReply(sessionId, aiReply);

      return res.status(200).json({ success: true, reply: aiReply });

    } catch (e: any) {
      console.error('Erro no processamento do webhook:', e.message);
      await sendWhatsAppReply(sessionId, 'Desculpe, um erro interno ocorreu ao processar a IA.');
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(200).send('Webhook recebido e ignorado.');
};