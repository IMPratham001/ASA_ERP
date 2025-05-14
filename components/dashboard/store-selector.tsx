
import { useState, useCallback } from 'react';
import { Check, ChevronsUpDown, Store, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useStore } from '@/lib/store/store';

export function StoreSelector() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { currentStore, stores = [], setCurrentStore } = useStore();

  const filteredStores = (stores || []).filter((store) =>
    store?.name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const onStoreSelect = useCallback((store: any) => {
    setCurrentStore(store);
    setOpen(false);
  }, [setCurrentStore]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between hover:bg-accent transition-colors"
        >
          <Store className="mr-2 h-4 w-4" />
          {currentStore?.name || "Select store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search stores..." 
            onValueChange={setSearchValue}
            className="h-9"
          />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            {filteredStores.map((store) => (
              <CommandItem
                key={store.id}
                value={store.name}
                onSelect={() => onStoreSelect(store)}
                className="cursor-pointer"
              >
                <Store className="mr-2 h-4 w-4" />
                {store.name}
                {currentStore?.id === store.id && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
