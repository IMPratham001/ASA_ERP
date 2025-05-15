
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StoreSelect({ value, onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select store" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="store1">Store 1</SelectItem>
        <SelectItem value="store2">Store 2</SelectItem>
        <SelectItem value="store3">Store 3</SelectItem>
      </SelectContent>
    </Select>
  );
}
