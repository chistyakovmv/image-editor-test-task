import type { CropRect, SourceImage } from './types';

const roundCropValue = (value: number) => Math.max(0, Math.round(value));

export const getFullImageCrop = (source: Pick<SourceImage, 'width' | 'height'>): CropRect => ({
  x: 0,
  y: 0,
  width: source.width,
  height: source.height,
});

export const normalizeCropRect = (
  crop: CropRect,
  bounds: Pick<SourceImage, 'width' | 'height'>,
): CropRect => {
  const x = Math.min(roundCropValue(crop.x), Math.max(0, bounds.width - 1));
  const y = Math.min(roundCropValue(crop.y), Math.max(0, bounds.height - 1));
  const maxWidth = Math.max(1, bounds.width - x);
  const maxHeight = Math.max(1, bounds.height - y);

  return {
    x,
    y,
    width: Math.min(Math.max(1, roundCropValue(crop.width)), maxWidth),
    height: Math.min(Math.max(1, roundCropValue(crop.height)), maxHeight),
  };
};

export const areCropRectsEqual = (left: CropRect | null, right: CropRect | null) => {
  if (left === right) {
    return true;
  }

  if (!left || !right) {
    return false;
  }

  return (
    Math.round(left.x) === Math.round(right.x) &&
    Math.round(left.y) === Math.round(right.y) &&
    Math.round(left.width) === Math.round(right.width) &&
    Math.round(left.height) === Math.round(right.height)
  );
};
