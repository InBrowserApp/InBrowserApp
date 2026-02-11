<template>
  <n-alert v-if="!issues.length" type="success" :bordered="false">{{ t('no-issues') }}</n-alert>

  <div v-else class="lint-result">
    <n-text depth="3">
      {{ t('summary') }}: {{ t('errors') }} {{ counts.error }}, {{ t('warnings') }}
      {{ counts.warning }}, {{ t('info') }} {{ counts.info }}
    </n-text>

    <n-table :bordered="false" size="small">
      <thead>
        <tr>
          <th>{{ t('severity') }}</th>
          <th>{{ t('code') }}</th>
          <th>{{ t('location') }}</th>
          <th>{{ t('message') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="issue in issues"
          :key="`${issue.code}:${issue.line}:${issue.column}:${issue.message}`"
        >
          <td>
            <n-tag size="small" :bordered="false" :type="severityTypeMap[issue.severity]">
              {{ severityLabelMap[issue.severity] }}
            </n-tag>
          </td>
          <td>
            <n-text code>{{ issue.code }}</n-text>
          </td>
          <td>
            <n-text code>{{ issue.line }}:{{ issue.column }}</n-text>
          </td>
          <td>{{ issue.message }}</td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAlert, NTable, NTag, NText } from 'naive-ui'
import type { SqlLintIssue } from '../sqlLint'

const props = defineProps<{
  issues: SqlLintIssue[]
}>()

const { t } = useI18n({ useScope: 'local' })

const counts = computed(() => {
  const count = {
    error: 0,
    warning: 0,
    info: 0,
  }

  for (const issue of props.issues) {
    count[issue.severity] += 1
  }

  return count
})

const severityTypeMap: Record<SqlLintIssue['severity'], 'error' | 'warning' | 'info'> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
}

const severityLabelMap = computed<Record<SqlLintIssue['severity'], string>>(() => ({
  error: t('errors'),
  warning: t('warnings'),
  info: t('info'),
}))
</script>

<style scoped>
.lint-result {
  display: grid;
  gap: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "zh": {
    "summary": "汇总",
    "errors": "错误",
    "warnings": "警告",
    "info": "提示",
    "no-issues": "未发现 lint 问题。",
    "severity": "级别",
    "code": "规则",
    "location": "位置",
    "message": "信息"
  },
  "zh-CN": {
    "summary": "汇总",
    "errors": "错误",
    "warnings": "警告",
    "info": "提示",
    "no-issues": "未发现 lint 问题。",
    "severity": "级别",
    "code": "规则",
    "location": "位置",
    "message": "信息"
  },
  "zh-TW": {
    "summary": "摘要",
    "errors": "錯誤",
    "warnings": "警告",
    "info": "資訊",
    "no-issues": "未發現 lint 問題。",
    "severity": "等級",
    "code": "規則",
    "location": "位置",
    "message": "訊息"
  },
  "zh-HK": {
    "summary": "摘要",
    "errors": "錯誤",
    "warnings": "警告",
    "info": "資訊",
    "no-issues": "未發現 lint 問題。",
    "severity": "等級",
    "code": "規則",
    "location": "位置",
    "message": "訊息"
  },
  "es": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "fr": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "de": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "it": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "ja": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "ko": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "ru": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "pt": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "ar": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "hi": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "tr": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "nl": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "sv": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "pl": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "vi": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "th": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "id": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "he": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "ms": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  },
  "no": {
    "summary": "Summary",
    "errors": "Errors",
    "warnings": "Warnings",
    "info": "Info",
    "no-issues": "No lint issues found.",
    "severity": "Severity",
    "code": "Code",
    "location": "Location",
    "message": "Message"
  }
}
</i18n>
