
import { financeAPI } from '@/lib/api/finance/transactions';
import axios from 'axios';

jest.mock('axios');

describe('Finance API', () => {
  it('fetches transactions correctly', async () => {
    const mockData = [{ id: 1, amount: 100 }];
    axios.get.mockResolvedValueOnce({ data: mockData });
    
    const result = await financeAPI.getAll();
    expect(result.data).toEqual(mockData);
  });
  
  it('handles errors appropriately', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));
    
    await expect(financeAPI.getAll()).rejects.toThrow('Network error');
  });
});
