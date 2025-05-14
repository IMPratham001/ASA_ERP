"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

export type Account = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId: string | null;
  description: string;
  balance: number;
  currency: string;
  isGroup: boolean;
  storeId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type JournalEntry = {
  id: string;
  number: string;
  date: string;
  description: string;
  reference: string;
  storeId: string;
  status: 'draft' | 'posted' | 'void';
  items: JournalItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  postDate: string | null;
};

export type JournalItem = {
  id: string;
  journalId: string;
  accountId: string;
  description: string;
  debit: number;
  credit: number;
  currency: string;
  exchangeRate: number;
};

export type TaxRate = {
  id: string;
  name: string;
  rate: number;
  type: 'gst' | 'vat' | 'other';
  components?: {
    cgst?: number;
    sgst?: number;
    igst?: number;
  };
  isActive: boolean;
};

type AccountingState = {
  accounts: Account[];
  journalEntries: JournalEntry[];
  taxRates: TaxRate[];
  addAccount: (account: Account) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void;
  postJournalEntry: (id: string) => void;
  voidJournalEntry: (id: string) => void;
  addTaxRate: (taxRate: TaxRate) => void;
  updateTaxRate: (id: string, taxRate: Partial<TaxRate>) => void;
  getAccountBalance: (accountId: string, asOf?: string) => number;
  getTrialBalance: (asOf?: string) => { account: Account; balance: number }[];
};

export const useAccountingStore = create<AccountingState>()(
  persist(
    (set, get) => ({
      accounts: [],
      journalEntries: [],
      taxRates: [],
      
      addAccount: (account) =>
        set((state) => ({ accounts: [...state.accounts, account] })),
      
      updateAccount: (id, account) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, ...account, updatedAt: new Date().toISOString() } : a
          ),
        })),
      
      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
        })),
      
      addJournalEntry: (entry) =>
        set((state) => ({ journalEntries: [...state.journalEntries, entry] })),
      
      updateJournalEntry: (id, entry) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((je) =>
            je.id === id ? { ...je, ...entry, updatedAt: new Date().toISOString() } : je
          ),
        })),
      
      postJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((je) =>
            je.id === id
              ? {
                  ...je,
                  status: 'posted',
                  postDate: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : je
          ),
        })),
      
      voidJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((je) =>
            je.id === id
              ? {
                  ...je,
                  status: 'void',
                  updatedAt: new Date().toISOString(),
                }
              : je
          ),
        })),
      
      addTaxRate: (taxRate) =>
        set((state) => ({ taxRates: [...state.taxRates, taxRate] })),
      
      updateTaxRate: (id, taxRate) =>
        set((state) => ({
          taxRates: state.taxRates.map((tr) =>
            tr.id === id ? { ...tr, ...taxRate } : tr
          ),
        })),
      
      getAccountBalance: (accountId, asOf) => {
        const state = get();
        const account = state.accounts.find((a) => a.id === accountId);
        if (!account) return 0;

        let balance = 0;
        state.journalEntries
          .filter((je) => 
            je.status === 'posted' && 
            (!asOf || new Date(je.date) <= new Date(asOf))
          )
          .forEach((je) => {
            je.items
              .filter((item) => item.accountId === accountId)
              .forEach((item) => {
                balance += item.debit - item.credit;
              });
          });

        return balance;
      },
      
      getTrialBalance: (asOf) => {
        const state = get();
        return state.accounts.map((account) => ({
          account,
          balance: get().getAccountBalance(account.id, asOf),
        }));
      },
    }),
    {
      name: 'erp-accounting',
    }
  )
);