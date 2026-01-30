<template>
  <n-grid cols="1 s:2 l:3" :x-gap="24" :y-gap="24" responsive="screen">
    <NumberBasePrimaryInputs
      :binary="binary"
      :binary-status="binaryStatus"
      :octal="octal"
      :octal-status="octalStatus"
      :decimal="decimal"
      :decimal-status="decimalStatus"
      :hex="hex"
      :hex-status="hexStatus"
      :on-input="onInput"
    />
    <NumberBaseExtendedInputs
      :base32="base32"
      :base32-status="base32Status"
      :base36="base36"
      :base36-status="base36Status"
      :base62="base62"
      :base62-status="base62Status"
      :base64="base64"
      :base64-status="base64Status"
      :on-input="onInput"
    />
    <NumberBaseCustomInput
      v-model:custom-base-value="customBaseValue"
      :custom="custom"
      :custom-status="customStatus"
      :on-input="onInput"
    />
  </n-grid>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NGrid } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import NumberBasePrimaryInputs from './NumberBasePrimaryInputs.vue'
import NumberBaseExtendedInputs from './NumberBaseExtendedInputs.vue'
import NumberBaseCustomInput from './NumberBaseCustomInput.vue'
import {
  isValidBinary,
  isValidOctal,
  isValidDecimal,
  isValidHex,
  isValidBase32,
  isValidBase36,
  isValidBase62,
  isValidBase64,
  isValidForBase,
  parseBinary,
  parseOctal,
  parseDecimal,
  parseHex,
  parseBase32,
  parseBase36,
  parseBase62,
  parseBase64Num,
  parseBase,
  toBinary,
  toOctal,
  toDecimal,
  toHex,
  toBase32,
  toBase36,
  toBase62,
  toBase64Num,
  toBase,
} from '../utils'

type BaseType =
  | 'binary'
  | 'octal'
  | 'decimal'
  | 'hex'
  | 'base32'
  | 'base36'
  | 'base62'
  | 'base64'
  | 'custom'

const binary = ref('')
const octal = ref('')
const decimal = useStorage('tools:number-base-converter:decimal', '')
const hex = ref('')
const base32 = ref('')
const base36 = ref('')
const base62 = ref('')
const base64 = ref('')
const custom = ref('')
const customBaseValue = useStorage('tools:number-base-converter:custom-base', 58)

const editSource = ref<BaseType | null>(null)

const binaryStatus = computed(() => {
  if (!binary.value) return undefined
  return isValidBinary(binary.value) ? undefined : 'error'
})

const octalStatus = computed(() => {
  if (!octal.value) return undefined
  return isValidOctal(octal.value) ? undefined : 'error'
})

const decimalStatus = computed(() => {
  if (!decimal.value) return undefined
  return isValidDecimal(decimal.value) ? undefined : 'error'
})

const hexStatus = computed(() => {
  if (!hex.value) return undefined
  return isValidHex(hex.value) ? undefined : 'error'
})

const base32Status = computed(() => {
  if (!base32.value) return undefined
  return isValidBase32(base32.value) ? undefined : 'error'
})

const base36Status = computed(() => {
  if (!base36.value) return undefined
  return isValidBase36(base36.value) ? undefined : 'error'
})

const base62Status = computed(() => {
  if (!base62.value) return undefined
  return isValidBase62(base62.value) ? undefined : 'error'
})

const base64Status = computed(() => {
  if (!base64.value) return undefined
  return isValidBase64(base64.value) ? undefined : 'error'
})

const customStatus = computed(() => {
  if (!custom.value) return undefined
  return isValidForBase(custom.value, customBaseValue.value) ? undefined : 'error'
})

function onInput(source: BaseType, value: string) {
  editSource.value = source
  switch (source) {
    case 'binary':
      binary.value = value
      break
    case 'octal':
      octal.value = value
      break
    case 'decimal':
      decimal.value = value
      break
    case 'hex':
      hex.value = value
      break
    case 'base32':
      base32.value = value
      break
    case 'base36':
      base36.value = value
      break
    case 'base62':
      base62.value = value
      break
    case 'base64':
      base64.value = value
      break
    case 'custom':
      custom.value = value
      break
  }
}

function updateAllFromBigInt(n: bigint, source: BaseType) {
  if (source !== 'binary') binary.value = toBinary(n)
  if (source !== 'octal') octal.value = toOctal(n)
  if (source !== 'decimal') decimal.value = toDecimal(n)
  if (source !== 'hex') hex.value = toHex(n)
  if (source !== 'base32') base32.value = toBase32(n)
  if (source !== 'base36') base36.value = toBase36(n)
  if (source !== 'base62') base62.value = toBase62(n)
  if (source !== 'base64') base64.value = toBase64Num(n)
  if (source !== 'custom') custom.value = toBase(n, customBaseValue.value)
}

function clearAll(source: BaseType) {
  if (source !== 'binary') binary.value = ''
  if (source !== 'octal') octal.value = ''
  if (source !== 'decimal') decimal.value = ''
  if (source !== 'hex') hex.value = ''
  if (source !== 'base32') base32.value = ''
  if (source !== 'base36') base36.value = ''
  if (source !== 'base62') base62.value = ''
  if (source !== 'base64') base64.value = ''
  if (source !== 'custom') custom.value = ''
}

function handleSourceChange(source: BaseType, value: string, parser: (v: string) => bigint | null) {
  if (editSource.value !== source) return
  if (!value) {
    clearAll(source)
    return
  }
  const n = parser(value)
  if (n !== null) {
    updateAllFromBigInt(n, source)
  }
}

watch(binary, (v) => handleSourceChange('binary', v, parseBinary))
watch(octal, (v) => handleSourceChange('octal', v, parseOctal))
watch(decimal, (v) => handleSourceChange('decimal', v, parseDecimal))
watch(hex, (v) => handleSourceChange('hex', v, parseHex))
watch(base32, (v) => handleSourceChange('base32', v, parseBase32))
watch(base36, (v) => handleSourceChange('base36', v, parseBase36))
watch(base62, (v) => handleSourceChange('base62', v, parseBase62))
watch(base64, (v) => handleSourceChange('base64', v, parseBase64Num))
watch(custom, (v) =>
  handleSourceChange('custom', v, (val) => parseBase(val, customBaseValue.value)),
)

// When custom base changes, recalculate custom field from decimal
watch(customBaseValue, () => {
  if (decimal.value) {
    const n = parseDecimal(decimal.value)
    if (n !== null) {
      custom.value = toBase(n, customBaseValue.value)
    }
  }
})

// Initialize from stored decimal value on mount
if (decimal.value) {
  editSource.value = 'decimal'
  const n = parseDecimal(decimal.value)
  if (n !== null) {
    updateAllFromBigInt(n, 'decimal')
  }
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
