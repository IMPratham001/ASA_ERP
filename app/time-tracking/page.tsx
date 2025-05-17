"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Square, Plus } from "lucide-react";

export default function TimeTrackingPage() {
  const { staff, projects, timeEntries, addTimeEntry } = useStore();
  const [timer, setTimer] = useState({ active: false, seconds: 0 });
  const [currentTask, setCurrentTask] = useState({
    project: "",
    staffId: "",
    description: "",
    startTime: "",
  });

  useEffect(() => {
    let interval;
    if (timer.active) {
      interval = setInterval(() => {
        setTimer(prev => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.active]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startTimer = () => setTimer({ ...timer, active: true });
  const pauseTimer = () => setTimer({ ...timer, active: false });
  const stopTimer = () => {
    if (currentTask.project) {
      setEntries([...entries, {
        ...currentTask,
        duration: timer.seconds,
        startTime: new Date().toISOString()
      }]);
    }
    setTimer({ active: false, seconds: 0 });
    setCurrentTask({ project: "", description: "" });
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Time Tracking</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Timer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Select 
        value={currentTask.staffId} 
        onValueChange={(val) => setCurrentTask({ ...currentTask, staffId: val })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Staff Member" />
        </SelectTrigger>
        <SelectContent>
          {staff.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={currentTask.project} onValueChange={(val) => setCurrentTask({ ...currentTask, project: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="project-1">Project 1</SelectItem>
                <SelectItem value="project-2">Project 2</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              placeholder="Task description"
              value={currentTask.description}
              onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
            />
            <div className="flex items-center gap-2">
              {!timer.active ? (
                <Button onClick={startTimer}><Play className="w-4 h-4" /></Button>
              ) : (
                <Button onClick={pauseTimer}><Pause className="w-4 h-4" /></Button>
              )}
              <Button variant="outline" onClick={stopTimer}><Square className="w-4 h-4" /></Button>
              <span className="text-2xl font-mono">{formatTime(timer.seconds)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, i) => (
                <TableRow key={i}>
                  <TableCell>{entry.project}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{new Date(entry.startTime).toLocaleString()}</TableCell>
                  <TableCell>{formatTime(entry.duration)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}