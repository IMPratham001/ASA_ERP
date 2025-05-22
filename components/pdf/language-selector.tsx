
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSelector() {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'hi', name: 'Hindi' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Language</CardTitle>
      </CardHeader>
      <CardContent>
        <Select defaultValue="en">
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
