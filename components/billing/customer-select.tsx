"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const customers = [
  {
    id: "1",
    name: "John Doe",
    phone: "+91 98765 43210",
    email: "john@example.com",
    gstin: "29ABCDE1234F1Z5",
  },
  {
    id: "2",
    name: "Jane Smith",
    phone: "+91 98765 43211",
    email: "jane@example.com",
    gstin: "29FGHIJ5678K2Z5",
  },
];

export function CustomerSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
  });

  const handleAddCustomer = () => {
    // Will be integrated with API later
    console.log("New customer:", newCustomer);
    setDialogOpen(false);
    setNewCustomer({ name: "", phone: "", email: "", gstin: "" });
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? customers.find((customer) => customer.id === value)?.name
              : "Select customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search customers..." />
            <CommandEmpty>
              <p>No customer found.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={() => {
                    onChange(customer.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{customer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="Name"
                value={newCustomer.name}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Phone"
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Email"
                type="email"
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="GSTIN (optional)"
                value={newCustomer.gstin}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, gstin: e.target.value })
                }
              />
            </div>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}