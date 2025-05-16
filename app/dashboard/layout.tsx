
"use client";

import React from "react";
import { Sidebar } from "@/components/layout/main-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-[280px] p-8 bg-background">
        {children}
      </main>
    </div>
  );
}
