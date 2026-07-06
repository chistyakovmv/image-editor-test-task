<script setup lang="ts">
import { useOperationsPreview } from './model/useOperationsPreview';

const { jsonPreview } = useOperationsPreview();
</script>

<template>
  <v-card class="ops-card" rounded="xl" elevation="0">
    <v-card-title class="card-title">
      <v-icon icon="mdi-vector-polyline" />
      Operation model
    </v-card-title>
    <v-card-text>
      <pre>{{ jsonPreview }}</pre>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.ops-card {
  border: 1px solid var(--line);
  background: rgba(29, 36, 36, 0.92);
  color: #fffaf1;
}

.card-title {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  font-weight: 900;
}

pre {
  max-height: 280px;
  margin: 0;
  overflow: auto;
  border-radius: 18px;
  color: #f7e7c8;
  font-size: 0.8rem;
  line-height: 1.55;
  white-space: pre-wrap;
}
</style>
