<template>
  <ToolSectionHeader>{{ title }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="16">
      <n-flex justify="space-between" align="center">
        <n-text strong>{{ t('basicFields') }}</n-text>
        <n-button quaternary size="small" @click="$emit('clear-all')">
          {{ t('clearAll') }}
        </n-button>
      </n-flex>

      <n-space vertical :size="12">
        <div v-for="key in basicFieldKeys" :key="key" class="metadata-field" :data-field="key">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ fieldLabels[key] }}</n-text>
            <n-button
              quaternary
              size="tiny"
              :data-restore-field="key"
              @click="$emit('restore-field', key)"
            >
              {{ t('restore') }}
            </n-button>
          </n-flex>

          <n-radio-group
            :value="fields[key].mode"
            :data-mode-field="key"
            @update:value="emitModeUpdate(key, $event)"
          >
            <n-space :size="8">
              <n-radio-button value="preserve">{{ t('preserve') }}</n-radio-button>
              <n-radio-button value="set">{{ t('custom') }}</n-radio-button>
              <n-radio-button value="clear">{{ t('clear') }}</n-radio-button>
            </n-space>
          </n-radio-group>

          <n-input
            v-if="fields[key].mode === 'set'"
            :value="fields[key].value"
            :type="key === 'keywords' ? 'textarea' : 'text'"
            :placeholder="key === 'keywords' ? t('keywordsPlaceholder') : undefined"
            :data-input-field="key"
            @update:value="emitValueUpdate(key, $event)"
          />
        </div>
      </n-space>

      <n-text strong>{{ t('advancedFields') }}</n-text>

      <n-space vertical :size="12">
        <div v-for="key in advancedFieldKeys" :key="key" class="metadata-field" :data-field="key">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ fieldLabels[key] }}</n-text>
            <n-button
              quaternary
              size="tiny"
              :data-restore-field="key"
              @click="$emit('restore-field', key)"
            >
              {{ t('restore') }}
            </n-button>
          </n-flex>

          <n-radio-group
            :value="fields[key].mode"
            :data-mode-field="key"
            @update:value="emitModeUpdate(key, $event)"
          >
            <n-space :size="8">
              <n-radio-button value="preserve">{{ t('preserve') }}</n-radio-button>
              <n-radio-button value="set">{{ t('custom') }}</n-radio-button>
              <n-radio-button value="clear">{{ t('clear') }}</n-radio-button>
            </n-space>
          </n-radio-group>

          <n-input
            v-if="fields[key].mode === 'set'"
            :value="fields[key].value"
            :placeholder="isDateField(key) ? t('datePlaceholder') : undefined"
            :data-input-field="key"
            @update:value="emitValueUpdate(key, $event)"
          />
        </div>
      </n-space>

      <n-alert v-if="validationFieldKeys.length" type="warning">
        {{ t('validationDescription', { fields: validationLabels }) }}
      </n-alert>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert, NButton, NFlex, NInput, NRadioButton, NRadioGroup, NSpace, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { MetadataFieldsState } from '../composables/usePdfMetadataEditor'
import type { PdfMetadataFieldKey, PdfMetadataUpdateMode } from '../utils/pdfMetadata'

const props = defineProps<{
  title: string
  fields: MetadataFieldsState
  fieldLabels: Record<PdfMetadataFieldKey, string>
  validationFieldKeys: PdfMetadataFieldKey[]
}>()

const emit = defineEmits<{
  (event: 'update:field-mode', key: PdfMetadataFieldKey, mode: PdfMetadataUpdateMode): void
  (event: 'update:field-value', key: PdfMetadataFieldKey, value: string): void
  (event: 'restore-field', key: PdfMetadataFieldKey): void
  (event: 'clear-all'): void
}>()

const basicFieldKeys: PdfMetadataFieldKey[] = ['title', 'author', 'subject', 'keywords']
const advancedFieldKeys: PdfMetadataFieldKey[] = [
  'creator',
  'producer',
  'creationDate',
  'modificationDate',
]

const { t } = useI18n({ useScope: 'local' })

const isDateField = (key: PdfMetadataFieldKey): boolean =>
  key === 'creationDate' || key === 'modificationDate'

const emitModeUpdate = (key: PdfMetadataFieldKey, mode: string): void => {
  emit('update:field-mode', key, mode as PdfMetadataUpdateMode)
}

const emitValueUpdate = (key: PdfMetadataFieldKey, value: string): void => {
  emit('update:field-value', key, value)
}

const validationLabels = computed(() =>
  props.validationFieldKeys.map((key) => props.fieldLabels[key]).join(', '),
)
</script>

<i18n lang="json">
{
  "en": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "zh": {
    "basicFields": "基础字段",
    "advancedFields": "高级字段",
    "preserve": "保留原值",
    "custom": "设置新值",
    "clear": "清空字段",
    "clearAll": "清空所有可编辑字段",
    "restore": "恢复",
    "keywordsPlaceholder": "输入关键词文本",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "请先修复无效字段：{fields}"
  },
  "zh-CN": {
    "basicFields": "基础字段",
    "advancedFields": "高级字段",
    "preserve": "保留原值",
    "custom": "设置新值",
    "clear": "清空字段",
    "clearAll": "清空所有可编辑字段",
    "restore": "恢复",
    "keywordsPlaceholder": "输入关键词文本",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "请先修复无效字段：{fields}"
  },
  "zh-TW": {
    "basicFields": "基礎欄位",
    "advancedFields": "進階欄位",
    "preserve": "保留原值",
    "custom": "設定新值",
    "clear": "清空欄位",
    "clearAll": "清空所有可編輯欄位",
    "restore": "還原",
    "keywordsPlaceholder": "輸入關鍵字文字",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "請先修正無效欄位：{fields}"
  },
  "zh-HK": {
    "basicFields": "基礎欄位",
    "advancedFields": "進階欄位",
    "preserve": "保留原值",
    "custom": "設定新值",
    "clear": "清空欄位",
    "clearAll": "清空所有可編輯欄位",
    "restore": "還原",
    "keywordsPlaceholder": "輸入關鍵字文字",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "請先修正無效欄位：{fields}"
  },
  "es": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "fr": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "de": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "it": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "ja": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "ko": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "ru": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "pt": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "ar": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "hi": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "tr": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "nl": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "sv": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "pl": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "vi": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "th": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "id": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "he": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "ms": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  },
  "no": {
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "preserve": "Keep original",
    "custom": "Set value",
    "clear": "Clear",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Enter keywords text",
    "datePlaceholder": "YYYY-MM-DDTHH:mm",
    "validationDescription": "Fix invalid fields before saving: {fields}"
  }
}
</i18n>
