
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
}

export function LoadingSpinner({ text = 'Loading...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <LoadingSpinner text="Loading page..." />
    </div>
  );
}
