"use client";

import { useState } from "react";
import { useAccountingStore, TaxRate } from "@/lib/store/accounting";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function TaxSettings() {
  const { taxRates, addTaxRate, updateTaxRate } = useAccountingStore();
  const [newTax, setNewTax] = useState<Partial<TaxRate>>({
    name: "",
    rate: 0,
    type: "gst",
    isActive: true,
  });

  const handleAddTax = () => {
    if (!newTax.name || newTax.rate === undefined) return;

    const taxRate: TaxRate = {
      id: Math.random().toString(),
      name: newTax.name,
      rate: newTax.rate,
      type: newTax.type || "gst",
      isActive: true,
      components:
        newTax.type === "gst"
          ? {
              cgst: newTax.rate / 2,
              sgst: newTax.rate / 2,
              igst: newTax.rate,
            }
          : undefined,
    };

    addTaxRate(taxRate);
    setNewTax({
      name: "",
      rate: 0,
      type: "gst",
      isActive: true,
    });
  };

  const toggleTaxStatus = (id: string, currentStatus: boolean) => {
    updateTaxRate(id, { isActive: !currentStatus });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tax Settings</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Tax Rate</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Tax Rate</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tax Name"
                value={newTax.name}
                onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Rate (%)"
                value={newTax.rate}
                onChange={(e) =>
                  setNewTax({ ...newTax, rate: parseFloat(e.target.value) })
                }
              />
              <Select
                value={newTax.type}
                onValueChange={(value: "gst" | "vat" | "other") =>
                  setNewTax({ ...newTax, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gst">GST</SelectItem>
                  <SelectItem value="vat">VAT</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddTax}>Add Tax Rate</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Components</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {taxRates.map((tax) => (
            <TableRow key={tax.id}>
              <TableCell>{tax.name}</TableCell>
              <TableCell className="uppercase">{tax.type}</TableCell>
              <TableCell>{tax.rate}%</TableCell>
              <TableCell>
                {tax.type === "gst" && tax.components ? (
                  <span className="text-sm">
                    CGST: {tax.components.cgst}% | SGST: {tax.components.sgst}% |
                    IGST: {tax.components.igst}%
                  </span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Switch
                  checked={tax.isActive}
                  onCheckedChange={() => toggleTaxStatus(tax.id, tax.isActive)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}