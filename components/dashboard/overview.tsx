'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';

export function DashboardOverview() {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Fetch data from API
    fetch('/api/mock/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setData({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Sales',
            data: data.monthlySales || [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        });
      });
  }, []);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <div className="w-full h-[300px]">
        <Chart data={data} />
      </div>
    </Card>
  );
}