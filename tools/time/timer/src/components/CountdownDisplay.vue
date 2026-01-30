<template>
  <ToolSection
    class="timer-display-section"
    :class="{ 'timer-display-section--fullscreen': isFullscreenActive }"
  >
    <div class="timer-display">
      <div
        class="timer-time"
        :class="{ 'timer-time--fullscreen': isFullscreenActive }"
        data-testid="timer-display"
      >
        {{ formattedRemaining }}
      </div>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { ToolSection } from '@shared/ui/tool'

defineProps<{
  formattedRemaining: string
  isFullscreenActive: boolean
}>()
</script>

<style scoped>
.timer-display-section--fullscreen {
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
}

.timer-time {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  font-family: var(--n-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.timer-time--fullscreen {
  font-size: clamp(3rem, 10vw, 6rem);
}
</style>
