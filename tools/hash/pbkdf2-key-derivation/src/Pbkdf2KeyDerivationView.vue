<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Pbkdf2Form
      v-model:password="password"
      v-model:salt="salt"
      v-model:salt-format="saltFormat"
      v-model:algorithm="algorithm"
      v-model:iterations="iterationsInput"
      v-model:length="lengthInput"
      :iterations-min="minIterations"
      :iterations-max="maxIterations"
      :length-min="minLength"
      :length-max="maxLength"
      :iterations-valid="iterationsState.isValid"
      :length-valid="lengthState.isValid"
      :salt-error-type="saltErrorType"
    />

    <Pbkdf2Result
      :password="password"
      :salt="salt"
      :salt-format="saltFormat"
      :algorithm="algorithm"
      :iterations="iterationsState.value"
      :length="lengthState.value"
      :iterations-valid="iterationsState.isValid"
      :length-valid="lengthState.isValid"
      :salt-error-type="saltErrorType"
    />

    <WhatIsPBKDF2 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import { isValidBase16 } from '@utils/base16'
import type { Pbkdf2Algorithm, SaltFormat } from './types'
import { isValidBase64 } from './utils'
import Pbkdf2Form from './components/Pbkdf2Form.vue'
import Pbkdf2Result from './components/Pbkdf2Result.vue'
import WhatIsPBKDF2 from './components/WhatIsPBKDF2.vue'

const minIterations = 1
const maxIterations = 1000000
const defaultIterations = 100000

const minLength = 16
const maxLength = 256
const defaultLength = 32

const password = ref('')
const salt = ref<string | File>('')

const algorithm = useStorage<Pbkdf2Algorithm>('tools:pbkdf2-key-derivation:algorithm', 'SHA-256')
const saltFormat = useStorage<SaltFormat>('tools:pbkdf2-key-derivation:salt-format', 'utf-8')
const iterationsInput = useStorage<number | null>(
  'tools:pbkdf2-key-derivation:iterations',
  defaultIterations,
)
const lengthInput = useStorage<number | null>('tools:pbkdf2-key-derivation:length', defaultLength)

const parseIntegerRange = (value: number | null, min: number, max: number, fallback: number) => {
  if (value === null) {
    return { value: fallback, isValid: true }
  }

  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { value: fallback, isValid: false }
  }

  if (value < min || value > max) {
    return { value: fallback, isValid: false }
  }

  return { value, isValid: true }
}

const iterationsState = computed(() =>
  parseIntegerRange(iterationsInput.value, minIterations, maxIterations, defaultIterations),
)
const lengthState = computed(() =>
  parseIntegerRange(lengthInput.value, minLength, maxLength, defaultLength),
)

const saltErrorType = computed((): '' | 'hex' | 'base64' => {
  const saltValue = salt.value
  if (saltValue instanceof File) return ''

  const value = saltValue.trim()
  if (!value) return ''

  if (saltFormat.value === 'hex' && !isValidBase16(value)) {
    return 'hex'
  }

  if (saltFormat.value === 'base64' && !isValidBase64(value)) {
    return 'base64'
  }

  return ''
})
</script>
