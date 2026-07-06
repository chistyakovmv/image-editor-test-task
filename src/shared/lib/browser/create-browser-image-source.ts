export type BrowserImageSource = {
  objectUrl: string;
  width: number;
  height: number;
};

export const createBrowserImageSource = async (file: File): Promise<BrowserImageSource> => {
  const objectUrl = URL.createObjectURL(file);

  try {
    const bitmap = await createImageBitmap(file);

    return {
      objectUrl,
      width: bitmap.width,
      height: bitmap.height,
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
};
