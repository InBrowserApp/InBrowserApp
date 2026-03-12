<template>
  <PDFMetadataSectionHeader :title="title" :icon="DocumentAdd16Regular" />
  <ToolSection>
    <n-space vertical :size="16">
      <n-flex justify="space-between" align="center">
        <n-text depth="3">{{ t('description') }}</n-text>
        <n-button quaternary size="small" @click="$emit('clear-all')">
          {{ t('clearAll') }}
        </n-button>
      </n-flex>

      <n-text strong>{{ t('basicFields') }}</n-text>

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

          <n-input
            :value="fields[key]"
            :type="key === 'keywords' ? 'textarea' : 'text'"
            :autosize="key === 'keywords' ? { minRows: 2, maxRows: 4 } : undefined"
            :placeholder="key === 'keywords' ? t('keywordsPlaceholder') : t('textPlaceholder')"
            :data-input-field="key"
            @update:value="emitTextValueUpdate(key, $event)"
          />
        </div>
      </n-space>

      <n-text strong>{{ t('advancedFields') }}</n-text>

      <n-space vertical :size="12">
        <div
          v-for="key in advancedTextFieldKeys"
          :key="key"
          class="metadata-field"
          :data-field="key"
        >
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

          <n-input
            :value="fields[key]"
            :placeholder="t('textPlaceholder')"
            :data-input-field="key"
            @update:value="emitTextValueUpdate(key, $event)"
          />
        </div>

        <div v-for="key in dateFieldKeys" :key="key" class="metadata-field" :data-field="key">
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

          <n-date-picker
            :value="fields[key]"
            type="datetime"
            clearable
            style="width: 100%"
            :placeholder="t('datePlaceholder')"
            :data-input-field="key"
            @update:value="emitDateValueUpdate(key, $event)"
          />
        </div>
      </n-space>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NDatePicker, NFlex, NInput, NSpace, NText } from 'naive-ui'
import DocumentAdd16Regular from '@vicons/fluent/DocumentAdd16Regular'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import type {
  MetadataDateFieldKey,
  MetadataFieldsState,
  MetadataTextFieldKey,
} from '../composables/usePdfMetadataEditor'
import PDFMetadataSectionHeader from './PDFMetadataSectionHeader.vue'

defineProps<{
  title: string
  fields: MetadataFieldsState
  fieldLabels: Record<MetadataTextFieldKey | MetadataDateFieldKey, string>
}>()

const emit = defineEmits<{
  (event: 'update:text-field', key: MetadataTextFieldKey, value: string): void
  (event: 'update:date-field', key: MetadataDateFieldKey, value: number | null): void
  (event: 'restore-field', key: MetadataTextFieldKey | MetadataDateFieldKey): void
  (event: 'clear-all'): void
}>()

const basicFieldKeys: MetadataTextFieldKey[] = ['title', 'author', 'subject', 'keywords']
const advancedTextFieldKeys: MetadataTextFieldKey[] = ['creator', 'producer']
const dateFieldKeys: MetadataDateFieldKey[] = ['creationDate', 'modificationDate']

const { t } = useI18n({ useScope: 'local' })

const emitTextValueUpdate = (key: MetadataTextFieldKey, value: string): void => {
  emit('update:text-field', key, value)
}

const emitDateValueUpdate = (key: MetadataDateFieldKey, value: number | null): void => {
  emit('update:date-field', key, value)
}
</script>

<i18n lang="json">
{
  "en": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "zh": {
    "description": "删除字段值即可清空该字段，点击“恢复”可回到原始元数据。",
    "basicFields": "基础字段",
    "advancedFields": "高级字段",
    "clearAll": "清空所有可编辑字段",
    "restore": "恢复",
    "keywordsPlaceholder": "用逗号或换行分隔关键词",
    "textPlaceholder": "留空即可清空",
    "datePlaceholder": "选择日期和时间"
  },
  "zh-CN": {
    "description": "删除字段值即可清空该字段，点击“恢复”可回到原始元数据。",
    "basicFields": "基础字段",
    "advancedFields": "高级字段",
    "clearAll": "清空所有可编辑字段",
    "restore": "恢复",
    "keywordsPlaceholder": "用逗号或换行分隔关键词",
    "textPlaceholder": "留空即可清空",
    "datePlaceholder": "选择日期和时间"
  },
  "zh-TW": {
    "description": "刪除欄位值即可清空欄位，點擊「還原」可回到原始中繼資料。",
    "basicFields": "基礎欄位",
    "advancedFields": "進階欄位",
    "clearAll": "清空所有可編輯欄位",
    "restore": "還原",
    "keywordsPlaceholder": "以逗號或換行分隔關鍵字",
    "textPlaceholder": "留空即可清空",
    "datePlaceholder": "選擇日期與時間"
  },
  "zh-HK": {
    "description": "刪除欄位值即可清空欄位，點擊「還原」可回到原始中繼資料。",
    "basicFields": "基礎欄位",
    "advancedFields": "進階欄位",
    "clearAll": "清空所有可編輯欄位",
    "restore": "還原",
    "keywordsPlaceholder": "以逗號或換行分隔關鍵字",
    "textPlaceholder": "留空即可清空",
    "datePlaceholder": "選擇日期與時間"
  },
  "es": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "fr": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "de": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "it": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "ja": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "ko": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "ru": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "pt": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "ar": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "hi": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "tr": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "nl": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "sv": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "pl": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "vi": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "th": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "id": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "he": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "ms": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  },
  "no": {
    "description": "Delete a value to clear that field. Use Restore to go back to the original metadata.",
    "basicFields": "Basic fields",
    "advancedFields": "Advanced fields",
    "clearAll": "Clear all editable fields",
    "restore": "Restore",
    "keywordsPlaceholder": "Comma or line separated keywords",
    "textPlaceholder": "Leave empty to clear",
    "datePlaceholder": "Pick a date and time"
  }
}
</i18n>
