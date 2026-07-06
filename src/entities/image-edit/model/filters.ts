import type { FilterKind, ImageAdjustments } from './types';

export const buildCanvasFilter = (adjustments: ImageAdjustments, filter: FilterKind) => {
  const filters = [
    `brightness(${adjustments.brightness}%)`,
    `contrast(${adjustments.contrast}%)`,
    `saturate(${adjustments.saturation}%)`,
  ];

  if (filter === 'grayscale') {
    filters.push('grayscale(1)');
  }

  if (filter === 'sepia') {
    filters.push('sepia(1)');
  }

  return filters.join(' ');
};
