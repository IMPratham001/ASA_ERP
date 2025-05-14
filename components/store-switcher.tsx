"use client";

import * as React from "react";
import { useStore } from "@/lib/store/store";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const stores = [
  {
    id: "1",
    name: "Main Store",
    location: "New York",
  },
  {
    id: "2",
    name: "Branch Store",
    location: "Los Angeles",
  },
];

export function StoreSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { user } = useStore();

  // If user is not super admin and has an assigned store, show store name without switcher
  if (!user?.permissions.canSwitchStores) {
    const assignedStore = stores.find((store) => store.id === user?.storeId);
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{assignedStore?.name}</span>
        <span className="text-xs text-muted-foreground">
          ({assignedStore?.location})
        </span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="truncate">
            {user?.storeId
              ? stores.find((store) => store.id === user.storeId)?.name
              : "Select store..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search stores..." />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            {stores.map((store) => (
              <CommandItem
                key={store.id}
                value={store.id}
                onSelect={() => {
                  // Will be integrated with store switching logic later
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    user?.storeId === store.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {store.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}