
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store/store';
import { Button } from './button';
import { Card, CardContent } from './card';
import { X } from 'lucide-react';

interface TourStep {
  element: string;
  title: string;
  content: string;
  role?: string[];
}

const tourSteps: Record<string, TourStep[]> = {
  '/dashboard': [
    {
      element: '[data-tour="overview"]',
      title: 'Revenue Overview',
      content: 'Track your revenue trends and performance metrics.',
      role: ['admin', 'manager', 'accountant']
    },
    {
      element: '[data-tour="recent-sales"]',
      title: 'Recent Sales',
      content: 'Monitor your latest transactions and sales activities.',
      role: ['admin', 'manager', 'sales']
    }
  ],
  '/inventory': [
    {
      element: '[data-tour="stock-levels"]',
      title: 'Stock Levels',
      content: 'Track inventory levels and get low stock alerts.',
      role: ['admin', 'manager', 'inventory']
    }
  ]
};

export function Tour() {
  const pathname = usePathname();
  const { user } = useStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  
  const steps = tourSteps[pathname]?.filter(
    step => !step.role || step.role.includes(user?.role || '')
  ) || [];

  useEffect(() => {
    const tourComplete = localStorage.getItem(`tour-${pathname}`);
    if (!tourComplete && steps.length > 0) {
      setIsTourActive(true);
    }
  }, [pathname, steps.length]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`tour-${pathname}`, 'completed');
    setIsTourActive(false);
    setCurrentStep(0);
  };

  if (!isTourActive || steps.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-[300px]">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{steps[currentStep].title}</h3>
            <Button variant="ghost" size="icon" onClick={handleComplete}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {steps[currentStep].content}
          </p>
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            <Button size="sm" onClick={handleNext}>
              {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
