<template>
  <JwkPemJwkInputSection v-model="jwkInput" :accept="jwkAccept" :status="jwkInputStatus" />
  <JwkPemKeySelectSection v-model="selectedJwkIndex" :keys="jwkKeys" />
  <JwkPemOutputTypeSection v-model="jwkOutputType" />
  <JwkPemErrorAlert :error="jwkError" />
  <JwkPemOutputSection
    :output="jwkOutput"
    :download-url="jwkDownloadUrl"
    :download-name="jwkDownloadName"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { computedAsync, useDebounce, useObjectUrl, useStorage } from '@vueuse/core'
import { type PemOutputType, jwkToPem, parseJwkJson } from '../utils/jwkPem'
import JwkPemErrorAlert from './JwkPemErrorAlert.vue'
import JwkPemJwkInputSection from './JwkPemJwkInputSection.vue'
import JwkPemKeySelectSection from './JwkPemKeySelectSection.vue'
import JwkPemOutputSection from './JwkPemOutputSection.vue'
import JwkPemOutputTypeSection from './JwkPemOutputTypeSection.vue'

const defaultJwkInput = `{
  "crv": "Ed25519",
  "d": "IPR8baukbPNU-nM57_prOTFvP9b9QTXY6JYLO1mbWR4",
  "x": "cc2GnZtI8l9tvVNwDyRRebvDto9_DLG9_Zvm4XODEKE",
  "kty": "OKP"
}`

const jwkAccept = '.json,.jwk,.txt'

const storedJwkInput = useStorage('tools:jwk-pem-converter:jwk-input', defaultJwkInput)
const jwkInput = ref<string | File>(storedJwkInput.value)

watch(jwkInput, (value) => {
  if (typeof value === 'string') {
    storedJwkInput.value = value
  }
})

const jwkOutputType = useStorage<PemOutputType>('tools:jwk-pem-converter:output-type', 'private')
const selectedJwkIndex = ref(0)

const debouncedJwkInput = useDebounce(jwkInput, 150)

const jwkParseState = computedAsync(
  async () => {
    const text = await readInputText(debouncedJwkInput.value)
    if (!text.trim()) {
      return { state: 'empty', keys: [] as JsonWebKey[], error: null } as const
    }
    try {
      const keys = parseJwkJson(text)
      return { state: 'parsed', keys, error: null } as const
    } catch (error) {
      return { state: 'error', keys: [] as JsonWebKey[], error } as const
    }
  },
  { state: 'empty', keys: [] as JsonWebKey[], error: null } as const,
)

const jwkKeys = computed(() =>
  jwkParseState.value.state === 'parsed' ? jwkParseState.value.keys : [],
)

watch(jwkKeys, (keys) => {
  if (selectedJwkIndex.value >= keys.length) {
    selectedJwkIndex.value = 0
  }
})

const jwkConversionState = computedAsync(
  async () => {
    if (jwkParseState.value.state !== 'parsed') {
      return { state: 'empty', pem: '', error: null } as const
    }
    const key = jwkKeys.value[selectedJwkIndex.value] ?? jwkKeys.value[0]
    if (!key) {
      return { state: 'empty', pem: '', error: null } as const
    }
    try {
      const pem = await jwkToPem(key, jwkOutputType.value)
      return { state: 'ready', pem, error: null } as const
    } catch (error) {
      return { state: 'error', pem: '', error } as const
    }
  },
  { state: 'empty', pem: '', error: null } as const,
)

const jwkError = computed(() => {
  if (jwkParseState.value.state === 'error') return jwkParseState.value.error
  if (jwkConversionState.value.state === 'error') return jwkConversionState.value.error
  return null
})

const jwkOutput = computed(() =>
  jwkConversionState.value.state === 'ready' ? jwkConversionState.value.pem : '',
)

const jwkDownloadBlob = computed(() =>
  jwkOutput.value ? new Blob([jwkOutput.value], { type: 'application/x-pem-file' }) : null,
)
const jwkDownloadUrl = useObjectUrl(jwkDownloadBlob)
const jwkDownloadName = computed(() =>
  jwkOutputType.value === 'public' ? 'public-key.pem' : 'private-key.pem',
)

const jwkInputStatus = computed(() => {
  if (jwkParseState.value.state === 'error' || jwkConversionState.value.state === 'error') {
    return 'error'
  }
  if (jwkParseState.value.state === 'parsed' && jwkOutput.value) return 'success'
  return undefined
})

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
