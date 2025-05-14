"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store/store";
import { Store } from "lucide-react";

export function StoreSelector() {
  const { stores, currentStore, setCurrentStore } = useStore();

  if (!stores?.length) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          <Store className="mr-2 h-4 w-4" />
          {currentStore?.name || "Select Store"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => setCurrentStore(store)}
          >
            <Store className="mr-2 h-4 w-4" />
            {store.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}