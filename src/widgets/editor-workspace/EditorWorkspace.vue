<script setup lang="ts">
import { AdjustmentPanel } from '@/features/image-adjustments';
import { CropActions, useCropSession } from '@/features/image-crop';
import { ExportPanel } from '@/features/image-export';
import { ImageUploader } from '@/features/image-upload';
import { EditorCanvas } from '@/widgets/editor-canvas';
import OperationsPreview from './OperationsPreview.vue';

const cropSession = useCropSession();
</script>

<template>
  <div class="workspace-grid">
    <main class="main-panel">
      <EditorCanvas :crop-session="cropSession" />
    </main>

    <aside class="side-panel">
      <ImageUploader />
      <CropActions :session="cropSession" />
      <AdjustmentPanel :is-crop-mode="cropSession.isCropMode.value" />
      <ExportPanel />
      <OperationsPreview />
    </aside>
  </div>
</template>

<style scoped>
.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
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

  .main-panel {
    order: -1;
  }

  .side-panel {
    position: static;
  }
}
</style>
