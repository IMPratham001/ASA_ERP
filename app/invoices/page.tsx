"use client";

import { InvoiceList } from "@/components/features/billing/invoice-list";

export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Invoice Management</h1>
      <InvoiceList />
    </div>
  );
}