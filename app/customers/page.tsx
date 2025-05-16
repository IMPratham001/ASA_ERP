"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Plus,
  Search,
  Download,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function CustomersPage() {
  const {
    customers,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editCustomer, setEditCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (typeof fetchCustomers === "function") {
      fetchCustomers();
    } else {
      console.error("fetchCustomers is not a function");
    }
  }, [fetchCustomers]);

  const filteredCustomers =
    customers?.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => {
            setNewCustomer({});
            setIsDialogOpen(true);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {customer.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {customer.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {customer.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setEditCustomer(customer)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteCustomer(customer.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen || !!editCustomer} onOpenChange={() => {
        setIsDialogOpen(false);
        setEditCustomer(null);
        setNewCustomer({});
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={(editCustomer?.name ) ?? (newCustomer?.name ?? '')}
                onChange={(e) => {
                  if (editCustomer) {
                    setEditCustomer({...editCustomer, name: e.target.value});
                  } else {
                    setNewCustomer({...newCustomer, name: e.target.value});
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={(editCustomer?.email) ?? (newCustomer?.email ?? '')}
                onChange={(e) => {
                  if (editCustomer) {
                    setEditCustomer({...editCustomer, email: e.target.value});
                  } else {
                    setNewCustomer({...newCustomer, email: e.target.value});
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input
                value={(editCustomer?.phone) ?? (newCustomer?.phone ?? '')}
                onChange={(e) => {
                  if (editCustomer) {
                    setEditCustomer({...editCustomer, phone: e.target.value});
                  } else {
                    setNewCustomer({...newCustomer, phone: e.target.value});
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input
                value={(editCustomer?.address) ?? (newCustomer?.address ?? '')}
                onChange={(e) => {
                  if (editCustomer) {
                    setEditCustomer({...editCustomer, address: e.target.value});
                  } else {
                    setNewCustomer({...newCustomer, address: e.target.value});
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setEditCustomer(null);
              setNewCustomer({});
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (editCustomer?.id) {
                updateCustomer(editCustomer.id, editCustomer);
              } else {
                addCustomer(newCustomer);
              }
              setIsDialogOpen(false);
              setEditCustomer(null);
              setNewCustomer({});
            }}>
              {editCustomer ? 'Update' : 'Add'} Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}