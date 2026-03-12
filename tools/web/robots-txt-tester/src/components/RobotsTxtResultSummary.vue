<template>
  <n-flex vertical :size="12">
    <n-descriptions :column="1" bordered label-placement="left">
      <n-descriptions-item :label="t('status')">
        <n-flex align="center" :size="8">
          <n-tag :type="statusType" size="small">{{ statusText }}</n-tag>
          <CopyToClipboardButton :content="summaryText" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('path')">
        <n-text code>{{ result.normalizedPath }}</n-text>
      </n-descriptions-item>
      <n-descriptions-item :label="t('matchedGroups')">
        <template v-if="result.matchedGroups.length > 0">
          <n-flex vertical :size="4">
            <n-text v-for="group in result.matchedGroups" :key="group.id">
              {{ group.userAgents.join(', ') }} ({{ t('line') }} {{ group.startLine }})
            </n-text>
          </n-flex>
        </template>
        <n-text v-else depth="3">{{ t('noMatchedGroups') }}</n-text>
      </n-descriptions-item>
      <n-descriptions-item :label="t('winner')">
        <n-text v-if="result.winner" code>{{ winnerText }}</n-text>
        <n-text v-else depth="3">{{ t('noWinner') }}</n-text>
      </n-descriptions-item>
    </n-descriptions>
    <n-alert :type="statusType" :bordered="false">{{ reasonText }}</n-alert>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert, NDescriptions, NDescriptionsItem, NFlex, NTag, NText } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import type { MatchResult } from '../utils/types'

const props = defineProps<{
  result: MatchResult
}>()

const { t } = useI18n({ useScope: 'local' })

const statusType = computed(() => (props.result.outcome === 'blocked' ? 'warning' : 'success'))

const statusText = computed(() =>
  props.result.outcome === 'blocked'
    ? t('blocked')
    : props.result.outcome === 'allowed'
      ? t('allowed')
      : t('allowedByDefault'),
)

const reasonText = computed(() =>
  !props.result.winner
    ? t('defaultReason')
    : props.result.winner.directive === 'allow'
      ? t('allowReason')
      : t('blockReason'),
)

const winnerText = computed(
  () =>
    `${props.result.winner?.directive === 'allow' ? t('allowDirective') : t('disallowDirective')}: ${props.result.winner?.pattern || '/'} (${t('line')} ${props.result.winner?.line})`,
)

const summaryText = computed(() => {
  const winner = props.result.winner
    ? `${props.result.winner.directive.toUpperCase()}: ${props.result.winner.pattern || '/'} (line ${props.result.winner.line})`
    : 'No matching rule'

  return [
    `Status: ${statusText.value}`,
    `Path: ${props.result.normalizedPath}`,
    `Winner: ${winner}`,
  ].join('\n')
})
</script>

<i18n lang="json">
{
  "en": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "zh": {
    "status": "状态",
    "allowed": "允许",
    "blocked": "阻止",
    "allowedByDefault": "默认允许",
    "path": "参与匹配的路径",
    "matchedGroups": "命中的分组",
    "noMatchedGroups": "没有命中的分组",
    "winner": "最终生效规则",
    "noWinner": "没有命中规则",
    "line": "行",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "没有命中任何 allow/disallow 规则，因此默认允许访问。",
    "allowReason": "最终生效规则是 Allow，因此该 URL 对当前爬虫可访问。",
    "blockReason": "最终生效规则是 Disallow，因此该 URL 对当前爬虫被阻止。"
  },
  "zh-CN": {
    "status": "状态",
    "allowed": "允许",
    "blocked": "阻止",
    "allowedByDefault": "默认允许",
    "path": "参与匹配的路径",
    "matchedGroups": "命中的分组",
    "noMatchedGroups": "没有命中的分组",
    "winner": "最终生效规则",
    "noWinner": "没有命中规则",
    "line": "行",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "没有命中任何 allow/disallow 规则，因此默认允许访问。",
    "allowReason": "最终生效规则是 Allow，因此该 URL 对当前爬虫可访问。",
    "blockReason": "最终生效规则是 Disallow，因此该 URL 对当前爬虫被阻止。"
  },
  "zh-TW": {
    "status": "狀態",
    "allowed": "允許",
    "blocked": "阻止",
    "allowedByDefault": "預設允許",
    "path": "參與比對的路徑",
    "matchedGroups": "命中的群組",
    "noMatchedGroups": "沒有命中的群組",
    "winner": "最終生效規則",
    "noWinner": "沒有命中規則",
    "line": "行",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "沒有命中任何 allow/disallow 規則，因此預設允許存取。",
    "allowReason": "最終生效規則是 Allow，因此該 URL 對目前爬蟲可存取。",
    "blockReason": "最終生效規則是 Disallow，因此該 URL 對目前爬蟲被阻止。"
  },
  "zh-HK": {
    "status": "狀態",
    "allowed": "允許",
    "blocked": "阻止",
    "allowedByDefault": "預設允許",
    "path": "參與比對的路徑",
    "matchedGroups": "命中的群組",
    "noMatchedGroups": "沒有命中的群組",
    "winner": "最終生效規則",
    "noWinner": "沒有命中規則",
    "line": "行",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "沒有命中任何 allow/disallow 規則，因此預設允許存取。",
    "allowReason": "最終生效規則是 Allow，因此該 URL 對目前爬蟲可存取。",
    "blockReason": "最終生效規則是 Disallow，因此該 URL 對目前爬蟲被阻止。"
  },
  "es": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "fr": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "de": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "it": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "ja": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "ko": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "ru": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "pt": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "ar": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "hi": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "tr": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "nl": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "sv": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "pl": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "vi": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "th": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "id": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "he": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "ms": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  },
  "no": {
    "status": "Status",
    "allowed": "Allowed",
    "blocked": "Blocked",
    "allowedByDefault": "Allowed by default",
    "path": "Evaluated path",
    "matchedGroups": "Matched groups",
    "noMatchedGroups": "No matching group",
    "winner": "Winning rule",
    "noWinner": "No matching rule",
    "line": "line",
    "allowDirective": "Allow",
    "disallowDirective": "Disallow",
    "defaultReason": "No matching allow/disallow rule was found, so the URL is allowed by default.",
    "allowReason": "The winning rule is Allow, so this URL is allowed for the selected crawler.",
    "blockReason": "The winning rule is Disallow, so this URL is blocked for the selected crawler."
  }
}
</i18n>
