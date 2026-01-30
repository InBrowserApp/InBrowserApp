<template>
  <ToolSectionHeader>{{ t('details') }}</ToolSectionHeader>
  <ToolSection>
    <n-descriptions :column="1" label-placement="left" bordered>
      <n-descriptions-item :label="t('iso-8601')">
        <n-flex align="center" :size="8">
          <code>{{ isoString || '-' }}</code>
          <CopyToClipboardButton v-if="isoString" :content="isoString" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('utc')">
        <n-flex align="center" :size="8">
          <code>{{ utcString || '-' }}</code>
          <CopyToClipboardButton v-if="utcString" :content="utcString" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('unix-ms')">
        <n-flex align="center" :size="8">
          <code>{{ unixMilliseconds || '-' }}</code>
          <CopyToClipboardButton v-if="unixMilliseconds" :content="unixMilliseconds" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('unix-s')">
        <n-flex align="center" :size="8">
          <code>{{ unixSeconds || '-' }}</code>
          <CopyToClipboardButton v-if="unixSeconds" :content="unixSeconds" size="tiny" />
        </n-flex>
      </n-descriptions-item>
    </n-descriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NFlex } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

defineProps<{
  isoString: string
  utcString: string
  unixMilliseconds: string
  unixSeconds: string
}>()

const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "details": "Details",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix timestamp (ms)",
    "unix-s": "Unix timestamp (s)"
  },
  "zh": {
    "details": "详情",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 时间戳（毫秒）",
    "unix-s": "Unix 时间戳（秒）"
  },
  "zh-CN": {
    "details": "详情",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 时间戳（毫秒）",
    "unix-s": "Unix 时间戳（秒）"
  },
  "zh-TW": {
    "details": "詳情",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 時間戳記（毫秒）",
    "unix-s": "Unix 時間戳記（秒）"
  },
  "zh-HK": {
    "details": "詳情",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 時間戳記（毫秒）",
    "unix-s": "Unix 時間戳記（秒）"
  },
  "es": {
    "details": "Detalles",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Marca de tiempo Unix (ms)",
    "unix-s": "Marca de tiempo Unix (s)"
  },
  "fr": {
    "details": "Détails",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "de": {
    "details": "Details",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix-Zeitstempel (ms)",
    "unix-s": "Unix-Zeitstempel (s)"
  },
  "it": {
    "details": "Dettagli",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "ja": {
    "details": "詳細",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix タイムスタンプ (ms)",
    "unix-s": "Unix タイムスタンプ (s)"
  },
  "ko": {
    "details": "세부 정보",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 타임스탬프 (ms)",
    "unix-s": "Unix 타임스탬프 (s)"
  },
  "ru": {
    "details": "Детали",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix метка времени (мс)",
    "unix-s": "Unix метка времени (с)"
  },
  "pt": {
    "details": "Detalhes",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "ar": {
    "details": "التفاصيل",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "طابع زمني Unix (مللي ثانية)",
    "unix-s": "طابع زمني Unix (ثانية)"
  },
  "hi": {
    "details": "विवरण",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix टाइमस्टैम्प (ms)",
    "unix-s": "Unix टाइमस्टैम्प (s)"
  },
  "tr": {
    "details": "Detaylar",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix zaman damgası (ms)",
    "unix-s": "Unix zaman damgası (s)"
  },
  "nl": {
    "details": "Details",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix-tijdstempel (ms)",
    "unix-s": "Unix-tijdstempel (s)"
  },
  "sv": {
    "details": "Detaljer",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix-tidsstämpel (ms)",
    "unix-s": "Unix-tidsstämpel (s)"
  },
  "pl": {
    "details": "Szczegóły",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Znacznik czasu Unix (ms)",
    "unix-s": "Znacznik czasu Unix (s)"
  },
  "vi": {
    "details": "Chi tiết",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Dấu thời gian Unix (ms)",
    "unix-s": "Dấu thời gian Unix (s)"
  },
  "th": {
    "details": "รายละเอียด",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix timestamp (มิลลิวินาที)",
    "unix-s": "Unix timestamp (วินาที)"
  },
  "id": {
    "details": "Detail",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "he": {
    "details": "פרטים",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "חותמת זמן Unix (ms)",
    "unix-s": "חותמת זמן Unix (s)"
  },
  "ms": {
    "details": "Butiran",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Cap masa Unix (ms)",
    "unix-s": "Cap masa Unix (s)"
  },
  "no": {
    "details": "Detaljer",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix-tidsstempel (ms)",
    "unix-s": "Unix-tidsstempel (s)"
  }
}
</i18n>
