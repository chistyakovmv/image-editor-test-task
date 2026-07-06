<script setup lang="ts"></script>

<template>
  <v-app>
    <v-main>
      <section class="editor-page">
        <div class="hero-panel">
          <p class="eyebrow">Browser print prep</p>
          <h1>Non-destructive image editor</h1>
          <p class="lead">
            Upload an image, crop it, tune print-friendly adjustments, and export the result with an operation log.
          </p>
        </div>
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
  border: 1px solid var(--line);
  border-radius: 32px;
  padding: clamp(1.5rem, 5vw, 4rem);
  background: rgba(255, 250, 241, 0.82);
  box-shadow: 0 24px 80px rgba(73, 55, 34, 0.16);
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--press-orange);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

h1 {
  max-width: 760px;
  margin: 0;
  color: var(--ink);
  font-size: clamp(2.4rem, 6vw, 6rem);
  font-weight: 900;
  letter-spacing: -0.07em;
  line-height: 0.9;
}

.lead {
  max-width: 620px;
  margin: 1.5rem 0 0;
  color: rgba(29, 36, 36, 0.72);
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.65;
}
</style>
