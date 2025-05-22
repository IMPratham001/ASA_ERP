"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useStore } from "@/lib/store/store";
import { useToast } from "@/hooks/use-toast";
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
import { PrinterIcon, Save, QrCode, FileText, Send } from "lucide-react";

const formSchema = z.object({
  invoiceType: z.enum(["retail", "wholesale", "tax"]).optional(),
  templateId: z.string().default("modern").optional(),
  customerId: z.string().optional(),
  storeId: z.string().optional(),
  currency: z.string().default("USD").optional(),
  paymentMode: z.enum(["cash", "upi", "card", "credit", "razorpay"]).optional(),
  dueDate: z.date().optional(),
  isRecurring: z.boolean().default(false).optional(),
  recurringFrequency: z.enum(["monthly", "quarterly", "yearly"]).optional().optional(),
  approvalRequired: z.boolean().default(false).optional(),
  customFields: z.record(z.string()).default({}).optional(),
  note: z.string().optional(),
});

export default function CreateInvoicePage() {
  const { user, customers, products, createInvoice } = useStore();
  const [items, setItems] = useState([]);
  const [scannedBarcode, setScannedBarcode] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceType: "retail",
      note: "",
      customerId: "",
      dueDate: "",
    },
  });

  const { toast } = useToast();
  
  const handleBarcodeScanned = (barcode: string) => {
    const product = products.find(p => p.sku === barcode);
    if (product) {
      setItems([...items, {
        id: Math.random().toString(),
        productId: product.id,
        quantity: 1,
        price: product.price,
        tax: product.tax || 0,
        discount: 0
      }]);
      
      toast({
        title: "Product Added",
        description: `Added ${product.name} to invoice`,
        variant: "success"
      });
    } else {
      toast({
        title: "Product Not Found",
        description: `No product found with barcode ${barcode}`,
        variant: "destructive"
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const validatedData = formSchema.parse(values);

      if (items.length === 0) {
        throw new Error("Please add at least one item to the invoice");
      }

      const invoiceData = {
        customer_id: validatedData.customerId,
        due_date: validatedData.dueDate,
        notes: validatedData.note,
        items: items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          tax: item.tax || 0
        }))
      };

      // const response = await invoices.create(invoiceData);

      // toast({
      //   title: "Success",
      //   description: "Invoice created successfully",
      // });

      // router.push(`/invoices/${response.invoice.id}`);

    } catch (error) {
      console.error("Form submission error:", error);
      // toast({
      //   title: "Error",
      //   description: error instanceof Error ? error.message : "Failed to create invoice",
      //   variant: "destructive"
      // });
    }
  };

  const handleCreateInvoice = async (data) => {
    try {
      const invoice = await createInvoice({
        ...data,
        items,
        status: "draft",
        total: items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
      });

      // Handle success
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => form.reset()}>
            Clear
          </Button>
          <Button variant="outline" onClick={() => window.open(`/api/invoices/preview/${form.getValues().templateId}`, '_blank')}>
            <PrinterIcon className="mr-2 h-4 w-4" />
            PDF Preview
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
          <Button variant="outline" onClick={() => handleBarcodeScanned(scannedBarcode)}>
            <QrCode className="w-4 h-4 mr-2" />
            Scan Barcode
          </Button>
          <Button onClick={form.handleSubmit(handleCreateInvoice)}>
            <Save className="w-4 h-4 mr-2" />
            Save Invoice
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="dark:bg-slate-900/50 backdrop-blur-sm">
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
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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

              <Input
                placeholder="Scan barcode..."
                value={scannedBarcode}
                onChange={(e) => setScannedBarcode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleBarcodeScanned(scannedBarcode);
                    setScannedBarcode('');
                  }
                }}
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