
"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const permissionSchema = z.object({
  permissions: z.array(z.string()).min(1, "Select at least one permission"),
});

export function UserPermissionForm({ onSubmit, initialPermissions = [] }) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      permissions: initialPermissions,
    },
  });

  const handleSubmit = async (data) => {
    setLoading(true);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="permissions"
          render={() => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                {["create", "read", "update", "delete", "manage"].map((permission) => (
                  <FormControl key={permission}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={form.watch("permissions").includes(permission)}
                        onCheckedChange={(checked) => {
                          const current = form.watch("permissions");
                          const updated = checked
                            ? [...current, permission]
                            : current.filter((p) => p !== permission);
                          form.setValue("permissions", updated);
                        }}
                      />
                      <span className="capitalize">{permission}</span>
                    </div>
                  </FormControl>
                ))}
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Permissions"}
        </Button>
      </form>
    </Form>
  );
}
