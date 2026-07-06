export type FilterKind = 'none' | 'grayscale' | 'sepia';

export type ImageAdjustments = {
  brightness: number;
  contrast: number;
  saturation: number;
};

export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SourceImage = {
  id: string;
  name: string;
  type: string;
  objectUrl: string;
  width: number;
  height: number;
  loadedAt: string;
};

export type ImageEditOperations = {
  version: 1;
  source: {
    name: string;
    width: number;
    height: number;
  };
  operations: Array<
    | { type: 'crop'; rect: CropRect }
    | { type: 'adjust'; adjustments: ImageAdjustments }
    | { type: 'filter'; name: Exclude<FilterKind, 'none'> }
  >;
};

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export const FILTER_OPTIONS: Array<{ title: string; value: FilterKind }> = [
  { title: 'None', value: 'none' },
  { title: 'Greyscale', value: 'grayscale' },
  { title: 'Sepia', value: 'sepia' },
];
