<script setup lang="ts">
import { EditorHero } from '@/widgets/editor-hero';
import { EditorWorkspace } from '@/widgets/editor-workspace';
</script>

<template>
  <v-app>
    <v-main>
      <section class="editor-page">
        <EditorHero />
        <EditorWorkspace />
      </section>
    </v-main>
  </v-app>
</template>

<style scoped>
.editor-page {
  display: grid;
  min-height: 100vh;
  gap: clamp(1rem, 3vw, 2rem);
  padding: clamp(1rem, 3vw, 2rem);
}
</style>
