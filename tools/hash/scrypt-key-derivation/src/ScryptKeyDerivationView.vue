<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ScryptForm
      v-model:password="password"
      v-model:salt="salt"
      v-model:salt-format="saltFormat"
      v-model:cost-factor="costFactorInput"
      v-model:block-size="blockSizeInput"
      v-model:parallelism="parallelismInput"
      v-model:length="lengthInput"
      :cost-factor-min="minCostFactor"
      :cost-factor-max="maxCostFactor"
      :block-size-min="minBlockSize"
      :block-size-max="maxBlockSize"
      :parallelism-min="minParallelism"
      :parallelism-max="maxParallelism"
      :length-min="minLength"
      :length-max="maxLength"
      :cost-factor-valid="costFactorValid"
      :cost-factor-power-of-two="costFactorPowerOfTwo"
      :block-size-valid="blockSizeState.isValid"
      :parallelism-valid="parallelismState.isValid"
      :length-valid="lengthState.isValid"
      :salt-error-type="saltErrorType"
    />

    <ScryptResult
      :password="password"
      :salt="salt"
      :salt-format="saltFormat"
      :cost-factor="costFactorState.value"
      :block-size="blockSizeState.value"
      :parallelism="parallelismState.value"
      :length="lengthState.value"
      :cost-factor-valid="costFactorValid"
      :block-size-valid="blockSizeState.isValid"
      :parallelism-valid="parallelismState.isValid"
      :length-valid="lengthState.isValid"
      :salt-error-type="saltErrorType"
    />

    <WhatIsScrypt />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import { isValidBase16 } from '@utils/base16'
import type { SaltFormat } from './types'
import { isValidBase64 } from './utils'
import ScryptForm from './components/ScryptForm.vue'
import ScryptResult from './components/ScryptResult.vue'
import WhatIsScrypt from './components/WhatIsScrypt.vue'

const minCostFactor = 1024
const maxCostFactor = 1048576
const defaultCostFactor = 16384

const minBlockSize = 1
const maxBlockSize = 32
const defaultBlockSize = 8

const minParallelism = 1
const maxParallelism = 16
const defaultParallelism = 1

const minLength = 16
const maxLength = 256
const defaultLength = 32

const password = ref('')
const salt = ref<string | File>('')

const saltFormat = useStorage<SaltFormat>('tools:scrypt-key-derivation:salt-format', 'utf-8')
const costFactorInput = useStorage<number | null>(
  'tools:scrypt-key-derivation:cost-factor',
  defaultCostFactor,
)
const blockSizeInput = useStorage<number | null>(
  'tools:scrypt-key-derivation:block-size',
  defaultBlockSize,
)
const parallelismInput = useStorage<number | null>(
  'tools:scrypt-key-derivation:parallelism',
  defaultParallelism,
)
const lengthInput = useStorage<number | null>('tools:scrypt-key-derivation:length', defaultLength)

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

const isPowerOfTwo = (value: number): boolean => value > 1 && (value & (value - 1)) === 0

const costFactorState = computed(() =>
  parseIntegerRange(costFactorInput.value, minCostFactor, maxCostFactor, defaultCostFactor),
)
const blockSizeState = computed(() =>
  parseIntegerRange(blockSizeInput.value, minBlockSize, maxBlockSize, defaultBlockSize),
)
const parallelismState = computed(() =>
  parseIntegerRange(parallelismInput.value, minParallelism, maxParallelism, defaultParallelism),
)
const lengthState = computed(() =>
  parseIntegerRange(lengthInput.value, minLength, maxLength, defaultLength),
)

const costFactorPowerOfTwo = computed(() => isPowerOfTwo(costFactorState.value.value))
const costFactorValid = computed(() => costFactorState.value.isValid && costFactorPowerOfTwo.value)

const saltErrorType = computed((): '' | 'hex' | 'base64' => {
  const saltValue = salt.value
  if (typeof saltValue !== 'string') return ''

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
