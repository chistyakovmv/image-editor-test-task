export const createExportName = (sourceName: string, extension: string) => {
  const baseName = sourceName.replace(/\.[^/.]+$/, '') || 'edited-image';
  return `${baseName}-edited.${extension}`;
};
