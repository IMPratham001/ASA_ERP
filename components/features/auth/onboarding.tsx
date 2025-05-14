
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const onboardingSteps = [
  {
    title: "Welcome to ASA ERP",
    description: "Let's get you started with a quick tour of the system.",
  },
  {
    title: "Navigation",
    description: "Use keyboard shortcuts (Ctrl/Cmd + Alt + Key) to quickly navigate: D for Dashboard, I for Inventory, O for Orders, etc.",
  },
  {
    title: "Dashboard Overview",
    description: "Your dashboard shows key metrics, recent sales, and important notifications at a glance.",
  },
  {
    title: "Quick Actions",
    description: "Use the top bar to switch between stores, access settings, and view notifications.",
  },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep === onboardingSteps.length - 1) {
      setOpen(false);
      localStorage.setItem('hasSeenOnboarding', 'true');
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{onboardingSteps[currentStep].title}</DialogTitle>
          <DialogDescription>
            {onboardingSteps[currentStep].description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Skip Tour
          </Button>
          <Button onClick={handleNext}>
            {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
