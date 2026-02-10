<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <Argon2Form
      v-model:password="password"
      v-model:secret="secret"
      v-model:algorithm="algorithm"
      v-model:iterations="iterationsInput"
      v-model:memory-size="memorySizeInput"
      v-model:parallelism="parallelismInput"
      v-model:hash-length="hashLengthInput"
      v-model:salt="salt"
      :iterations-min="minIterations"
      :iterations-max="maxIterations"
      :memory-min="minMemorySize"
      :memory-max="maxMemorySize"
      :parallelism-min="minParallelism"
      :parallelism-max="maxParallelism"
      :hash-length-min="minHashLength"
      :hash-length-max="maxHashLength"
      :iterations-valid="iterationsState.isValid"
      :memory-valid="memoryState.isValid"
      :parallelism-valid="parallelismState.isValid"
      :hash-length-valid="hashLengthState.isValid"
      :memory-dependency-valid="memoryDependencyValid"
      :salt-error-type="saltErrorType"
      @generate-salt="generateRandomSalt"
    />

    <Argon2Result
      :password="password"
      :secret="secret"
      :algorithm="algorithm"
      :salt="salt.trim()"
      :iterations="iterationsState.value"
      :memory-size="memoryState.value"
      :parallelism="parallelismState.value"
      :hash-length="hashLengthState.value"
      :config-valid="configValid"
    />

    <WhatIsArgon2 />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import type { Argon2Algorithm } from './types'
import { bytesToBase64, generateRandomSaltBytes, isValidBase64 } from './utils'
import Argon2Form from './components/Argon2Form.vue'
import Argon2Result from './components/Argon2Result.vue'
import WhatIsArgon2 from './WhatIsArgon2.vue'

const minIterations = 1
const maxIterations = 12
const defaultIterations = 3

const minParallelism = 1
const maxParallelism = 16
const defaultParallelism = 1

const minMemorySize = 8
const maxMemorySize = 1048576
const defaultMemorySize = 512

const minHashLength = 4
const maxHashLength = 64
const defaultHashLength = 32

const password = ref('')
const secret = ref('')

const algorithm = useStorage<Argon2Algorithm>('tools:argon2-hash-password:algorithm', 'argon2id')
const iterationsInput = useStorage<number | null>(
  'tools:argon2-hash-password:iterations',
  defaultIterations,
)
const memorySizeInput = useStorage<number | null>(
  'tools:argon2-hash-password:memory-size',
  defaultMemorySize,
)
const parallelismInput = useStorage<number | null>(
  'tools:argon2-hash-password:parallelism',
  defaultParallelism,
)
const hashLengthInput = useStorage<number | null>(
  'tools:argon2-hash-password:hash-length',
  defaultHashLength,
)
const salt = useStorage('tools:argon2-hash-password:salt', '')

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
const parallelismState = computed(() =>
  parseIntegerRange(parallelismInput.value, minParallelism, maxParallelism, defaultParallelism),
)
const memoryState = computed(() =>
  parseIntegerRange(memorySizeInput.value, minMemorySize, maxMemorySize, defaultMemorySize),
)
const hashLengthState = computed(() =>
  parseIntegerRange(hashLengthInput.value, minHashLength, maxHashLength, defaultHashLength),
)

const memoryDependencyValid = computed(
  () => memoryState.value.value >= parallelismState.value.value * 8,
)

const saltErrorType = computed((): '' | 'required' | 'base64' => {
  const value = salt.value.trim()
  if (!value) return 'required'
  if (!isValidBase64(value)) return 'base64'
  return ''
})

const configValid = computed(() => {
  return (
    iterationsState.value.isValid &&
    parallelismState.value.isValid &&
    memoryState.value.isValid &&
    memoryDependencyValid.value &&
    hashLengthState.value.isValid &&
    !saltErrorType.value
  )
})

function generateRandomSalt() {
  salt.value = bytesToBase64(generateRandomSaltBytes())
}
</script>
