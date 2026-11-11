const API_BASE_URL = '/api';

const apiClient = {
  async post(endpoint: string, data: any) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include', // Equivalent to withCredentials: true
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }
};

export const api = apiClient;

export const login = (username: string, password: string) => 
  api.post('/login', { username, password });

export const generateReport = (config: string) => 
  api.post('/generate-report', { config });
