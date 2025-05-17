"use client";

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HelpCircle,
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  ChevronRight,
  Store,
  BarChart,
  CreditCard,
} from "lucide-react";

export function UserGuide() {
  const [open, setOpen] = useState(false);

  const sections = [
    {
      title: "Getting Started",
      icon: LayoutDashboard,
      content: "Welcome to the POS System! This guide will help you navigate through the main features..."
    },
    {
      title: "Managing Inventory",
      icon: Package,
      content: "Learn how to add, edit, and track your inventory efficiently..."
    },
    {
      title: "Customer Management",
      icon: Users,
      content: "Keep track of your customers, their purchase history, and preferences..."
    },
    // Add more sections...
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <HelpCircle className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>User Guide</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-4rem)] mt-4">
          <div className="space-y-6 pr-6">
            {sections.map((section, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </div>
                <p className="text-sm text-muted-foreground">{section.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}