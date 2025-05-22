
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function SessionManager() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Session Expired",
          description: "Please login again to continue",
          variant: "destructive"
        });
        router.push('/auth/login');
      }
    };

    const interval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [router, toast]);

  return null;
}
