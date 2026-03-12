<template>
  <PDFMetadataSectionHeader :title="title" :icon="Info16Regular" />
  <ToolSection>
    <n-grid cols="1 s:2" :x-gap="12" :y-gap="12" responsive="screen">
      <n-gi>
        <n-flex vertical :size="8">
          <n-text strong>{{ t('basicFields') }}</n-text>
          <n-descriptions bordered :column="1" label-placement="left">
            <n-descriptions-item :label="fieldLabels.title">
              <n-text>{{ formatText(info.metadata.title) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="fieldLabels.author">
              <n-text>{{ formatText(info.metadata.author) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="fieldLabels.subject">
              <n-text>{{ formatText(info.metadata.subject) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="fieldLabels.keywords">
              <n-text>{{ formatText(info.metadata.keywords) }}</n-text>
            </n-descriptions-item>
          </n-descriptions>
        </n-flex>
      </n-gi>

      <n-gi>
        <n-flex vertical :size="8">
          <n-text strong>{{ t('advancedFields') }}</n-text>
          <n-descriptions bordered :column="1" label-placement="left">
            <n-descriptions-item :label="fieldLabels.creator">
              <n-text>{{ formatText(info.metadata.creator) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="fieldLabels.producer">
              <n-text>{{ formatText(info.metadata.producer) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="fieldLabels.creationDate">
              <n-text>{{ formatDate(info.metadata.creationDate) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="fieldLabels.modificationDate">
              <n-text>{{ formatDate(info.metadata.modificationDate) }}</n-text>
            </n-descriptions-item>
          </n-descriptions>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { NDescriptions, NDescriptionsItem, NFlex, NGi, NGrid, NText } from 'naive-ui'
import Info16Regular from '@vicons/fluent/Info16Regular'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import type { PdfMetadataFieldKey, PdfMetadataInfo } from '../utils/pdfMetadata'
import PDFMetadataSectionHeader from './PDFMetadataSectionHeader.vue'

defineProps<{
  title: string
  info: PdfMetadataInfo
  fieldLabels: Record<PdfMetadataFieldKey, string>
}>()

const { t } = useI18n({ useScope: 'local' })

const formatText = (value?: string): string => value?.trim() || t('notAvailable')

const formatDate = (value?: Date): string =>
  value && !Number.isNaN(value.getTime()) ? value.toLocaleString() : t('notAvailable')
</script>

<i18n lang="json">
{
  "en": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "zh": {
    "basicFields": "基础字段",
    "advancedFields": "高级字段",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "basicFields": "基础字段",
    "advancedFields": "高级字段",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "basicFields": "基礎欄位",
    "advancedFields": "進階欄位",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "basicFields": "基礎欄位",
    "advancedFields": "進階欄位",
    "notAvailable": "不可用"
  },
  "es": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "fr": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "de": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "it": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "ja": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "ko": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "ru": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "pt": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "ar": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "hi": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "tr": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "nl": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "sv": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "pl": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "vi": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "th": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "id": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "he": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "ms": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  },
  "no": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "notAvailable": "Not available"
  }
}
</i18n>
