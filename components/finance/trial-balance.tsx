
"use client";

import { useState } from "react";
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
  const { getTrialBalance } = useAccountingStore();
  const [asOfDate, setAsOfDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const trialBalance = getTrialBalance(asOfDate);

  const totalDebits = trialBalance.reduce(
    (sum, { balance }) => sum + (balance > 0 ? balance : 0),
    0
  );
  const totalCredits = trialBalance.reduce(
    (sum, { balance }) => sum + (balance < 0 ? Math.abs(balance) : 0),
    0
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Trial Balance</h3>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
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
                {balance > 0 ? `₹${balance.toFixed(2)}` : "-"}
              </TableCell>
              <TableCell className="text-right">
                {balance < 0 ? `₹${Math.abs(balance).toFixed(2)}` : "-"}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="font-bold">
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">₹{totalDebits.toFixed(2)}</TableCell>
            <TableCell className="text-right">₹{totalCredits.toFixed(2)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
