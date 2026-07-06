import type { SourceImage } from '@/entities/image-edit';

export const createSourceImageFromFile = async (file: File): Promise<SourceImage> => {
  const objectUrl = URL.createObjectURL(file);

  try {
    const bitmap = await createImageBitmap(file);

    return {
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type || 'image/png',
      objectUrl,
      width: bitmap.width,
      height: bitmap.height,
      loadedAt: new Date().toISOString(),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
};
