
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api/axios';
import { Alert } from '@/components/ui/alert';
import { handleApiError } from '@/lib/utils/api';

export function ApiTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [dbData, setDbData] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic API
        const apiResponse = await api.get('/test');
        setMessage(apiResponse.data.message);
        
        // Test DB connection
        const dbResponse = await api.get('/test-db');
        setDbData(dbResponse.data);
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setMessage(handleApiError(error));
      }
    };

    testConnection();
  }, []);

  return (
    <div className="space-y-4">
      <Alert variant={status === 'error' ? 'destructive' : 'default'}>
        <p>API Status: {status}</p>
        <p>Message: {message}</p>
      </Alert>
      
      {dbData && (
        <Alert>
          <p>Database Status: {dbData.status}</p>
          <p>Database: {dbData.connection}</p>
          <pre className="mt-2 text-sm">
            {JSON.stringify(dbData.data, null, 2)}
          </pre>
        </Alert>
      )}
    </div>
  );
}
