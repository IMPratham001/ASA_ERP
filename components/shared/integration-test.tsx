
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Activity } from 'lucide-react';
import api from '@/lib/api/laravel';

export function IntegrationTest() {
  const [testData, setTestData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testIntegration = async () => {
      try {
        const response = await api.get('/test');
        setTestData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to backend');
      } finally {
        setIsLoading(false);
      }
    };

    testIntegration();
  }, []);

  return (
    <Card className="dark:bg-slate-800/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Status</CardTitle>
        <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'} shadow-lg ${!error && !isLoading && 'animate-pulse'}`} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Activity className="w-5 h-5 text-yellow-500 animate-spin" />
              ) : error ? (
                <X className="w-5 h-5 text-red-500" />
              ) : (
                <Check className="w-5 h-5 text-green-500" />
              )}
              <span className="font-medium">Backend Connection</span>
            </div>
            <div className={`text-sm ${error ? 'text-red-500' : 'text-green-500'}`}>
              {isLoading ? 'Checking...' : error ? 'Disconnected' : 'Connected'}
            </div>
          </div>
          {!error && testData && (
            <div className="rounded-lg bg-slate-100 dark:bg-slate-900/50 p-3 text-sm font-mono">
              {JSON.stringify(testData.test_data, null, 2)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
