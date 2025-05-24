
import Echo from 'laravel-echo';
import io from 'socket.io-client';

declare global {
  interface Window {
    io: typeof io;
    Echo: Echo;
  }
}

export const initializeEcho = () => {
  window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001',
    transports: ['websocket']
  });
  
  window.Echo.private('updates')
    .listen('DataUpdated', (e: any) => {
      // Handle real-time updates
    });
};
