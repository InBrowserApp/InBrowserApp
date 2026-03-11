<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-space vertical :size="12">
      <n-text v-if="diagnostics.length === 0" depth="3">{{ t('empty') }}</n-text>

      <n-alert v-if="errors.length" type="error" :title="t('errors')" :show-icon="true">
        <n-space vertical :size="4">
          <div v-for="diagnostic in errors" :key="diagnostic.message">{{ diagnostic.message }}</div>
        </n-space>
      </n-alert>

      <n-alert v-if="warnings.length" type="warning" :title="t('warnings')" :show-icon="true">
        <n-space vertical :size="4">
          <div v-for="diagnostic in warnings" :key="diagnostic.message">
            {{ diagnostic.message }}
          </div>
        </n-space>
      </n-alert>

      <n-alert v-if="notes.length" type="info" :title="t('notes')" :show-icon="true">
        <n-space vertical :size="4">
          <div v-for="diagnostic in notes" :key="diagnostic.message">{{ diagnostic.message }}</div>
        </n-space>
      </n-alert>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NSpace, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { CSPDiagnostic } from '@utils/csp'

const props = defineProps<{
  diagnostics: CSPDiagnostic[]
}>()

const errors = computed(() =>
  props.diagnostics.filter((diagnostic) => diagnostic.severity === 'error'),
)
const warnings = computed(() =>
  props.diagnostics.filter((diagnostic) => diagnostic.severity === 'warning'),
)
const notes = computed(() =>
  props.diagnostics.filter((diagnostic) => diagnostic.severity === 'info'),
)
const { t } = useI18n()
</script>

<i18n lang="json">
{
  "en": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "zh": {
    "title": "诊断",
    "empty": "未发现问题。",
    "errors": "错误",
    "warnings": "警告",
    "notes": "说明"
  },
  "zh-CN": {
    "title": "诊断",
    "empty": "未发现问题。",
    "errors": "错误",
    "warnings": "警告",
    "notes": "说明"
  },
  "zh-TW": {
    "title": "診斷",
    "empty": "未發現問題。",
    "errors": "錯誤",
    "warnings": "警告",
    "notes": "說明"
  },
  "zh-HK": {
    "title": "診斷",
    "empty": "未發現問題。",
    "errors": "錯誤",
    "warnings": "警告",
    "notes": "說明"
  },
  "es": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "fr": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "de": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "it": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "ja": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "ko": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "ru": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "pt": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "ar": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "hi": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "tr": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "nl": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "sv": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "pl": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "vi": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "th": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "id": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "he": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "ms": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  },
  "no": {
    "title": "Diagnostics",
    "empty": "No issues detected.",
    "errors": "Errors",
    "warnings": "Warnings",
    "notes": "Notes"
  }
}
</i18n>
