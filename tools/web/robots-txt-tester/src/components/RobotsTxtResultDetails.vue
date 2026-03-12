<template>
  <n-flex vertical :size="8">
    <n-text strong>{{ t('candidates') }}</n-text>
    <n-text v-if="result.candidates.length === 0" depth="3">{{ t('noCandidates') }}</n-text>
    <n-code v-else :code="candidatesText" word-wrap />

    <n-text strong>{{ t('warnings') }}</n-text>
    <n-text v-if="warnings.length === 0" depth="3">{{ t('noWarnings') }}</n-text>
    <n-code v-else :code="warningsText" word-wrap />

    <n-text strong>{{ t('directives') }}</n-text>
    <n-text v-if="metadata.length === 0" depth="3">{{ t('noDirectives') }}</n-text>
    <n-code v-else :code="metadataText" word-wrap />
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCode, NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { MatchResult, ParseWarning, ParsedMetadataEntry } from '../utils/types'

const props = defineProps<{
  result: MatchResult
  warnings: ParseWarning[]
  metadata: ParsedMetadataEntry[]
}>()

const { t } = useI18n({ useScope: 'local' })

const candidatesText = computed(() =>
  props.result.candidates
    .map((candidate) => {
      const directive = candidate.directive === 'allow' ? 'Allow' : 'Disallow'
      return `${directive}: ${candidate.pattern || '/'} | matched length: ${candidate.matchedLength} | line ${candidate.line}`
    })
    .join('\n'),
)

const warningsText = computed(() =>
  props.warnings.map((warning) => `line ${warning.line}: ${warning.message}`).join('\n'),
)

const metadataText = computed(() =>
  props.metadata
    .map(
      (entry) =>
        `${entry.directive}: ${entry.value}${entry.groupId ? ` | group ${entry.groupId}` : ''}`,
    )
    .join('\n'),
)
</script>

<i18n lang="json">
{
  "en": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "zh": {
    "candidates": "候选规则",
    "noCandidates": "没有任何候选规则命中该路径。",
    "warnings": "警告",
    "noWarnings": "没有警告。",
    "directives": "不参与判定的指令",
    "noDirectives": "没有其他指令。"
  },
  "zh-CN": {
    "candidates": "候选规则",
    "noCandidates": "没有任何候选规则命中该路径。",
    "warnings": "警告",
    "noWarnings": "没有警告。",
    "directives": "不参与判定的指令",
    "noDirectives": "没有其他指令。"
  },
  "zh-TW": {
    "candidates": "候選規則",
    "noCandidates": "沒有任何候選規則命中該路徑。",
    "warnings": "警告",
    "noWarnings": "沒有警告。",
    "directives": "不參與判定的指令",
    "noDirectives": "沒有其他指令。"
  },
  "zh-HK": {
    "candidates": "候選規則",
    "noCandidates": "沒有任何候選規則命中該路徑。",
    "warnings": "警告",
    "noWarnings": "沒有警告。",
    "directives": "不參與判定的指令",
    "noDirectives": "沒有其他指令。"
  },
  "es": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "fr": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "de": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "it": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "ja": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "ko": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "ru": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "pt": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "ar": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "hi": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "tr": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "nl": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "sv": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "pl": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "vi": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "th": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "id": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "he": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "ms": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  },
  "no": {
    "candidates": "Candidate rules",
    "noCandidates": "No candidate rules matched the path.",
    "warnings": "Warnings",
    "noWarnings": "No warnings.",
    "directives": "Non-decision directives",
    "noDirectives": "No non-decision directives."
  }
}
</i18n>
