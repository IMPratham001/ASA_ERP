"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore } from "@/lib/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerSelect } from "@/components/billing/customer-select";
import { ProductTable } from "@/components/billing/product-table";
import { InvoiceSummary } from "@/components/billing/invoice-summary";
import { StoreSelect } from "@/components/billing/store-select";
import { PrinterIcon, Save } from "lucide-react";

const formSchema = z.object({
  invoiceType: z.enum(["retail", "wholesale"]),
  customerId: z.string(),
  storeId: z.string(),
  paymentMode: z.enum(["cash", "upi", "card", "credit"]),
  note: z.string().optional(),
});

export default function CreateInvoicePage() {
  const { user } = useStore();
  const [items, setItems] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceType: "retail",
      note: "",
    },
  });

  const onSubmit = (values) => {
    console.log("Form submitted:", values);
    // Will be integrated with API later
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => form.reset()}>
            Clear
          </Button>
          <Button variant="outline">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print Preview
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="invoiceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store</FormLabel>
                    <StoreSelect
                      value={field.value}
                      onChange={field.onChange}
                      disabled={user?.role !== "super_admin"}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <CustomerSelect
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Mode</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Add note (optional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <ProductTable items={items} setItems={setItems} />
          <InvoiceSummary items={items} />
        </form>
      </Form>
    </div>
  );
}