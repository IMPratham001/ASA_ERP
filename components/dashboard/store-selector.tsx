typescript jsx
"use client";

import { useStore } from "@/lib/store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StoreSelector() {
  const { selectedStore, setSelectedStore } = useStore();

  return (
    <Select value={selectedStore || ""} onValueChange={setSelectedStore}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select store" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="store1">Store 1</SelectItem>
        <SelectItem value="store2">Store 2</SelectItem>
      </SelectContent>
    </Select>
  );
}