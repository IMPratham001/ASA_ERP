
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, ChevronRight } from "lucide-react";

export function UserGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const guides = [
    {
      title: "Getting Started",
      content: "Welcome to the ERP system! This guide will help you get started..."
    },
    {
      title: "Managing Inventory",
      content: "Learn how to add, edit, and track your inventory..."
    },
    {
      title: "Customer Management",
      content: "Manage your customers, view history, and more..."
    },
    {
      title: "Creating Invoices",
      content: "Step by step guide to creating and managing invoices..."
    },
    // Add more guides as needed
  ];

  return (
    <div className={`fixed right-0 top-20 z-50 transition-all ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <Button
        variant="outline"
        className="absolute -left-10 top-0 h-20 w-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Book className="h-4 w-4" />
      </Button>
      <Card className="h-[calc(100vh-5rem)] w-80">
        <ScrollArea className="h-full">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-4">User Manual</h2>
            <div className="space-y-4">
              {guides.map((guide, index) => (
                <div key={index} className="border-b pb-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                  >
                    {guide.title}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
