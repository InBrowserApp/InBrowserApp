<template>
  <ToolSectionHeader>{{ t('queueTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between">
        <n-text depth="3">{{
          t('queueSummary', { count: items.length, size: totalSizeLabel })
        }}</n-text>
        <n-button quaternary size="small" :disabled="items.length === 0" @click="emit('clear')">
          {{ t('clearAll') }}
        </n-button>
      </n-flex>

      <n-empty v-if="items.length === 0" size="small" :description="t('emptyState')" />

      <Sortable
        v-else
        class="queue-list"
        :list="sortableItems"
        item-key="id"
        tag="div"
        :options="sortableOptions"
        @end="handleSortEnd"
      >
        <template #item="{ element, index }">
          <div
            :key="element.id"
            class="queue-item"
            :class="{ 'queue-item--selected': element.id === selectedItemId }"
            @click="emit('select', element.id)"
          >
            <div class="queue-item__left">
              <div
                class="queue-item__handle"
                :aria-label="t('dragHandle')"
                style="display: flex; align-items: center; cursor: grab; touch-action: none"
              >
                <n-icon :depth="3" size="20">
                  <ReOrderDotsHorizontal24Regular />
                </n-icon>
              </div>

              <img
                :src="element.previewUrl"
                :alt="element.name"
                style="
                  width: 56px;
                  height: 56px;
                  border-radius: 8px;
                  object-fit: cover;
                  background: var(--n-color-embedded);
                "
              />

              <div style="display: flex; min-width: 0; flex-direction: column">
                <n-text strong>{{ index + 1 }}. {{ element.name }}</n-text>
                <n-text depth="3">{{ formatImageMeta(element) }}</n-text>
              </div>
            </div>

            <n-flex :size="4">
              <n-button
                quaternary
                circle
                size="small"
                :aria-label="t('rotate')"
                @click.stop="emit('rotate', element.id)"
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
                :aria-label="t('moveUp')"
                @click.stop="emit('move-up', index)"
              >
                <template #icon>
                  <n-icon :component="ArrowUp16Regular" />
                </template>
              </n-button>
              <n-button
                quaternary
                circle
                size="small"
                :disabled="index === items.length - 1"
                :aria-label="t('moveDown')"
                @click.stop="emit('move-down', index)"
              >
                <template #icon>
                  <n-icon :component="ArrowDown16Regular" />
                </template>
              </n-button>
              <n-button
                quaternary
                circle
                size="small"
                :aria-label="t('remove')"
                @click.stop="emit('remove', element.id)"
              >
                <template #icon>
                  <n-icon :component="Delete16Regular" />
                </template>
              </n-button>
            </n-flex>
          </div>
        </template>
      </Sortable>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { filesize } from 'filesize'
import { NButton, NEmpty, NFlex, NIcon, NText } from 'naive-ui'
import { Sortable } from 'sortablejs-vue3'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'
import ArrowDown16Regular from '@vicons/fluent/ArrowDown16Regular'
import ArrowUp16Regular from '@vicons/fluent/ArrowUp16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import ReOrderDotsHorizontal24Regular from '@vicons/fluent/ReOrderDotsHorizontal24Regular'
import type { ImageQueueItem } from '../types'

const props = defineProps<{
  items: ImageQueueItem[]
  selectedItemId: string | null
}>()

const emit = defineEmits<{
  (event: 'clear'): void
  (event: 'select', id: string): void
  (event: 'rotate', id: string): void
  (event: 'move-up', index: number): void
  (event: 'move-down', index: number): void
  (event: 'reorder', payload: { oldIndex: number | null; newIndex: number | null }): void
  (event: 'remove', id: string): void
}>()

const { t } = useI18n({ useScope: 'local' })

const totalSizeLabel = computed(() =>
  filesize(props.items.reduce((sum, item) => sum + item.size, 0)),
)
const sortableItems = computed(() => [...props.items])

const sortableOptions = {
  animation: 180,
  handle: '.queue-item__handle',
  ghostClass: 'queue-item--ghost',
  chosenClass: 'queue-item--chosen',
  dragClass: 'queue-item--dragging',
}

function handleSortEnd(event: { oldIndex?: number; newIndex?: number }) {
  emit('reorder', {
    oldIndex: event.oldIndex ?? null,
    newIndex: event.newIndex ?? null,
  })
}

function formatImageMeta(item: ImageQueueItem) {
  return `${item.width} × ${item.height} · ${filesize(item.size)}`
}
</script>

<style scoped>
.queue-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

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

.queue-item--selected {
  border-color: var(--n-primary-color);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--n-primary-color) 45%, transparent);
}

.queue-item--ghost {
  opacity: 0.35;
}

.queue-item--chosen {
  border-color: var(--n-primary-color);
}

.queue-item--dragging {
  opacity: 0.75;
}

.queue-item__left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}
</style>

<i18n lang="json">
{
  "en": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "zh": {
    "queueTitle": "图片队列",
    "queueSummary": "{count} 张图片 · {size}",
    "clearAll": "清空",
    "emptyState": "添加图片后即可调整 PDF 页顺序",
    "dragHandle": "拖拽排序",
    "rotate": "旋转 90 度",
    "moveUp": "上移",
    "moveDown": "下移",
    "remove": "删除"
  },
  "zh-CN": {
    "queueTitle": "图片队列",
    "queueSummary": "{count} 张图片 · {size}",
    "clearAll": "清空",
    "emptyState": "添加图片后即可调整 PDF 页顺序",
    "dragHandle": "拖拽排序",
    "rotate": "旋转 90 度",
    "moveUp": "上移",
    "moveDown": "下移",
    "remove": "删除"
  },
  "zh-TW": {
    "queueTitle": "圖片佇列",
    "queueSummary": "{count} 張圖片 · {size}",
    "clearAll": "清空",
    "emptyState": "新增圖片後即可調整 PDF 頁面順序",
    "dragHandle": "拖曳排序",
    "rotate": "旋轉 90 度",
    "moveUp": "上移",
    "moveDown": "下移",
    "remove": "刪除"
  },
  "zh-HK": {
    "queueTitle": "圖片佇列",
    "queueSummary": "{count} 張圖片 · {size}",
    "clearAll": "清空",
    "emptyState": "新增圖片後即可調整 PDF 頁面順序",
    "dragHandle": "拖曳排序",
    "rotate": "旋轉 90 度",
    "moveUp": "上移",
    "moveDown": "下移",
    "remove": "刪除"
  },
  "es": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "fr": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "de": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "it": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "ja": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "ko": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "ru": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "pt": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "ar": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "hi": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "tr": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "nl": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "sv": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "pl": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "vi": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "th": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "id": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "he": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "ms": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  },
  "no": {
    "queueTitle": "Image queue",
    "queueSummary": "{count} images · {size}",
    "clearAll": "Clear all",
    "emptyState": "Add images to arrange your PDF pages",
    "dragHandle": "Drag to reorder",
    "rotate": "Rotate 90 degrees",
    "moveUp": "Move up",
    "moveDown": "Move down",
    "remove": "Remove"
  }
}
</i18n>
