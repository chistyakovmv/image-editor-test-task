import { computed, ref, watch, type ComputedRef } from 'vue';
import { renderImageToCanvas, useImageEditStore, type CropRect } from '@/entities/image-edit';

export type UseCanvasPreviewParams = {
  activeCrop: ComputedRef<CropRect | null>;
  isCropMode: ComputedRef<boolean>;
};

export const useCanvasPreview = ({ activeCrop, isCropMode }: UseCanvasPreviewParams) => {
  const store = useImageEditStore();
  const canvasElement = ref<HTMLCanvasElement | null>(null);
  const renderError = ref('');
  const isRendering = ref(false);
  let renderToken = 0;

  const dimensionsLabel = computed(() => {
    if (!store.source) {
      return 'No image loaded';
    }

    const crop = activeCrop.value;
    const width = crop?.width ?? store.source.width;
    const height = crop?.height ?? store.source.height;

    return `${Math.round(width)} x ${Math.round(height)} px`;
  });

  const modeLabel = computed(() => {
    if (store.showOriginal) {
      return 'Original';
    }

    return isCropMode.value ? 'Crop draft' : 'Edited';
  });

  const renderPreview = async () => {
    if (!canvasElement.value || !store.source || !store.effectiveCrop) {
      return;
    }

    const currentToken = ++renderToken;
    isRendering.value = true;
    renderError.value = '';

    try {
      await renderImageToCanvas(canvasElement.value, {
        source: store.source,
        crop: activeCrop.value ?? store.effectiveCrop,
        adjustments: store.adjustments,
        filter: store.filter,
        ignoreEdits: store.showOriginal,
      });
    } catch {
      if (currentToken === renderToken) {
        renderError.value = 'Preview render failed.';
      }
    } finally {
      if (currentToken === renderToken) {
        isRendering.value = false;
      }
    }
  };

  watch(
    () => [
      store.source?.id,
      activeCrop.value?.x,
      activeCrop.value?.y,
      activeCrop.value?.width,
      activeCrop.value?.height,
      store.adjustments.brightness,
      store.adjustments.contrast,
      store.adjustments.saturation,
      store.filter,
      store.showOriginal,
      isCropMode.value,
    ],
    () => {
      void renderPreview();
    },
    { immediate: true },
  );

  return {
    canvasElement,
    dimensionsLabel,
    modeLabel,
    renderError,
    isRendering,
  };
};
