import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export function TestChat() {

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', content: 'Olá! Use este chat para testar a IA. Sua sessão é a "123". Lembre-se de configurar a API Key no painel "Configurações" antes de perguntar.' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const TEST_SESSION_ID = '123'; 

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: input.trim() };
  
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/chat', {
        message: userMessage.content,
        sessionId: TEST_SESSION_ID,
      });

      const aiResponse: Message = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: data.response 
      };
      setMessages(prev => [...prev, aiResponse]);

    } catch (error: any) {
      console.error('Chat API Error:', error);
      const errorMessage = error.response?.data?.error || 'Erro de rede ou na IA. Verifique suas configurações e dependências.';
      const errorMsg: Message = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: `**ERRO:** ${errorMessage}` 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #333', borderRadius: '8px', display: 'flex', flexDirection: 'column', height: '60vh' }}>
      <h2 style={{ padding: '10px', margin: 0, borderBottom: '1px solid #333' }}>💬 Chat de Teste (Item 4)</h2>
      
      {/* Área de Mensagens */}
      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '15px' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            marginBottom: '10px',
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '10px',
              borderRadius: '10px',
              background: msg.role === 'user' ? '#1E88E5' : '#424242',
              color: 'white',
              fontSize: '14px',
              wordBreak: 'break-word'
            }}>
              {msg.content}
              {isLoading && msg.id === messages[messages.length - 1].id && msg.role === 'user' && (
                <span className="loading-dots">...</span>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Formulário de Input */}
      <form onSubmit={handleSubmit} style={{ borderTop: '1px solid #333', padding: '10px', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? 'Aguardando resposta...' : 'Digite sua pergunta...'}
          disabled={isLoading}
          style={{ flexGrow: 1, padding: '10px', borderRadius: '5px', border: '1px solid #555', background: '#333', color: 'white' }}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          style={{ padding: '10px 15px', marginLeft: '10px', background: '#1E88E5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Enviar
        </button>
      </form>
      
      {/* Adicionar CSS para o efeito de loading */}
      <style>{`
        .loading-dots:after {
          overflow: hidden;
          display: inline-block;
          vertical-align: bottom;
          -webkit-animation: ellipsis steps(4, end) 900ms infinite;
          animation: ellipsis steps(4, end) 900ms infinite;
          content: "\\2026"; 
          width: 0;
        }
        @keyframes ellipsis {
          to {
            width: 1.25em;
          }
        }
      `}</style>
    </div>
  );
}