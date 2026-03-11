<template>
  <ToolSectionHeader>{{ title }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" :x-gap="12" :y-gap="12" responsive="screen">
      <n-gi>
        <n-flex vertical :size="8">
          <n-text strong>{{ t('fileDetails') }}</n-text>
          <n-descriptions bordered :column="1" label-placement="left">
            <n-descriptions-item :label="t('filename')">
              <n-text>{{ info.file.name }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('pageCount')">
              <n-text>{{ formatNumber(info.document.pageCount) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('version')">
              <n-text>{{ formatText(info.document.version) }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('encrypted')">
              <n-text>{{ info.document.encrypted ? t('yes') : t('no') }}</n-text>
            </n-descriptions-item>
          </n-descriptions>
        </n-flex>
      </n-gi>

      <n-gi>
        <n-flex vertical :size="8">
          <n-text strong>{{ t('metadata') }}</n-text>
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
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NFlex, NGi, NGrid, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PdfMetadataFieldKey, PdfMetadataInfo } from '../utils/pdfMetadata'

defineProps<{
  title: string
  info: PdfMetadataInfo
  fieldLabels: Record<PdfMetadataFieldKey, string>
}>()

const { t } = useI18n({ useScope: 'local' })

const formatText = (value?: string): string => value?.trim() || t('notAvailable')
const formatNumber = (value?: number): string =>
  typeof value === 'number' ? `${value}` : t('notAvailable')
const formatDate = (value?: Date): string =>
  value && !Number.isNaN(value.getTime()) ? value.toLocaleString() : t('notAvailable')
</script>

<i18n lang="json">
{
  "en": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "zh": {
    "fileDetails": "文件详情",
    "metadata": "元数据",
    "filename": "文件名",
    "pageCount": "页数",
    "version": "PDF 版本",
    "encrypted": "是否加密",
    "yes": "是",
    "no": "否",
    "notAvailable": "不可用"
  },
  "zh-CN": {
    "fileDetails": "文件详情",
    "metadata": "元数据",
    "filename": "文件名",
    "pageCount": "页数",
    "version": "PDF 版本",
    "encrypted": "是否加密",
    "yes": "是",
    "no": "否",
    "notAvailable": "不可用"
  },
  "zh-TW": {
    "fileDetails": "檔案詳情",
    "metadata": "中繼資料",
    "filename": "檔名",
    "pageCount": "頁數",
    "version": "PDF 版本",
    "encrypted": "是否加密",
    "yes": "是",
    "no": "否",
    "notAvailable": "不可用"
  },
  "zh-HK": {
    "fileDetails": "檔案詳情",
    "metadata": "中繼資料",
    "filename": "檔名",
    "pageCount": "頁數",
    "version": "PDF 版本",
    "encrypted": "是否加密",
    "yes": "是",
    "no": "否",
    "notAvailable": "不可用"
  },
  "es": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "fr": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "de": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "it": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "ja": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "ko": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "ru": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "pt": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "ar": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "hi": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "tr": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "nl": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "sv": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "pl": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "vi": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "th": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "id": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "he": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "ms": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  },
  "no": {
    "fileDetails": "File details",
    "metadata": "Metadata",
    "filename": "Filename",
    "pageCount": "Page count",
    "version": "PDF version",
    "encrypted": "Encrypted",
    "yes": "Yes",
    "no": "No",
    "notAvailable": "Not available"
  }
}
</i18n>
