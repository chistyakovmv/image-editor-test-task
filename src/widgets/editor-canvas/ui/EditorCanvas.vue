<script setup lang="ts">
import { computed } from 'vue';
import { useImageEditStore } from '@/entities/image-edit';
import type { useCropSession } from '@/features/image-crop';
import { useCanvasPreview } from '../model/useCanvasPreview';
import CropOverlay from './CropOverlay.vue';

type CropSession = ReturnType<typeof useCropSession>;

const props = defineProps<{
  cropSession: CropSession;
}>();

const store = useImageEditStore();
const isCropMode = computed(() => props.cropSession.isCropMode.value);
const activeCrop = computed(() => {
  if (store.showOriginal) {
    return null;
  }

  return isCropMode.value ? props.cropSession.draftCrop.value : store.effectiveCrop;
});

const { canvasElement, dimensionsLabel, isRendering, modeLabel, renderError } = useCanvasPreview({
  activeCrop,
  isCropMode,
});
</script>

<template>
  <v-card class="editor-canvas" rounded="xl" elevation="0">
    <v-card-title class="canvas-title">
      <span><v-icon icon="mdi-image-edit-outline" /> Editor stage</span>
      <div class="title-chips">
        <v-chip size="small" color="secondary" variant="flat">{{ modeLabel }}</v-chip>
        <v-chip size="small" color="primary" variant="tonal">{{ dimensionsLabel }}</v-chip>
      </div>
    </v-card-title>

    <v-card-text>
      <div class="stage" :class="{ 'is-empty': !store.hasImage, 'is-cropping': isCropMode }">
        <div v-if="store.hasImage" class="artboard">
          <CropOverlay
            v-if="isCropMode && !store.showOriginal"
            :source="store.source"
            :session="cropSession"
          />
          <canvas v-show="!isCropMode || store.showOriginal" ref="canvasElement" />
        </div>

        <div v-else class="empty-stage">
          <v-icon icon="mdi-image-plus-outline" size="64" />
          <strong>Load an image to start editing</strong>
          <span
            >The original will stay untouched while operations are replayed into
            preview/export.</span
          >
        </div>

        <v-progress-circular
          v-if="isRendering"
          class="render-loader"
          color="primary"
          indeterminate
          size="32"
        />
      </div>

      <v-alert v-if="renderError" class="mt-4" type="error" variant="tonal">
        {{ renderError }}
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.editor-canvas {
  border: 1px solid rgba(21, 95, 91, 0.18);
  background: #142f2e;
  color: #fffaf1;
  box-shadow: 0 28px 90px rgba(20, 47, 46, 0.24);
}

.canvas-title {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
  font-weight: 900;
}

.canvas-title span,
.title-chips {
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
}

.stage {
  position: relative;
  display: grid;
  min-height: clamp(340px, 62vh, 760px);
  place-items: center;
  overflow: hidden;
  border: 1px solid rgba(255, 250, 241, 0.12);
  border-radius: 28px;
  background:
    linear-gradient(45deg, rgba(255, 250, 241, 0.08) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255, 250, 241, 0.08) 25%, transparent 25%),
    radial-gradient(circle at 15% 20%, rgba(244, 189, 79, 0.16), transparent 20rem), #0d2221;
  background-size:
    28px 28px,
    28px 28px,
    auto,
    auto;
}

.artboard {
  display: grid;
  width: 100%;
  min-height: inherit;
  place-items: center;
  padding: clamp(0.75rem, 2vw, 1.5rem);
}

.stage canvas {
  display: block;
  width: auto;
  max-width: 100%;
  max-height: min(72vh, 760px);
  border-radius: 18px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
}

.empty-stage {
  display: grid;
  max-width: 380px;
  gap: 0.75rem;
  place-items: center;
  color: rgba(255, 250, 241, 0.7);
  text-align: center;
}

.empty-stage strong {
  color: #fffaf1;
  font-size: 1.2rem;
}

.render-loader {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}

@media (max-width: 720px) {
  .stage {
    min-height: 320px;
  }

  .title-chips {
    width: 100%;
  }
}
</style>
