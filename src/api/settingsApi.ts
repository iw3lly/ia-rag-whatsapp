import axios from 'axios';

interface AppSettings {
  id: number;
  openrouter_api_key: string;
  openrouter_model: string;
  system_prompt: string;
}

export const fetchSettings = async (): Promise<AppSettings> => {
  const { data } = await axios.get('/api/settings');
  return data;
};

export const updateSettings = async (settings: Partial<AppSettings>): Promise<AppSettings> => {
  const { data } = await axios.post('/api/settings', settings);
  return data;
};