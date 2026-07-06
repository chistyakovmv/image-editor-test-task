import type { ImageEditOperations } from '@/entities/image-edit';

export const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const downloadOperationsJson = (operations: ImageEditOperations, fileName: string) => {
  const blob = new Blob([JSON.stringify(operations, null, 2)], { type: 'application/json' });
  downloadBlob(blob, fileName);
};

export const createExportName = (sourceName: string, extension: string) => {
  const baseName = sourceName.replace(/\.[^/.]+$/, '') || 'edited-image';
  return `${baseName}-edited.${extension}`;
};
