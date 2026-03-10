<template>
  <div class="queue-item">
    <div class="queue-item__left">
      <div
        class="queue-item__handle"
        :aria-label="dragHandleLabel"
        style="display: flex; align-items: center; cursor: grab; touch-action: none"
      >
        <n-icon :depth="3" size="20">
          <ReOrderDotsHorizontal24Regular />
        </n-icon>
      </div>

      <img
        :src="item.previewUrl"
        :alt="item.name"
        style="
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
          background: var(--n-color-embedded);
        "
      />

      <div class="queue-item__content">
        <n-text strong class="queue-item__name" :title="item.name">
          {{ index + 1 }}. {{ item.name }}
        </n-text>
        <n-text depth="3" class="queue-item__meta">{{ imageMeta }}</n-text>
      </div>
    </div>

    <div class="queue-item__actions">
      <n-button
        quaternary
        circle
        size="small"
        :aria-label="rotateLabel"
        @click.stop="emit('rotate')"
      >
        <template #icon>
          <n-icon :component="ArrowCounterclockwise16Regular" />
        </template>
      </n-button>
      <n-button
        quaternary
        circle
        size="small"
        :disabled="index === 0"
        :aria-label="moveUpLabel"
        @click.stop="emit('move-up')"
      >
        <template #icon>
          <n-icon :component="ArrowUp16Regular" />
        </template>
      </n-button>
      <n-button
        quaternary
        circle
        size="small"
        :disabled="isLast"
        :aria-label="moveDownLabel"
        @click.stop="emit('move-down')"
      >
        <template #icon>
          <n-icon :component="ArrowDown16Regular" />
        </template>
      </n-button>
      <n-button
        quaternary
        circle
        size="small"
        :aria-label="removeLabel"
        @click.stop="emit('remove')"
      >
        <template #icon>
          <n-icon :component="Delete16Regular" />
        </template>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize } from 'filesize'
import { NButton, NIcon, NText } from 'naive-ui'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'
import ArrowDown16Regular from '@vicons/fluent/ArrowDown16Regular'
import ArrowUp16Regular from '@vicons/fluent/ArrowUp16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import ReOrderDotsHorizontal24Regular from '@vicons/fluent/ReOrderDotsHorizontal24Regular'
import type { ImageQueueItem } from '../types'

const props = defineProps<{
  item: ImageQueueItem
  index: number
  isLast: boolean
  rotateLabel: string
  moveUpLabel: string
  moveDownLabel: string
  removeLabel: string
  dragHandleLabel: string
}>()

const emit = defineEmits<{
  (event: 'rotate'): void
  (event: 'move-up'): void
  (event: 'move-down'): void
  (event: 'remove'): void
}>()

const imageMeta = computed(
  () => `${props.item.width} × ${props.item.height} · ${filesize(props.item.size)}`,
)
</script>

<style scoped>
.queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid var(--n-border-color);
  background: var(--n-card-color);
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}

.queue-item__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.queue-item__content {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.queue-item__name,
.queue-item__meta {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.queue-item__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 4px;
}

@media (max-width: 640px) {
  .queue-item {
    align-items: flex-start;
  }
}
</style>
