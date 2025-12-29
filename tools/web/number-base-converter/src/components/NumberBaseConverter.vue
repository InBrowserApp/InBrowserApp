<template>
  <n-grid cols="1 s:2 l:3" :x-gap="24" :y-gap="24" responsive="screen">
    <n-gi>
      <BaseInput
        :label="t('binary')"
        v-model="binary"
        :status="binaryStatus"
        :placeholder="t('enterBinary')"
        @update:model-value="onInput('binary', $event)"
      />
    </n-gi>
    <n-gi>
      <BaseInput
        :label="t('octal')"
        v-model="octal"
        :status="octalStatus"
        :placeholder="t('enterOctal')"
        @update:model-value="onInput('octal', $event)"
      />
    </n-gi>
    <n-gi>
      <BaseInput
        :label="t('decimal')"
        v-model="decimal"
        :status="decimalStatus"
        :placeholder="t('enterDecimal')"
        @update:model-value="onInput('decimal', $event)"
      />
    </n-gi>
    <n-gi>
      <BaseInput
        :label="t('hex')"
        v-model="hex"
        :status="hexStatus"
        :placeholder="t('enterHex')"
        @update:model-value="onInput('hex', $event)"
      />
    </n-gi>
    <n-gi>
      <BaseInput
        :label="t('base32')"
        v-model="base32"
        :status="base32Status"
        :placeholder="t('enterBase32')"
        @update:model-value="onInput('base32', $event)"
      />
    </n-gi>
    <n-gi>
      <BaseInput
        :label="t('base36')"
        v-model="base36"
        :status="base36Status"
        :placeholder="t('enterBase36')"
        @update:model-value="onInput('base36', $event)"
      />
    </n-gi>
    <n-gi>
      <BaseInput
        :label="t('base62')"
        v-model="base62"
        :status="base62Status"
        :placeholder="t('enterBase62')"
        @update:model-value="onInput('base62', $event)"
      />
    </n-gi>
    <n-gi>
      <BaseInput
        :label="t('base64')"
        v-model="base64"
        :status="base64Status"
        :placeholder="t('enterBase64')"
        @update:model-value="onInput('base64', $event)"
      />
    </n-gi>
    <n-gi>
      <ToolSection>
        <n-flex justify="space-between" align="center" class="section-header">
          <n-flex align="center" :size="8">
            <span class="section-title">{{ t('customBase') }}</span>
            <n-input-number
              v-model:value="customBaseValue"
              :min="2"
              :max="64"
              size="small"
              class="base-input"
            />
          </n-flex>
          <CopyToClipboardButton :content="custom" size="small" />
        </n-flex>
        <n-input
          v-model:value="custom"
          :status="customStatus"
          :placeholder="t('enterCustom')"
          class="monospace-input"
          @update:value="onInput('custom', $event)"
        />
      </ToolSection>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NGrid, NGi, NInput, NInputNumber, NFlex } from 'naive-ui'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import BaseInput from './BaseInput.vue'
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

const { t } = useI18n()

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
  "en": {
    "binary": "Binary (Base 2)",
    "octal": "Octal (Base 8)",
    "decimal": "Decimal (Base 10)",
    "hex": "Hexadecimal (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Custom Base",
    "enterBinary": "Enter binary...",
    "enterOctal": "Enter octal...",
    "enterDecimal": "Enter decimal...",
    "enterHex": "Enter hex...",
    "enterBase32": "Enter base32...",
    "enterBase36": "Enter base36...",
    "enterBase62": "Enter base62...",
    "enterBase64": "Enter base64...",
    "enterCustom": "Enter number..."
  },
  "zh": {
    "binary": "二进制 (Base 2)",
    "octal": "八进制 (Base 8)",
    "decimal": "十进制 (Base 10)",
    "hex": "十六进制 (Base 16)",
    "base32": "32 进制",
    "base36": "36 进制",
    "base62": "62 进制",
    "base64": "64 进制",
    "customBase": "自定义进制",
    "enterBinary": "输入二进制...",
    "enterOctal": "输入八进制...",
    "enterDecimal": "输入十进制...",
    "enterHex": "输入十六进制...",
    "enterBase32": "输入 32 进制...",
    "enterBase36": "输入 36 进制...",
    "enterBase62": "输入 62 进制...",
    "enterBase64": "输入 64 进制...",
    "enterCustom": "输入数字..."
  }
}
</i18n>

<style scoped>
.section-header {
  margin-bottom: 8px;
}

.section-title {
  font-weight: 500;
  font-size: 14px;
}

.base-input {
  width: 90px;
}

.monospace-input :deep(input) {
  font-family: var(--n-font-family-mono, monospace);
}
</style>
