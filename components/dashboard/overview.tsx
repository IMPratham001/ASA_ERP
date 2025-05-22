
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useStore } from "@/lib/store/store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function Overview() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const store = useStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await store.fetchProducts();
        const products = store.products;
        const lowStockItems = products.filter(p => p.stock <= (p.inventory?.low_stock_threshold || 10));
        
        const response = await fetch("/api/mock/dashboard/stats");
        const data = await response.json();
        
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Sales',
              data: data.sales,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            },
            {
              label: 'Revenue',
              data: data.revenue,
              borderColor: 'rgb(53, 162, 235)',
              tension: 0.1
            }
          ]
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: true,
                  text: 'Sales & Revenue Overview'
                }
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
