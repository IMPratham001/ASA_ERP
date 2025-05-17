
"use client";

import { ChevronRight, ChevronDown, FolderIcon, GripVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type Category = {
  id: string;
  name: string;
  children?: Category[];
};

const ItemTypes = {
  CATEGORY: 'category'
};

function CategoryItem({ 
  category, 
  level = 0, 
  onMove 
}: { 
  category: Category; 
  level?: number;
  onMove: (dragId: string, dropId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CATEGORY,
    item: { id: category.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CATEGORY,
    drop: (item: { id: string }) => {
      if (item.id !== category.id) {
        onMove(item.id, category.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div 
      className={`select-none ${isDragging ? 'opacity-50' : ''}`}
      ref={(node) => drag(drop(node))}
    >
      <div 
        className={`flex items-center gap-1 py-1 px-2 hover:bg-accent rounded cursor-pointer ${isOver ? 'bg-accent/50' : ''}`}
        style={{ marginLeft: `${level * 16}px` }}
      >
        <GripVertical className="h-4 w-4 cursor-grab" />
        <div onClick={() => setIsExpanded(!isExpanded)}>
          {hasChildren ? (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <span className="w-4"></span>
          )}
        </div>
        <FolderIcon className="h-4 w-4" />
        <span>{category.name}</span>
      </div>
      
      {isExpanded && hasChildren && (
        <div>
          {category.children?.map(child => (
            <CategoryItem 
              key={child.id} 
              category={child} 
              level={level + 1} 
              onMove={onMove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryTree() {
  const [categories, setCategories] = useState(demoCategories);

  const handleMove = (dragId: string, dropId: string) => {
    const findCategoryAndParent = (
      categories: Category[],
      id: string,
      parent: Category[] | null = null
    ): [Category | null, Category[] | null] => {
      for (let i = 0; i < categories.length; i++) {
        if (categories[i].id === id) {
          return [categories[i], parent || categories];
        }
        if (categories[i].children) {
          const [found, foundParent] = findCategoryAndParent(
            categories[i].children!,
            id,
            categories[i].children
          );
          if (found) return [found, foundParent];
        }
      }
      return [null, null];
    };

    const [draggedCategory, draggedParent] = findCategoryAndParent(categories, dragId);
    const [dropCategory] = findCategoryAndParent(categories, dropId);

    if (!draggedCategory || !dropCategory || !draggedParent) return;

    // Remove from original location
    const newDraggedParent = draggedParent.filter(cat => cat.id !== dragId);
    
    // Add to new location
    if (!dropCategory.children) {
      dropCategory.children = [];
    }
    dropCategory.children.push(draggedCategory);

    // Update state
    setCategories([...categories]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
          {categories.map(category => (
            <CategoryItem 
              key={category.id} 
              category={category}
              onMove={handleMove}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
