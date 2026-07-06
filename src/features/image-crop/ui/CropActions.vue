<script setup lang="ts">
import { computed } from 'vue';
import type { useCropSession } from '../model/useCropSession';

type CropSession = ReturnType<typeof useCropSession>;

const props = defineProps<{
  session: CropSession;
}>();

const canUseCrop = computed(() => props.session.canUseCrop.value);
const hasDraftChanges = computed(() => props.session.hasDraftChanges.value);
const isCropMode = computed(() => props.session.isCropMode.value);
</script>

<template>
  <v-card class="crop-actions" rounded="xl" elevation="0">
    <v-card-title class="card-title">
      <v-icon icon="mdi-crop" />
      Crop
    </v-card-title>

    <v-card-text class="actions-stack">
      <p>
        Crop is edited as a draft. Resize or layout changes cannot change the saved operation until
        you apply it.
      </p>

      <template v-if="!isCropMode">
        <v-btn
          block
          color="primary"
          prepend-icon="mdi-crop-free"
          variant="flat"
          :disabled="!canUseCrop"
          @click="session.startCrop"
        >
          Edit crop
        </v-btn>
        <v-btn
          block
          color="primary"
          prepend-icon="mdi-image-size-select-large"
          variant="outlined"
          :disabled="!canUseCrop"
          @click="session.resetCrop"
        >
          Reset crop to full image
        </v-btn>
      </template>

      <template v-else>
        <v-alert density="compact" type="info" variant="tonal">
          Crop mode is active. Apply to save this operation or cancel to keep the current result.
        </v-alert>
        <div class="crop-mode-actions">
          <v-btn
            color="primary"
            prepend-icon="mdi-check"
            variant="flat"
            :disabled="!hasDraftChanges"
            @click="session.applyCrop"
          >
            Apply
          </v-btn>
          <v-btn
            color="secondary"
            prepend-icon="mdi-close"
            variant="outlined"
            @click="session.cancelCrop"
          >
            Cancel
          </v-btn>
        </div>
        <v-btn
          block
          color="primary"
          prepend-icon="mdi-image-size-select-large"
          variant="text"
          @click="session.resetCrop"
        >
          Draft full image
        </v-btn>
      </template>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.crop-actions {
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

.actions-stack {
  display: grid;
  gap: 0.85rem;
}

.crop-mode-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

p {
  margin: 0;
  color: rgba(29, 36, 36, 0.68);
  line-height: 1.5;
}
</style>
