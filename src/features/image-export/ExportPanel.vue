<script setup lang="ts">
import { ref } from 'vue';
import { canvasToBlob, renderImageToCanvas, useImageEditStore } from '@/entities/image-edit';
import { createExportName, downloadBlob, downloadOperationsJson } from './download';

const store = useImageEditStore();
const isExporting = ref(false);
const errorMessage = ref('');

const exportImage = async () => {
  if (!store.source || !store.effectiveCrop) {
    return;
  }

  errorMessage.value = '';
  isExporting.value = true;

  try {
    const canvas = document.createElement('canvas');
    await renderImageToCanvas(canvas, {
      source: store.source,
      crop: store.effectiveCrop,
      adjustments: store.adjustments,
      filter: store.filter,
    });
    const blob = await canvasToBlob(canvas);
    downloadBlob(blob, createExportName(store.source.name, 'png'));
  } catch {
    errorMessage.value = 'Export failed. Please try another image.';
  } finally {
    isExporting.value = false;
  }
};

const exportOperations = () => {
  if (!store.operationsDocument || !store.source) {
    return;
  }

  downloadOperationsJson(store.operationsDocument, createExportName(store.source.name, 'json'));
};
</script>

<template>
  <v-card class="export-card" rounded="xl" elevation="0">
    <v-card-title class="card-title">
      <v-icon icon="mdi-tray-arrow-down" />
      Export
    </v-card-title>

    <v-card-text class="export-stack">
      <p>
        Download the rendered PNG, or export the operation JSON to replay the same crop, adjustments and filter.
      </p>

      <v-btn
        block
        color="primary"
        prepend-icon="mdi-download"
        size="large"
        variant="flat"
        :disabled="!store.hasImage"
        :loading="isExporting"
        @click="exportImage"
      >
        Download PNG
      </v-btn>

      <v-btn
        block
        color="primary"
        prepend-icon="mdi-code-json"
        variant="outlined"
        :disabled="!store.hasImage"
        @click="exportOperations"
      >
        Download operations JSON
      </v-btn>

      <v-alert v-if="errorMessage" type="error" variant="tonal">{{ errorMessage }}</v-alert>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.export-card {
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

.export-stack {
  display: grid;
  gap: 0.9rem;
}

p {
  margin: 0;
  color: rgba(29, 36, 36, 0.68);
  line-height: 1.5;
}
</style>
