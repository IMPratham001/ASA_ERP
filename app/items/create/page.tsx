
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Editor } from '@/components/ui/editor';
import { ImageUpload } from '@/components/ui/image-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store/store";

export default function CreateItemPage() {
  const router = useRouter();
  const { addProduct, categories, brands } = useStore();
  const [activeTab, setActiveTab] = useState("basic");
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    price: "",
    description: "",
    categoryId: "",
    brandId: "",
    metaTitle: "",
    metaDescription: "",
    attributes: [],
    variations: [],
    images: [],
    stock: 0,
    minStock: 5,
    warehouse: "",
    taxClass: "",
    customFields: {}
  });

  const handleImageUpload = useCallback((files: File[]) => {
    // Handle image upload logic
  }, []);

  const generateSKU = useCallback(() => {
    // Generate SKU logic
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add Product</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit">Save Product</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variations">Variations</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>SKU</Label>
                    <div className="flex gap-2">
                      <Input value={product.sku} onChange={(e) => setProduct({ ...product, sku: e.target.value })} />
                      <Button onClick={generateSKU}>Generate</Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label>Price</Label>
                    <Input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Category</Label>
                    <Select value={product.categoryId} onValueChange={(value) => setProduct({ ...product, categoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Brand</Label>
                    <Select value={product.brandId} onValueChange={(value) => setProduct({ ...product, brandId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands?.map(brand => (
                          <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description">
          <Card>
            <CardContent className="pt-4">
              <Editor 
                value={product.description} 
                onChange={(value) => setProduct({ ...product, description: value })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardContent className="pt-4">
              <ImageUpload
                value={product.images}
                onChange={(value) => setProduct({ ...product, images: value })}
                onUpload={handleImageUpload}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variations">
          {/* Variations form */}
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div className="grid gap-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Stock</Label>
                    <Input type="number" value={product.stock} onChange={(e) => setProduct({ ...product, stock: e.target.value })} />
                  </div>
                  <div className="flex-1">
                    <Label>Min Stock</Label>
                    <Input type="number" value={product.minStock} onChange={(e) => setProduct({ ...product, minStock: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Warehouse</Label>
                  <Input value={product.warehouse} onChange={(e) => setProduct({ ...product, warehouse: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label>Meta Title</Label>
                <Input value={product.metaTitle} onChange={(e) => setProduct({ ...product, metaTitle: e.target.value })} />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Input value={product.metaDescription} onChange={(e) => setProduct({ ...product, metaDescription: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
