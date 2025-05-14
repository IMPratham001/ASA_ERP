
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserManualPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">User Manual</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Welcome to the ASA ERP system user manual. Here you'll find detailed information about using the system.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
