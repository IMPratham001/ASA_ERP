
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SecurityPage() {
  const [allowedIPs, setAllowedIPs] = useState<string[]>([]);
  const [appPasswords, setAppPasswords] = useState<string[]>([]);
  const [deviceSignIns, setDeviceSignIns] = useState([]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Security</h2>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" />
            <Button className="mt-4">Change Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geo-fencing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Secure your account by allowing access only from specific countries
          </p>
          <Button variant="default">Set up Geo-fencing</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Allowed IP Address</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Restrict access to your account by adding a range of trusted IP addresses.
          </p>
          <Button variant="default">Add Allowed IP Address</Button>
          {allowedIPs.length > 0 && (
            <div className="mt-4 space-y-2">
              {allowedIPs.map((ip) => (
                <div key={ip} className="flex items-center justify-between">
                  <span>{ip}</span>
                  <Button variant="destructive" size="sm">Remove</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application-Specific Passwords</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Allow third-party applications to access your account with unique passwords
          </p>
          <Button variant="default">Generate New Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
