<script setup lang="ts">
import Cropper from 'cropperjs';
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useImageEditStore, type CropRect } from '@/entities/image-edit';

const store = useImageEditStore();
const imageElement = ref<HTMLImageElement | null>(null);
let cropper: Cropper | null = null;

const toCropRect = (data: Cropper.Data): CropRect => ({
  x: Math.max(0, data.x),
  y: Math.max(0, data.y),
  width: Math.max(1, data.width),
  height: Math.max(1, data.height),
});

const syncCrop = () => {
  if (!cropper) {
    return;
  }

  store.setCrop(toCropRect(cropper.getData(true)));
};

const destroyCropper = () => {
  cropper?.destroy();
  cropper = null;
};

const createCropper = async () => {
  destroyCropper();
  await nextTick();

  if (!imageElement.value || !store.source) {
    return;
  }

  cropper = new Cropper(imageElement.value, {
    viewMode: 1,
    autoCropArea: 1,
    background: false,
    responsive: true,
    movable: true,
    zoomable: true,
    rotatable: false,
    scalable: false,
    crop: syncCrop,
    ready: syncCrop,
  });
};

watch(
  () => store.source?.objectUrl,
  () => {
    void createCropper();
  },
  { immediate: true },
);

watch(
  () => store.crop,
  (crop) => {
    if (!cropper || !crop) {
      return;
    }

    const current = cropper.getData(true);
    const hasSameCrop =
      current.x === Math.round(crop.x) &&
      current.y === Math.round(crop.y) &&
      current.width === Math.round(crop.width) &&
      current.height === Math.round(crop.height);

    if (!hasSameCrop) {
      cropper.setData(crop);
    }
  },
);

onBeforeUnmount(destroyCropper);
</script>

<template>
  <v-card class="tool-card" rounded="xl" elevation="0">
    <v-card-title class="card-title">
      <v-icon icon="mdi-crop" />
      Crop
    </v-card-title>
    <v-card-text>
      <div v-if="store.source" class="crop-frame">
        <img ref="imageElement" :src="store.source.objectUrl" :alt="store.source.name" />
      </div>
      <div v-else class="empty-state">Upload an image to start cropping.</div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.tool-card {
  border: 1px solid var(--line);
  background: rgba(255, 250, 241, 0.9);
}

.card-title {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  color: var(--ink);
  font-weight: 900;
}

.crop-frame {
  min-height: 360px;
  max-height: 62vh;
  overflow: hidden;
  border-radius: 22px;
  background:
    linear-gradient(45deg, rgba(21, 95, 91, 0.07) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(21, 95, 91, 0.07) 25%, transparent 25%),
    #efe3d1;
  background-size: 22px 22px;
}

.crop-frame img {
  display: block;
  max-width: 100%;
}

.empty-state {
  display: grid;
  min-height: 260px;
  place-items: center;
  border: 1px dashed rgba(29, 36, 36, 0.18);
  border-radius: 22px;
  color: rgba(29, 36, 36, 0.56);
}

:deep(.cropper-view-box),
:deep(.cropper-face) {
  border-radius: 12px;
}
</style>
