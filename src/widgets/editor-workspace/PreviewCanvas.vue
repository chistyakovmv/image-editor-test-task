<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { renderImageToCanvas, useImageEditStore } from '@/entities/image-edit';

const store = useImageEditStore();
const canvasElement = ref<HTMLCanvasElement | null>(null);
const renderError = ref('');
const isRendering = ref(false);
let renderToken = 0;

const dimensionsLabel = computed(() => {
  const crop = store.showOriginal ? null : store.effectiveCrop;

  if (!store.source) {
    return 'No image loaded';
  }

  const width = crop?.width ?? store.source.width;
  const height = crop?.height ?? store.source.height;

  return `${Math.round(width)} x ${Math.round(height)} px`;
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
      crop: store.effectiveCrop,
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
    store.effectiveCrop?.x,
    store.effectiveCrop?.y,
    store.effectiveCrop?.width,
    store.effectiveCrop?.height,
    store.adjustments.brightness,
    store.adjustments.contrast,
    store.adjustments.saturation,
    store.filter,
    store.showOriginal,
  ],
  () => {
    void renderPreview();
  },
  { immediate: true },
);
</script>

<template>
  <v-card class="preview-card" rounded="xl" elevation="0">
    <v-card-title class="preview-title">
      <span><v-icon icon="mdi-monitor-screenshot" /> Live preview</span>
      <v-chip size="small" color="primary" variant="tonal">{{ dimensionsLabel }}</v-chip>
    </v-card-title>

    <v-card-text>
      <div class="preview-stage" :class="{ 'is-empty': !store.hasImage }">
        <canvas v-show="store.hasImage" ref="canvasElement" />
        <div v-if="!store.hasImage" class="empty-preview">
          <v-icon icon="mdi-image-outline" size="52" />
          <span>Preview appears after upload.</span>
        </div>
        <v-progress-circular v-if="isRendering" class="render-loader" color="primary" indeterminate size="32" />
      </div>

      <v-alert v-if="renderError" class="mt-4" type="error" variant="tonal">{{ renderError }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.preview-card {
  border: 1px solid rgba(21, 95, 91, 0.18);
  background: #142f2e;
  color: #fffaf1;
  box-shadow: 0 28px 90px rgba(20, 47, 46, 0.24);
}

.preview-title {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  font-weight: 900;
}

.preview-title span {
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
}

.preview-stage {
  position: relative;
  display: grid;
  min-height: 360px;
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 250, 241, 0.12);
  border-radius: 26px;
  background:
    linear-gradient(45deg, rgba(255, 250, 241, 0.08) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255, 250, 241, 0.08) 25%, transparent 25%),
    #0d2221;
  background-size: 28px 28px;
}

.preview-stage canvas {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: min(62vh, 680px);
  border-radius: 14px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

.empty-preview {
  display: grid;
  gap: 0.75rem;
  place-items: center;
  color: rgba(255, 250, 241, 0.66);
}

.render-loader {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}

@media (max-width: 720px) {
  .preview-stage {
    min-height: 260px;
  }
}
</style>
