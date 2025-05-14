
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export const useKeyboardShortcuts = () => {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd + Alt is pressed
      if ((event.ctrlKey || event.metaKey) && event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'd':
            router.push('/dashboard');
            toast({ title: "Navigation", description: "Switched to Dashboard" });
            break;
          case 'i':
            router.push('/inventory');
            toast({ title: "Navigation", description: "Switched to Inventory" });
            break;
          case 'o':
            router.push('/orders');
            toast({ title: "Navigation", description: "Switched to Orders" });
            break;
          case 'u':
            router.push('/users');
            toast({ title: "Navigation", description: "Switched to Users" });
            break;
          case 's':
            router.push('/settings');
            toast({ title: "Navigation", description: "Switched to Settings" });
            break;
          case 'h':
            router.push('/help');
            toast({ title: "Navigation", description: "Switched to Help" });
            break;
          case 'l':
            router.push('/auth');
            toast({ title: "Navigation", description: "Switched to Login" });
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, toast]);
};
