<template>
  <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text depth="3">{{ labels.hint }}</n-text>

      <n-spin :show="isLoadingDocument">
        <div class="preview-grid">
          <div v-for="item in items" :key="item.page" class="preview-cell">
            <n-checkbox
              class="page-select-toggle"
              size="large"
              :checked="selectedPageSet.has(item.page)"
              :aria-label="labels.selectPage(item.page)"
              @click.stop="emit('toggle-page', item.page, $event)"
            />

            <button
              class="page-card"
              :class="{ 'page-card--selected': selectedPageSet.has(item.page) }"
              type="button"
              @click="emit('open-preview', item.page)"
            >
              <div class="page-card__thumbnail">
                <n-spin v-if="item.isLoading" size="small" />
                <n-empty
                  v-else-if="item.hasError"
                  size="small"
                  :description="labels.previewUnavailable"
                />
                <img
                  v-else-if="item.thumbnailUrl"
                  :src="item.thumbnailUrl"
                  :alt="labels.thumbnailAlt(item.page)"
                />
              </div>
              <span class="page-card__badge">{{ item.page }}</span>
            </button>
          </div>
        </div>
      </n-spin>

      <n-alert v-if="isRenderingThumbnails" type="info" :bordered="false">
        {{ labels.rendering }}
      </n-alert>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NCheckbox, NEmpty, NFlex, NSpin, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PreviewItem } from './usePdfSplitter'

defineProps<{
  items: PreviewItem[]
  selectedPageSet: Set<number>
  isLoadingDocument: boolean
  isRenderingThumbnails: boolean
}>()

const emit = defineEmits<{
  (event: 'toggle-page', page: number, mouseEvent: MouseEvent): void
  (event: 'open-preview', page: number): void
}>()

const labels = {
  title: 'Page Preview',
  hint: 'Click a page to preview. Use the circle at top-right to select pages. Hold Shift for range.',
  previewUnavailable: 'Preview unavailable',
  selectPage: (page: number) => `Select page ${page}`,
  rendering: 'Rendering page previews in the background...',
  thumbnailAlt: (page: number) => `Page ${page}`,
}
</script>

<style scoped>
.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 10px;
}

.preview-cell {
  position: relative;
}

.page-card {
  position: relative;
  width: 100%;
  border: 1px solid color-mix(in srgb, var(--n-border-color) 74%, #d7dbe1 26%);
  border-radius: 10px;
  background: #fff;
  padding: 6px;
  cursor: pointer;
  text-align: left;
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 75%, transparent) inset,
    0 4px 10px color-mix(in srgb, #111827 12%, transparent);
}

.page-card--selected {
  border-color: var(--n-primary-color);
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 75%, transparent) inset,
    0 0 0 1px var(--n-primary-color),
    0 10px 24px color-mix(in srgb, var(--n-primary-color) 28%, transparent);
}

.page-select-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.page-select-toggle :deep(.n-checkbox__label) {
  display: none;
}

.page-select-toggle :deep(.n-checkbox-box-wrapper) {
  margin-right: 0;
}

.page-card__badge {
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--n-text-color-2);
  border: 1px solid color-mix(in srgb, var(--n-border-color) 74%, #a7adb6 26%);
  background: color-mix(in srgb, var(--n-color-target) 72%, #a7adb6 28%);
  backdrop-filter: blur(8px);
}

.page-card__thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--n-border-color) 75%, #e5e7eb 25%);
  background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
}

.page-card__thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}
</style>
