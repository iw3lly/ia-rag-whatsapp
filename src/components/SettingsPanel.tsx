import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSettings, updateSettings } from '../api/settingsApi';

interface AppSettings {
  id: number;
  openrouter_api_key: string;
  openrouter_model: string;
  system_prompt: string;
}

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
    <form onSubmit={handleSubmit} className="settings-form">
      <h2>Painel de Configurações</h2>
      {}
      
      <div className="form-group">
        <label>OpenRouter API Key:</label>
        <input type="password" name="openrouter_api_key" value={formData.openrouter_api_key || ''} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>Modelo (ex: `anthropic/claude-3-haiku`):</label>
        <input type="text" name="openrouter_model" value={formData.openrouter_model || ''} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>System Prompt:</label>
        <textarea name="system_prompt" rows={8} value={formData.system_prompt || ''} onChange={handleChange} />
      </div>

      <button type="submit" disabled={mutation.isPending} className="save-button">
        {mutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </form>
  );
}