
"use client";

import React from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils/cn';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onUpload?: (files: File[]) => void;
}

export function ImageUpload({ value, onChange, onUpload }: ImageUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles) => {
      if (onUpload) {
        onUpload(acceptedFiles);
      }
      const newImages = acceptedFiles.map(file => URL.createObjectURL(file));
      onChange([...value, ...newImages]);
    }
  });

  return (
    <div className="space-y-4">
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
          Drag & drop images here, or click to select files
        </p>
      </div>
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {value.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Uploaded ${index + 1}`}
              className="rounded-lg object-cover w-full aspect-square"
            />
          ))}
        </div>
      )}
    </div>
  );
}
