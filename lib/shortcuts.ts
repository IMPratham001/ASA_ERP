
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useKeyboardShortcuts = () => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (!(event.ctrlKey || event.metaKey)) return;

      switch (event.key) {
        case 'd':
          event.preventDefault();
          router.push('/dashboard');
          break;
        case 'i':
          event.preventDefault();
          router.push('/inventory');
          break;
        case 'o':
          event.preventDefault();
          router.push('/orders');
          break;
        case 'h':
          event.preventDefault();
          router.push('/help');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router]);
};
