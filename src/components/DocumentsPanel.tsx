import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Document {
  id: string;
  file_name: string;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'ERROR';
  created_at: string;
}

const fetchDocuments = async (): Promise<Document[]> => {
  const { data } = await axios.get('/api/documents');
  return data;
};

const deleteDocument = async (id: string) => {
  await axios.delete(`/api/documents?id=${id}`);
};

const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  await axios.post('/api/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export function DocumentsPanel() {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: documents, isLoading: isLoadingDocs } = useQuery({
    queryKey: ['ragDocuments'],
    queryFn: fetchDocuments,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ragDocuments'] }); // Atualiza a lista
      alert('Documento deletado com sucesso.');
    },
    onError: (error: any) => {
      alert(`Erro ao deletar: ${error.message}`);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ragDocuments'] });
      setSelectedFile(null);
      alert('Upload iniciado! O processamento RAG pode levar alguns segundos.');
    },
    onError: (e: any) => {
      alert(`Erro no upload: ${e.response?.data?.error || e.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    } else {
      alert('Por favor, selecione um arquivo.');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza? Isso deletará os vetores de RAG.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto' }}>
      <h2>📚 Sistema de Documentos (RAG)</h2>

      {/* Formulário de Upload */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: '20px',
          padding: '15px',
          border: '1px solid #333',
          borderRadius: '8px',
        }}
      >
        <h3>1. Fazer Upload de Documento (PDF, TXT, MD)</h3>
        <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.md" />
        <button
          type="submit"
          disabled={!selectedFile || uploadMutation.isPending}
          style={{ marginLeft: '10px' }}
        >
          {uploadMutation.isPending ? 'Enviando e Processando...' : 'Enviar para RAG'}
        </button>
      </form>

      {/* Lista de Documentos */}
      <h3>2. Documentos Carregados</h3>
      {isLoadingDocs ? (
        <p>Carregando lista...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333' }}>
              <th style={{ padding: '8px', border: '1px solid #555', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '8px', border: '1px solid #555', textAlign: 'left' }}>
                Status
              </th>
              <th style={{ padding: '8px', border: '1px solid #555' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {documents?.map((doc) => (
              <tr key={doc.id}>
                <td style={{ padding: '8px', border: '1px solid #555' }}>{doc.file_name}</td>
                <td
                  style={{
                    padding: '8px',
                    border: '1px solid #555',
                    color:
                      doc.status === 'READY'
                        ? 'lightgreen'
                        : doc.status === 'ERROR'
                          ? 'red'
                          : 'yellow',
                  }}
                >
                  **{doc.status}**
                </td>
                <td style={{ padding: '8px', border: '1px solid #555', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deleteMutation.isPending}
                    style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
