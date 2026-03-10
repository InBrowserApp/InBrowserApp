<template>
  <section ref="sectionRef">
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <ToolSection>
      <n-flex vertical :size="12">
        <n-flex justify="space-between" align="center" wrap :size="[12, 8]">
          <n-text>{{ t('summary', { pageCount, selectedCount }) }}</n-text>
          <n-flex wrap :size="[8, 8]">
            <n-button quaternary :disabled="!canUndo" @click="emit('undo')">
              {{ t('undo') }}
            </n-button>
            <n-button quaternary :disabled="!canRedo" @click="emit('redo')">
              {{ t('redo') }}
            </n-button>
            <n-button quaternary @click="emit('select-all')">{{ t('selectAll') }}</n-button>
            <n-button quaternary :disabled="selectedCount === 0" @click="emit('clear-selection')">
              {{ t('clearSelection') }}
            </n-button>
            <n-button quaternary :disabled="selectedCount === 0" @click="emit('rotate-left')">
              {{ t('rotateLeft') }}
            </n-button>
            <n-button quaternary :disabled="selectedCount === 0" @click="emit('rotate-right')">
              {{ t('rotateRight') }}
            </n-button>
            <n-button
              quaternary
              type="error"
              :disabled="selectedCount === 0"
              @click="emit('delete-selection')"
            >
              {{ t('deleteSelection') }}
            </n-button>
            <n-button quaternary :disabled="!hasChanges" @click="emit('reset')">
              {{ t('reset') }}
            </n-button>
            <n-button
              type="primary"
              :loading="isGenerating"
              :disabled="!canExport"
              @click="emit('export')"
            >
              {{ t('exportPdf') }}
            </n-button>
            <n-button
              v-if="hasResult"
              tag="a"
              type="success"
              :href="downloadUrl"
              :download="resultFilename"
            >
              {{ t('downloadPdf') }}
            </n-button>
          </n-flex>
        </n-flex>

        <n-flex justify="space-between" align="center" wrap :size="[12, 8]">
          <n-flex wrap align="center" :size="[8, 8]">
            <n-text depth="3">{{ t('jumpLabel') }}</n-text>
            <n-input-number
              v-model:value="jumpPage"
              :min="1"
              :max="pageCount || 1"
              :precision="0"
              style="width: 110px"
            />
            <n-button quaternary :disabled="!canJump" @click="handleJump">
              {{ t('jumpAction') }}
            </n-button>
          </n-flex>

          <n-flex wrap align="center" :size="[8, 8]">
            <n-text depth="3">{{ t('thumbnailSize') }}</n-text>
            <n-button
              size="small"
              :type="thumbnailSize === 'compact' ? 'primary' : 'default'"
              @click="emit('set-thumbnail-size', 'compact')"
            >
              {{ t('compact') }}
            </n-button>
            <n-button
              size="small"
              :type="thumbnailSize === 'comfortable' ? 'primary' : 'default'"
              @click="emit('set-thumbnail-size', 'comfortable')"
            >
              {{ t('comfortable') }}
            </n-button>
            <n-button
              size="small"
              :type="thumbnailSize === 'large' ? 'primary' : 'default'"
              @click="emit('set-thumbnail-size', 'large')"
            >
              {{ t('large') }}
            </n-button>
          </n-flex>
        </n-flex>

        <n-alert v-if="generateErrorMessage" type="error" :title="generateErrorMessage" />
      </n-flex>
    </ToolSection>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NInputNumber, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { PDF_ERROR } from '../pdf-errors'
import type { ThumbnailSize } from './pageOrganizerState'

const props = defineProps<{
  pageCount: number
  selectedCount: number
  hasChanges: boolean
  canUndo: boolean
  canRedo: boolean
  isGenerating: boolean
  canExport: boolean
  hasResult: boolean
  thumbnailSize: ThumbnailSize
  downloadUrl?: string
  resultFilename: string
  generateErrorCode: string
}>()

const emit = defineEmits<{
  (event: 'undo'): void
  (event: 'redo'): void
  (event: 'select-all'): void
  (event: 'clear-selection'): void
  (event: 'rotate-left'): void
  (event: 'rotate-right'): void
  (event: 'delete-selection'): void
  (event: 'reset'): void
  (event: 'export'): void
  (event: 'jump-to-page', pageNumber: number): void
  (event: 'set-thumbnail-size', size: ThumbnailSize): void
}>()

const { t } = useI18n({ useScope: 'local' })
const sectionRef = ref<HTMLElement | null>(null)
const jumpPage = ref<number | null>(null)

const generateErrorMessage = computed(() => {
  if (!props.generateErrorCode) {
    return ''
  }

  if (props.generateErrorCode === PDF_ERROR.Encrypted) {
    return t('encryptedError')
  }

  if (props.generateErrorCode === PDF_ERROR.WorkerUnsupported) {
    return t('workerUnsupported')
  }

  return t('exportError')
})

