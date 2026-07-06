import { buildCanvasFilter } from '../model/filters';
import type { CropRect, FilterKind, ImageAdjustments, SourceImage } from '../model/types';

export type RenderImageParams = {
  source: SourceImage;
  crop: CropRect;
  adjustments: ImageAdjustments;
  filter: FilterKind;
  ignoreEdits?: boolean;
};

const loadHtmlImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image for rendering.'));
    image.src = url;
  });

export const renderImageToCanvas = async (canvas: HTMLCanvasElement, params: RenderImageParams) => {
  const image = await loadHtmlImage(params.source.objectUrl);
  const crop = params.ignoreEdits
    ? { x: 0, y: 0, width: params.source.width, height: params.source.height }
    : params.crop;

  canvas.width = Math.max(1, Math.round(crop.width));
  canvas.height = Math.max(1, Math.round(crop.height));

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas 2D context is not available.');
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingQuality = 'high';
  context.filter = params.ignoreEdits ? 'none' : buildCanvasFilter(params.adjustments, params.filter);
  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
};

export const canvasToBlob = (canvas: HTMLCanvasElement, type = 'image/png', quality = 0.95): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to export image.'));
        return;
      }

      resolve(blob);
    }, type, quality);
  });
