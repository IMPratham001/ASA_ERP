
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';

export function handleApiError(error: AxiosError) {
  const message = error.response?.data?.message || 'An error occurred';
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
  throw error;
}