const canJump = computed(
  () => jumpPage.value !== null && jumpPage.value >= 1 && jumpPage.value <= props.pageCount,
)

const syncJumpPage = (pageCount: number): void => {
  if (pageCount < 1) {
    jumpPage.value = null
    return
  }

  if (jumpPage.value === null) {
    jumpPage.value = 1
    return
  }

  jumpPage.value = Math.min(Math.max(jumpPage.value, 1), pageCount)
}

const handleJump = (): void => {
  if (!canJump.value || jumpPage.value === null) {
    return
  }

  emit('jump-to-page', jumpPage.value)
}

watch(() => props.pageCount, syncJumpPage, { immediate: true })

defineExpose({
  scrollIntoView: () => sectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
})
</script>

<!-- prettier-ignore -->
<i18n lang="json">
{"en":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"zh":{"title":"整理页面","summary":"当前文档共 {pageCount} 页，已选择 {selectedCount} 页","undo":"撤销","redo":"重做","selectAll":"全选","clearSelection":"清除选择","rotateLeft":"向左旋转","rotateRight":"向右旋转","deleteSelection":"删除所选页面","reset":"重置","exportPdf":"导出 PDF","downloadPdf":"下载 PDF","jumpLabel":"跳转到页码","jumpAction":"跳转","thumbnailSize":"缩略图尺寸","compact":"紧凑","comfortable":"舒适","large":"大图","encryptedError":"检测到加密 PDF，请先移除权限密码。","workerUnsupported":"当前浏览器不支持 PDF 导出工作线程。","exportError":"导出整理后的 PDF 失败。"},"zh-CN":{"title":"整理页面","summary":"当前文档共 {pageCount} 页，已选择 {selectedCount} 页","undo":"撤销","redo":"重做","selectAll":"全选","clearSelection":"清除选择","rotateLeft":"向左旋转","rotateRight":"向右旋转","deleteSelection":"删除所选页面","reset":"重置","exportPdf":"导出 PDF","downloadPdf":"下载 PDF","jumpLabel":"跳转到页码","jumpAction":"跳转","thumbnailSize":"缩略图尺寸","compact":"紧凑","comfortable":"舒适","large":"大图","encryptedError":"检测到加密 PDF，请先移除权限密码。","workerUnsupported":"当前浏览器不支持 PDF 导出工作线程。","exportError":"导出整理后的 PDF 失败。"},"zh-TW":{"title":"整理頁面","summary":"目前文件共有 {pageCount} 頁，已選取 {selectedCount} 頁","undo":"復原","redo":"重做","selectAll":"全選","clearSelection":"清除選取","rotateLeft":"向左旋轉","rotateRight":"向右旋轉","deleteSelection":"刪除所選頁面","reset":"重設","exportPdf":"匯出 PDF","downloadPdf":"下載 PDF","jumpLabel":"跳至頁碼","jumpAction":"跳轉","thumbnailSize":"縮圖尺寸","compact":"緊湊","comfortable":"舒適","large":"大圖","encryptedError":"偵測到加密 PDF，請先移除權限密碼。","workerUnsupported":"目前瀏覽器不支援 PDF 匯出工作執行緒。","exportError":"匯出整理後的 PDF 失敗。"},"zh-HK":{"title":"整理頁面","summary":"目前文件共有 {pageCount} 頁，已選取 {selectedCount} 頁","undo":"復原","redo":"重做","selectAll":"全選","clearSelection":"清除選取","rotateLeft":"向左旋轉","rotateRight":"向右旋轉","deleteSelection":"刪除所選頁面","reset":"重設","exportPdf":"匯出 PDF","downloadPdf":"下載 PDF","jumpLabel":"跳至頁碼","jumpAction":"跳轉","thumbnailSize":"縮圖尺寸","compact":"緊湊","comfortable":"舒適","large":"大圖","encryptedError":"偵測到加密 PDF，請先移除權限密碼。","workerUnsupported":"目前瀏覽器不支援 PDF 匯出工作執行緒。","exportError":"匯出整理後的 PDF 失敗。"},"es":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"fr":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"de":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"it":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"ja":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"ko":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"ru":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"pt":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"ar":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"hi":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"tr":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"nl":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"sv":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"pl":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"vi":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"th":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"id":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"he":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"ms":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."},"no":{"title":"Organize Pages","summary":"{pageCount} pages in the current document, {selectedCount} selected","undo":"Undo","redo":"Redo","selectAll":"Select all","clearSelection":"Clear selection","rotateLeft":"Rotate left","rotateRight":"Rotate right","deleteSelection":"Delete selected","reset":"Reset","exportPdf":"Export PDF","downloadPdf":"Download PDF","jumpLabel":"Go to page","jumpAction":"Jump","thumbnailSize":"Thumbnail size","compact":"Compact","comfortable":"Comfortable","large":"Large","encryptedError":"Encrypted PDF detected. Please remove the owner password first.","workerUnsupported":"This browser does not support PDF export workers.","exportError":"Failed to export organized PDF."}}
</i18n>
