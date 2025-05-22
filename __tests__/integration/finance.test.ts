
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FinancialDashboard } from '@/components/finance/financial-dashboard';
import { JournalEntries } from '@/components/finance/journal-entries';

describe('Finance Module Integration', () => {
  describe('Financial Dashboard', () => {
    beforeEach(() => {
      render(<FinancialDashboard />);
    });

    it('should display correct financial metrics', async () => {
      expect(await screen.findByText('Total Assets')).toBeInTheDocument();
      expect(await screen.findByText('Total Liabilities')).toBeInTheDocument();
      expect(await screen.findByText('Total Equity')).toBeInTheDocument();
    });
  });

  describe('Journal Entries', () => {
    beforeEach(() => {
      render(<JournalEntries />);
    });

    it('should create new journal entry', async () => {
      const addButton = screen.getByText('Add Entry');
      fireEvent.click(addButton);
      expect(await screen.findByText('New Journal Entry')).toBeInTheDocument();
    });
  });
});
