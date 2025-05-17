
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerSelect } from "@/components/billing/customer-select";
import { useForm } from "react-hook-form";
import { useStore } from "@/lib/store/store";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function CreateCustomOrderPage() {
  const router = useRouter();
  const { addCustomOrder } = useStore();
  const form = useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    try {
      await addCustomOrder({
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      router.push("/custom-orders");
    } catch (error) {
      console.error("Error creating custom order:", error);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create Custom Order</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      <Textarea {...field} placeholder="Enter detailed specifications" />
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
                      <Input {...field} placeholder="List required materials" />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => router.push("/custom-orders")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Order"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
