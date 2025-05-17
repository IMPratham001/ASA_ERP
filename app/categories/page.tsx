"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryTree } from "@/components/categories/category-tree";

export default function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button variant="outline">Add Root Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 col-span-1">
          <CategoryTree />
        </Card>
      </div>
    </div>
  );
}