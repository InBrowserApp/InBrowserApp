<template>
  <ToolSection>
    <n-descriptions :column="1" label-placement="left" bordered>
      <n-descriptions-item :label="t('iso-8601')">
        <n-flex align="center" :size="8">
          <code>{{ isoString }}</code>
          <CopyToClipboardButton :content="isoString" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('utc')">
        <n-flex align="center" :size="8">
          <code>{{ utcString }}</code>
          <CopyToClipboardButton :content="utcString" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('relative')">
        <n-time :time="dateValue ?? undefined" type="relative" :to="now" />
      </n-descriptions-item>
    </n-descriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NFlex, NTime } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  isoString: string
  utcString: string
  dateValue: number | null
  now: Date
}>()
</script>

<i18n lang="json">
{
  "en": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relative"
  },
  "zh": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相对时间"
  },
  "zh-CN": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相对时间"
  },
  "zh-TW": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相對時間"
  },
  "zh-HK": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相對時間"
  },
  "es": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativo"
  },
  "fr": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relatif"
  },
  "de": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativ"
  },
  "it": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativo"
  },
  "ja": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相対時間"
  },
  "ko": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "상대 시간"
  },
  "ru": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Относительное"
  },
  "pt": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativo"
  },
  "ar": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "نسبي"
  },
  "hi": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "सापेक्ष"
  },
  "tr": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Göreceli"
  },
  "nl": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relatief"
  },
  "sv": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativ"
  },
  "pl": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Względny"
  },
  "vi": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Tương đối"
  },
  "th": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "สัมพัทธ์"
  },
  "id": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relatif"
  },
  "he": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "יחסי"
  },
  "ms": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relatif"
  },
  "no": {
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativ"
  }
}
</i18n>
