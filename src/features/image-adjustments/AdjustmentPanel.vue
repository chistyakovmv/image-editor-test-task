<script setup lang="ts">
import { FILTER_OPTIONS, useImageEditStore, type ImageAdjustments, type FilterKind } from '@/entities/image-edit';

const store = useImageEditStore();

const sliders: Array<{ key: keyof ImageAdjustments; label: string; min: number; max: number; icon: string }> = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, icon: 'mdi-white-balance-sunny' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, icon: 'mdi-contrast-circle' },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200, icon: 'mdi-palette' },
];

const updateFilter = (value: FilterKind | null) => {
  store.setFilter(value ?? 'none');
};
</script>

<template>
  <v-card class="panel-card" rounded="xl" elevation="0">
    <v-card-title class="card-title">
      <v-icon icon="mdi-tune-variant" />
      Adjustments
    </v-card-title>

    <v-card-text class="adjustments-stack">
      <div v-for="slider in sliders" :key="slider.key" class="slider-row">
        <div class="slider-label">
          <span><v-icon :icon="slider.icon" size="18" /> {{ slider.label }}</span>
          <strong>{{ store.adjustments[slider.key] }}%</strong>
        </div>
        <v-slider
          :model-value="store.adjustments[slider.key]"
          color="primary"
          density="comfortable"
          hide-details
          :max="slider.max"
          :min="slider.min"
          :step="1"
          :disabled="!store.hasImage"
          @update:model-value="store.updateAdjustment(slider.key, Number($event))"
        />
      </div>

      <v-select
        :model-value="store.filter"
        :items="FILTER_OPTIONS"
        color="primary"
        density="comfortable"
        hide-details
        item-title="title"
        item-value="value"
        label="Bonus filter"
        prepend-inner-icon="mdi-auto-fix"
        variant="outlined"
        :disabled="!store.hasImage"
        @update:model-value="updateFilter"
      />

      <div class="actions">
        <v-btn
          block
          color="secondary"
          prepend-icon="mdi-restore"
          variant="flat"
          :disabled="!store.hasImage"
          @click="store.resetOperations"
        >
          Reset edits
        </v-btn>

        <v-btn-toggle
          :model-value="store.showOriginal"
          class="compare-toggle"
          color="primary"
          divided
          mandatory
          rounded="lg"
          variant="outlined"
          @update:model-value="store.setShowOriginal(Boolean($event))"
        >
          <v-btn :value="false" :disabled="!store.hasImage">Edited</v-btn>
          <v-btn :value="true" :disabled="!store.hasImage">Original</v-btn>
        </v-btn-toggle>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.panel-card {
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

.adjustments-stack {
  display: grid;
  gap: 1.25rem;
}

.slider-row {
  display: grid;
  gap: 0.35rem;
}

.slider-label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: rgba(29, 36, 36, 0.76);
  font-size: 0.92rem;
}

.slider-label span {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
}

.slider-label strong {
  color: var(--ink);
}

.actions {
  display: grid;
  gap: 0.75rem;
}

.compare-toggle {
  width: 100%;
}

.compare-toggle :deep(.v-btn) {
  flex: 1;
}
</style>
