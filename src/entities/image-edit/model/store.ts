import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  DEFAULT_ADJUSTMENTS,
  type CropRect,
  type FilterKind,
  type ImageAdjustments,
  type ImageEditOperations,
  type SourceImage,
} from './types';

const createSourceImage = async (file: File): Promise<SourceImage> => {
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

export const useImageEditStore = defineStore('image-edit', () => {
  const source = ref<SourceImage | null>(null);
  const crop = ref<CropRect | null>(null);
  const adjustments = ref<ImageAdjustments>({ ...DEFAULT_ADJUSTMENTS });
  const filter = ref<FilterKind>('none');
  const showOriginal = ref(false);

  const hasImage = computed(() => source.value !== null);

  const effectiveCrop = computed<CropRect | null>(() => {
    if (!source.value) {
      return null;
    }

    return crop.value ?? {
      x: 0,
      y: 0,
      width: source.value.width,
      height: source.value.height,
    };
  });

  const cssFilter = computed(() => {
    if (showOriginal.value) {
      return 'none';
    }

    const base = [
      `brightness(${adjustments.value.brightness}%)`,
      `contrast(${adjustments.value.contrast}%)`,
      `saturate(${adjustments.value.saturation}%)`,
    ];

    if (filter.value === 'grayscale') {
      base.push('grayscale(1)');
    }

    if (filter.value === 'sepia') {
      base.push('sepia(1)');
    }

    return base.join(' ');
  });

  const operationsDocument = computed<ImageEditOperations | null>(() => {
    if (!source.value) {
      return null;
    }

    const operations: ImageEditOperations['operations'] = [];

    if (effectiveCrop.value) {
      operations.push({ type: 'crop', rect: effectiveCrop.value });
    }

    operations.push({ type: 'adjust', adjustments: { ...adjustments.value } });

    if (filter.value !== 'none') {
      operations.push({ type: 'filter', name: filter.value });
    }

    return {
      version: 1,
      source: {
        name: source.value.name,
        width: source.value.width,
        height: source.value.height,
      },
      operations,
    };
  });

  const loadImage = async (file: File) => {
    const nextSource = await createSourceImage(file);

    if (source.value) {
      URL.revokeObjectURL(source.value.objectUrl);
    }

    source.value = nextSource;
    resetOperations();
  };

  const setCrop = (nextCrop: CropRect | null) => {
    crop.value = nextCrop;
  };

  const updateAdjustment = (key: keyof ImageAdjustments, value: number) => {
    adjustments.value = {
      ...adjustments.value,
      [key]: value,
    };
  };

  const setFilter = (nextFilter: FilterKind) => {
    filter.value = nextFilter;
  };

  const setShowOriginal = (value: boolean) => {
    showOriginal.value = value;
  };

  const resetOperations = () => {
    crop.value = source.value
      ? { x: 0, y: 0, width: source.value.width, height: source.value.height }
      : null;
    adjustments.value = { ...DEFAULT_ADJUSTMENTS };
    filter.value = 'none';
    showOriginal.value = false;
  };

  return {
    source,
    crop,
    adjustments,
    filter,
    showOriginal,
    hasImage,
    effectiveCrop,
    cssFilter,
    operationsDocument,
    loadImage,
    setCrop,
    updateAdjustment,
    setFilter,
    setShowOriginal,
    resetOperations,
  };
});
