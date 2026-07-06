import { ref } from 'vue';
import { useImageEditStore } from '@/entities/image-edit';

export const useImageUpload = () => {
  const store = useImageEditStore();
  const file = ref<File | null>(null);
  const errorMessage = ref('');
  const isLoading = ref(false);

  const handleFileChange = async (nextFile: File | File[] | null) => {
    const selectedFile = Array.isArray(nextFile) ? nextFile[0] : nextFile;
    errorMessage.value = '';

    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      errorMessage.value = 'Please choose an image file.';
      file.value = null;
      return;
    }

    isLoading.value = true;

    try {
      await store.loadImage(selectedFile);
    } catch {
      errorMessage.value = 'The image could not be loaded.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    file,
    errorMessage,
    isLoading,
    handleFileChange,
  };
};
