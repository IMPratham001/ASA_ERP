"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Role, UserPermissions } from "@/lib/auth/types";
import { DEFAULT_PERMISSIONS } from "@/lib/auth/permissions";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ShoppingCart, Package, Users, Store } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['super_admin', 'store_manager', 'marketing_staff', 'sales_staff', 'accounting_staff']),
  storeId: z.string().optional(),
  permissions: z.object({
    canCreateInvoice: z.boolean(),
    canViewFinancials: z.boolean(),
    canManageProducts: z.boolean(),
    canManageStaff: z.boolean(),
    canSwitchStores: z.boolean(),
  }),
});

export function UserPermissionForm({ user, onSubmit }) {
  const [role, setRole] = useState<Role>(user?.role || 'sales_staff');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      name: user?.name || '',
      role: user?.role || 'sales_staff',
      storeId: user?.storeId || undefined,
      permissions: user?.permissions || DEFAULT_PERMISSIONS[role],
    },
  });

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    form.setValue('permissions', DEFAULT_PERMISSIONS[newRole]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={(value: Role) => {
                      field.onChange(value);
                      handleRoleChange(value);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="store_manager">Store Manager</SelectItem>
                      <SelectItem value="marketing_staff">Marketing Staff</SelectItem>
                      <SelectItem value="sales_staff">Sales Staff</SelectItem>
                      <SelectItem value="accounting_staff">Accounting Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {role !== 'super_admin' && (
              <FormField
                control={form.control}
                name="storeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Store</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Main Store</SelectItem>
                        <SelectItem value="2">Branch Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FormField
              control={form.control}
              name="permissions.canCreateInvoice"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <ShoppingCart className="mr-2 h-4 w-4 inline" />
                      Create Invoices
                    </FormLabel>
                    <FormDescription>
                      Can create and manage sales invoices
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions.canViewFinancials"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <FileText className="mr-2 h-4 w-4 inline" />
                      View Financial Reports
                    </FormLabel>
                    <FormDescription>
                      Can access financial reports and analytics
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions.canManageProducts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <Package className="mr-2 h-4 w-4 inline" />
                      Manage Products
                    </FormLabel>
                    <FormDescription>
                      Can add, edit, and delete products
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions.canManageStaff"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <Users className="mr-2 h-4 w-4 inline" />
                      Manage Staff
                    </FormLabel>
                    <FormDescription>
                      Can manage user accounts and permissions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions.canSwitchStores"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      <Store className="mr-2 h-4 w-4 inline" />
                      Switch Stores
                    </FormLabel>
                    <FormDescription>
                      Can access and switch between different stores
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}