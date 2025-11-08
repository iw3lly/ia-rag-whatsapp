import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

export function TestChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Olá! Use este chat para testar a IA. Sua sessão é a "123". Lembre-se de configurar a API Key no painel "Configurações" antes de perguntar.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const testSessionId = '123';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now(), role: 'user', content: input.trim() };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post('/api/chat', {
        message: userMessage.content,
        sessionId: testSessionId,
      });

      const aiResponse: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error: any) {
      console.error('Chat API Error:', error);
      const errorMessage = error.response?.data?.error || 'Erro de rede ou na IA. Chave inválida ou modelo incorreto. Verifique suas configurações.';

      const errorMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `**ERRO:** ${errorMessage}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">
        💬 Chat de Teste (Item 4)
      </h2>

      <div className="message-area">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-row ${msg.role === 'user' ? 'user' : 'assistant'}`}
          >
            <div className="message-bubble">
              {msg.content}
              {isLoading && msg.id === messages[messages.length - 1].id && msg.role === 'user' && (
                <span className="loading-dots"></span>
              )}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="input-form"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? 'Aguardando resposta...' : 'Digite sua pergunta...'}
          disabled={isLoading}
          className="input-field"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="send-button"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}