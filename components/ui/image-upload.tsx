
"use client";

import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  onUpload?: (files: File[]) => void;
  className?: string;
}

export function ImageUpload({ value = [], onChange, onUpload, className }: ImageUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles) => {
      if (onUpload) {
        onUpload(acceptedFiles);
      }
      if (onChange) {
        const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
        onChange([...value, ...newImages]);
      }
    }
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
          isDragActive && "border-primary bg-secondary/50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive ? "Drop images here" : "Drag & drop images here, or click to select"}
        </p>
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Upload ${index + 1}`}
              className="rounded-lg w-full h-32 object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
