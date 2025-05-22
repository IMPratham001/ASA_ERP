
"use client";

import React from "react";
import { useAccountingStore } from "@/lib/store/accounting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

interface JournalEntry {
  accountId: string;
  description: string;
  debit: number;
  credit: number;
}

export function JournalEntries() {
  const { accounts, addJournalEntry } = useAccountingStore();
  const [entries, setEntries] = React.useState<JournalEntry[]>([
    { accountId: '', description: '', debit: 0, credit: 0 }
  ]);

  const handleAddEntry = () => {
    setEntries([...entries, { accountId: '', description: '', debit: 0, credit: 0 }]);
  };

  const handleEntryChange = (index: number, field: keyof JournalEntry, value: string | number) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
  };

  const handleSave = () => {
    try {
      const totalDebits = entries.reduce((sum, entry) => sum + entry.debit, 0);
      const totalCredits = entries.reduce((sum, entry) => sum + entry.credit, 0);

      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        toast({
          title: "Error",
          description: "Total debits must equal total credits",
          variant: "destructive"
        });
        return;
      }

      addJournalEntry({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        description: 'Journal Entry',
        items: entries,
        status: 'draft',
        number: `JE-${Date.now()}`,
        reference: '',
        storeId: '',
        createdBy: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        postDate: null
      });

      toast({
        title: "Success",
        description: "Journal entry saved successfully"
      });

      setEntries([{ accountId: '', description: '', debit: 0, credit: 0 }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Account</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Debit</TableHead>
              <TableHead>Credit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>
                  <select
                    className="w-full p-2 border rounded"
                    value={entry.accountId}
                    onChange={(e) => handleEntryChange(index, 'accountId', e.target.value)}
                  >
                    <option value="">Select Account</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <Input
                    value={entry.description}
                    onChange={(e) => handleEntryChange(index, 'description', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={entry.debit}
                    onChange={(e) => handleEntryChange(index, 'debit', parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={entry.credit}
                    onChange={(e) => handleEntryChange(index, 'credit', parseFloat(e.target.value) || 0)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4">
          <Button onClick={handleAddEntry}>Add Line</Button>
          <Button onClick={handleSave}>Save Journal Entry</Button>
        </div>
      </CardContent>
    </Card>
  );
}
