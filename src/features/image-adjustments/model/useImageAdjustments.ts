import { computed } from 'vue';
import {
  FILTER_OPTIONS,
  useImageEditStore,
  type FilterKind,
  type ImageAdjustments,
} from '@/entities/image-edit';

export const adjustmentSliders: Array<{
  key: keyof ImageAdjustments;
  label: string;
  min: number;
  max: number;
  icon: string;
}> = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, icon: 'mdi-white-balance-sunny' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, icon: 'mdi-contrast-circle' },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200, icon: 'mdi-palette' },
];

export const useImageAdjustments = (isCropMode = computed(() => false)) => {
  const store = useImageEditStore();
  const areGlobalActionsDisabled = computed(() => !store.hasImage || isCropMode.value);

  const updateAdjustment = (key: keyof ImageAdjustments, value: number) => {
    store.updateAdjustment(key, value);
  };

  const updateFilter = (value: FilterKind | null) => {
    store.setFilter(value ?? 'none');
  };

  const updateShowOriginal = (value: boolean) => {
    store.setShowOriginal(value);
  };

  return {
    adjustments: store.adjustments,
    areGlobalActionsDisabled,
    filter: computed(() => store.filter),
    filterOptions: FILTER_OPTIONS,
    hasImage: computed(() => store.hasImage),
    showOriginal: computed(() => store.showOriginal),
    sliders: adjustmentSliders,
    resetOperations: store.resetOperations,
    updateAdjustment,
    updateFilter,
    updateShowOriginal,
  };
};
