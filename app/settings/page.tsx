
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/settings/users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              Configure user roles, permissions, and access controls
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/stores">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>Configure store details</CardDescription>
            </CardHeader>
            <CardContent>
              Manage store information, locations, and preferences
            </CardContent>
          </Card>
        </Link>

        <Link href="/settings/preferences">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>General system settings</CardDescription>
            </CardHeader>
            <CardContent>
              Configure global settings, notifications, and display options
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
