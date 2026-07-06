<script setup lang="ts">
import { AdjustmentPanel } from '@/features/image-adjustments';
import { CropTool } from '@/features/image-crop';
import { ExportPanel } from '@/features/image-export';
import { ImageUploader } from '@/features/image-upload';
import OperationsPreview from './OperationsPreview.vue';
import PreviewCanvas from './PreviewCanvas.vue';
</script>

<template>
  <div class="workspace-grid">
    <aside class="side-panel">
      <ImageUploader />
      <AdjustmentPanel />
      <ExportPanel />
      <OperationsPreview />
    </aside>

    <main class="main-panel">
      <CropTool />
      <PreviewCanvas />
    </main>
  </div>
</template>

<style scoped>
.workspace-grid {
  display: grid;
  grid-template-columns: minmax(300px, 380px) minmax(0, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);
  align-items: start;
}

.side-panel,
.main-panel {
  display: grid;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.side-panel {
  position: sticky;
  top: 1rem;
}

@media (max-width: 1120px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .side-panel {
    position: static;
  }
}
</style>
