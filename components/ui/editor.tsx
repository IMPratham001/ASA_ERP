
"use client";

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Editor({ value, onChange, className }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-1 bg-muted/50 p-1 rounded-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(editor.isActive('bold') && "bg-muted")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(editor.isActive('italic') && "bg-muted")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(editor.isActive('bulletList') && "bg-muted")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(editor.isActive('orderedList') && "bg-muted")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent 
        editor={editor} 
        className="min-h-[150px] rounded-md border bg-background p-4"
      />
    </div>
  );
}
