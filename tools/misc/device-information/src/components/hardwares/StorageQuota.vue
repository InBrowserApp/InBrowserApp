<template>
  <InfoStatistic :label="t('storage-quota')" :value="storageQuota" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { computedAsync } from '@vueuse/core'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

// Storage Information
const storageInfo = computedAsync(
  async () => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate()
        return {
          quota: estimate.quota ? formatBytes(estimate.quota) : null,
          usage: estimate.usage ? formatBytes(estimate.usage) : null,
        }
      }
      return { quota: null, usage: null }
    } catch {
      return { quota: null, usage: null }
    }
  },
  { quota: null, usage: null },
)

const storageQuota = computed(() => storageInfo.value?.quota || null)

// Utility Functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<i18n lang="json">
{
  "en": {
    "storage-quota": "Storage Quota"
  },
  "zh": {
    "storage-quota": "存储配额"
  },
  "zh-CN": {
    "storage-quota": "存储配额"
  },
  "zh-TW": {
    "storage-quota": "儲存配額"
  },
  "zh-HK": {
    "storage-quota": "儲存配額"
  },
  "es": {
    "storage-quota": "Cuota de almacenamiento"
  },
  "fr": {
    "storage-quota": "Quota de stockage"
  },
  "de": {
    "storage-quota": "Speicherkontingent"
  },
  "it": {
    "storage-quota": "Quota di archiviazione"
  },
  "ja": {
    "storage-quota": "ストレージ割当量"
  },
  "ko": {
    "storage-quota": "저장 공간 할당량"
  },
  "ru": {
    "storage-quota": "Квота хранилища"
  },
  "pt": {
    "storage-quota": "Cota de armazenamento"
  },
  "ar": {
    "storage-quota": "حصة التخزين"
  },
  "hi": {
    "storage-quota": "स्टोरेज कोटा"
  },
  "tr": {
    "storage-quota": "Depolama Kotasi"
  },
  "nl": {
    "storage-quota": "Opslagquotum"
  },
  "sv": {
    "storage-quota": "Lagringskvot"
  },
  "pl": {
    "storage-quota": "Limit pamieci"
  },
  "vi": {
    "storage-quota": "Han muc luu tru"
  },
  "th": {
    "storage-quota": "โควต้าพื้นที่จัดเก็บ"
  },
  "id": {
    "storage-quota": "Kuota Penyimpanan"
  },
  "he": {
    "storage-quota": "מכסת אחסון"
  },
  "ms": {
    "storage-quota": "Kuota Storan"
  },
  "no": {
    "storage-quota": "Lagringskvote"
  }
}
</i18n>
