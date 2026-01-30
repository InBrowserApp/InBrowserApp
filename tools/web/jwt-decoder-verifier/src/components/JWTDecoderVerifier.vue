<template>
  <div>
    <JWTTokenInput v-model:value="tokenInput" :placeholder="jwtPlaceholder" />

    <JWTDecodedSection :decoded-header="decodedHeader" :decoded-payload="decodedPayload" />

    <JWTVerifySettings v-model:secret="secret" v-model:alg="alg" />
    <JWTVerificationSection
      :token="normalizedToken"
      :secret="secret"
      :alg="alg"
      :decoded-header="decodedHeader"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import JWTTokenInput from './JWTTokenInput.vue'
import JWTVerifySettings from './JWTVerifySettings.vue'
import JWTDecodedSection from './JWTDecodedSection.vue'
import JWTVerificationSection from './JWTVerificationSection.vue'
import { decode } from 'hono/jwt'
import { useStorage } from '@vueuse/core'

const jwtPlaceholder =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyIiwicm9sZSI6ImFkbWluIn0.Ds9haC0uAzNBPv5XixZeIOInFNxCJfmeCjNnN1rPlNs'
const tokenInput = useStorage<string>('tools:jwt-decoder-verifier:token', jwtPlaceholder)

type AlgorithmType =
  | 'auto'
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'EdDSA'

const alg = useStorage<AlgorithmType>('tools:jwt-decoder-verifier:alg', 'auto')
const secret = useStorage('tools:jwt-decoder-verifier:secret', '')

const normalizedToken = computed(() => tokenInput.value.trim())

const decodedHeader = computed(() => {
  try {
    if (!normalizedToken.value) return null
    return decode(normalizedToken.value)?.header ?? null
  } catch {
    return null
  }
})

const decodedPayload = computed(() => {
  try {
    if (!normalizedToken.value) return null
    return decode(normalizedToken.value)?.payload ?? null
  } catch {
    return null
  }
})
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
