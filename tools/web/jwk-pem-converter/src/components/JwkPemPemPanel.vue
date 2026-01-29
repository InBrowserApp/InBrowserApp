<template>
  <JwkPemPemInputSection v-model="pemInput" :accept="pemAccept" :status="pemInputStatus" />
  <JwkPemPrettyJsonSection v-model="prettyJson" />
  <JwkPemErrorAlert :error="pemError" />
  <JwkPemWarningsAlert :warnings="pemWarnings" />
  <JwkPemOutputSection
    :output="pemOutput"
    :download-url="pemDownloadUrl"
    :download-name="pemDownloadName"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { computedAsync, useDebounce, useObjectUrl, useStorage } from '@vueuse/core'
import { pemToJwk } from '../utils/jwkPem'
import JwkPemErrorAlert from './JwkPemErrorAlert.vue'
import JwkPemOutputSection from './JwkPemOutputSection.vue'
import JwkPemPemInputSection from './JwkPemPemInputSection.vue'
import JwkPemPrettyJsonSection from './JwkPemPrettyJsonSection.vue'
import JwkPemWarningsAlert from './JwkPemWarningsAlert.vue'

const defaultPemInput = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEICD0fG2rpGzzVPpzOe/6azkxbz/W/UE12OiWCztZm1ke
-----END PRIVATE KEY-----`

const pemAccept = '.pem,.key,.pub,.txt'

const storedPemInput = useStorage('tools:jwk-pem-converter:pem-input', defaultPemInput)
const pemInput = ref<string | File>(storedPemInput.value)

watch(pemInput, (value) => {
  if (typeof value === 'string') {
    storedPemInput.value = value
  }
})

const prettyJson = useStorage('tools:jwk-pem-converter:pretty-json', true)

const debouncedPemInput = useDebounce(pemInput, 150)

const pemConversionState = computedAsync(
  async () => {
    const text = await readInputText(debouncedPemInput.value)
    if (!text.trim()) {
      return { state: 'empty', output: '', warnings: [], error: null } as const
    }
    try {
      const result = await pemToJwk(text)
      const output = JSON.stringify(result.jwk, null, prettyJson.value ? 2 : undefined)
      return { state: 'ready', output, warnings: result.warnings, error: null } as const
    } catch (error) {
      return { state: 'error', output: '', warnings: [], error } as const
    }
  },
  { state: 'empty', output: '', warnings: [], error: null } as const,
)

const pemOutput = computed(() =>
  pemConversionState.value.state === 'ready' ? pemConversionState.value.output : '',
)

const pemWarnings = computed(() =>
  pemConversionState.value.state === 'ready' ? pemConversionState.value.warnings : [],
)

const pemDownloadBlob = computed(() =>
  pemOutput.value ? new Blob([pemOutput.value], { type: 'application/json' }) : null,
)
const pemDownloadUrl = useObjectUrl(pemDownloadBlob)
const pemDownloadName = computed(() => 'key.jwk.json')

const pemInputStatus = computed(() => {
  if (pemConversionState.value.state === 'error') return 'error'
  if (pemConversionState.value.state === 'ready' && pemOutput.value) return 'success'
  return undefined
})

const pemError = computed(() =>
  pemConversionState.value.state === 'error' ? pemConversionState.value.error : null,
)

async function readInputText(value: string | File): Promise<string> {
  if (typeof value === 'string') {
    return value
  }
  return await value.text()
}
</script>

<i18n lang="json">
{
  "en": {},
  "zh": {},
  "zh-CN": {},
  "zh-TW": {},
  "zh-HK": {},
  "es": {},
  "fr": {},
  "de": {},
  "it": {},
  "ja": {},
  "ko": {},
  "ru": {},
  "pt": {},
  "ar": {},
  "hi": {},
  "tr": {},
  "nl": {},
  "sv": {},
  "pl": {},
  "vi": {},
  "th": {},
  "id": {},
  "he": {},
  "ms": {},
  "no": {}
}
</i18n>
