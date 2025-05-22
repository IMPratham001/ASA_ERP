
"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
