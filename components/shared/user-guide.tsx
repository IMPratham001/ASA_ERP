
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, ChevronRight, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function UserGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedGuide, setExpandedGuide] = useState(null);

  const guides = [
    {
      title: "Getting Started",
      content: `Welcome to the ERP System!
        
Quick Start:
1. Navigate using the sidebar menu
2. Access your dashboard for key metrics
3. Manage inventory, customers, and sales
4. Generate reports for business insights
        
Need help? Contact support at support@erp.com`
    },
    {
      title: "Reports & Analytics",
      content: `Generate Insights:
        
1. Select report type (Sales/Inventory/Staff)
2. Choose date range
3. Filter by store location
4. Export in Excel or PDF format
        
Tips:
- Use date filters for specific periods
- Compare across stores
- Schedule automated reports`
    },
    {
      title: "Inventory Management",
      content: `Track & Manage Stock:
        
1. View current stock levels
2. Set low stock alerts
3. Add/Edit inventory items
4. Generate barcodes
        
Best Practices:
- Regular stock counts
- Update quantities promptly
- Monitor low stock alerts`
    },
    {
      title: "Customer Management",
      content: `Manage Customer Relations:
        
1. Add new customers
2. View purchase history
3. Track interactions
4. Manage loyalty programs
        
Tips:
- Keep contact info updated
- Monitor buying patterns
- Set follow-up reminders`
    },
    {
      title: "Creating Invoices",
      content: `Generate Sales Documents:
        
1. Select customer
2. Add products/services
3. Apply discounts
4. Generate QR codes
        
Remember to:
- Verify prices
- Check stock availability
- Include payment terms`
    }
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
      <Card className="h-[calc(100vh-5rem)] w-96">
        <ScrollArea className="h-full">
          <CardContent className="p-4">
            <h2 className="text-xl font-bold mb-4">User Manual</h2>
            <div className="space-y-4">
              {guides.map((guide, index) => (
                <Collapsible
                  key={index}
                  open={expandedGuide === index}
                  onOpenChange={() => setExpandedGuide(expandedGuide === index ? null : index)}
                >
                  <CollapsibleTrigger className="flex w-full items-center justify-between p-2 hover:bg-gray-100 rounded">
                    <span>{guide.title}</span>
                    {expandedGuide === index ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 text-sm space-y-2 border-l-2 ml-2">
                    <pre className="whitespace-pre-wrap font-sans">
                      {guide.content}
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
