<template>
  <PDFMetadataCurrentSection :title="currentTitle" :info="info" :field-labels="fieldLabels" />

  <PDFMetadataFormSection
    v-if="canEdit"
    :title="editTitle"
    :fields="fields"
    :field-labels="fieldLabels"
    @update:text-field="forwardTextFieldValue"
    @update:date-field="forwardDateFieldValue"
    @restore-field="forwardRestoreField"
    @clear-all="forwardClearAll"
  />

  <PDFMetadataSaveSection
    v-if="canEdit"
    :title="saveTitle"
    :field-labels="fieldLabels"
    :change-summary="changeSummary"
    :can-generate="canGenerate"
    :is-generating="isSaving"
    :result-filename="resultFilename"
    :result-url="resultUrl"
    :error-message="errorMessage"
    @generate="forwardGenerate"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type {
  MetadataDateFieldKey,
  MetadataFieldChange,
  MetadataFieldsState,
  MetadataTextFieldKey,
} from '../composables/usePdfMetadataEditor'
import type { PdfMetadataFieldKey, PdfMetadataInfo } from '../utils/pdfMetadata'
import PDFMetadataCurrentSection from './PDFMetadataCurrentSection.vue'
import PDFMetadataFormSection from './PDFMetadataFormSection.vue'
import PDFMetadataSaveSection from './PDFMetadataSaveSection.vue'

defineProps<{
  currentTitle: string
  editTitle: string
  saveTitle: string
  info: PdfMetadataInfo
  canEdit: boolean
  fields: MetadataFieldsState
  changeSummary: MetadataFieldChange[]
  canGenerate: boolean
  isSaving: boolean
  resultFilename: string
  resultUrl: string | undefined
  errorMessage: string
}>()

const emit = defineEmits<{
  (event: 'update:text-field', key: MetadataTextFieldKey, value: string): void
  (event: 'update:date-field', key: MetadataDateFieldKey, value: number | null): void
  (event: 'restore-field', key: PdfMetadataFieldKey): void
  (event: 'clear-all'): void
  (event: 'generate'): void
}>()

const { t } = useI18n({ useScope: 'local' })

const fieldLabels = computed<Record<PdfMetadataFieldKey, string>>(() => ({
  title: t('fieldTitle'),
  author: t('fieldAuthor'),
  subject: t('fieldSubject'),
  keywords: t('fieldKeywords'),
  creator: t('fieldCreator'),
  producer: t('fieldProducer'),
  creationDate: t('fieldCreationDate'),
  modificationDate: t('fieldModificationDate'),
}))

const forwardTextFieldValue = (key: MetadataTextFieldKey, value: string): void => {
  emit('update:text-field', key, value)
}

const forwardDateFieldValue = (key: MetadataDateFieldKey, value: number | null): void => {
  emit('update:date-field', key, value)
}

const forwardRestoreField = (key: PdfMetadataFieldKey): void => {
  emit('restore-field', key)
}

const forwardClearAll = (): void => {
  emit('clear-all')
}

const forwardGenerate = (): void => {
  emit('generate')
}
</script>

<i18n lang="json">
{
  "en": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "zh": {
    "fieldTitle": "标题",
    "fieldAuthor": "作者",
    "fieldSubject": "主题",
    "fieldKeywords": "关键词",
    "fieldCreator": "创建者",
    "fieldProducer": "生成器",
    "fieldCreationDate": "创建日期",
    "fieldModificationDate": "修改日期"
  },
  "zh-CN": {
    "fieldTitle": "标题",
    "fieldAuthor": "作者",
    "fieldSubject": "主题",
    "fieldKeywords": "关键词",
    "fieldCreator": "创建者",
    "fieldProducer": "生成器",
    "fieldCreationDate": "创建日期",
    "fieldModificationDate": "修改日期"
  },
  "zh-TW": {
    "fieldTitle": "標題",
    "fieldAuthor": "作者",
    "fieldSubject": "主題",
    "fieldKeywords": "關鍵字",
    "fieldCreator": "建立者",
    "fieldProducer": "產生器",
    "fieldCreationDate": "建立日期",
    "fieldModificationDate": "修改日期"
  },
  "zh-HK": {
    "fieldTitle": "標題",
    "fieldAuthor": "作者",
    "fieldSubject": "主題",
    "fieldKeywords": "關鍵字",
    "fieldCreator": "建立者",
    "fieldProducer": "產生器",
    "fieldCreationDate": "建立日期",
    "fieldModificationDate": "修改日期"
  },
  "es": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "fr": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "de": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "it": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "ja": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "ko": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "ru": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "pt": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "ar": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "hi": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "tr": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "nl": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "sv": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "pl": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "vi": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "th": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "id": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "he": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "ms": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  },
  "no": {
    "fieldTitle": "Title",
    "fieldAuthor": "Author",
    "fieldSubject": "Subject",
    "fieldKeywords": "Keywords",
    "fieldCreator": "Creator",
    "fieldProducer": "Producer",
    "fieldCreationDate": "Creation date",
    "fieldModificationDate": "Modification date"
  }
}
</i18n>
