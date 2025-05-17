
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryTree } from "@/components/categories/category-tree";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

        <Card className="p-6 col-span-2">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="image">Image</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name <span className="text-red-500">*</span></Label>
                  <Input placeholder="Category name" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="searchable" />
                    <Label htmlFor="searchable">Show this category in search box category list</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox id="enabled" />
                    <Label htmlFor="enabled">Enable the category</Label>
                  </div>
                </div>

                <Button>Save</Button>
              </div>
            </TabsContent>
            <TabsContent value="image">
              {/* Image upload section */}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
