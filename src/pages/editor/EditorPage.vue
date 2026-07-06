<script setup lang="ts">
import { EditorWorkspace } from '@/widgets/editor-workspace';
</script>

<template>
  <v-app>
    <v-main>
      <section class="editor-page">
        <header class="hero-panel">
          <div>
            <p class="eyebrow">Browser print prep</p>
            <h1>Non-destructive image editor</h1>
          </div>
          <p class="lead">
            Upload artwork, crop it, tune brightness, contrast and saturation in real time, then
            export both the rendered image and a replayable operation log.
          </p>
        </header>

        <EditorWorkspace />
      </section>
    </v-main>
  </v-app>
</template>

<style scoped>
.editor-page {
  min-height: 100vh;
  padding: clamp(1rem, 3vw, 2rem);
}

.hero-panel {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: end;
  margin-bottom: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 34px;
  padding: clamp(1.5rem, 5vw, 4rem);
  background:
    linear-gradient(135deg, rgba(255, 250, 241, 0.94), rgba(255, 250, 241, 0.72)),
    repeating-linear-gradient(90deg, rgba(21, 95, 91, 0.08) 0 1px, transparent 1px 44px);
  box-shadow: 0 24px 80px rgba(73, 55, 34, 0.16);
}

.hero-panel::after {
  position: absolute;
  right: -5rem;
  top: -6rem;
  width: 18rem;
  height: 18rem;
  border: 32px solid rgba(216, 111, 69, 0.28);
  border-radius: 999px;
  content: '';
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--press-orange);
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1 {
  max-width: 860px;
  margin: 0;
  color: var(--ink);
  font-size: clamp(2.45rem, 6.6vw, 6.8rem);
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 0.88;
}

.lead {
  position: relative;
  z-index: 1;
  margin: 0;
  color: rgba(29, 36, 36, 0.72);
  font-size: clamp(1rem, 2vw, 1.22rem);
  line-height: 1.65;
}

@media (max-width: 900px) {
  .hero-panel {
    grid-template-columns: 1fr;
  }
}
</style>
