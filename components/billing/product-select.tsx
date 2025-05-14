
"use client";

import { Check, ChevronsUpDown, Package } from "lucide-react";
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
import { useStore } from "@/lib/store/store";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductSelect({ onSelect }: { onSelect: (product: any) => void }) {
  const [open, setOpen] = useState(false);
  const { products } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <Package className="mr-2 h-4 w-4" />
          {selectedProduct ? 
            products.find(product => product.id === selectedProduct)?.name : 
            "Select product..."}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandEmpty>No product found.</CommandEmpty>
          <CommandGroup>
            {products.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => {
                  setSelectedProduct(product.id);
                  onSelect(product);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedProduct === product.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {product.name} - ₹{product.price}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
