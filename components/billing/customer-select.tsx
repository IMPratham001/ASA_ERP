'use client';

import { Check, ChevronsUpDown } from "lucide-react";
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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  gstin: string;
}

interface CustomerSelectProps {
  customers?: Customer[];
  onSelect: (customerId: string) => void;
  selectedId?: string;
}

export function CustomerSelect({ customers = [], onSelect, selectedId }: CustomerSelectProps) {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    gstin: "",
  });
  const selectedCustomer = customers.find(c => c.id === selectedId);

    const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) {
      toast({
        title: "Error",
        description: "Customer name is required",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await customerAPI.create({
        ...newCustomer,
        status: 'pending_details', // Indicates admin needs to verify complete details
        customerType: 'individual',
      });
      
      if (response.data) {
        onSelect(response.data.id);
        toast({
          title: "Success",
          description: "Customer added successfully. Details pending admin verification.",
        });
      }
      
      setDialogOpen(false);
      setNewCustomer({ name: "", phone: "", email: "", gstin: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      });
    }
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
            {selectedCustomer?.name ?? "Select customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
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
                    onSelect(customer.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {customer.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
             <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent aria-describedby="customer-form-description">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <p id="customer-form-description" className="text-sm text-muted-foreground">
              Enter the customer details below to add them to your system.
            </p>
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