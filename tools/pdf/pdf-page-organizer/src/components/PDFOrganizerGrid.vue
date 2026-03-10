<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-text depth="3">{{ t('hint') }}</n-text>

      <n-spin :show="isLoadingDocument">
        <n-empty v-if="!pages.length" :description="t('empty')" />

        <Sortable
          v-else
          :class="['pages-grid', `pages-grid--${thumbnailSize}`]"
          :list="pages"
          item-key="id"
          tag="div"
          :options="sortableOptions"
          @end="handleSortEnd"
        >
          <template #item="{ element, index }">
            <article
              :key="element.id"
              :ref="setPageElement(element.id)"
              class="page-card"
              :data-page-id="element.id"
              :class="{
                'page-card--selected': selectedPageSet.has(element.id),
                'page-card--highlighted': highlightedPageId === element.id,
              }"
            >
              <div class="page-card__top">
                <n-checkbox
                  :checked="selectedPageSet.has(element.id)"
                  :aria-label="t('selectPage', { page: index + 1 })"
                  @click.stop="handleToggleSelection(element.id, $event)"
                />
                <button
                  class="page-card__handle"
                  type="button"
                  :aria-label="t('dragPage', { page: index + 1 })"
                >
                  <n-icon :depth="3" :component="ReOrderDotsHorizontal24Regular" />
                </button>
              </div>

              <button
                class="page-card__preview"
                type="button"
                @click="emit('open-preview', element.id)"
              >
                <div class="page-card__thumbnail">
                  <n-spin v-if="element.isLoading" size="small" />
                  <n-empty
                    v-else-if="element.hasError"
                    size="small"
                    :description="t('previewUnavailable')"
                  />
                  <img
                    v-else-if="element.thumbnailUrl"
                    :src="element.thumbnailUrl"
                    :alt="t('thumbnailAlt', { page: index + 1 })"
                    :style="{ transform: `rotate(${element.rotationOffset}deg)` }"
                  />
                </div>
              </button>

              <n-text strong>{{
                t('pageLabel', { page: index + 1, source: element.sourcePageNumber })
              }}</n-text>

              <n-flex wrap :size="[6, 6]">
                <n-button
                  quaternary
                  size="small"
                  :disabled="index === 0"
                  @click="emit('move-up', element.id)"
                >
                  {{ t('moveUp') }}
                </n-button>
                <n-button
                  quaternary
                  size="small"
                  :disabled="index === pages.length - 1"
                  @click="emit('move-down', element.id)"
                >
                  {{ t('moveDown') }}
                </n-button>
                <n-button quaternary size="small" @click="emit('rotate-left', element.id)">
                  {{ t('rotateLeft') }}
                </n-button>
                <n-button quaternary size="small" @click="emit('rotate-right', element.id)">
                  {{ t('rotateRight') }}
                </n-button>
                <n-button
                  quaternary
                  size="small"
                  type="error"
                  @click="emit('delete-page', element.id)"
                >
                  {{ t('deletePage') }}
                </n-button>
              </n-flex>
            </article>
          </template>
        </Sortable>
      </n-spin>

      <n-alert v-if="isRenderingThumbnails" type="info" :bordered="false">
        {{ t('rendering') }}
      </n-alert>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NCheckbox, NEmpty, NFlex, NIcon, NSpin, NText } from 'naive-ui'
import { Sortable } from 'sortablejs-vue3'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ReOrderDotsHorizontal24Regular from '@vicons/fluent/ReOrderDotsHorizontal24Regular'
import type { OrganizerPage, ThumbnailSize } from './pageOrganizerState'

defineProps<{
  pages: OrganizerPage[]
  selectedPageSet: Set<string>
  isLoadingDocument: boolean
  isRenderingThumbnails: boolean
  thumbnailSize: ThumbnailSize
}>()

const emit = defineEmits<{
  (event: 'reorder', oldIndex: number | null, newIndex: number | null): void
  (event: 'toggle-page', pageId: string, shiftKey: boolean): void
  (event: 'move-up', pageId: string): void
  (event: 'move-down', pageId: string): void
  (event: 'rotate-left', pageId: string): void
  (event: 'rotate-right', pageId: string): void
  (event: 'delete-page', pageId: string): void
  (event: 'open-preview', pageId: string): void
}>()

const { t } = useI18n({ useScope: 'local' })

const sortableOptions = {
  animation: 180,
  handle: '.page-card__handle',
  ghostClass: 'page-card--ghost',
  chosenClass: 'page-card--chosen',
  dragClass: 'page-card--dragging',
}

const pageElements = new Map<string, HTMLElement>()
const highlightedPageId = ref<string | null>(null)
let highlightTimeout: number | null = null

const clearHighlightTimeout = (): void => {
  if (highlightTimeout !== null) {
    window.clearTimeout(highlightTimeout)
    highlightTimeout = null
  }
}

const setPageElement =
  (pageId: string) =>
  (element: Element | null): void => {
    if (element instanceof HTMLElement) {
      pageElements.set(pageId, element)
      return
    }

    pageElements.delete(pageId)
  }

const scrollToPage = (pageId: string): boolean => {
  const element = pageElements.get(pageId)
  if (!element) {
    return false
  }

  clearHighlightTimeout()
  highlightedPageId.value = pageId
  element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  highlightTimeout = window.setTimeout(() => {
    if (highlightedPageId.value === pageId) {
      highlightedPageId.value = null
    }
    highlightTimeout = null
  }, 1200)
  return true
}

const handleSortEnd = (event: { oldIndex?: number; newIndex?: number }): void => {
  emit('reorder', event.oldIndex ?? null, event.newIndex ?? null)
}

const handleToggleSelection = (pageId: string, event: MouseEvent): void => {
  emit('toggle-page', pageId, event.shiftKey)
}

