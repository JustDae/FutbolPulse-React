import React, { useRef, useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { UploadCloud } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected?: (file: File) => void;
  currentImageUrl?: string;
}

export function ImageUploader({ onImageSelected, currentImageUrl }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      onImageSelected?.(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg bg-muted/50">
      {preview ? (
        <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
      ) : (
        <div className="w-32 h-32 flex items-center justify-center bg-muted rounded-md">
          <UploadCloud className="w-8 h-8 text-muted-foreground" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
        Seleccionar Imagen
      </Button>
    </div>
  );
}
