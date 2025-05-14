"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function StoreSelector() {
  const { stores, currentStore, setCurrentStore, isLoading } = useStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
            className="justify-between"
          >
            {store.name}
            {currentStore?.id === store.id && (
              <CheckIcon className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        {stores.length === 0 && (
          <DropdownMenuItem disabled>No stores available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

```text
The provided code already contains the intended change. The useStore hook is expected to handle undefined data appropriately. No modifications are necessary based on the provided "changes" snippet.
```

```typescript
"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/store/store";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function StoreSelector() {
  const { stores, currentStore, setCurrentStore, isLoading } = useStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
            className="justify-between"
          >
            {store.name}
            {currentStore?.id === store.id && (
              <CheckIcon className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        {stores.length === 0 && (
          <DropdownMenuItem disabled>No stores available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}