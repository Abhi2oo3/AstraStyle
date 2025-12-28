
import type { ImageData } from '../types';

export const toBase64 = (file: File): Promise<ImageData> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      if (!header || !data) {
          reject(new Error("Invalid file format"));
          return;
      }
      const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
      resolve({ base64: data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });


export const blobToBase64 = (blob: Blob): Promise<ImageData> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result as string;
      const [header, data] = result.split(',');
      if (!header || !data) {
          reject(new Error("Invalid blob format"));
          return;
      }
      const mimeType = header.match(/:(.*?);/)?.[1] || blob.type || 'application/octet-stream';
      resolve({ base64: data, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
