
"use client";

import { useStore } from "@/lib/store/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoreSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function StoreSelect({ value, onChange, disabled }: StoreSelectProps) {
  const { stores } = useStore();

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Select store" />
      </SelectTrigger>
      <SelectContent>
        {stores?.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
