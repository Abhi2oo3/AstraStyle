
import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  title: string;
  description: string;
  onImageUpload: (file: File) => void;
  imagePreviewUrl: string | null;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  title,
  description,
  onImageUpload,
  imagePreviewUrl,
  disabled
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };
  
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isEntering: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(isEntering);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const uploaderClass = `relative bg-gray-800/50 backdrop-blur-sm border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-900/50' : 'border-gray-600 hover:border-indigo-500'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`;

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2 text-gray-200">{title}</h2>
      <div
        className={uploaderClass}
        onClick={handleClick}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={id}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          disabled={disabled}
        />
        {imagePreviewUrl ? (
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="w-full h-48 object-contain rounded-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-48 space-y-2 text-gray-400">
            <UploadIcon className="w-12 h-12" />
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};
