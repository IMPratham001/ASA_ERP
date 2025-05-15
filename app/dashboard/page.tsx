"use client";

import { useState } from "react";
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
    value: "main-store",
    label: "Main Store",
  },
  {
    value: "online-store",
    label: "Online Store",
  },
  {
    value: "warehouse",
    label: "Warehouse",
  },
  {
    value: "outlet",
    label: "Outlet",
  },
];

export function StoreSelector() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("main-store");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? stores.find((store) => store.value === value)?.label
            : "Select store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            {stores.map((store) => (
              <CommandItem
                key={store.value}
                value={store.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === store.value ? "opacity-100" : "opacity-0",
                  )}
                />
                {store.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}