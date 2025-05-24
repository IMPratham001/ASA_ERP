
import { useEffect } from 'react';
import Echo from 'laravel-echo';

export function useRealtimeUpdates(channel: string, event: string, callback: (data: any) => void) {
  useEffect(() => {
    const echo = window.Echo;
    
    if (echo) {
      echo.private(channel)
        .listen(event, (data: any) => {
          callback(data);
        });
    }
    
    return () => {
      if (echo) {
        echo.leave(channel);
      }
    };
  }, [channel, event, callback]);
}
