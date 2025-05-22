
"use client";

import { useState } from "react";
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

export function JournalEntries() {
  const { accounts, addJournalEntry } = useAccountingStore();
  const [entries, setEntries] = useState([{ accountId: '', description: '', debit: 0, credit: 0 }]);

  const handleAddEntry = () => {
    setEntries([...entries, { accountId: '', description: '', debit: 0, credit: 0 }]);
  };

  const handleSave = () => {
    const totalDebits = entries.reduce((sum, entry) => sum + entry.debit, 0);
    const totalCredits = entries.reduce((sum, entry) => sum + entry.credit, 0);

    if (totalDebits !== totalCredits) {
      alert('Total debits must equal total credits');
      return;
    }

    addJournalEntry({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      description: 'New Journal Entry',
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
                    onChange={(e) => {
                      const newEntries = [...entries];
                      newEntries[index].accountId = e.target.value;
                      setEntries(newEntries);
                    }}
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
                    onChange={(e) => {
                      const newEntries = [...entries];
                      newEntries[index].description = e.target.value;
                      setEntries(newEntries);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={entry.debit}
                    onChange={(e) => {
                      const newEntries = [...entries];
                      newEntries[index].debit = parseFloat(e.target.value) || 0;
                      setEntries(newEntries);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={entry.credit}
                    onChange={(e) => {
                      const newEntries = [...entries];
                      newEntries[index].credit = parseFloat(e.target.value) || 0;
                      setEntries(newEntries);
                    }}
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
