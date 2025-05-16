
"use client";

import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 ml-[280px] p-8 bg-background">
      {children}
    </main>
  );
}
