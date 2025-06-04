const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include', // Important for sanctum
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
};

// Dashboard specific service
export const dashboardService = {
  async getStats() {
    return apiClient.get('/dashboard/stats'); // This should match your Laravel route
  }
};