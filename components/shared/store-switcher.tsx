"use client";

import { useState } from "react";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function StoreSwitcher() {
  const [stores] = useState([
    { id: 1, name: "Main Store" },
    { id: 2, name: "Branch 1" },
    { id: 3, name: "Branch 2" },
  ]);
  const [currentStore, setCurrentStore] = useState(stores[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Store className="h-4 w-4" />
          {currentStore.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => setCurrentStore(store)}
          >
            {store.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}