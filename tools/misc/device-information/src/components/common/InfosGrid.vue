<template>
  <div class="info-grid">
    <slot />
  </div>
</template>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 12px;
}

@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .info-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
