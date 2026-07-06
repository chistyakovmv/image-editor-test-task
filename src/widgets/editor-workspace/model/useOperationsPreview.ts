import { computed } from 'vue';
import { useImageEditStore } from '@/entities/image-edit';

const EMPTY_OPERATIONS_PREVIEW = '{\n  "operations": []\n}';

export const useOperationsPreview = () => {
  const store = useImageEditStore();

  const jsonPreview = computed(() => {
    if (!store.operationsDocument) {
      return EMPTY_OPERATIONS_PREVIEW;
    }

    return JSON.stringify(store.operationsDocument, null, 2);
  });

  return {
    jsonPreview,
  };
};
