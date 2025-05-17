"use client";

import { Bar, Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview as OverviewCard } from "@/components/ui/overview";

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Sales overview for current period</CardDescription>
      </CardHeader>
      <CardContent>
        <OverviewCard />
      </CardContent>
    </Card>
  );
}