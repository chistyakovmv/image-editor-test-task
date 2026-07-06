import type { ImageAdjustments } from './types';

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export const FILTER_OPTIONS = [
  { title: 'None', value: 'none' },
  { title: 'Greyscale', value: 'grayscale' },
  { title: 'Sepia', value: 'sepia' },
] as const;
