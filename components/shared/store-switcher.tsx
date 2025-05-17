
"use client";

import { useState } from 'react';
import { Check, ChevronDown, Store } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StoreSwitcherProps {
  className?: string;
  onStoreChange?: (storeId: string) => void;
}

export function StoreSwitcher({ className, onStoreChange }: StoreSwitcherProps) {
  const [selectedStore, setSelectedStore] = useState('all');

  const stores = [
    { id: 'all', name: 'All Stores', color: '#3b82f6' },
    { id: 'store-1', name: 'Main Store', color: '#10b981' },
    { id: 'store-2', name: 'Branch A', color: '#6366f1' },
    { id: 'store-3', name: 'Branch B', color: '#8b5cf6' },
  ];

  const handleStoreSelect = (storeId: string) => {
    setSelectedStore(storeId);
    onStoreChange?.(storeId);
  };

  const currentStore = stores.find(store => store.id === selectedStore) || stores[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox"
          aria-expanded={false}
          aria-label="Select store"
          className={cn("w-[200px] justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: currentStore.color }}
            />
            <span>{currentStore.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id}
            onClick={() => handleStoreSelect(store.id)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: store.color }}
              />
              <span>{store.name}</span>
            </div>
            {selectedStore === store.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
