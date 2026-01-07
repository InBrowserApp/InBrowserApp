<template>
  <ToolSection>
    <n-flex>
      <CopyToClipboardButton :content="exifJson">
        {{ t('copyAsJson') }}
      </CopyToClipboardButton>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFlex } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { ExifData } from '../ExifViewerView.vue'

const props = defineProps<{
  exifData: ExifData
}>()

const { t } = useI18n()

const exifJson = computed(() => {
  return JSON.stringify(
    props.exifData,
    (key, value) => {
      if (value instanceof Date) {
        return value.toISOString()
      }
      if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
        return `[Binary data: ${(value as ArrayBuffer).byteLength || (value as Uint8Array).length} bytes]`
      }
      return value
    },
    2,
  )
})
</script>

<i18n lang="json">
{
  "en": { "copyAsJson": "Copy as JSON" },
  "zh": { "copyAsJson": "复制为 JSON" },
  "zh-CN": { "copyAsJson": "复制为 JSON" },
  "zh-TW": { "copyAsJson": "複製為 JSON" },
  "zh-HK": { "copyAsJson": "複製為 JSON" },
  "es": { "copyAsJson": "Copiar como JSON" },
  "fr": { "copyAsJson": "Copier en JSON" },
  "de": { "copyAsJson": "Als JSON kopieren" },
  "it": { "copyAsJson": "Copia come JSON" },
  "ja": { "copyAsJson": "JSON としてコピー" },
  "ko": { "copyAsJson": "JSON으로 복사" },
  "ru": { "copyAsJson": "Копировать как JSON" },
  "pt": { "copyAsJson": "Copiar como JSON" },
  "ar": { "copyAsJson": "نسخ كـ JSON" },
  "hi": { "copyAsJson": "JSON के रूप में कॉपी करें" },
  "tr": { "copyAsJson": "JSON olarak kopyala" },
  "nl": { "copyAsJson": "Kopiëren als JSON" },
  "sv": { "copyAsJson": "Kopiera som JSON" },
  "pl": { "copyAsJson": "Kopiuj jako JSON" },
  "vi": { "copyAsJson": "Sao chép dạng JSON" },
  "th": { "copyAsJson": "คัดลอกเป็น JSON" },
  "id": { "copyAsJson": "Salin sebagai JSON" },
  "he": { "copyAsJson": "העתק כ-JSON" },
  "ms": { "copyAsJson": "Salin sebagai JSON" },
  "no": { "copyAsJson": "Kopier som JSON" }
}
</i18n>
