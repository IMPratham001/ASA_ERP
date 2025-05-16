"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store/store";
import {
  Barcode,
  Upload,
  Download,
  Plus,
  Search,
  Filter,
  QrCode,
} from "lucide-react";
import JsBarcode from 'jsbarcode';

export default function ItemsPage() {
  const router = useRouter();
  const { products = [], fetchProducts, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const generateBarcode = (sku) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, sku, {
      format: "CODE128",
      width: 2,
      height: 100,
    });
    const url = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = url;
    link.download = `barcode-${sku}.png`;
    link.click();
  };

  const handleImport = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    await useStore.getState().importData("products", file);
    fetchProducts();
  };

  const handleExport = async (format) => {
    await useStore.getState().exportData("products", format);
  };

  const filteredItems = products?.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Items</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/items/import')}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/items/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
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
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.inventory?.quantity || 0}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => generateBarcode(item.sku)}>
                      <Barcode className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/items/${item.id}`)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => router.push(`/items/${item.id}/edit`)}>
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}