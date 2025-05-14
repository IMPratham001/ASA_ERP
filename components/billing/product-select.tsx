
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store/store";

export function ProductSelect({ onSelect }) {
  const [search, setSearch] = useState("");
  const { products } = useStore();

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-2">
      <Input
        type="search"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-2">
        {filteredProducts.map((product) => (
          <Button
            key={product.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onSelect(product)}
          >
            {product.name} - ${product.price}
          </Button>
        ))}
      </div>
    </div>
  );
}
