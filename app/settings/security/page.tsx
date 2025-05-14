
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, MapPin, Mail, Phone, Key } from "lucide-react";

export default function SecurityPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appAccess, setAppAccess] = useState(true);
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Security Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" /> Password & Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button>Change Password</Button>
          <Button variant="outline">Enable Two-Factor Authentication</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Geo-fencing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Set up Geo-fencing</Button>
          <p className="text-sm text-muted-foreground mt-2">
            Secure your account by allowing access only from specific countries
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" /> Security Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">New sign-in alerts</label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about new device sign-ins
              </p>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">App access alerts</label>
              <p className="text-sm text-muted-foreground">
                Get notified when new apps access your account
              </p>
            </div>
            <Switch checked={appAccess} onCheckedChange={setAppAccess} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Newsletter subscription</label>
              <p className="text-sm text-muted-foreground">
                Receive product updates and security alerts
              </p>
            </div>
            <Switch checked={newsletter} onCheckedChange={setNewsletter} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
