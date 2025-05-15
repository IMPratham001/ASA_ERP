"use client";
import * as React from "react";
import { useStore } from "@/lib/store/store";
import { Check, ChevronsUpDown, Store, MapPin } from "lucide-react";
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

export function StoreSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { user, stores } = useStore();

  // Guard against undefined stores
  const storesList = stores || [];

  // Safe grouping with null check
  const groupedStores = storesList.reduce((acc, store) => {
    if (!acc[store.region]) {
      acc[store.region] = [];
    }
    acc[store.region].push(store);
    return acc;
  }, {});

  // Check if user exists and has permissions before accessing canSwitchStores
  const canSwitchStores =
    user && user.permissions && user.permissions.canSwitchStores;

  if (!canSwitchStores) {
    const assignedStore = storesList.find(
      (store) => store.id === user?.storeId,
    );
    return (
      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg">
        <Store className="w-4 h-4" />
        <span className="text-sm font-medium">
          {assignedStore?.name || "No store assigned"}
        </span>
        {assignedStore && (
          <>
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {assignedStore.region}
            </span>
          </>
        )}
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
          className="w-[250px] justify-between"
        >
          <Store className="w-4 h-4 mr-2" />
          <span className="truncate">
            {user?.storeId
              ? storesList.find((store) => store.id === user.storeId)?.name ||
                "Unknown store"
              : "Select store..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search stores..." />
          <CommandEmpty>No store found.</CommandEmpty>
          {Object.entries(groupedStores).map(([region, regionStores]) => (
            <CommandGroup key={region} heading={region}>
              {regionStores.map((store) => (
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
                      user?.storeId === store.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{store.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {store.address}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
