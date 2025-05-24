
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api/axios';
import { Alert } from '@/components/ui/alert';
import { handleApiError } from '@/lib/utils/api';

export function ApiTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/test');
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(handleApiError(error));
      }
    };

    testConnection();
  }, []);

  return (
    <Alert variant={status === 'error' ? 'destructive' : 'default'}>
      <p>API Status: {status}</p>
      <p>{message}</p>
    </Alert>
  );
}
