import { DEFAULT_ADJUSTMENTS } from './constants';
import { getFullImageCrop } from './crop';
import type { CropRect, FilterKind, ImageAdjustments, ImageEditOperations, SourceImage } from './types';

export type ImageEditStateSnapshot = {
  source: SourceImage;
  crop: CropRect | null;
  adjustments: ImageAdjustments;
  filter: FilterKind;
};

export const isDefaultAdjustment = (adjustments: ImageAdjustments) =>
  adjustments.brightness === DEFAULT_ADJUSTMENTS.brightness &&
  adjustments.contrast === DEFAULT_ADJUSTMENTS.contrast &&
  adjustments.saturation === DEFAULT_ADJUSTMENTS.saturation;

export const createOperationsDocument = (snapshot: ImageEditStateSnapshot): ImageEditOperations => {
  const crop = snapshot.crop ?? getFullImageCrop(snapshot.source);
  const operations: ImageEditOperations['operations'] = [
    { type: 'crop', rect: { ...crop } },
    { type: 'adjust', adjustments: { ...snapshot.adjustments } },
  ];

  if (snapshot.filter !== 'none') {
    operations.push({ type: 'filter', name: snapshot.filter });
  }

  return {
    version: 1,
    source: {
      name: snapshot.source.name,
      width: snapshot.source.width,
      height: snapshot.source.height,
    },
    operations,
  };
};
