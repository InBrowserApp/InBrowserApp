<template>
  <div class="track" ref="trackRef" data-testid="stops-track" @click="handleTrackClick">
    <div class="track__fill" :style="{ backgroundImage: gradientCss }" />
    <button
      v-for="stop in sortedStops"
      :key="stop.id"
      type="button"
      class="track__stop"
      :class="{ 'track__stop--active': stop.id === activeStopId }"
      :style="{ left: `${stop.position}%`, backgroundColor: stop.color }"
      :data-stop-id="stop.id"
      data-testid="stop-handle"
      @click.stop="emit('select', stop.id)"
      @pointerdown.stop.prevent="startDrag(stop.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GradientStop } from '../types'
import { clamp, sortStops } from '../utils/gradient'

const props = defineProps<{
  stops: GradientStop[]
  activeStopId: string | null
  gradientCss: string
}>()

const emit = defineEmits<{
  (event: 'select', id: string): void
  (event: 'update', id: string, position: number): void
  (event: 'add', position: number): void
}>()

const trackRef = ref<HTMLDivElement | null>(null)

const sortedStops = computed(() => sortStops(props.stops))

const getPositionFromEvent = (event: MouseEvent | PointerEvent) => {
  const rect = trackRef.value?.getBoundingClientRect()
  if (!rect) return 0
  const percent = ((event.clientX - rect.left) / rect.width) * 100
  return clamp(percent, 0, 100)
}

const handleTrackClick = (event: MouseEvent) => {
  emit('add', getPositionFromEvent(event))
}

const startDrag = (id: string) => {
  emit('select', id)

  const handleMove = (moveEvent: PointerEvent) => {
    emit('update', id, getPositionFromEvent(moveEvent))
  }

  const handleUp = () => {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleUp)
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleUp, { once: true })
}
</script>

<style scoped>
.track {
  position: relative;
  height: 32px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #0f172a;
  cursor: pointer;
}

.track__fill {
  position: absolute;
  inset: 0;
}

.track__stop {
  position: absolute;
  top: 50%;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid #ffffff;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 8px rgba(15, 23, 42, 0.25);
  cursor: grab;
}

.track__stop--active {
  border-color: #0f172a;
  box-shadow:
    0 0 0 2px #ffffff,
    0 6px 14px rgba(15, 23, 42, 0.35);
}
</style>
