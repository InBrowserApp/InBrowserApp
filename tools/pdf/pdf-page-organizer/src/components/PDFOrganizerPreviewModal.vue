<template>
  <n-modal :show="visible" @update:show="handleVisibleChange">
    <n-card style="width: min(980px, 94vw)" :title="modalTitle" closable @close="emit('close')">
      <n-flex justify="space-between" align="center" wrap style="margin-bottom: 12px">
        <n-button quaternary :disabled="!canPrev" @click="emit('prev')">
          {{ t('prev') }}
        </n-button>
        <n-button quaternary :disabled="!canNext" @click="emit('next')">
          {{ t('next') }}
        </n-button>
      </n-flex>

      <n-spin :show="isLoading">
        <div class="preview-modal-content">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="modalTitle"
            :style="{ transform: `rotate(${rotation}deg)` }"
          />
          <n-empty v-else-if="!isLoading" />
        </div>
      </n-spin>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NCard, NEmpty, NFlex, NModal, NSpin } from 'naive-ui'

const props = defineProps<{
  visible: boolean
  page: number | null
  imageUrl: string | null
  rotation: number
  isLoading: boolean
  canPrev: boolean
  canNext: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'prev'): void
  (event: 'next'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const modalTitle = computed(() => {
  if (props.page === null) {
    return ''
  }

  return t('previewModalTitle', { page: props.page })
})

const handleVisibleChange = (visible: boolean): void => {
  if (!visible) {
    emit('close')
  }
}
</script>

<style scoped>
.preview-modal-content {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-modal-content img {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 8px;
  transition: transform 0.15s ease;
}
</style>

<i18n lang="json">
{
  "en": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "zh": { "previewModalTitle": "第 {page} 页预览", "prev": "上一页", "next": "下一页" },
  "zh-CN": { "previewModalTitle": "第 {page} 页预览", "prev": "上一页", "next": "下一页" },
  "zh-TW": { "previewModalTitle": "第 {page} 頁預覽", "prev": "上一頁", "next": "下一頁" },
  "zh-HK": { "previewModalTitle": "第 {page} 頁預覽", "prev": "上一頁", "next": "下一頁" },
  "es": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "fr": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "de": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "it": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "ja": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "ko": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "ru": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "pt": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "ar": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "hi": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "tr": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "nl": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "sv": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "pl": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "vi": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "th": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "id": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "he": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "ms": {
    "previewModalTitle": "Page {page} Preview",
    "prev": "Previous page",
    "next": "Next page"
  },
  "no": { "previewModalTitle": "Page {page} Preview", "prev": "Previous page", "next": "Next page" }
}
</i18n>
