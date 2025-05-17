
"use client";

import { ChevronRight, ChevronDown, FolderIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  name: string;
  children?: Category[];
};

const demoCategories: Category[] = [
  {
    id: "1",
    name: "Ushnakal Shringars and Sahityas",
    children: [
      { id: "1-1", name: "Chip Shringars" }
    ]
  },
  {
    id: "2",
    name: "Chandan Shringars",
    children: [
      { id: "2-1", name: "Chandan Chandrika" },
      { id: "2-2", name: "Chandan Haas" },
      { id: "2-3", name: "Chandan Kundal" },
      { id: "2-4", name: "Chandan Venuji" },
      { id: "2-5", name: "Chandan Tipara" },
      { id: "2-6", name: "Chandan Mukut" },
      { id: "2-7", name: "Chandan Sets" },
      { id: "2-8", name: "Chandan Moti" }
    ]
  },
  {
    id: "3",
    name: "Moti Shringars",
    children: [
      { id: "3-1", name: "Moti Gadimala" },
      { id: "3-2", name: "Moti Kandora" }
    ]
  }
];

function CategoryItem({ category, level = 0 }: { category: Category; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className="flex items-center gap-1 py-1 px-2 hover:bg-accent rounded cursor-pointer"
        style={{ marginLeft: `${level * 16}px` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {hasChildren ? (
          isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        ) : (
          <span className="w-4"></span>
        )}
        <FolderIcon className="h-4 w-4" />
        <span>{category.name}</span>
      </div>
      
      {isExpanded && hasChildren && (
        <div>
          {category.children?.map(child => (
            <CategoryItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button variant="link" className="p-0 h-auto">Collapse All</Button>
          <span>|</span>
          <Button variant="link" className="p-0 h-auto">Expand All</Button>
        </div>
        <Button variant="outline" size="sm">Add Subcategory</Button>
      </div>
      <div className="space-y-1">
        {demoCategories.map(category => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
