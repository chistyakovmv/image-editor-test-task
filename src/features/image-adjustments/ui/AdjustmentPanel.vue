<script setup lang="ts">
import { computed } from 'vue';
import { useImageAdjustments } from '../model/useImageAdjustments';

const props = withDefaults(
  defineProps<{
    isCropMode?: boolean;
  }>(),
  {
    isCropMode: false,
  },
);

const {
  adjustments,
  areGlobalActionsDisabled,
  filter,
  filterOptions,
  hasImage,
  resetOperations,
  showOriginal,
  sliders,
  updateAdjustment,
  updateFilter,
  updateShowOriginal,
} = useImageAdjustments(computed(() => props.isCropMode));
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
          <strong>{{ adjustments[slider.key] }}%</strong>
        </div>
        <v-slider
          :model-value="adjustments[slider.key]"
          color="primary"
          density="comfortable"
          hide-details
          :max="slider.max"
          :min="slider.min"
          :step="1"
          :disabled="!hasImage"
          @update:model-value="updateAdjustment(slider.key, Number($event))"
        />
      </div>

      <v-select
        :model-value="filter"
        :items="filterOptions"
        color="primary"
        density="comfortable"
        hide-details
        item-title="title"
        item-value="value"
        label="Bonus filter"
        prepend-inner-icon="mdi-auto-fix"
        variant="outlined"
        :disabled="!hasImage"
        @update:model-value="updateFilter"
      />

      <v-alert v-if="props.isCropMode" density="compact" type="info" variant="tonal">
        Apply or cancel crop before resetting edits or comparing with original.
      </v-alert>

      <div class="actions">
        <v-btn
          block
          color="secondary"
          prepend-icon="mdi-restore"
          variant="flat"
          :disabled="areGlobalActionsDisabled"
          @click="resetOperations"
        >
          Reset edits
        </v-btn>

        <v-btn-toggle
          :model-value="showOriginal"
          class="compare-toggle"
          color="primary"
          divided
          mandatory
          rounded="lg"
          variant="outlined"
          @update:model-value="updateShowOriginal(Boolean($event))"
        >
          <v-btn :value="false" :disabled="areGlobalActionsDisabled">Edited</v-btn>
          <v-btn :value="true" :disabled="areGlobalActionsDisabled">Original</v-btn>
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
