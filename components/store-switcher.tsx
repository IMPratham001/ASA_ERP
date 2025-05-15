"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building } from "lucide-react";

export function StoreSwitcher() {
  const [stores] = useState([]);

  return (
    <Button variant="outline" className="w-[200px] justify-between">
      <Building className="mr-2 h-4 w-4" />
      <span>Select Store</span>
    </Button>
  );
}