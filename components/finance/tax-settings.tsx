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
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Plus, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function TaxSettings() {
  const { taxRates, addTaxRate, updateTaxRate, deleteTaxRate } = useAccountingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [newTax, setNewTax] = useState<Partial<TaxRate>>({
    name: "",
    rate: 0,
    type: "gst",
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateTax = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!newTax.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (newTax.rate === undefined || newTax.rate < 0 || newTax.rate > 100) {
      newErrors.rate = "Rate must be between 0 and 100";
    }
    if (!newTax.type) {
      newErrors.type = "Type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTax = async () => {
    if (!validateTax()) return;
    
    setIsLoading(true);
    try {
      const taxRate: TaxRate = {
        id: Math.random().toString(),
        name: newTax.name!,
        rate: newTax.rate!,
        type: newTax.type || "gst",
        isActive: true,
        components: newTax.type === "gst" 
          ? {
              cgst: newTax.rate! / 2,
              sgst: newTax.rate! / 2,
              igst: newTax.rate!,
            }
          : undefined,
      };

      await addTaxRate(taxRate);
      setNewTax({
        name: "",
        rate: 0,
        type: "gst",
        isActive: true,
      });
      toast({
        title: "Success",
        description: "Tax rate added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tax rate",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaxStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateTaxRate(id, { isActive: !currentStatus });
      toast({
        title: "Success",
        description: "Tax status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tax status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Add Tax Rate</h3>
        <div className="grid grid-cols-3 gap-4">
          <Input 
            placeholder="Tax Name" 
            value={newTax.name}
            onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
           {errors.name && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.name}</AlertDescription>
              </Alert>
            )}
          <Input 
            type="number" 
            placeholder="Rate %" 
            value={newTax.rate}
            onChange={(e) => setNewTax({ ...newTax, rate: parseFloat(e.target.value) })}
            className={errors.rate ? "border-red-500" : ""}
          />
          {errors.rate && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.rate}</AlertDescription>
              </Alert>
            )}
          <Select
            value={newTax.type}
            onValueChange={(value: "gst" | "vat" | "other") =>
              setNewTax({ ...newTax, type: value })
            }
          >
            <SelectTrigger className={errors.type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gst">GST</SelectItem>
              <SelectItem value="vat">VAT</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddTax} 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Tax Rate'
            )}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Tax Rates</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Components</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
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
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}