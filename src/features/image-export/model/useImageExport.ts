import { ref } from 'vue';
import { canvasToBlob, renderImageToCanvas, useImageEditStore } from '@/entities/image-edit';
import { downloadBlob } from '@/shared/lib/download/download-blob';
import { createExportName } from '../lib/create-export-name';

export const useImageExport = () => {
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

    const blob = new Blob([JSON.stringify(store.operationsDocument, null, 2)], { type: 'application/json' });
    downloadBlob(blob, createExportName(store.source.name, 'json'));
  };

  return {
    isExporting,
    errorMessage,
    exportImage,
    exportOperations,
  };
};
