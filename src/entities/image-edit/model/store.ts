import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { createSourceImageFromFile } from '../lib/create-source-image';
import { DEFAULT_ADJUSTMENTS } from './constants';
import { getFullImageCrop, normalizeCropRect } from './crop';
import { createOperationsDocument } from './operations';
import type {
  CropRect,
  FilterKind,
  ImageAdjustments,
  ImageEditOperations,
  SourceImage,
} from './types';

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

    return crop.value ?? getFullImageCrop(source.value);
  });

  const operationsDocument = computed<ImageEditOperations | null>(() => {
    if (!source.value) {
      return null;
    }

    return createOperationsDocument({
      source: source.value,
      crop: crop.value,
      adjustments: adjustments.value,
      filter: filter.value,
    });
  });

  const setSource = (nextSource: SourceImage) => {
    if (source.value) {
      URL.revokeObjectURL(source.value.objectUrl);
    }

    source.value = nextSource;
    resetOperations();
  };

  const loadImage = async (file: File) => {
    setSource(await createSourceImageFromFile(file));
  };

  const setCrop = (nextCrop: CropRect | null) => {
    crop.value = nextCrop && source.value ? normalizeCropRect(nextCrop, source.value) : nextCrop;
  };

  const resetCrop = () => {
    crop.value = source.value ? getFullImageCrop(source.value) : null;
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
    resetCrop();
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
    operationsDocument,
    setSource,
    loadImage,
    setCrop,
    resetCrop,
    updateAdjustment,
    setFilter,
    setShowOriginal,
    resetOperations,
  };
});
