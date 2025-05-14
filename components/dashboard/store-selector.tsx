
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StoreSelector() {
  const [selectedStore, setSelectedStore] = React.useState("1");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedStore} onValueChange={setSelectedStore}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Store One</SelectItem>
            <SelectItem value="2">Store Two</SelectItem>
            <SelectItem value="3">Store Three</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
