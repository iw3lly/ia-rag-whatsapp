import React, { useState } from 'react';

export function TestChat() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionalidade de Chat (Item 4) não implementada.');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', border: '1px solid #333', borderRadius: '8px', padding: '10px' }}>
      <h2>Interface de Teste</h2>
      <div style={{ height: '300px', border: '1px solid #555', marginBottom: '10px', padding: '5px', overflowY: 'scroll' }}>
        <p>Histórico do Chat (Item 4) apareceria aqui.</p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
          placeholder="Digite sua mensagem..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}