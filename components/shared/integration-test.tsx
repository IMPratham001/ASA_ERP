
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from '@/lib/api/laravel';

export function IntegrationTest() {
  const [testData, setTestData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testIntegration = async () => {
      try {
        const response = await api.get('/test');
        setTestData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to backend');
        console.error('Integration test failed:', err);
      }
    };

    testIntegration();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integration Status</CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500">
            {error}
          </div>
        ) : testData ? (
          <div className="space-y-2">
            <div className="text-green-500">✓ Backend Connected</div>
            <div>Timestamp: {new Date(testData.timestamp).toLocaleString()}</div>
            <div>Status: {testData.status}</div>
            <pre className="bg-muted p-2 rounded">
              {JSON.stringify(testData.test_data, null, 2)}
            </pre>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}
