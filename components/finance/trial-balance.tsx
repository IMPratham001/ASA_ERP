import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BalanceEntry {
  account: string;
  debit: number;
  credit: number;
}

export function TrialBalance() {
  const [entries] = React.useState<BalanceEntry[]>([
    { account: "Cash", debit: 5000, credit: 0 },
    { account: "Accounts Receivable", debit: 3000, credit: 0 },
    { account: "Accounts Payable", debit: 0, credit: 2000 },
  ]);

  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Debit</TableHead>
            <TableHead className="text-right">Credit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, index) => (
            <TableRow key={index}>
              <TableCell>{entry.account}</TableCell>
              <TableCell className="text-right">
                {entry.debit > 0 ? entry.debit.toFixed(2) : "-"}
              </TableCell>
              <TableCell className="text-right">
                {entry.credit > 0 ? entry.credit.toFixed(2) : "-"}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-bold">Total</TableCell>
            <TableCell className="text-right font-bold">
              {totalDebit.toFixed(2)}
            </TableCell>
            <TableCell className="text-right font-bold">
              {totalCredit.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}