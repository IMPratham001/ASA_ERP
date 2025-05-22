
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export function Overview() {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });
  const [selectedStore, setSelectedStore] = useState('all');
  const stores = [
    { id: 'all', name: 'All Stores' },
    { id: 'store1', name: 'Main Store' },
    { id: 'store2', name: 'Branch A' },
    { id: 'store3', name: 'Branch B' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchData();
  }, [selectedStore]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
