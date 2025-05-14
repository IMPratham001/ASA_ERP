
"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store/store";
import { Store } from "lucide-react";

export function StoreSelect({ onSelect }) {
  const { stores } = useStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px]">
          <Store className="mr-2 h-4 w-4" />
          Select Store
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {stores?.map((store) => (
          <DropdownMenuItem key={store.id} onClick={() => onSelect(store)}>
            {store.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
