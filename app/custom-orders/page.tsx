
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerSelect } from "@/components/billing/customer-select";
import { useForm } from "react-hook-form";

export default function CustomOrdersPage() {
  const form = useForm();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Custom Orders</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Custom Order</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Custom Order</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <div className="grid gap-4 py-4">
                <CustomerSelect />
                <FormField
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shringar">Thakorji Shringar</SelectItem>
                          <SelectItem value="vastra">Ang Vastra</SelectItem>
                          <SelectItem value="accessories">Silver Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Design Specifications</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materials Required</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {/* Add more fields for artisan assignment, delivery date, etc. */}
              </div>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Artisan</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Custom orders will be mapped here */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
