
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";

export interface Invoice {
  id: string;
  number: string;
  date: string;
  customer: string;
  amount: number;
  status: "draft" | "pending" | "paid" | "overdue";
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    number: "INV-001",
    date: "2024-02-14",
    customer: "Acme Corp",
    amount: 1200.00,
    status: "paid"
  },
  {
    id: "2", 
    number: "INV-002",
    date: "2024-02-15",
    customer: "Globex Inc",
    amount: 850.50,
    status: "pending"
  },
  {
    id: "3",
    number: "INV-003", 
    date: "2024-02-16",
    customer: "Stark Industries",
    amount: 3200.75,
    status: "draft"
  }
];

const statusColors = {
  draft: "bg-gray-500",
  pending: "bg-yellow-500",
  paid: "bg-green-500",
  overdue: "bg-red-500"
};

export function InvoiceList() {
  const router = useRouter();
  const [invoices] = useState<Invoice[]>(mockInvoices);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Invoices</CardTitle>
        <Button onClick={() => router.push("/create-invoice")}>
          <Plus className="mr-2 h-4 w-4" />
          New Invoice
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.number}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[invoice.status]}>
                    {invoice.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => router.push(`/invoices/${invoice.id}`)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
