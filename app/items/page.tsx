
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
  Upload, 
  Download,
  Plus,
  Search,
  Filter
} from "lucide-react";

export default function ItemsPage() {
  const { products, fetchProducts, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleImport = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    await useStore.getState().importData('products', file);
    fetchProducts();
  };

  const handleExport = async (format) => {
    await useStore.getState().exportData('products', format);
  };

  const filteredItems = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Items</h1>
        <div className="flex gap-2">
          <input
            type="file"
            id="import-file"
            className="hidden"
            onChange={(e) => handleImport(e.target.files[0])}
          />
          <Button onClick={() => document.getElementById('import-file').click()}>
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => {
            setNewItem({});
            setIsDialogOpen(true);
          }}>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setEditItem(item)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteProduct(item.id)}
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

      <Dialog open={isDialogOpen || !!editItem} onOpenChange={() => {
        setIsDialogOpen(false);
        setEditItem(null);
        setNewItem(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input
                value={(editItem?.name || newItem?.name) ?? ''}
                onChange={(e) => {
                  if (editItem) {
                    setEditItem({...editItem, name: e.target.value});
                  } else {
                    setNewItem({...newItem, name: e.target.value});
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>SKU</Label>
              <Input
                value={(editItem?.sku || newItem?.sku) ?? ''}
                onChange={(e) => {
                  if (editItem) {
                    setEditItem({...editItem, sku: e.target.value});
                  } else {
                    setNewItem({...newItem, sku: e.target.value});
                  }
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={(editItem?.price || newItem?.price) ?? ''}
                onChange={(e) => {
                  if (editItem) {
                    setEditItem({...editItem, price: e.target.value});
                  } else {
                    setNewItem({...newItem, price: e.target.value});
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setEditItem(null);
              setNewItem(null);
            }}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (editItem?.id) {
                updateProduct(editItem.id, editItem);
              } else {
                addProduct({
                  name: newItem.name,
                  sku: newItem.sku,
                  price: parseFloat(newItem.price),
                });
              }
              setIsDialogOpen(false);
              setEditItem(null);
              setNewItem(null);
            }}>
              {editItem ? 'Update' : 'Add'} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
