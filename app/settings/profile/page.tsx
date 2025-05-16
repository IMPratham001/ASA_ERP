
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Line, Bar, Radar } from 'react-chartjs-2';
import { Clock, Star, Award, Target, TrendingUp, Calendar } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'PRATHAM SONI',
    displayName: 'PRATHAM',
    email: 'sonipratham415@gmail.com',
    gender: 'Male',
    country: 'India',
    state: 'Gujarat',
    language: 'English - United States',
    timezone: '(GMT +05:30) India Standard Time (Asia/Kolkata)',
    role: 'Senior Manager',
    department: 'Operations'
  });

  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Performance Score',
      data: [85, 88, 92, 90, 95, 93],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true
    }]
  };

  const skillsData = {
    labels: ['Leadership', 'Communication', 'Technical', 'Innovation', 'Teamwork', 'Problem Solving'],
    datasets: [{
      label: 'Skills Assessment',
      data: [90, 85, 95, 88, 92, 87],
      backgroundColor: 'rgba(147, 51, 234, 0.2)',
      borderColor: 'rgb(147, 51, 234)',
      pointBackgroundColor: 'rgb(147, 51, 234)',
    }]
  };

  const activityStats = [
    { icon: Clock, label: 'Hours Logged', value: '180h', trend: '+12%' },
    { icon: Star, label: 'Projects Completed', value: '23', trend: '+8%' },
    { icon: Award, label: 'Achievements', value: '15', trend: '+3' },
    { icon: Target, label: 'Goals Met', value: '92%', trend: '+5%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          View Calendar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                <p className="text-gray-500">{profile.role} • {profile.department}</p>
                <Button className="mt-2">Upload Picture</Button>
              </div>
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
                <Label>Department</Label>
                <Select value={profile.department} onValueChange={(value) => setProfile({...profile, department: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <stat.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{stat.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{stat.value}</div>
                    <div className="text-xs text-green-600">{stat.trend}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Monthly performance analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <Line data={performanceData} options={{ responsive: true }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>Competency evaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <Radar data={skillsData} options={{ responsive: true }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
