
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export function DynamicFieldManager() {
  const fields = [
    { id: 'customer_name', label: 'Customer Name', type: 'text' },
    { id: 'invoice_date', label: 'Invoice Date', type: 'date' },
    { id: 'invoice_number', label: 'Invoice Number', type: 'number' },
  ];

  const handleDragEnd = (result: any) => {
    // Implement drag and drop logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center gap-2 p-2 mb-2 border rounded"
                      >
                        <span>{field.label}</span>
                        <span className="text-sm text-gray-500">({field.type})</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button className="mt-4">
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
      </CardContent>
    </Card>
  );
}
