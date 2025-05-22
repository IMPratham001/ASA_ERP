
export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive';
}

export interface TaxSetting {
  id: string;
  name: string;
  percentage: number;
  isDefault: boolean;
  status: 'active' | 'inactive';
}

export interface JournalEntry {
  id: string;
  date: Date;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: 'pending' | 'posted';
}
