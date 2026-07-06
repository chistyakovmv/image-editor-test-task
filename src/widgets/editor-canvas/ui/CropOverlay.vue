<script setup lang="ts">
import { computed, toRef } from 'vue';
import {
  buildCanvasFilter,
  useImageEditStore,
  type CropRect,
  type SourceImage,
} from '@/entities/image-edit';
import { useCropperOverlay } from '../model/useCropperOverlay';

type CropSession = {
  isCropMode: { value: boolean };
  draftCrop: { value: CropRect | null };
  updateDraftCrop: (crop: CropRect) => void;
};

const props = defineProps<{
  source: SourceImage | null;
  session: CropSession;
}>();

const store = useImageEditStore();
const previewFilter = computed(() => buildCanvasFilter(store.adjustments, store.filter));
const { imageElement } = useCropperOverlay({
  source: toRef(props, 'source'),
  session: props.session,
});
</script>

<template>
  <div class="crop-layer">
    <img
      v-if="source"
      ref="imageElement"
      :src="source.objectUrl"
      :alt="source.name"
      :style="{ filter: previewFilter }"
    />
  </div>
</template>

<style scoped>
.crop-layer {
  width: min(100%, 980px);
  max-height: min(72vh, 760px);
  overflow: hidden;
  border-radius: 20px;
}

.crop-layer img {
  display: block;
  max-width: 100%;
}

:deep(.cropper-container) {
  border-radius: 20px;
}

:deep(.cropper-view-box),
:deep(.cropper-face) {
  border-radius: 12px;
}
</style>