onBeforeUnmount(() => {
  clearHighlightTimeout()
  pageElements.clear()
})

defineExpose({
  scrollToPage,
})
</script>

<style scoped>
.pages-grid {
  --page-grid-min-width: 210px;
  --page-thumbnail-min-height: 200px;
  --page-thumbnail-max-height: 280px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--page-grid-min-width), 1fr));
  gap: 12px;
}

.pages-grid--compact {
  --page-grid-min-width: 180px;
  --page-thumbnail-min-height: 160px;
  --page-thumbnail-max-height: 220px;
}

.pages-grid--large {
  --page-grid-min-width: 260px;
  --page-thumbnail-min-height: 260px;
  --page-thumbnail-max-height: 360px;
}

.page-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--n-border-color) 74%, #d7dbe1 26%);
  background: linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%);
  box-shadow:
    0 1px 0 color-mix(in srgb, #fff 70%, transparent) inset,
    0 8px 18px color-mix(in srgb, #111827 8%, transparent);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.page-card--selected {
  border-color: var(--n-primary-color);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--n-primary-color) 45%, transparent),
    0 8px 20px color-mix(in srgb, var(--n-primary-color) 15%, transparent);
}

.page-card--highlighted {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--n-warning-color) 80%, #f59e0b 20%);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--n-warning-color) 52%, transparent),
    0 14px 26px color-mix(in srgb, var(--n-warning-color) 22%, transparent);
}

.page-card--ghost {
  opacity: 0.35;
}

.page-card--chosen {
  border-color: var(--n-primary-color);
}

.page-card--dragging {
  opacity: 0.75;
}

.page-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-card__handle,
.page-card__preview {
  border: 0;
  background: transparent;
  padding: 0;
}

.page-card__handle {
  cursor: grab;
  display: flex;
  align-items: center;
}

.page-card__handle:active {
  cursor: grabbing;
}

.page-card__preview {
  cursor: zoom-in;
}

.page-card__thumbnail {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--page-thumbnail-min-height);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--n-border-color) 74%, #e5e7eb 26%);
  background: linear-gradient(180deg, #ffffff 0%, #f5f6f8 100%);
}

.page-card__thumbnail img {
  max-width: 100%;
  max-height: var(--page-thumbnail-max-height);
  display: block;
  transition: transform 0.15s ease;
}
</style>

<i18n lang="json">
{"en":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"zh":{"title":"页面","hint":"拖拽页面即可重排，点击缩略图可预览，按住 Shift 选择可连续选中范围。","empty":"上传 PDF 后开始整理页面。","selectPage":"选择第 {page} 页","dragPage":"拖拽第 {page} 页","previewUnavailable":"无法预览","thumbnailAlt":"第 {page} 页","pageLabel":"第 {page} 页 · 原始页 {source}","moveUp":"上移","moveDown":"下移","rotateLeft":"向左旋转","rotateRight":"向右旋转","deletePage":"删除","rendering":"正在后台渲染页面预览..."},"zh-CN":{"title":"页面","hint":"拖拽页面即可重排，点击缩略图可预览，按住 Shift 选择可连续选中范围。","empty":"上传 PDF 后开始整理页面。","selectPage":"选择第 {page} 页","dragPage":"拖拽第 {page} 页","previewUnavailable":"无法预览","thumbnailAlt":"第 {page} 页","pageLabel":"第 {page} 页 · 原始页 {source}","moveUp":"上移","moveDown":"下移","rotateLeft":"向左旋转","rotateRight":"向右旋转","deletePage":"删除","rendering":"正在后台渲染页面预览..."},"zh-TW":{"title":"頁面","hint":"拖曳頁面即可重排，點擊縮圖可預覽，按住 Shift 選擇可連續選取範圍。","empty":"上傳 PDF 後開始整理頁面。","selectPage":"選擇第 {page} 頁","dragPage":"拖曳第 {page} 頁","previewUnavailable":"無法預覽","thumbnailAlt":"第 {page} 頁","pageLabel":"第 {page} 頁 · 原始頁 {source}","moveUp":"上移","moveDown":"下移","rotateLeft":"向左旋轉","rotateRight":"向右旋轉","deletePage":"刪除","rendering":"正在背景產生頁面預覽..."},"zh-HK":{"title":"頁面","hint":"拖曳頁面即可重排，點擊縮圖可預覽，按住 Shift 選擇可連續選取範圍。","empty":"上傳 PDF 後開始整理頁面。","selectPage":"選擇第 {page} 頁","dragPage":"拖曳第 {page} 頁","previewUnavailable":"無法預覽","thumbnailAlt":"第 {page} 頁","pageLabel":"第 {page} 頁 · 原始頁 {source}","moveUp":"上移","moveDown":"下移","rotateLeft":"向左旋轉","rotateRight":"向右旋轉","deletePage":"刪除","rendering":"正在背景產生頁面預覽..."},"es":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"fr":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"de":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"it":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"ja":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"ko":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"ru":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"pt":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"ar":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"hi":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"tr":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"nl":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"sv":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"pl":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"vi":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"th":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"id":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"he":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"ms":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."},"no":{"title":"Pages","hint":"Drag pages to reorder. Click a thumbnail to preview. Use Shift while selecting to add a range.","empty":"Upload a PDF to start organizing pages.","selectPage":"Select page {page}","dragPage":"Drag page {page}","previewUnavailable":"Preview unavailable","thumbnailAlt":"Page {page}","pageLabel":"Page {page} · source {source}","moveUp":"Move up","moveDown":"Move down","rotateLeft":"Rotate left","rotateRight":"Rotate right","deletePage":"Delete","rendering":"Rendering page previews in the background..."}}
</i18n>
