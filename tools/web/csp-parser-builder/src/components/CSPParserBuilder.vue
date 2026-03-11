<template>
  <div>
    <CSPPresetsSection
      v-model:delivery="delivery"
      v-model:mode="mode"
      @apply-preset="applyPreset"
    />

    <CSPInputSection
      v-model:value="rawInput"
      :detected-input-kind="parseResult.inputKind"
      :status="inputStatus"
      :feedback="inputFeedback"
      :import-from-file="importFromFile"
      :apply-sample="applySample"
      :clear-input="clearInput"
    />

    <CSPDiagnosticsSection :diagnostics="combinedDiagnostics" />

    <CSPDirectivesSection v-model:directives="workingDirectives" />

    <CSPOutputSection
      :policy-value="policyValue"
      :header-value="headerValue"
      :meta-value="metaValue"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { fileOpen } from 'browser-fs-access'
import {
  clonePolicy,
  createEmptyPolicy,
  diagnoseContentSecurityPolicy,
  getPresetPolicy,
  parseContentSecurityPolicy,
  serializeContentSecurityPolicy,
} from '@utils/csp'
import type {
  CSPDelivery,
  CSPDiagnostic,
  CSPDirective,
  CSPMode,
  CSPPolicy,
  CSPPresetID,
} from '@utils/csp'
import CSPDiagnosticsSection from './CSPDiagnosticsSection.vue'
import CSPDirectivesSection from './CSPDirectivesSection.vue'
import CSPInputSection from './CSPInputSection.vue'
import CSPOutputSection from './CSPOutputSection.vue'
import CSPPresetsSection from './CSPPresetsSection.vue'

const sampleInput =
  "Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"

const rawInput = useStorage<string>('tools:csp-parser-builder:input', sampleInput)
const delivery = useStorage<CSPDelivery>('tools:csp-parser-builder:delivery', 'header')
const mode = useStorage<CSPMode>('tools:csp-parser-builder:mode', 'enforce')
const workingPolicy = ref<CSPPolicy>(createEmptyPolicy())

const parseResult = computed(() => parseContentSecurityPolicy(rawInput.value))

watch(
  rawInput,
  () => {
    workingPolicy.value = clonePolicy(parseResult.value.policy)
    if (parseResult.value.inputKind === 'meta') {
      delivery.value = 'meta'
      mode.value = 'enforce'
      return
    }

    if (parseResult.value.inputKind === 'header') {
      delivery.value = 'header'
      mode.value = parseResult.value.mode
    }
  },
  { immediate: true },
)

const workingDirectives = computed<CSPDirective[]>({
  get: () => workingPolicy.value.directives,
  set: (value) => {
    workingPolicy.value = { directives: value.filter((directive) => directive.name) }
  },
})

const derivedDiagnostics = computed(() =>
  diagnoseContentSecurityPolicy(workingPolicy.value, {
    delivery: delivery.value,
    mode: mode.value,
  }),
)

const combinedDiagnostics = computed<CSPDiagnostic[]>(() => {
  const all = [...parseResult.value.diagnostics, ...derivedDiagnostics.value]
  const seen = new Set<string>()
  return all.filter((diagnostic) => {
    const key = `${diagnostic.code}:${diagnostic.directive ?? ''}:${diagnostic.token ?? ''}:${diagnostic.message}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

const inputStatus = computed(() => {
  if (!rawInput.value.trim()) return undefined
  return parseResult.value.diagnostics.some((diagnostic) => diagnostic.severity === 'error')
    ? 'error'
    : 'success'
})

const inputFeedback = computed(
  () =>
    parseResult.value.diagnostics.find((diagnostic) => diagnostic.severity === 'error')?.message ??
    '',
)

const policyValue = computed(() =>
  serializeContentSecurityPolicy(workingPolicy.value, {
    format: 'policy',
  }),
)

const headerValue = computed(() =>
  serializeContentSecurityPolicy(workingPolicy.value, {
    format: 'header',
    mode: mode.value,
  }),
)

const metaValue = computed(() =>
  serializeContentSecurityPolicy(workingPolicy.value, {
    format: 'meta',
  }),
)

function applyPreset(id: CSPPresetID): void {
  const presetPolicy = getPresetPolicy(id)
  if (!presetPolicy) return

  rawInput.value = serializeContentSecurityPolicy(parseContentSecurityPolicy(presetPolicy).policy, {
    format: delivery.value === 'meta' ? 'meta' : 'header',
    mode: id === 'report-only-audit' ? 'report-only' : mode.value,
  })

  if (id === 'report-only-audit') {
    mode.value = 'report-only'
  }
}

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({
      extensions: ['.txt', '.html'],
    })
    rawInput.value = await file.text()
  } catch {
    // User cancelled file selection.
  }
}

function applySample(): void {
  rawInput.value = sampleInput
}

function clearInput(): void {
  rawInput.value = ''
}
</script>
