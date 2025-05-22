
"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface ErrorHandlerProps {
  error: Error;
  reset: () => void;
}

export default function ErrorHandler({ error, reset }: ErrorHandlerProps) {
  useEffect(() => {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message,
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-white rounded-md"
      >
        Try again
      </button>
    </div>
  );
}
