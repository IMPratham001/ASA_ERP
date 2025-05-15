
'use client';

import { DashboardOverview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <DashboardOverview />
        <RecentSales />
      </div>
    </div>
  );
}
