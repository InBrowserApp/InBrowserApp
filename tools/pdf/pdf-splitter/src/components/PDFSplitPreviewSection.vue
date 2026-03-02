<template>
  <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text depth="3">{{ labels.hint }}</n-text>

      <n-spin :show="isLoadingDocument">
        <div class="preview-grid">
          <div v-for="item in items" :key="item.page" class="preview-cell">
            <button
              class="page-select-toggle"
              type="button"
              :aria-label="labels.selectPage(item.page)"
              @click.stop="emit('toggle-page', item.page, $event)"
            >
              <span
                class="page-select-toggle__dot"
                :class="{ 'page-select-toggle__dot--selected': selectedPageSet.has(item.page) }"
              />
            </button>

            <button
              class="page-card"
              :class="{ 'page-card--selected': selectedPageSet.has(item.page) }"
              type="button"
              @click="emit('open-preview', item.page)"
            >
              <span class="page-card__badge">{{ item.page }}</span>
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
import { NAlert, NEmpty, NFlex, NSpin, NText } from 'naive-ui'
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
  width: 100%;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  background: var(--n-card-color);
  padding: 6px;
  cursor: pointer;
  text-align: left;
}

.page-card--selected {
  border-color: var(--n-primary-color);
  box-shadow:
    0 0 0 1px var(--n-primary-color-hover),
    0 8px 18px color-mix(in srgb, var(--n-primary-color) 22%, transparent);
}

.page-select-toggle {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.page-select-toggle__dot {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  border: 2px solid var(--n-border-color);
  background: color-mix(in srgb, var(--n-color-target) 88%, transparent);
}

.page-select-toggle__dot--selected {
  border-color: var(--n-primary-color);
  background: var(--n-primary-color);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--n-primary-color) 30%, transparent);
}

.page-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 22px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--n-text-color-3);
  background: var(--n-hover-color);
  margin-bottom: 6px;
}

.page-card__thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--n-color-target);
}

.page-card__thumbnail img {
  width: 100%;
  height: auto;
  display: block;
}
</style>
