
"use client";

import { useStore } from "@/lib/store/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StoreSelector() {
  const stores = useStore((state) => state.stores);
  const currentStore = useStore((state) => state.currentStore);
  const setCurrentStore = useStore((state) => state.setCurrentStore);

  return (
    <Select
      value={currentStore?.id}
      onValueChange={(storeId) => {
        const store = stores.find((s) => s.id === storeId);
        if (store) setCurrentStore(store);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select store" />
      </SelectTrigger>
      <SelectContent>
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
