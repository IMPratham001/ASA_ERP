
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, ChevronRight, Settings, Store, Users, BarChart2, FileText, DollarSign, Package, Clock } from "lucide-react";

export function UserGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const guides = [
    {
      title: "Getting Started",
      icon: <Settings className="h-5 w-5" />,
      content: "Welcome to the Enterprise Resource Planning system. This comprehensive guide will help you navigate through all features and functionalities.",
      sections: ["System Overview", "Quick Start", "Basic Navigation"]
    },
    {
      title: "Store Management",
      icon: <Store className="h-5 w-5" />,
      content: "Complete guide for managing multiple store locations, inventory synchronization, and store performance tracking.",
      sections: ["Store Setup", "Location Management", "Store Analytics"]
    },
    {
      title: "Analytics & Reporting",
      icon: <BarChart2 className="h-5 w-5" />,
      content: "Detailed insights into business performance, from granular metrics to high-level analysis.",
      sections: ["Financial Reports", "Performance Metrics", "Custom Analytics"]
    },
    {
      title: "Inventory Control",
      icon: <Package className="h-5 w-5" />,
      content: "Manage your inventory across all locations with advanced tracking and optimization.",
      sections: ["Stock Management", "Inventory Tracking", "Order Management"]
    },
    {
      title: "Employee Management",
      icon: <Users className="h-5 w-5" />,
      content: "Comprehensive employee management including performance tracking and scheduling.",
      sections: ["Staff Profiles", "Performance Metrics", "Schedule Management"]
    },
    {
      title: "Financial Management",
      icon: <DollarSign className="h-5 w-5" />,
      content: "Complete financial management including transactions, reporting, and forecasting.",
      sections: ["Transaction Management", "Financial Reports", "Budgeting"]
    },
    {
      title: "Time Tracking",
      icon: <Clock className="h-5 w-5" />,
      content: "Advanced time tracking and attendance management system.",
      sections: ["Time Sheets", "Attendance Reports", "Schedule Planning"]
    },
    {
      title: "Document Management",
      icon: <FileText className="h-5 w-5" />,
      content: "Organize and manage all business documents efficiently.",
      sections: ["File Organization", "Document Sharing", "Version Control"]
    }
  ];

  return (
    <div className={`fixed right-0 top-20 z-50 transition-all ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <Button
        variant="outline"
        className="absolute -left-12 top-0 h-24 w-12 bg-white dark:bg-slate-900 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Book className="h-6 w-6" />
      </Button>
      <Card className="h-[calc(100vh-5rem)] w-96 shadow-xl">
        <ScrollArea className="h-full">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6">User Manual</h2>
            <div className="space-y-6">
              {guides.map((guide, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Button
                    variant="ghost"
                    className="w-full justify-between mb-2"
                  >
                    <div className="flex items-center gap-3">
                      {guide.icon}
                      <span className="font-semibold">{guide.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <p className="text-sm text-muted-foreground mb-3">{guide.content}</p>
                  <div className="pl-4 space-y-1">
                    {guide.sections.map((section, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                        • {section}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
