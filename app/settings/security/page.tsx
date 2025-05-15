
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecurityPage() {
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
          <Button>Set up Geo-fencing</Button>
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
          <Button>Generate New Password</Button>
        </CardContent>
      </Card>
    </div>
  );
}
