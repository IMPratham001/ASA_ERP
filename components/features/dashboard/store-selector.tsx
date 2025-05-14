"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StoreSelector() {
  const [store, setStore] = useState("all");

  return (
    <Select value={store} onValueChange={setStore}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select store" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Stores</SelectItem>
        <SelectItem value="store1">Store 1</SelectItem>
        <SelectItem value="store2">Store 2</SelectItem>
      </SelectContent>
    </Select>
  );
}