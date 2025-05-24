
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TransactionForm } from '@/components/finance/transaction-form';
import { financeAPI } from '@/lib/api/finance/transactions';

jest.mock('@/lib/api/finance/transactions');

describe('TransactionForm', () => {
  it('submits form data correctly', async () => {
    render(<TransactionForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Amount'), {
      target: { value: '100' }
    });
    
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Test transaction' }
    });
    
    fireEvent.click(screen.getByText('Create Transaction'));
    
    await waitFor(() => {
      expect(financeAPI.create).toHaveBeenCalledWith({
        amount: 100,
        description: 'Test transaction'
      });
    });
  });
});
