"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StoreSelector() {
  return (
    <Select defaultValue="main">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select store" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="main">Main Store</SelectItem>
        <SelectItem value="downtown">Downtown Branch</SelectItem>
        <SelectItem value="mall">Mall Location</SelectItem>
        <SelectItem value="airport">Airport Store</SelectItem>
      </SelectContent>
    </Select>
  );
}