
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country/Region</label>
              <Input placeholder="United States" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Zone</label>
              <Input placeholder="(GMT-05:00) Eastern Time" />
            </div>
          </div>
          <Button className="mt-4">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" /> Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address</label>
            <Input type="email" placeholder="john@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input type="tel" placeholder="+1 (555) 000-0000" />
          </div>
          <Button>Update Contact Info</Button>
        </CardContent>
      </Card>
    </div>
  );
}
