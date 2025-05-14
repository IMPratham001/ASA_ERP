
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useKeyboardShortcuts = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'd':
            router.push('/dashboard');
            break;
          case 'i':
            router.push('/inventory');
            break;
          case 'o':
            router.push('/orders');
            break;
          case 'f':
            router.push('/finance');
            break;
          case 'n':
            router.push('/create-invoice');
            break;
          case 'h':
            router.push('/help');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);
};
