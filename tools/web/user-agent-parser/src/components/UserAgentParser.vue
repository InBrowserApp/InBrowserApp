<template>
  <UserAgentInputPanel
    v-model:userAgent="userAgent"
    :input-status="inputStatus"
    :input-error="inputError"
    :can-use-current="canUseCurrent"
    :has-output="hasOutput"
    :rendered-json="renderedJson"
    @use-current="useCurrentUserAgent"
  />

  <UserAgentParsedDetails :parsed-result="parsedResult" />
</template>

<script setup lang="ts">
import type { FormValidationStatus } from 'naive-ui'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import UAParser from 'ua-parser-js'
import UserAgentInputPanel from './UserAgentInputPanel.vue'
import UserAgentParsedDetails from './UserAgentParsedDetails.vue'

const defaultUserAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
const userAgent = useStorage('tools:user-agent-parser:input', defaultUserAgent)

const canUseCurrent = computed(() => typeof navigator !== 'undefined')
const hasInput = computed(() => userAgent.value.trim().length > 0)
const inputError = computed(() => !hasInput.value)
const inputStatus = computed<FormValidationStatus | undefined>(() =>
  inputError.value ? 'error' : undefined,
)

const parsedResult = computed(() => {
  if (!hasInput.value) return null
  const parser = new UAParser(userAgent.value)
  return parser.getResult()
})

const normalizedResult = computed(() => {
  if (!parsedResult.value) return null
  const { browser, engine, os, device, cpu, ua } = parsedResult.value
  return {
    ua: ua || userAgent.value,
    browser,
    os,
    engine,
    device,
    cpu,
  }
})

const hasOutput = computed(() => Boolean(normalizedResult.value))
const renderedJson = computed(() =>
  normalizedResult.value ? JSON.stringify(normalizedResult.value, null, 2) : '',
)

function useCurrentUserAgent() {
  if (typeof navigator === 'undefined') return
  userAgent.value = navigator.userAgent
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
