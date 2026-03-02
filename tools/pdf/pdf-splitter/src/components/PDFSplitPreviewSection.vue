<template>
  <ToolSectionHeader>{{ labels.title }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text depth="3">{{ labels.hint }}</n-text>

      <n-spin :show="isLoadingDocument">
        <div class="preview-grid">
          <div v-for="item in items" :key="item.page" class="preview-cell">
            <button
              class="page-card"
              :class="{ 'page-card--selected': selectedPageSet.has(item.page) }"
              type="button"
              @click="emit('toggle-page', item.page, $event)"
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

            <n-button
              quaternary
              size="tiny"
              class="preview-button"
              @click="emit('open-preview', item.page)"
            >
              <template #icon>
                <n-icon :component="Eye16Regular" />
              </template>
              {{ labels.preview }}
            </n-button>
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
import { NAlert, NButton, NEmpty, NFlex, NIcon, NSpin, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import Eye16Regular from '@vicons/fluent/Eye16Regular'
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
  hint: 'Click a page to toggle selection. Hold Shift and click another page to select a range.',
  previewUnavailable: 'Preview unavailable',
  preview: 'Preview',
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
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  box-shadow: 0 0 0 1px var(--n-primary-color-hover);
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

.preview-button {
  align-self: stretch;
}
</style>
