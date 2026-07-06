<script setup lang="ts">
import { ref } from 'vue';
import { useImageEditStore } from '@/entities/image-edit';

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
</script>

<template>
  <v-card class="upload-card" rounded="xl" elevation="0">
    <v-card-text>
      <div class="upload-copy">
        <v-icon icon="mdi-cloud-upload-outline" size="36" />
        <div>
          <h2>Load artwork</h2>
          <p>Keep the source untouched. Every edit is replayed from the original file.</p>
        </div>
      </div>

      <v-file-input
        v-model="file"
        accept="image/*"
        class="mt-5"
        clearable
        density="comfortable"
        :error-messages="errorMessage"
        label="Choose image"
        prepend-icon=""
        prepend-inner-icon="mdi-image-plus"
        variant="outlined"
        :loading="isLoading"
        @update:model-value="handleFileChange"
      />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.upload-card {
  border: 1px dashed rgba(21, 95, 91, 0.28);
  background: rgba(255, 250, 241, 0.76);
}

.upload-copy {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  color: var(--press-green);
}

h2 {
  margin: 0;
  color: var(--ink);
  font-size: 1.25rem;
  font-weight: 900;
}

p {
  margin: 0.35rem 0 0;
  color: rgba(29, 36, 36, 0.68);
  line-height: 1.5;
}
</style>
