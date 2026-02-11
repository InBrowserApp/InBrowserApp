<template>
  <ToolSection v-if="numPages > 0">
    <ToolSectionHeader>{{ t('previewTitle') }}</ToolSectionHeader>

    <n-flex vertical :size="12">
      <div class="preview-stage">
        <n-spin v-if="isRendering" size="small" />
        <n-alert
          v-else-if="errorMessage"
          class="preview-alert"
          type="error"
          :title="t('renderErrorTitle')"
        >
          {{ errorMessage }}
        </n-alert>
        <div v-else-if="previewUrl" class="preview-image-frame">
          <img :src="previewUrl" :alt="t('previewTitle')" class="preview-image" />
        </div>
        <n-empty v-else :description="t('emptyPreview')" />
      </div>

      <n-flex align="center" justify="space-between" :size="8" wrap>
        <n-text depth="3">{{ t('pageInfo', { page, total: numPages }) }}</n-text>
        <n-text v-if="pageImage" depth="3">{{ detailsText }}</n-text>
      </n-flex>

      <n-flex v-if="numPages > 1" justify="center">
        <n-pagination
          v-model:page="pageModel"
          :page-count="numPages"
          :page-slot="7"
          size="small"
          :disabled="isRendering"
        />
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { filesize } from 'filesize'
import { useObjectUrl } from '@vueuse/core'
import { NAlert, NEmpty, NFlex, NPagination, NSpin, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PdfPageImage } from '../types'

const props = defineProps<{
  page: number
  numPages: number
  pageImage: PdfPageImage | null
  isRendering: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  (event: 'update:page', value: number): void
}>()

const { t } = useI18n({ useScope: 'local' })

const pageModel = computed({
  get: () => props.page,
  set: (value: number) => emit('update:page', value),
})

const imageRef = toRef(props, 'pageImage')
const previewUrl = useObjectUrl(computed(() => imageRef.value?.blob ?? null))

const detailsText = computed(() => {
  if (!props.pageImage) return ''

  return t('details', {
    width: props.pageImage.width,
    height: props.pageImage.height,
    dpi: props.pageImage.dpi,
    size: filesize(props.pageImage.blob.size) as string,
  })
})
</script>

<style scoped>
.preview-stage {
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.preview-alert {
  max-width: min(100%, 680px);
}

.preview-image-frame {
  width: fit-content;
  max-width: 100%;
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  padding: 8px;
}

.preview-image {
  max-width: 100%;
  max-height: min(65vh, 720px);
  object-fit: contain;
  display: block;
}
</style>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "zh": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "zh-CN": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "zh-TW": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "zh-HK": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "es": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "fr": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "de": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "it": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "ja": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "ko": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "ru": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "pt": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "ar": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "hi": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "tr": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "nl": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "sv": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "pl": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "vi": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "th": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "id": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "he": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "ms": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  },
  "no": {
    "previewTitle": "Preview",
    "renderErrorTitle": "Render Failed",
    "emptyPreview": "No preview available.",
    "pageInfo": "Page {page} / {total}",
    "details": "{width} × {height} px · {dpi} DPI · {size}"
  }
}
</i18n>
