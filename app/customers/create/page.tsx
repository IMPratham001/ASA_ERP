"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, ChevronRight, Info, Trash2, UserPlus, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateCustomer() {
  const router = useRouter();
  const [customerType, setCustomerType] = useState("business");
  const [allowPortalAccess, setAllowPortalAccess] = useState(false);
  const [formStatus, setFormStatus] = useState({ 
    success: false, 
    error: false, 
    message: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState({
    id: "",
    salutation: "",
    firstName: "",
    lastName: "",
    email: "",
    workPhone: "",
    mobile: "",
    isPrimary: false,
  });

  const [customer, setCustomer] = useState({
    customerType: "business",
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    displayName: "",
    email: "",
    workPhone: "",
    mobile: "",
    website: "",
    currency: "USD",
    paymentTerms: "due_on_receipt",
    portalLanguage: "english",
    billingAddress: {
      attention: "",
      country: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      fax: ""
    },
    shippingAddress: {
      attention: "",
      country: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      fax: ""
    },
    contactPersons: [],
    remarks: ""
  });

  // Update display name when other fields change
  useEffect(() => {
    if (customerType === "business" && customer.companyName) {
      setCustomer(prev => ({ ...prev, displayName: prev.companyName }));
    } else if (customer.firstName || customer.lastName) {
      setCustomer(prev => ({ 
        ...prev, 
        displayName: `${prev.firstName} ${prev.lastName}`.trim() 
      }));
    }
  }, [customerType, customer.firstName, customer.lastName, customer.companyName]);

  // Update customer type state when radio changes
  useEffect(() => {
    setCustomer(prev => ({ ...prev, customerType }));
  }, [customerType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!customer.displayName) {
      setFormStatus({
        success: false,
        error: true,
        message: "Display name is required"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add API call here
      // const response = await fetch('/api/customers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(customer),
      // });

      setFormStatus({
        success: true,
        error: false,
        message: "Customer created successfully!"
      });

      // Redirect after showing success message
      setTimeout(() => {
        router.push("/customers");
      }, 1500);
    } catch (error) {
      console.error("Error creating customer:", error);
      setFormStatus({
        success: false,
        error: true,
        message: "Failed to create customer. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddContact = () => {
    if (!currentContact.firstName || !currentContact.lastName) {
      return;
    }

    const newContact = {
      ...currentContact,
      id: Date.now().toString(),
    };

    setCustomer(prev => ({
      ...prev,
      contactPersons: [...prev.contactPersons, newContact]
    }));

    setCurrentContact({
      id: "",
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      workPhone: "",
      mobile: "",
      isPrimary: false,
    });

    setIsContactDialogOpen(false);
  };

  const handleRemoveContact = (id) => {
    setCustomer(prev => ({
      ...prev,
      contactPersons: prev.contactPersons.filter(contact => contact.id !== id)
    }));
  };

  const copyBillingAddress = () => {
    setCustomer({
      ...customer,
      shippingAddress: {...customer.billingAddress}
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Add Customer</h1>
          <p className="text-muted-foreground mt-1">Create a new customer record</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {formStatus.success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{formStatus.message}</AlertDescription>
        </Alert>
      )}

      {formStatus.error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <X className="h-4 w-4 text-red-600" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{formStatus.message}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 space-y-6">
              <div className="flex gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <RadioGroup
                  defaultValue="business"
                  value={customerType}
                  onValueChange={setCustomerType}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="business" id="business" />
                    <Label htmlFor="business" className="font-medium">Business</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="font-medium">Individual</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-medium text-gray-700">Primary Contact</Label>
                  <div className="flex gap-2 mt-2">
                    <Select
                      value={customer.salutation}
                      onValueChange={(value) => setCustomer({...customer, salutation: value})}
                    >
                      <SelectTrigger className="w-1/4">
                        <SelectValue placeholder="Salutation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mr">Mr.</SelectItem>
                        <SelectItem value="mrs">Mrs.</SelectItem>
                        <SelectItem value="ms">Ms.</SelectItem>
                        <SelectItem value="dr">Dr.</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="First Name"
                      value={customer.firstName}
                      onChange={(e) => setCustomer({...customer, firstName: e.target.value})}
                    />
                    <Input 
                      placeholder="Last Name"
                      value={customer.lastName}
                      onChange={(e) => setCustomer({...customer, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label className={`font-medium text-gray-700 ${customerType === 'individual' ? 'opacity-50' : ''}`}>
                    Company Name
                    {customerType === 'business' && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  <Input 
                    className="mt-2"
                    disabled={customerType === 'individual'}
                    required={customerType === 'business'}
                    value={customer.companyName}
                    onChange={(e) => setCustomer({...customer, companyName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Label className="font-medium text-gray-700">
                      Customer Display Name<span className="text-red-500">*</span>
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info size={16} className="text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">This name will be displayed on invoices and customer communications.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input 
                    className="mt-2" 
                    required
                    value={customer.displayName}
                    onChange={(e) => setCustomer({...customer, displayName: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="font-medium text-gray-700">Customer Email</Label>
                  <Input 
                    type="email" 
                    className="mt-2"
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="font-medium text-gray-700">Customer Phone</Label>
                  <div className="flex gap-2 mt-2">
                    <Input 
                      placeholder="Work Phone"
                      value={customer.workPhone}
                      onChange={(e) => setCustomer({...customer, workPhone: e.target.value})}
                    />
                    <Input 
                      placeholder="Mobile"
                      value={customer.mobile}
                      onChange={(e) => setCustomer({...customer, mobile: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label className="font-medium text-gray-700">Website</Label>
                  <Input 
                    className="mt-2"
                    placeholder="https://"
                    value={customer.website}
                    onChange={(e) => setCustomer({...customer, website: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Tabs defaultValue="other-details" className="mt-8">
              <TabsList className="border-b w-full rounded-none justify-start">
                <TabsTrigger value="other-details" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Other Details
                </TabsTrigger>
                <TabsTrigger value="address" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Address
                </TabsTrigger>
                <TabsTrigger value="contact-persons" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Contact Persons
                </TabsTrigger>
                <TabsTrigger value="custom-fields" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Custom Fields
                </TabsTrigger>
                <TabsTrigger value="remarks" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                  Remarks
                </TabsTrigger>
              </TabsList>

              <TabsContent value="other-details" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="font-medium text-gray-700">
                      Currency<span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      defaultValue="USD"
                      value={customer.currency}
                      onValueChange={(value) => setCustomer({...customer, currency: value})}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-medium text-gray-700">Payment Terms</Label>
                    <Select 
                      defaultValue="due_on_receipt"
                      value={customer.paymentTerms}
                      onValueChange={(value) => setCustomer({...customer, paymentTerms: value})}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net45">Net 45</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-gray-700">Portal Language</Label>
                  <Select 
                    defaultValue="english"
                    value={customer.portalLanguage}
                    onValueChange={(value) => setCustomer({...customer, portalLanguage: value})}
                  >
                    <SelectTrigger className="mt-2 max-w-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="chinese">Chinese (Simplified)</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-lg max-w-md">
                  <Switch
                    id="portal-access"
                    checked={allowPortalAccess}
                    onCheckedChange={setAllowPortalAccess}
                  />
                  <div>
                    <Label htmlFor="portal-access" className="font-medium">
                      Allow portal access for this customer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Customer will be able to view invoices and make payments online
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-800 mb-4">Billing Address</h3>
                    <Input 
                      placeholder="Attention"
                      value={customer.billingAddress.attention}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, attention: e.target.value}
                      })}
                    />
                    <Select
                      value={customer.billingAddress.country}
                      onValueChange={(value) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, country: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Country/Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="Street 1"
                      value={customer.billingAddress.street1}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, street1: e.target.value}
                      })}
                    />
                    <Input 
                      placeholder="Street 2"
                      value={customer.billingAddress.street2}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, street2: e.target.value}
                      })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="City"
                        value={customer.billingAddress.city}
                        onChange={(e) => setCustomer({
                          ...customer, 
                          billingAddress: {...customer.billingAddress, city: e.target.value}
                        })}
                      />
                      <Input 
                        placeholder="State/Province"
                        value={customer.billingAddress.state}
                        onChange={(e) => setCustomer({
                          ...customer, 
                          billingAddress: {...customer.billingAddress, state: e.target.value}
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="ZIP/Postal Code"
                        value={customer.billingAddress.zipCode}
                        onChange={(e) => setCustomer({
                          ...customer, 
                          billingAddress: {...customer.billingAddress, zipCode: e.target.value}
                        })}
                      />
                      <Input 
                        placeholder="Phone"
                        value={customer.billingAddress.phone}
                        onChange={(e) => setCustomer({
                          ...customer, 
                          billingAddress: {...customer.billingAddress, phone: e.target.value}
                        })}
                      />
                    </div>
                    <Input 
                      placeholder="Fax"
                      value={customer.billingAddress.fax}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        billingAddress: {...customer.billingAddress, fax: e.target.value}
                      })}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">Shipping Address</h3>
                      <Button 
                        type="button"
                        variant="outline" 
                        size="sm"
                        onClick={copyBillingAddress}
                      >
                        Copy from Billing
                      </Button>
                    </div>
                    <Input 
                      placeholder="Attention"
                      value={customer.shippingAddress.attention}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, attention: e.target.value}
                      })}
                    />
                    <Select
                      value={customer.shippingAddress.country}
                      onValueChange={(value) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, country: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Country/Region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      placeholder="Street 1"
                      value={customer.shippingAddress.street1}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, street1: e.target.value}
                      })}
                    />
                    <Input 
                      placeholder="Street 2"
                      value={customer.shippingAddress.street2}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, street2: e.target.value}
                      })}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="City"
                        value={customer.shippingAddress.city}
                        onChange={(e) => setCustomer({
                          ...customer, 
                          shippingAddress: {...customer.shippingAddress, city: e.target.value}
                        })}
                      />
                      <Input 
                        placeholder="State/Province"
                        value={customer.shippingAddress.state}
                        onChange={(e) => setCustomer({
                          ...customer, 
                          shippingAddress: {...customer.shippingAddress, state: e.target.value}
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="ZIP/Postal Code"
                        value={customer.shippingAddress.zipCode}
                        onChange={(e) => setCustomer({
                          ...customer, 
                          shippingAddress: {...customer.shippingAddress, zipCode: e.target.value}
                        })}
                      />
                      <Input 
                        placeholder="Phone"
                        value={customer.shippingAddress.phone}
                        onChange={(e) => setCustomer({
                          ...customer, 
                          shippingAddress: {...customer.shippingAddress, phone: e.target.value}
                        })}
                      />
                    </div>
                    <Input 
                      placeholder="Fax"
                      value={customer.shippingAddress.fax}
                      onChange={(e) => setCustomer({
                        ...customer, 
                        shippingAddress: {...customer.shippingAddress, fax: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact-persons" className="mt-6">
                <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-800">Contact Persons</h3>
                    <DialogTrigger asChild>
                      <Button 
                        type="button"
                        className="gap-2"
                      >
                        <UserPlus size={16} />
                        Add Contact Person
                      </Button>
                    </DialogTrigger>
                  </div>

                  {customer.contactPersons.length === 0 ? (
                    <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
                      <p className="text-muted-foreground">No contact persons added yet</p>
                      <DialogTrigger asChild>
                        <Button 
                          type="button"
                          variant="link" 
                          className="mt-2"
                        >
                          Add your first contact
                        </Button>
                      </DialogTrigger>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>NAME</TableHead>
                            <TableHead>EMAIL</TableHead>
                            <TableHead>PHONE</TableHead>
                            <TableHead>PRIMARY</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {customer.contactPersons.map((contact) => (
                            <TableRow key={contact.id}>
                              <TableCell>
                                <div className="font-medium">
                                  {contact.salutation} {contact.firstName} {contact.lastName}
                                </div>
                              </TableCell>
                              <TableCell>{contact.email}</TableCell>
                              <TableCell>
                                {contact.workPhone || contact.mobile || "-"}
                              </TableCell>
                              <TableCell>
                                {contact.isPrimary ? (
                                  <Check size={16} className="text-green-600" />
                                ) : "-"}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveContact(contact.id)}
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add Contact Person</DialogTitle>
                      <DialogDescription>
                        Add additional contacts for this customer
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="col-span-1">
                          <Label>Salutation</Label>
                          <Select
                            value={currentContact.salutation}
                            onValueChange={(value) => setCurrentContact({...currentContact, salutation: value})}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="--" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mr">Mr.</SelectItem>
                              <SelectItem value="mrs">Mrs.</SelectItem>
                              <SelectItem value="ms">Ms.</SelectItem>
                              <SelectItem value="dr">Dr.</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3">
                          <Label>Name<span className="text-red-500">*</span></Label>
                          <div className="flex gap-2 mt-2">
                            <Input 
                              placeholder="First Name"
                              value={currentContact.firstName}
                              onChange={(e) => setCurrentContact({...currentContact, firstName: e.target.value})}
                              required
                            />
                            <Input 
                              placeholder="Last Name"
                              value={currentContact.lastName}
                              onChange={(e) => setCurrentContact({...currentContact, lastName: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>Email</Label>
                        <Input 
                          type="email" 
                          className="mt-2"
                          placeholder="email@example.com"
                          value={currentContact.email}
                          onChange={(e) => setCurrentContact({...currentContact, email: e.onChange={(e) => setCurrentContact({...currentContact, email: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Work Phone</Label>
                          <Input 
                            className="mt-2"
                            placeholder="Work Phone"
                            value={currentContact.workPhone}
                            onChange={(e) => setCurrentContact({...currentContact, workPhone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Mobile</Label>
                          <Input 
                            className="mt-2"
                            placeholder="Mobile"
                            value={currentContact.mobile}
                            onChange={(e) => setCurrentContact({...currentContact, mobile: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-primary"
                          checked={currentContact.isPrimary}
                          onCheckedChange={(checked) => setCurrentContact({...currentContact, isPrimary: checked})}
                        />
                        <Label htmlFor="is-primary">Mark as primary contact</Label>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsContactDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="button" onClick={handleAddContact}>
                        Add Contact
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="custom-fields" className="mt-6">
                <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
                  <p className="text-muted-foreground">No custom fields have been defined for customers</p>
                  <Button 
                    type="button"
                    variant="link" 
                    className="mt-2"
                    onClick={() => router.push("/settings/custom-fields")}
                  >
                    Configure custom fields
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="remarks" className="mt-6">
                <div>
                  <Label className="font-medium text-gray-700">Remarks</Label>
                  <Textarea 
                    className="mt-2 h-32"
                    placeholder="Add any additional notes or remarks about this customer"
                    value={customer.remarks}
                    onChange={(e) => setCustomer({...customer, remarks: e.target.value})}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end gap-2">
              <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}