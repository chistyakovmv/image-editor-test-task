import { createBrowserImageSource } from '@/shared/lib/browser/create-browser-image-source';
import type { SourceImage } from '../model/types';

export const createSourceImageFromFile = async (file: File): Promise<SourceImage> => {
  const imageSource = await createBrowserImageSource(file);

  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type || 'image/png',
    objectUrl: imageSource.objectUrl,
    width: imageSource.width,
    height: imageSource.height,
    loadedAt: new Date().toISOString(),
  };
};
