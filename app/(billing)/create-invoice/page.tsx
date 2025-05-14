"use client";

import { InvoiceForm } from "@/components/features/billing/invoice-form";

export default function CreateInvoicePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Create Invoice</h1>
      <InvoiceForm />
    </div>
  );
}