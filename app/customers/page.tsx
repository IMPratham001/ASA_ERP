'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Download, Filter, MoreHorizontal, User, Users, Search, ShoppingBag, Star, Tag, MapPin, Calendar, Clock, ChevronDown, CreditCard, RefreshCw } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CustomersPage() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [customerType, setCustomerType] = useState('all');
  const [viewType, setViewType] = useState('table');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [filterIsOpen, setFilterIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for demo purposes
  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      status: "active",
      type: "retail",
      source: "in-store",
      storeLocation: "New York Downtown",
      totalSpent: 1250.75,
      lastPurchase: "2025-05-10",
      loyaltyPoints: 450,
      joinDate: "2024-03-15",
      orders: 12,
      tags: ["premium", "loyalty-gold"],
      avatar: null
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+0987654321",
      status: "active",
      type: "online",
      source: "website",
      storeLocation: "Online",
      totalSpent: 3420.50,
      lastPurchase: "2025-05-12",
      loyaltyPoints: 890,
      joinDate: "2023-11-20",
      orders: 28,
      tags: ["premium", "loyalty-platinum"],
      avatar: null
    },
    {
      id: 3,
      name: "Sam Wilson",
      email: "sam@example.com",
      phone: "+2468101214",
      status: "inactive",
      type: "both",
      source: "referral",
      storeLocation: "Chicago North",
      totalSpent: 750.25,
      lastPurchase: "2025-04-02",
      loyaltyPoints: 150,
      joinDate: "2024-08-10",
      orders: 5,
      tags: ["new-customer"],
      avatar: null
    }
  ];

  // Handle customer selection
  const toggleCustomerSelection = (customerId) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  // Handle select all customers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCustomers(customers.map(customer => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Customer status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get customer source icon
  const getSourceIcon = (source) => {
    switch (source) {
      case 'in-store':
        return <MapPin className="h-4 w-4 text-gray-500" />;
      case 'website':
        return <ShoppingBag className="h-4 w-4 text-gray-500" />;
      case 'referral':
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  // Get customer type badge
  const getTypeBadge = (type) => {
    switch (type) {
      case 'retail':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Retail</Badge>;
      case 'online':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">Online</Badge>;
      case 'both':
        return <Badge variant="outline" className="bg-teal-100 text-teal-800 border-teal-300">Omnichannel</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.phone.includes(searchTerm);

    if (customerType === 'all') return matchesSearch;
    return matchesSearch && customer.type === customerType;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your retail and online customers</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <User className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First Name" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last Name" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="customer@example.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+1234567890" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="customerType">Customer Type</Label>
                    <Select>
                      <SelectTrigger id="customerType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="both">Omnichannel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="source">Source</Label>
                    <Select>
                      <SelectTrigger id="source">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-store">In-Store</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="campaign">Marketing Campaign</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="storeLocation">Store Location</Label>
                  <Select>
                    <SelectTrigger id="storeLocation">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New York Downtown">New York Downtown</SelectItem>
                      <SelectItem value="Chicago North">Chicago North</SelectItem>
                      <SelectItem value="Los Angeles West">Los Angeles West</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Add any additional notes about this customer..." />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Customer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem>Export Selected</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Print Customer List</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                {filteredCustomers.length} customers found
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search customers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <Select value={customerType} onValueChange={setCustomerType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="retail">Retail Only</SelectItem>
                  <SelectItem value="online">Online Only</SelectItem>
                  <SelectItem value="both">Omnichannel</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setFilterIsOpen(true)}>
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Tabs value={viewType} onValueChange={setViewType} className="hidden sm:flex">
                <TabsList className="grid grid-cols-2 w-24">
                  <TabsTrigger value="table">
                    <Users className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="card">
                    <Tag className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <Sheet open={filterIsOpen} onOpenChange={setFilterIsOpen}>
          <SheetContent side="right" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle>Filter Customers</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Customer Status</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="active" />
                    <label htmlFor="active">Active</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="inactive" />
                    <label htmlFor="inactive">Inactive</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pending" />
                    <label htmlFor="pending">Pending</label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Loyalty Level</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="bronze" />
                    <label htmlFor="bronze">Bronze</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="silver" />
                    <label htmlFor="silver">Silver</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="gold" />
                    <label htmlFor="gold">Gold</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="platinum" />
                    <label htmlFor="platinum">Platinum</label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Store Location</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="new-york">New York Downtown</SelectItem>
                    <SelectItem value="chicago">Chicago North</SelectItem>
                    <SelectItem value="la">Los Angeles West</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Joined</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">From</span>
                    <Input type="date" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">To</span>
                    <Input type="date" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Total Spent</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">Min</span>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-500">Max</span>
                    <Input type="number" placeholder="10000" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setFilterIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setFilterIsOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <CardContent>
          <TabsContent value="table" className="m-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox id="selectAll" onCheckedChange={handleSelectAll} />
                    </TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead>Loyalty</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="h-8 w-8 text-gray-400" />
                          <p className="text-xl font-medium">No customers found</p>
                          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map(customer => (
                      <TableRow key={customer.id} className={selectedCustomers.includes(customer.id) ? "bg-gray-50" : ""}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedCustomers.includes(customer.id)} 
                            onCheckedChange={() => toggleCustomerSelection(customer.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              {!customer.avatar && (
                                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                  {customer.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                              <div className="text-xs text-gray-400">{customer.phone}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeBadge(customer.type)}
                            <div className="flex items-center text-xs text-gray-500">
                              {getSourceIcon(customer.source)}
                              <span className="ml-1">{customer.storeLocation}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{formatCurrency(customer.totalSpent)}</div>
                          <div className="text-xs text-gray-500">{customer.orders} orders</div>
                        </TableCell>
                        <TableCell>
                          <div>{formatDate(customer.lastPurchase)}</div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>
                              {Math.floor((new Date() - new Date(customer.lastPurchase)) / (1000 * 60 * 60 * 24))} days ago
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span>{customer.loyaltyPoints} pts</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Since {formatDate(customer.joinDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 px-2">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent align="end" className="w-48">
                                <div className="grid gap-1">
                                  <Button variant="ghost" size="sm" className="justify-start">
                                    <User className="mr-2 h-4 w-4" />
                                    View Profile
                                  </Button>
                                  <Button variant="ghost" size="sm" className="justify-start">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    Order History
                                  </Button>
                                  <Button variant="ghost" size="sm" className="justify-start">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Payment Methods
                                  </Button>
                                  <Button variant="ghost" size="sm" className="justify-start">
                                    <Star className="mr-2 h-4 w-4" />
                                    Loyalty Status
                                  </Button>
                                  <Button variant="ghost" size="sm" className="justify-start text-red-600">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Change Status
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {filteredCustomers.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredCustomers.length} of {customers.length} customers
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Card>

      {/* Customer Profile Sheet */}
      <Sheet>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Customer Profile</SheetTitle>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="h-24 w-24">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 text-3xl">
                  JD
                </div>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className="text-gray-500">john@example.com • +1234567890</p>
                <div className="mt-2 flex justify-center gap-2">
                  {getStatusBadge('active')}
                  {getTypeBadge('retail')}
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Customer ID</div>
                        <div>#CUS-001</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Join Date</div>
                        <div>Mar 15, 2024</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Store Location</div>
                        <div>New York Downtown</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Source</div>
                        <div>In-Store</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Tags</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                            premium
                          </Badge>
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                            loyalty-gold
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{formatCurrency(1250.75)}</div>
                        <div className="text-sm text-gray-500">Total Spent</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm text-gray-500">Total Orders</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">{formatCurrency(104.23)}</div>
                        <div className="text-sm text-gray-500">Average Order</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold">May 10, 2025</div>
                        <div className="text-sm text-gray-500">Last Purchase</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Email</div>
                        <div>john@example.com</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Phone</div>
                        <div>+1234567890</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Address</div>
                        <div>123 Main St, New York, NY 10001</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-500">Marketing Preferences</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                            Email: Opted In
                          </Badge>
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                            SMS: Opted Out
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Channel</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>#ORD-2564</TableCell>
                          <TableCell>May 10, 2025</TableCell>
                          <TableCell>{formatCurrency(234.50)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Completed</Badge>
                          </TableCell>
                          <TableCell>In-Store</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>#ORD-2317</TableCell>
                          <TableCell>Apr 22, 2025</TableCell>
                          <TableCell>{formatCurrency(187.25)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Completed</Badge>
                          </TableCell>
                          <TableCell>In-Store</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>#ORD-2105</TableCell>
                          <TableCell>Mar 15, 2025</TableCell>
                          <TableCell>{formatCurrency(329.00)}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">Completed</Badge>
                          </TableCell>
                          <TableCell>Online</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">View All Orders</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Purchase Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      [Purchase trend chart would appear here]
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-medium">Most Purchased Category</div>
                        <div className="text-gray-500">Clothing</div>
                      </div>
                      <div>
                        <div className="font-medium">Purchase Frequency</div>
                        <div className="text-gray-500">Every 3 weeks</div>
                      </div>
                      <div>
                        <div className="font-medium">Preferred Payment</div>
                        <div className="text-gray-500">Credit Card</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="loyalty" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Loyalty Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative h-32 w-32">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl font-bold">450</div>
                        </div>
                        <div className="h-full w-full rounded-full border-8 border-amber-300"></div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="text-xl font-bold">Gold Member</div>
                        <div className="text-sm text-gray-500">Since January 2025</div>
                      </div>
                      <div className="w-full max-w-md space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Silver (200 pts)</span>
                          <span>Gold (400 pts)</span>
                          <span>Platinum (1000 pts)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-1/2"></div>
                        </div>
                        <div className="text-sm text-gray-500 text-center">
                          550 more points needed for Platinum status
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Loyalty History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                          <TableHead>Points</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>May 10, 2025</TableCell>
                          <TableCell>Purchase #ORD-2564</TableCell>
                          <TableCell className="text-green-600">+25</TableCell>
                          <TableCell>450</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Apr 22, 2025</TableCell>
                          <TableCell>Purchase #ORD-2317</TableCell>
                          <TableCell className="text-green-600">+19</TableCell>
                          <TableCell>425</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Apr 10, 2025</TableCell>
                          <TableCell>Birthday Bonus</TableCell>
                          <TableCell className="text-green-600">+50</TableCell>
                          <TableCell>406</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mar 15, 2025</TableCell>
                          <TableCell>Purchase #ORD-2105</TableCell>
                          <TableCell className="text-green-600">+33</TableCell>
                          <TableCell>356</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Feb 28, 2025</TableCell>
                          <TableCell>Reward Redemption</TableCell>
                          <TableCell className="text-red-600">-100</TableCell>
                          <TableCell>323</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Available Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">$10 Coupon</div>
                          <div className="text-sm text-gray-500">100 points</div>
                        </div>
                        <Button size="sm">Redeem</Button>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">Free Shipping</div>
                          <div className="text-sm text-gray-500">150 points</div>
                        </div>
                        <Button size="sm">Redeem</Button>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">$25 Gift Card</div>
                          <div className="text-sm text-gray-500">250 points</div>
                        </div>
                        <Button size="sm">Redeem</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <div className="font-medium">Sarah Johnson (Sales Associate)</div>
                          <div className="text-sm text-gray-500">May 10, 2025</div>
                        </div>
                        <p className="text-sm">
                          Customer expressed interest in our new summer collection. Showed particular interest in men's casual wear.
                          Mentioned his birthday is coming up in June.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <div className="font-medium">Support Team</div>
                          <div className="text-sm text-gray-500">Apr 05, 2025</div>
                        </div>
                        <p className="text-sm">
                          Customer contacted regarding size exchange for order #ORD-2105. Issue resolved and customer was satisfied
                          with the service.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <div className="font-medium">Mike Chen (Store Manager)</div>
                          <div className="text-sm text-gray-500">Mar 15, 2025</div>
                        </div>
                        <p className="text-sm">
                          Initial sign up during store visit. Customer was very enthusiastic about our loyalty program and 
                          signed up immediately. Prefers to be contacted via email rather than phone.
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <Label htmlFor="newNote">Add Note</Label>
                      <Textarea id="newNote" placeholder="Add a new note about this customer..." />
                      <div className="flex justify-end">
                        <Button>Save Note</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Customer Import/Export Modal */}
      <Dialog>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Import Customers</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Download className="h-10 w-10 text-gray-400" />
                <h3 className="font-medium">Drop your file here or click to browse</h3>
                <p className="text-sm text-gray-500">
                  Support for CSV, Excel (.xlsx, .xls)
                </p>
                <Input type="file" className="mt-2 max-w-xs" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Template Options</div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">Download Retail Template</Button>
                <Button variant="outline" size="sm">Download Online Template</Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Import Options</div>
              <div className="flex items-center space-x-2">
                <Checkbox id="updateExisting" />
                <label htmlFor="updateExisting" className="text-sm">Update existing customers if found</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="skipErrors" />
                <label htmlFor="skipErrors" className="text-sm">Skip records with errors</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="sendWelcome" />
                <label htmlFor="sendWelcome" className="text-sm">Send welcome email to new customers</label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Import Customers</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions for Selected Customers */}
      {selectedCustomers.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white border rounded-lg p-2 shadow-lg z-50">
          <div className="flex items-center px-3 font-medium">
            {selectedCustomers.length} customers selected
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Tag className="mr-1.5 h-4 w-4" />
              Add Tags
            </Button>
            <Button size="sm" variant="outline">
              <Star className="mr-1.5 h-4 w-4" />
              Update Loyalty
            </Button>
            <Button size="sm" variant="outline">
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Change Status
            </Button>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}</PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </TabsContent>
          <TabsContent value="card" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center gap-2 py-12">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                  <p className="text-xl font-medium">No customers found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredCustomers.map(customer => (
                  <Card key={customer.id} className={`overflow-hidden ${selectedCustomers.includes(customer.id) ? "border-primary" : ""}`}>
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {!customer.avatar && (
                              <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600">
                                {customer.name.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {customer.name}
                              {getStatusBadge(customer.status)}
                            </div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                        <Checkbox 
                          checked={selectedCustomers.includes(customer.id)} 
                          onCheckedChange={() => toggleCustomerSelection(customer.id)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">Customer Type</div>
                          <div className="flex items-center gap-1">{getTypeBadge(customer.type)}</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">Total Spent</div>
                          <div className="font-medium">{formatCurrency(customer.totalSpent)}</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">Loyalty Points</div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                            <span>{customer.loyaltyPoints} pts</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-gray-500">Last Purchase</div>
                          <div>{formatDate(customer.lastPurchase)}</div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <Button variant="outline" size="sm">View Profile</Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                              <DropdownMenuItem>Order History</DropdownMenuItem>
                              <DropdownMenuItem>Send Email</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Change Status</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            {filteredCustomers.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                      </PaginationItem>
                                        </PaginationContent>
                                      </Pagination>
                                    </div>
                                  )}
                                </TabsContent>
                              </CardContent>
                            </Card>

                            {/* Customer Profile Sheet */}
                            <Sheet>
                              <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                                <SheetHeader>
                                  <SheetTitle>Customer Profile</SheetTitle>
                                </SheetHeader>
                                <div className="space-y-6 py-6">
                                  <div className="flex flex-col items-center gap-4 text-center">
                                    <Avatar className="h-24 w-24">
                                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 text-3xl">
                                        JD
                                      </div>
                                    </Avatar>
                                    <div>
                                      <h2 className="text-2xl font-bold">John Doe</h2>
                                      <p className="text-gray-500">john@example.com • +1234567890</p>
                                      <div className="mt-2 flex justify-center gap-2">
                                        {getStatusBadge('active')}
                                        {getTypeBadge('retail')}
                                      </div>
                                    </div>
                                  </div>

                                  <Tabs defaultValue="overview">
                                    <TabsList className="grid grid-cols-4 w-full">
                                      <TabsTrigger value="overview">Overview</TabsTrigger>
                                      <TabsTrigger value="orders">Orders</TabsTrigger>
                                      <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                                      <TabsTrigger value="notes">Notes</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="overview" className="space-y-4 pt-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Customer Details</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Customer ID</div>
                                              <div>#CUS-001</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Join Date</div>
                                              <div>Mar 15, 2024</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Store Location</div>
                                              <div>New York Downtown</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Source</div>
                                              <div>In-Store</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Tags</div>
                                              <div className="flex flex-wrap gap-1">
                                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                                                  premium
                                                </Badge>
                                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                                  loyalty-gold
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Purchase Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                              <div className="text-2xl font-bold">{formatCurrency(1250.75)}</div>
                                              <div className="text-sm text-gray-500">Total Spent</div>
                                            </div>
                                            <div className="space-y-1">
                                              <div className="text-2xl font-bold">12</div>
                                              <div className="text-sm text-gray-500">Total Orders</div>
                                            </div>
                                            <div className="space-y-1">
                                              <div className="text-2xl font-bold">{formatCurrency(104.23)}</div>
                                              <div className="text-sm text-gray-500">Average Order</div>
                                            </div>
                                            <div className="space-y-1">
                                              <div className="text-2xl font-bold">May 10, 2025</div>
                                              <div className="text-sm text-gray-500">Last Purchase</div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Contact Information</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-2">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Email</div>
                                              <div>john@example.com</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Phone</div>
                                              <div>+1234567890</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Address</div>
                                              <div>123 Main St, New York, NY 10001</div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                              <div className="text-gray-500">Marketing Preferences</div>
                                              <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                                  Email: Opted In
                                                </Badge>
                                                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                                                  SMS: Opted Out
                                                </Badge>
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="orders" className="space-y-4 pt-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Recent Orders</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Order ID</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Channel</TableHead>
                                                <TableHead></TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              <TableRow>
                                                <TableCell>#ORD-2564</TableCell>
                                                <TableCell>May 10, 2025</TableCell>
                                                <TableCell>{formatCurrency(234.50)}</TableCell>
                                                <TableCell>
                                                  <Badge className="bg-green-500">Completed</Badge>
                                                </TableCell>
                                                <TableCell>In-Store</TableCell>
                                                <TableCell>
                                                  <Button variant="ghost" size="sm">View</Button>
                                                </TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell>#ORD-2317</TableCell>
                                                <TableCell>Apr 22, 2025</TableCell>
                                                <TableCell>{formatCurrency(187.25)}</TableCell>
                                                <TableCell>
                                                  <Badge className="bg-green-500">Completed</Badge>
                                                </TableCell>
                                                <TableCell>In-Store</TableCell>
                                                <TableCell>
                                                  <Button variant="ghost" size="sm">View</Button>
                                                </TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell>#ORD-2105</TableCell>
                                                <TableCell>Mar 15, 2025</TableCell>
                                                <TableCell>{formatCurrency(329.00)}</TableCell>
                                                <TableCell>
                                                  <Badge className="bg-green-500">Completed</Badge>
                                                </TableCell>
                                                <TableCell>Online</TableCell>
                                                <TableCell>
                                                  <Button variant="ghost" size="sm">View</Button>
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                          <div className="mt-4 flex justify-end">
                                            <Button variant="outline" size="sm">View All Orders</Button>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Purchase Analytics</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="h-64 flex items-center justify-center text-gray-500">
                                            [Purchase trend chart would appear here]
                                          </div>
                                          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                            <div>
                                              <div className="font-medium">Most Purchased Category</div>
                                              <div className="text-gray-500">Clothing</div>
                                            </div>
                                            <div>
                                              <div className="font-medium">Purchase Frequency</div>
                                              <div className="text-gray-500">Every 3 weeks</div>
                                            </div>
                                            <div>
                                              <div className="font-medium">Preferred Payment</div>
                                              <div className="text-gray-500">Credit Card</div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="loyalty" className="space-y-4 pt-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Loyalty Status</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="flex flex-col items-center space-y-4">
                                            <div className="relative h-32 w-32">
                                              <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-3xl font-bold">450</div>
                                              </div>
                                              <div className="h-full w-full rounded-full border-8 border-amber-300"></div>
                                            </div>
                                            <div className="space-y-1 text-center">
                                              <div className="text-xl font-bold">Gold Member</div>
                                              <div className="text-sm text-gray-500">Since January 2025</div>
                                            </div>
                                            <div className="w-full max-w-md space-y-2">
                                              <div className="flex justify-between text-sm">
                                                <span>Silver (200 pts)</span>
                                                <span>Gold (400 pts)</span>
                                                <span>Platinum (1000 pts)</span>
                                              </div>
                                              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 w-1/2"></div>
                                              </div>
                                              <div className="text-sm text-gray-500 text-center">
                                                550 more points needed for Platinum status
                                              </div>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Loyalty History</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <Table>
                                            <TableHeader>
                                              <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Activity</TableHead>
                                                <TableHead>Points</TableHead>
                                                <TableHead>Balance</TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                              <TableRow>
                                                <TableCell>May 10, 2025</TableCell>
                                                <TableCell>Purchase #ORD-2564</TableCell>
                                                <TableCell className="text-green-600">+25</TableCell>
                                                <TableCell>450</TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell>Apr 22, 2025</TableCell>
                                                <TableCell>Purchase #ORD-2317</TableCell>
                                                <TableCell className="text-green-600">+19</TableCell>
                                                <TableCell>425</TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell>Apr 10, 2025</TableCell>
                                                <TableCell>Birthday Bonus</TableCell>
                                                <TableCell className="text-green-600">+50</TableCell>
                                                <TableCell>406</TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell>Mar 15, 2025</TableCell>
                                                <TableCell>Purchase #ORD-2105</TableCell>
                                                <TableCell className="text-green-600">+33</TableCell>
                                                <TableCell>356</TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell>Feb 28, 2025</TableCell>
                                                <TableCell>Reward Redemption</TableCell>
                                                <TableCell className="text-red-600">-100</TableCell>
                                                <TableCell>323</TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                        </CardContent>
                                      </Card>

                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Available Rewards</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-4">
                                            <div className="flex justify-between items-center p-3 border rounded-lg">
                                              <div>
                                                <div className="font-medium">$10 Coupon</div>
                                                <div className="text-sm text-gray-500">100 points</div>
                                              </div>
                                              <Button size="sm">Redeem</Button>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border rounded-lg">
                                              <div>
                                                <div className="font-medium">Free Shipping</div>
                                                <div className="text-sm text-gray-500">150 points</div>
                                              </div>
                                              <Button size="sm">Redeem</Button>
                                            </div>
                                            <div className="flex justify-between items-center p-3 border rounded-lg">
                                              <div>
                                                <div className="font-medium">$25 Gift Card</div>
                                                <div className="text-sm text-gray-500">250 points</div>
                                              </div>
                                              <Button size="sm">Redeem</Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>

                                    <TabsContent value="notes" className="space-y-4 pt-4">
                                      <Card>
                                        <CardHeader>
                                          <CardTitle>Customer Notes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-4">
                                            <div className="border rounded-lg p-4 space-y-2">
                                              <div className="flex justify-between">
                                                <div className="font-medium">Sarah Johnson (Sales Associate)</div>
                                                <div className="text-sm text-gray-500">May 10, 2025</div>
                                              </div>
                                              <p className="text-sm">
                                                Customer expressed interest in our new summer collection. Showed particular interest in men's casual wear.
                                                Mentioned his birthday is coming up in June.
                                              </p>
                                            </div>
                                            <div className="border rounded-lg p-4 space-y-2">
                                              <div className="flex justify-between">
                                                <div className="font-medium">Support Team</div>
                                                <div className="text-sm text-gray-500">Apr 05, 2025</div>
                                              </div>
                                              <p className="text-sm">
                                                Customer contacted regarding size exchange for order #ORD-2105. Issue resolved and customer was satisfied
                                                with the service.
                                              </p>
                                            </div>
                                            <div className="border rounded-lg p-4 space-y-2">
                                              <div className="flex justify-between">
                                                <div className="font-medium">Mike Chen (Store Manager)</div>
                                                <div className="text-sm text-gray-500">Mar 15, 2025</div>
                                              </div>
                                              <p className="text-sm">
                                                Initial sign up during store visit. Customer was very enthusiastic about our loyalty program and 
                                                signed up immediately. Prefers to be contacted via email rather than phone.
                                              </p>
                                            </div>
                                          </div>

                                          <div className="mt-6 space-y-2">
                                            <Label htmlFor="newNote">Add Note</Label>
                                            <Textarea id="newNote" placeholder="Add a new note about this customer..." />
                                            <div className="flex justify-end">
                                              <Button>Save Note</Button>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              </SheetContent>
                            </Sheet>

                            {/* Customer Import/Export Modal */}
                            <Dialog>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Import Customers</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                      <Download className="h-10 w-10 text-gray-400" />
                                      <h3 className="font-medium">Drop your file here or click to browse</h3>
                                      <p className="text-sm text-gray-500">
                                        Support for CSV, Excel (.xlsx, .xls)
                                      </p>
                                      <Input type="file" className="mt-2 max-w-xs" />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="text-sm font-medium">Template Options</div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <Button variant="outline" size="sm">Download Retail Template</Button>
                                      <Button variant="outline" size="sm">Download Online Template</Button>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="text-sm font-medium">Import Options</div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="updateExisting" />
                                      <label htmlFor="updateExisting" className="text-sm">Update existing customers if found</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="skipErrors" />
                                      <label htmlFor="skipErrors" className="text-sm">Skip records with errors</label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox id="sendWelcome" />
                                      <label htmlFor="sendWelcome" className="text-sm">Send welcome email to new customers</label>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline">Cancel</Button>
                                  <Button>Import Customers</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            {/* Bulk Actions for Selected Customers */}
                            {selectedCustomers.length > 0 && (
                              <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white border rounded-lg p-2 shadow-lg z-50">
                                <div className="flex items-center px-3 font-medium">
                                  {selectedCustomers.length} customers selected
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Tag className="mr-1.5 h-4 w-4" />
                                    Add Tags
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Star className="mr-1.5 h-4 w-4" />
                                    Update Loyalty
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <RefreshCw className="mr-1.5 h-4 w-4" />
                                    Change Status
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }