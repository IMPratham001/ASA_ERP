
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [dateFormat, setDateFormat] = useState('MMM d, yyyy HH:mm');
  const [notifications, setNotifications] = useState({
    newSignIn: true,
    thirdPartyAccess: true,
    newsletter: false
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Date Format</Label>
            <Input value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} />
          </div>

          <div className="space-y-4">
            <Label>Email notifications</Label>
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <div className="font-medium">New sign-in to account alert</div>
                <div className="text-sm text-muted-foreground">
                  Receive email alerts whenever your account is signed in from a new device or location
                </div>
              </div>
              <Switch 
                checked={notifications.newSignIn}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, newSignIn: checked}))}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <div className="font-medium">Third-party app access alert</div>
                <div className="text-sm text-muted-foreground">
                  Receive email alerts when your account is accessed from a new third-party app
                </div>
              </div>
              <Switch 
                checked={notifications.thirdPartyAccess}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, thirdPartyAccess: checked}))}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <div className="font-medium">Newsletter subscription</div>
                <div className="text-sm text-muted-foreground">
                  Receive marketing communications regarding products and services
                </div>
              </div>
              <Switch 
                checked={notifications.newsletter}
                onCheckedChange={(checked) => setNotifications(prev => ({...prev, newsletter: checked}))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
