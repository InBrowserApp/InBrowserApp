<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-alert v-if="pending" type="info" :bordered="false">
        {{ t('pending') }}
      </n-alert>
      <n-alert v-else-if="targetError" type="error" :bordered="false">
        {{ targetError }}
      </n-alert>

      <template v-else-if="result">
        <RobotsTxtResultSummary :result="result" />
        <RobotsTxtResultDetails :result="result" :warnings="warnings" :metadata="metadata" />
      </template>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NAlert, NFlex } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import type { MatchResult, ParseWarning, ParsedMetadataEntry } from '../utils/types'
import RobotsTxtResultSummary from './RobotsTxtResultSummary.vue'
import RobotsTxtResultDetails from './RobotsTxtResultDetails.vue'

defineProps<{
  pending: boolean
  targetError: string
  result: MatchResult | null
  warnings: ParseWarning[]
  metadata: ParsedMetadataEntry[]
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "zh": { "title": "结果", "pending": "输入 robots.txt、User-agent 和 URL 或路径后即可查看结果。" },
  "zh-CN": {
    "title": "结果",
    "pending": "输入 robots.txt、User-agent 和 URL 或路径后即可查看结果。"
  },
  "zh-TW": {
    "title": "結果",
    "pending": "輸入 robots.txt、User-agent 和 URL 或路徑後即可查看結果。"
  },
  "zh-HK": {
    "title": "結果",
    "pending": "輸入 robots.txt、User-agent 和 URL 或路徑後即可查看結果。"
  },
  "es": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "fr": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "de": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "it": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "ja": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "ko": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "ru": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "pt": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "ar": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "hi": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "tr": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "nl": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "sv": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "pl": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "vi": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "th": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "id": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "he": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "ms": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  },
  "no": {
    "title": "Result",
    "pending": "Enter a robots.txt, user-agent, and URL or path to see the result."
  }
}
</i18n>
