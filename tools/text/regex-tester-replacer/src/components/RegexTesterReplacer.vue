<template>
  <n-grid cols="1 l:2" responsive="screen" :x-gap="24" :y-gap="24">
    <n-gi>
      <RegexInputs
        v-model:text-or-file="textOrFile"
        v-model:pattern="pattern"
        v-model:selected-flags="selectedFlags"
        v-model:replacement="replacement"
        v-model:auto-run="autoRun"
        :pattern-status="patternStatus"
        :pattern-error="patternError"
        :flag-options="flagOptions"
        @run="run"
      />
    </n-gi>
    <n-gi>
      <RegexResults
        v-model:active-tab="activeResultTab"
        :pattern-error="patternError"
        :show-summary-counts="showSummaryCounts"
        :matches-count="matchesCount"
        :groups-count="groupsCount"
        :zero-length-count="zeroLengthCount"
        :preview-text="previewText"
        :preview-html="previewHtml"
        :preview-truncated="previewTruncated"
        :preview-limit="previewLimit"
        :matches-truncated="matchesTruncated"
        :match-limit="matchLimit"
        :matches="matches"
        :replace-output="replaceOutput"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { computedAsync, useDebounceFn, useStorage } from '@vueuse/core'
import { NGi, NGrid } from 'naive-ui'
import RegexInputs from './RegexInputs.vue'
import RegexResults from './RegexResults.vue'
import {
  buildHighlightSegments,
  collectMatches,
  compileRegex,
  normalizeFlags,
  replaceText,
  type RegexMatch,
} from '../utils'

const matchLimit = 200
const previewLimit = 5000

const defaultText = 'Order #123-ABC\nOrder #456-DEF'
const defaultPattern = '#(\\d+)-([A-Z]+)'
const defaultReplacement = 'ID:$1 Code:$2'

const storedText = useStorage('tools:regex-tester-replacer:text', defaultText)
const textOrFile = ref<string | File>(storedText.value)
const pattern = useStorage('tools:regex-tester-replacer:pattern', defaultPattern)
const replacement = useStorage('tools:regex-tester-replacer:replacement', defaultReplacement)
const selectedFlags = useStorage<string[]>('tools:regex-tester-replacer:flags', ['g'])
const autoRun = useStorage('tools:regex-tester-replacer:auto-run', true)
const activeResultTab = useStorage<'preview' | 'matches' | 'replace'>(
  'tools:regex-tester-replacer:result-tab',
  'preview',
)

const flagOptions = ['g', 'i', 'm', 's', 'u', 'y']
const isReading = ref(false)

const sourceText = computedAsync(
  async () => {
    const input = textOrFile.value
    if (typeof input === 'string') return input
    return input.text()
  },
  '',
  isReading,
)

watch(textOrFile, (value) => {
  if (typeof value === 'string') {
    storedText.value = value
  }
})

watch(storedText, (value) => {
  if (typeof textOrFile.value === 'string') {
    textOrFile.value = value
  }
})

const normalizedFlags = computed(() => normalizeFlags(selectedFlags.value))
const compiledRegex = computed(() => {
  if (!pattern.value) return { regex: null, error: null }
  return compileRegex(pattern.value, normalizedFlags.value)
})

const patternError = computed(() => compiledRegex.value.error ?? '')
const patternStatus = computed(() => {
  if (!pattern.value) return undefined
  return patternError.value ? 'error' : 'success'
})

const matches = ref<RegexMatch[]>([])
const matchesTruncated = ref(false)
const replaceOutput = ref('')

const matchesCount = computed(() => matches.value.length)
const groupsCount = computed(() =>
  matches.value.reduce((sum, match) => sum + match.groups.length, 0),
)
const zeroLengthCount = computed(() =>
  matches.value.reduce((sum, match) => (match.match.length ? sum : sum + 1), 0),
)

const highlightResult = computed(() =>
  buildHighlightSegments(sourceText.value, matches.value, previewLimit),
)
const previewText = computed(() => highlightResult.value.previewText)
const previewTruncated = computed(() => highlightResult.value.truncated)
const previewHtml = computed(() => {
  if (!previewText.value) return ''
  return highlightResult.value.segments
    .map((segment) => {
      const escaped = escapeHtml(segment.text)
      return segment.isMatch ? `<mark class="preview-match">${escaped}</mark>` : escaped
    })
    .join('')
})

const showSummaryCounts = computed(
  () => !!pattern.value && !!sourceText.value && !patternError.value,
)

const debouncedRun = useDebounceFn(() => {
  if (!autoRun.value) return
  run()
}, 150)

watch([sourceText, pattern, normalizedFlags, replacement], () => {
  debouncedRun()
})

watch(autoRun, (enabled) => {
  if (enabled) {
    run()
  }
})

function run(): void {
  if (!pattern.value || !sourceText.value) {
    clearResults()
    return
  }

  if (compiledRegex.value.error || !compiledRegex.value.regex) {
    clearResults()
    return
  }

  const regex = compiledRegex.value.regex
  const { matches: found, truncated } = collectMatches(
    sourceText.value,
    new RegExp(regex.source, regex.flags),
    matchLimit,
  )

  matches.value = found
  matchesTruncated.value = truncated
  replaceOutput.value = replaceText(
    sourceText.value,
    new RegExp(regex.source, regex.flags),
    replacement.value,
  )
}

function clearResults(): void {
  matches.value = []
  matchesTruncated.value = false
  replaceOutput.value = ''
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
</script>
