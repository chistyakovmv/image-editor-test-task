<script setup lang="ts">
import Cropper from 'cropperjs';
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import {
  areCropRectsEqual,
  buildCanvasFilter,
  useImageEditStore,
  type CropRect,
  type SourceImage,
} from '@/entities/image-edit';

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
const imageElement = ref<HTMLImageElement | null>(null);
let cropper: Cropper | null = null;
let isSyncingFromState = false;

const previewFilter = computed(() => buildCanvasFilter(store.adjustments, store.filter));

const toCropRect = (data: Cropper.Data): CropRect => ({
  x: data.x,
  y: data.y,
  width: data.width,
  height: data.height,
});

const syncCropperFromDraft = () => {
  if (!cropper || !props.session.draftCrop.value) {
    return;
  }

  const current = toCropRect(cropper.getData(true));

  if (areCropRectsEqual(current, props.session.draftCrop.value)) {
    return;
  }

  isSyncingFromState = true;
  cropper.setData(props.session.draftCrop.value);
  queueMicrotask(() => {
    isSyncingFromState = false;
  });
};

const destroyCropper = () => {
  cropper?.destroy();
  cropper = null;
  isSyncingFromState = false;
};

const createCropper = async () => {
  destroyCropper();
  await nextTick();

  if (!imageElement.value || !props.source || !props.session.isCropMode.value) {
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
    crop: () => {
      if (!cropper || isSyncingFromState) {
        return;
      }

      props.session.updateDraftCrop(toCropRect(cropper.getData(true)));
    },
    ready: syncCropperFromDraft,
  });
};

watch(
  () => [props.source?.id, props.session.isCropMode.value],
  () => {
    void createCropper();
  },
  { immediate: true },
);

watch(() => props.session.draftCrop.value, syncCropperFromDraft);

onBeforeUnmount(destroyCropper);
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
