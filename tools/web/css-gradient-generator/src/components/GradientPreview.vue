<template>
  <div class="preview" :style="previewStyle" data-testid="gradient-preview">
    <div class="preview__surface" :style="surfaceStyle" />
    <div class="preview__overlay">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  backgroundImage: string
  blendMode?: string
}>()

const previewStyle = computed(() => ({
  backgroundImage: `linear-gradient(45deg, #f1f5f9 25%, transparent 25%), linear-gradient(-45deg, #f1f5f9 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f1f5f9 75%), linear-gradient(-45deg, transparent 75%, #f1f5f9 75%)`,
  backgroundSize: '24px 24px',
  backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0',
}))

const surfaceStyle = computed(() => ({
  backgroundImage: props.backgroundImage,
  backgroundBlendMode: props.blendMode || undefined,
}))
</script>

<style scoped>
.preview {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  min-height: 240px;
}

.preview__surface {
  position: absolute;
  inset: 0;
}

.preview__overlay {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 12px;
  color: #0f172a;
}
</style>
