
import React from "react";
import { useAccountingStore } from "@/lib/store/accounting";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function TrialBalance() {
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const { getTrialBalance } = useAccountingStore();
  const trialBalance = React.useMemo(() => getTrialBalance(date), [date, getTrialBalance]);

  const totalDebits = React.useMemo(() => 
    trialBalance.reduce((sum, { balance }) => 
      sum + (balance > 0 ? balance : 0), 0), [trialBalance]);

  const totalCredits = React.useMemo(() => 
    trialBalance.reduce((sum, { balance }) => 
      sum + (balance < 0 ? Math.abs(balance) : 0), 0), [trialBalance]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Trial Balance</h3>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-40"
          />
          <Button variant="outline">Export PDF</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Code</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Debit</TableHead>
            <TableHead className="text-right">Credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trialBalance.map(({ account, balance }) => (
            <TableRow key={account.id}>
              <TableCell>{account.code}</TableCell>
              <TableCell>{account.name}</TableCell>
              <TableCell className="capitalize">{account.type}</TableCell>
              <TableCell className="text-right">
                {balance > 0 ? balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '-'}
              </TableCell>
              <TableCell className="text-right">
                {balance < 0 ? Math.abs(balance).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '-'}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-bold">
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {totalDebits.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </TableCell>
            <TableCell className="text-right">
              {totalCredits.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
