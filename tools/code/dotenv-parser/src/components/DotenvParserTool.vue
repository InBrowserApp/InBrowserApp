<template>
  <DotenvInputSection v-model:value="inputValue" :status="inputStatus" @load-sample="loadSample" />
  <DotenvOptionsSection
    v-model:mode="mode"
    v-model:duplicate-strategy="duplicateStrategy"
    v-model:mask-values="maskValues"
  />
  <DotenvSummaryCards :stats="parseResult.stats" />
  <DotenvDiagnosticsSection :diagnostics="parseResult.diagnostics" />
  <DotenvResultsSection
    v-model:active-tab="activeTab"
    :entries="parseResult.entries"
    :duplicate-count="parseResult.stats.duplicateCount"
    :duplicate-strategy="duplicateStrategy"
    :mask-values="maskValues"
    :json-output="jsonOutput"
    :normalized-output="normalizedOutput"
    :download-json-url="jsonDownloadUrl"
    download-json-name="dotenv.json"
    :download-env-url="envDownloadUrl"
    download-env-name=".env"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { computedAsync, useObjectUrl, useStorage } from '@vueuse/core'
import {
  parseDotenv,
  serializeDotenv,
  toDotenvObject,
  type DotenvDuplicateStrategy,
  type DotenvParserMode,
} from '@utils/dotenv'
import DotenvDiagnosticsSection from './DotenvDiagnosticsSection.vue'
import { getInputStatus } from './dotenv-display'
import DotenvInputSection from './DotenvInputSection.vue'
import DotenvOptionsSection from './DotenvOptionsSection.vue'
import DotenvResultsSection from './DotenvResultsSection.vue'
import DotenvSummaryCards from './DotenvSummaryCards.vue'

const sampleEnv = `# Example .env
APP_NAME="InBrowser App"
API_URL=https://api.example.com
FEATURE_FLAG=true
EMPTY_VALUE=
APP_NAME=InBrowser App Local
BROKEN_LINE`

const inputValue = ref<string | File>('')
const mode = useStorage<DotenvParserMode>('tools:dotenv-parser:mode', 'compatible')
const duplicateStrategy = useStorage<DotenvDuplicateStrategy>(
  'tools:dotenv-parser:duplicate-strategy',
  'last-wins',
)
const maskValues = useStorage('tools:dotenv-parser:mask-values', false)
const activeTab = useStorage<'variables' | 'json' | 'normalized'>(
  'tools:dotenv-parser:active-tab',
  'variables',
)

const sourceText = computedAsync(async () => {
  const current = inputValue.value
  if (typeof current === 'string') return current

  try {
    return await current.text()
  } catch {
    return ''
  }
}, '')

const hasInput = computed(() => sourceText.value.trim().length > 0)

const parseResult = computed(() =>
  hasInput.value
    ? parseDotenv(sourceText.value, {
        mode: mode.value,
        duplicateStrategy: duplicateStrategy.value,
      })
    : parseDotenv(''),
)

const inputStatus = computed(() =>
  getInputStatus(hasInput.value, parseResult.value.stats.invalidLineCount),
)

const jsonOutput = computed(() => {
  if (!hasInput.value) return ''
  return JSON.stringify(
    toDotenvObject(parseResult.value.entries, { maskValues: maskValues.value }),
    null,
    2,
  )
})

const normalizedOutput = computed(() => {
  if (!hasInput.value) return ''
  return serializeDotenv(parseResult.value.entries, { maskValues: maskValues.value })
})

const jsonBlob = computed(() =>
  jsonOutput.value
    ? new Blob([jsonOutput.value], { type: 'application/json;charset=utf-8' })
    : null,
)
const envBlob = computed(() =>
  normalizedOutput.value
    ? new Blob([normalizedOutput.value], { type: 'text/plain;charset=utf-8' })
    : null,
)

const jsonDownloadUrl = useObjectUrl(jsonBlob)
const envDownloadUrl = useObjectUrl(envBlob)

function loadSample() {
  inputValue.value = sampleEnv
}
</script>
