<template>
  <ToolSectionHeader>{{ t('queueTitle') }}</ToolSectionHeader>
  <ToolSection>
    <div class="queue">
      <div class="queue__toolbar">
        <n-text depth="3">{{
          t('queueSummary', { count: items.length, size: totalSizeLabel })
        }}</n-text>
        <n-button
          quaternary
          size="small"
          :disabled="items.length === 0 || disabled"
          @click="emit('clear')"
        >
          <template #icon>
            <n-icon :component="Delete16Regular" />
          </template>
          {{ t('clearAll') }}
        </n-button>
      </div>

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
          <ImageToPdfQueueItem
            :key="element.id"
            :item="element"
            :index="index"
            :is-last="index === items.length - 1"
            :disabled="disabled"
            :rotate-label="t('rotate')"
            :move-up-label="t('moveUp')"
            :move-down-label="t('moveDown')"
            :remove-label="t('remove')"
            :drag-handle-label="t('dragHandle')"
            @rotate="emit('rotate', element.id)"
            @move-up="emit('move-up', index)"
            @move-down="emit('move-down', index)"
            @remove="emit('remove', element.id)"
          />
        </template>
      </Sortable>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { filesize } from 'filesize'
import { NButton, NEmpty, NIcon, NText } from 'naive-ui'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { Sortable } from 'sortablejs-vue3'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageQueueItem } from '../types'
import ImageToPdfQueueItem from './ImageToPdfQueueItem.vue'

const props = defineProps<{
  items: ImageQueueItem[]
  disabled: boolean
}>()

const emit = defineEmits<{
  (event: 'clear'): void
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

const sortableOptions = computed(() => ({
  animation: 180,
  disabled: props.disabled,
  handle: '.queue-item__handle',
  ghostClass: 'queue-item--ghost',
  chosenClass: 'queue-item--chosen',
  dragClass: 'queue-item--dragging',
}))

function handleSortEnd(event: { oldIndex?: number; newIndex?: number }) {
  if (props.disabled) {
    return
  }

  emit('reorder', {
    oldIndex: event.oldIndex ?? null,
    newIndex: event.newIndex ?? null,
  })
}
</script>

<style scoped>
.queue {
  display: grid;
  gap: 12px;
}

.queue__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.queue-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
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
