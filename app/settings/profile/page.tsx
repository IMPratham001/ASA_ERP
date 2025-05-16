
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'PRATHAM SONI',
    displayName: 'PRATHAM',
    email: 'sonipratham415@gmail.com',
    gender: 'Male',
    country: 'India',
    state: 'Gujarat',
    language: 'English - United States',
    timezone: '(GMT +05:30) India Standard Time (Asia/Kolkata)'
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Profile</h2>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
            </Avatar>
            <Button>Upload Picture</Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.fullName} onChange={(e) => setProfile({...profile, fullName: e.target.value})} />
            </div>
            
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input value={profile.displayName} onChange={(e) => setProfile({...profile, displayName: e.target.value})} />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Country/Region</Label>
              <Input value={profile.country} readOnly />
            </div>

            <div className="space-y-2">
              <Label>State</Label>
              <Input value={profile.state} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={profile.language} onValueChange={(value) => setProfile({...profile, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English - United States">English - United States</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between border-b py-4">
            <div>
              <p className="font-medium">{profile.email}</p>
              <p className="text-sm text-muted-foreground">Primary Email</p>
            </div>
            <Button variant="outline" size="sm">Verify</Button>
          </div>
          <Button className="mt-4">Add Email Address</Button>
        </CardContent>
      </Card>
    </div>
  );
}
