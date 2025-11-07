import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface AppSettings {
  id: number;
  openrouter_api_key: string;
  openrouter_model: string;
  system_prompt: string;
}

const fetchSettings = async (): Promise<AppSettings> => {
  const { data } = await axios.get('/api/settings');
  return data;
};

const updateSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  const { data } = await axios.post('/api/settings', settings);
  return data;
};

export function SettingsPanel() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<AppSettings>>({});

  const { data: settingsData, isLoading: isLoadingQuery } = useQuery({
    queryKey: ['appSettings'], 
    queryFn: fetchSettings,      
  });

  const mutation = useMutation({
    mutationFn: updateSettings, 
    onSuccess: (data) => {
      queryClient.setQueryData(['appSettings'], data); 
      alert('Salvo com sucesso!');
    },
    onError: () => {
      alert('Erro ao salvar as configurações.');
    },
  });

  useEffect(() => {
    if (settingsData) {
      setFormData(settingsData);
    }
  }, [settingsData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoadingQuery) {
    return <div>Carregando configurações do Supabase...</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px', margin: 'auto', padding: '20px', border: '1px solid #333', borderRadius: '8px' }}>
      <h2>Painel de Configurações</h2>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label>OpenRouter API Key:</label>
        <input
          type="password"
          name="openrouter_api_key"
          value={formData.openrouter_api_key || ''}
          onChange={handleChange}
          style={{ padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label>Seletor de Modelo (ex: `anthropic/claude-3-haiku`):</label>
        <input
          type="text"
          name="openrouter_model"
          value={formData.openrouter_model || ''}
          onChange={handleChange}
          style={{ padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label>System Prompt:</label>
        <textarea
          name="system_prompt"
          rows={8}
          value={formData.system_prompt || ''}
          onChange={handleChange}
          style={{ padding: '8px', fontFamily: 'sans-serif', marginTop: '5px' }}
        />
      </div>

      {/* --- CORREÇÃO AQUI --- */}
      <button type="submit" disabled={mutation.isPending} style={{ padding: '12px', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
        {mutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </form>
  );
}