"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store/store";
import {
  Search,
  Plus,
  MoreVertical,
  AlertTriangle,
  Package,
  Truck,
  History,
  Filter,
  ArrowUpDown,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BarcodeScanner } from "@/components/ui/barcode-scanner";

export default function InventoryPage() {
  const {
    inventory = [],
    products = [],
    updateInventory,
    addInventoryItem,
  } = useStore();

  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "lastUpdated",
    direction: "desc",
  });
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    quantity: 0,
    minQuantity: 5,
    location: "Main Warehouse",
  });
  const [filterLocation, setFilterLocation] = useState("all");

  // Unique locations for filtering
  const locations = useMemo(() => {
    const uniqueLocations = new Set(inventory.map((item) => item.location));
    return ["all", ...Array.from(uniqueLocations)];
  }, [inventory]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Update stock quantity
  const updateStock = (itemId, quantity) => {
    const item = inventory.find((i) => i.id === itemId);
    if (item) {
      updateInventory({
        ...item,
        quantity,
        lastUpdated: new Date().toISOString(),
      });
    }
  };

  // Handle adding new product to inventory
  const [lastScanned, setLastScanned] = useState<{
    barcode: string;
    timestamp: number;
    success: boolean;
  } | null>(null);

  const { toast } = useToast();

  const handleBarcodeScanned = (barcode) => {
    const product = products.find(p => p.sku === barcode);
    if (product) {
      setNewProduct({
        ...newProduct,
        productId: product.id,
        price: product.price,
        tax: product.tax || 0
      });

      setLastScanned({
        barcode,
        timestamp: Date.now(),
        success: true
      });

      // Show toast notification

      toast({
        title: "Product Scanned",
        description: `Added ${product.name} to inventory`,
        variant: "success"
      });


      // Add to inventory if not exists
      if (!inventory.some(item => item.productId === product.id)) {
        addInventoryItem({
          id: `inv-${Date.now()}`,
          productId: product.id,
          quantity: 1,
          minQuantity: 5,
          location: "Main Warehouse",
          lastUpdated: new Date().toISOString(),
        });
      }
    } else {
         toast({
          title: "Product Not Found",
          description: `No product found with barcode: ${barcode}`,
          variant: "destructive"
        });
    }
  };

  // Handle barcode scanner input
  useEffect(() => {
    let barcodeBuffer = '';
    let lastKeyTime = Date.now();
    const SCANNER_DELAY = 30; // Typical barcode scanner delay between characters

    const handleKeyPress = (e: KeyboardEvent) => {
      const currentTime = Date.now();

      // If the delay between keystrokes is too long, reset buffer
      // This helps distinguish between manual typing and scanner input
      if (currentTime - lastKeyTime > 100) {
        barcodeBuffer = '';
      }
      lastKeyTime = currentTime;

      // Ignore if modifier keys are pressed (likely manual input)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      // Add character to buffer
      if (e.key !== 'Enter') {
        barcodeBuffer += e.key;
        return;
      }

      // Process barcode when Enter is pressed
      if (barcodeBuffer.length > 5) { // Minimum barcode length check
        handleBarcodeScanned(barcodeBuffer);
        // Show toast notification

        toast({
          title: "Barcode Scanned",
          description: `Scanned barcode: ${barcodeBuffer}`,
        });

      }

      barcodeBuffer = ''; // Reset buffer
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [products, inventory, addInventoryItem, toast, newProduct]);

  const handleAddProduct = () => {
    if (newProduct.productId) {
      addInventoryItem({
        id: `inv-${Date.now()}`,
        productId: newProduct.productId,
        barcode: products.find(p => p.id === newProduct.productId)?.sku,
        quantity: parseInt(newProduct.quantity),
        minQuantity: parseInt(newProduct.minQuantity),
        location: newProduct.location,
        lastUpdated: new Date().toISOString(),
      });
      setAddProductDialogOpen(false);
      setNewProduct({
        productId: "",
        quantity: 0,
        minQuantity: 5,
        location: "Main Warehouse",
      });
    }
  };

  // Filter inventory based on search term, tab, and location
  const filteredInventory = useMemo(() => {
    let filtered = inventory.filter((item) => {
      const product = products.find((p) => p.id === item.productId);
      const matchesSearch =
        product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product?.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation =
        filterLocation === "all" || item.location === filterLocation;

      if (activeTab === "all") return matchesSearch && matchesLocation;
      if (activeTab === "low-stock")
        return (
          matchesSearch && matchesLocation && item.quantity <= item.minQuantity
        );
      if (activeTab === "out-of-stock")
        return matchesSearch && matchesLocation && item.quantity === 0;
      return matchesSearch && matchesLocation;
    });

    // Apply sorting
    return [...filtered].sort((a, b) => {
      // Handle special case for product name which is in a different object

      if (sortConfig.key === "name") {
        const productA = products.find((p) => p.id === a.productId)?.name || "";
        const productB = products.find((p) => p.id === b.productId)?.name || "";

        if (sortConfig.direction === "asc") {
          return productA.localeCompare(productB);
        } else {
          return productB.localeCompare(productA);
        }
      }

      // For other properties
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [inventory, products, searchTerm, activeTab, sortConfig, filterLocation]);

  // Get inventory stats
  const inventoryStats = useMemo(() => {
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(
      (item) => item.quantity <= item.minQuantity,
    ).length;
    const outOfStockItems = inventory.filter(
      (item) => item.quantity === 0,
    ).length;
    const totalValue = inventory.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + item.quantity * (product?.price || 0);
    }, 0);

    return { totalItems, lowStockItems, outOfStockItems, totalValue };
  }, [inventory, products]);

  // Sort indicator helper function
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Get stock status badge
  const getStockStatusBadge = (quantity, minQuantity) => {
    if (quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (quantity <= minQuantity) {
      return (
        <Badge variant="warning" className="bg-yellow-500 hover:bg-yellow-600">
          Low Stock
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
        >
          In Stock
        </Badge>
      );
    }
  };

  if (!inventory || !products) {
    return <div>Loading...</div>; // Or some other loading state
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your product inventory across all locations
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </Button>
          <Button
            onClick={() => setAddProductDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Add Inventory Item
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Products
                </p>
                <p className="text-2xl font-bold">
                  {inventoryStats.totalItems}
                </p>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Low Stock Items
                </p>
                <p className="text-2xl font-bold">
                  {inventoryStats.lowStockItems}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold">
                  {inventoryStats.outOfStockItems}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold">
                  ${inventoryStats.totalValue.toFixed(2)}
                </p>
              </div>
              <History className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Control</CardTitle>
          <CardDescription>
            Manage product inventory levels across all locations
          </CardDescription>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <div className="flex flex-1 items-center relative max-w-md">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by product name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <Select
                  value={filterLocation}
                  onValueChange={setFilterLocation}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location === "all" ? "All Locations" : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <BarcodeScanner onScan={handleBarcodeScanned} />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => requestSort("name")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      Product {getSortIndicator("name")}
                      <ArrowUpDown size={14} className="ml-1 text-gray-500" />
                    </div>
                  </TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    onClick={() => requestSort("quantity")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      Quantity {getSortIndicator("quantity")}
                      <ArrowUpDown size={14} className="ml-1 text-gray-500" />
                    </div>
                  </TableHead>
                  <TableHead>Alert Threshold</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead
                    onClick={() => requestSort("lastUpdated")}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      Last Updated {getSortIndicator("lastUpdated")}
                      <ArrowUpDown size={14} className="ml-1 text-gray-500" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-gray-500"
                    >
                      No inventory items found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => {
                    const product = products.find(
                      (p) => p.id === item.productId,
                    );
                    return (
                      <TableRow
                        key={item.id}
                        className={
                          item.quantity === 0
                            ? "bg-red-50"
                            : item.quantity <= item.minQuantity
                              ? "bg-yellow-50"
                              : ""
                        }
                      >
                        <TableCell className="font-medium">
                          {product?.name}
                        </TableCell>
                        <TableCell>{product?.sku}</TableCell>
                        <TableCell>
                          {getStockStatusBadge(item.quantity, item.minQuantity)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateStock(item.id, parseInt(e.target.value))
                            }
                            className="w-24"
                            min="0"
                          />
                        </TableCell>
                        <TableCell>{item.minQuantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Truck size={14} className="text-gray-500" />
                            {item.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(item.lastUpdated).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Item</DropdownMenuItem>
                              <DropdownMenuItem>Move Location</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Remove Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog
        open={addProductDialogOpen}
        onOpenChange={setAddProductDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">Product</Label>
              <Select
                value={newProduct.productId}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, productId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, quantity: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minQuantity">Minimum Stock Alert</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  min="0"
                  value={newProduct.minQuantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      minQuantity: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Storage Location</Label>
              <Select
                value={newProduct.location}
                onValueChange={(value) =>
                  setNewProduct({ ...newProduct, location: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                  <SelectItem value="Secondary Storage">
                    Secondary Storage
                  </SelectItem>
                  <SelectItem value="Retail Floor">Retail Floor</SelectItem>
                  <SelectItem value="Returns Department">
                    Returns Department
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddProductDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}