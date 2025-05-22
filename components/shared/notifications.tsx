
'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export function NotificationProvider() {
  return <Toaster />;
}

export function showNotification({ message, type }: NotificationProps) {
  const { toast } = useToast();
  
  useEffect(() => {
    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  }, [message, type, toast]);

  return null;
}
