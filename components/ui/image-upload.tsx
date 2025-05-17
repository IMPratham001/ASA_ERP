"use client";

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

export function ImageUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles: 1,
    onDrop: files => files[0] && onUpload(files[0])
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/10" : "border-border"
      )}
    >
      <input {...getInputProps()} />
      <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {isDragActive ? "Drop the file here" : "Drag & drop an image, or click to select"}
      </p>
    </div>
  );
}