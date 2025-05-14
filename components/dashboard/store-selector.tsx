"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store/store";

export function StoreSelector() {
  const { stores, currentStore, setCurrentStore } = useStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {currentStore?.name || "Select Store"}
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onSelect={() => setCurrentStore(store)}
          >
            {store.name}
          </DropdownMenuItem>
        ))}
        {stores.length === 0 && (
          <DropdownMenuItem disabled>No stores available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}