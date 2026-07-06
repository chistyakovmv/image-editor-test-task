import { computed, ref } from 'vue';
import { areCropRectsEqual, getFullImageCrop, normalizeCropRect, useImageEditStore, type CropRect } from '@/entities/image-edit';

export const useCropSession = () => {
  const store = useImageEditStore();
  const isCropMode = ref(false);
  const draftCrop = ref<CropRect | null>(null);

  const canUseCrop = computed(() => Boolean(store.source && store.effectiveCrop));
  const hasDraftChanges = computed(() => !areCropRectsEqual(draftCrop.value, store.effectiveCrop));

  const startCrop = () => {
    if (!store.source || !store.effectiveCrop) {
      return;
    }

    draftCrop.value = { ...store.effectiveCrop };
    isCropMode.value = true;
    store.setShowOriginal(false);
  };

  const updateDraftCrop = (crop: CropRect) => {
    if (!store.source || !isCropMode.value) {
      return;
    }

    draftCrop.value = normalizeCropRect(crop, store.source);
  };

  const applyCrop = () => {
    if (!draftCrop.value) {
      return;
    }

    store.setCrop(draftCrop.value);
    isCropMode.value = false;
    draftCrop.value = null;
  };

  const cancelCrop = () => {
    isCropMode.value = false;
    draftCrop.value = null;
  };

  const resetCrop = () => {
    if (!store.source) {
      return;
    }

    const fullCrop = getFullImageCrop(store.source);

    if (isCropMode.value) {
      draftCrop.value = fullCrop;
      return;
    }

    store.setCrop(fullCrop);
  };

  return {
    isCropMode,
    draftCrop,
    canUseCrop,
    hasDraftChanges,
    startCrop,
    updateDraftCrop,
    applyCrop,
    cancelCrop,
    resetCrop,
  };
};
