
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ProductSelect({ value, onValueChange }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select product" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="product1">Product 1</SelectItem>
        <SelectItem value="product2">Product 2</SelectItem>
        <SelectItem value="product3">Product 3</SelectItem>
      </SelectContent>
    </Select>
  );
}
