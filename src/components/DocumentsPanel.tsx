import React, { useState } from 'react';

export function DocumentsPanel() {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Funcionalidade de Upload (Item 2) não implementada.');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2>Sistema de Documentos (RAG)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #333', borderRadius: '8px' }}>
        <h3>Fazer Upload (PDF, TXT)</h3>
        <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        <button type="submit">Enviar</button>
      </form>
      <h3>Documentos Carregados</h3>
      <p>(A lista de documentos (Item 2) apareceria aqui.)</p>
    </div>
  );
}