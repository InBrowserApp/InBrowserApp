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
  },
  "zh-CN": {
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
  },
  "zh-TW": {
    "binary": "二進制 (Base 2)",
    "octal": "八進制 (Base 8)",
    "decimal": "十進制 (Base 10)",
    "hex": "十六進制 (Base 16)",
    "base32": "32 進制",
    "base36": "36 進制",
    "base62": "62 進制",
    "base64": "64 進制",
    "customBase": "自訂進制",
    "enterBinary": "輸入二進制...",
    "enterOctal": "輸入八進制...",
    "enterDecimal": "輸入十進制...",
    "enterHex": "輸入十六進制...",
    "enterBase32": "輸入 32 進制...",
    "enterBase36": "輸入 36 進制...",
    "enterBase62": "輸入 62 進制...",
    "enterBase64": "輸入 64 進制...",
    "enterCustom": "輸入數字..."
  },
  "zh-HK": {
    "binary": "二進制 (Base 2)",
    "octal": "八進制 (Base 8)",
    "decimal": "十進制 (Base 10)",
    "hex": "十六進制 (Base 16)",
    "base32": "32 進制",
    "base36": "36 進制",
    "base62": "62 進制",
    "base64": "64 進制",
    "customBase": "自訂進制",
    "enterBinary": "輸入二進制...",
    "enterOctal": "輸入八進制...",
    "enterDecimal": "輸入十進制...",
    "enterHex": "輸入十六進制...",
    "enterBase32": "輸入 32 進制...",
    "enterBase36": "輸入 36 進制...",
    "enterBase62": "輸入 62 進制...",
    "enterBase64": "輸入 64 進制...",
    "enterCustom": "輸入數字..."
  },
  "es": {
    "binary": "Binario (Base 2)",
    "octal": "Octal (Base 8)",
    "decimal": "Decimal (Base 10)",
    "hex": "Hexadecimal (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Base personalizada",
    "enterBinary": "Ingrese binario...",
    "enterOctal": "Ingrese octal...",
    "enterDecimal": "Ingrese decimal...",
    "enterHex": "Ingrese hexadecimal...",
    "enterBase32": "Ingrese base32...",
    "enterBase36": "Ingrese base36...",
    "enterBase62": "Ingrese base62...",
    "enterBase64": "Ingrese base64...",
    "enterCustom": "Ingrese numero..."
  },
  "fr": {
    "binary": "Binaire (Base 2)",
    "octal": "Octal (Base 8)",
    "decimal": "Decimal (Base 10)",
    "hex": "Hexadecimal (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Base personnalisee",
    "enterBinary": "Entrez binaire...",
    "enterOctal": "Entrez octal...",
    "enterDecimal": "Entrez decimal...",
    "enterHex": "Entrez hexadecimal...",
    "enterBase32": "Entrez base32...",
    "enterBase36": "Entrez base36...",
    "enterBase62": "Entrez base62...",
    "enterBase64": "Entrez base64...",
    "enterCustom": "Entrez nombre..."
  },
  "de": {
    "binary": "Binar (Basis 2)",
    "octal": "Oktal (Basis 8)",
    "decimal": "Dezimal (Basis 10)",
    "hex": "Hexadezimal (Basis 16)",
    "base32": "Basis 32",
    "base36": "Basis 36",
    "base62": "Basis 62",
    "base64": "Basis 64",
    "customBase": "Benutzerdefinierte Basis",
    "enterBinary": "Binar eingeben...",
    "enterOctal": "Oktal eingeben...",
    "enterDecimal": "Dezimal eingeben...",
    "enterHex": "Hexadezimal eingeben...",
    "enterBase32": "Base32 eingeben...",
    "enterBase36": "Base36 eingeben...",
    "enterBase62": "Base62 eingeben...",
    "enterBase64": "Base64 eingeben...",
    "enterCustom": "Zahl eingeben..."
  },
  "it": {
    "binary": "Binario (Base 2)",
    "octal": "Ottale (Base 8)",
    "decimal": "Decimale (Base 10)",
    "hex": "Esadecimale (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Base personalizzata",
    "enterBinary": "Inserisci binario...",
    "enterOctal": "Inserisci ottale...",
    "enterDecimal": "Inserisci decimale...",
    "enterHex": "Inserisci esadecimale...",
    "enterBase32": "Inserisci base32...",
    "enterBase36": "Inserisci base36...",
    "enterBase62": "Inserisci base62...",
    "enterBase64": "Inserisci base64...",
    "enterCustom": "Inserisci numero..."
  },
  "ja": {
    "binary": "2進数 (Base 2)",
    "octal": "8進数 (Base 8)",
    "decimal": "10進数 (Base 10)",
    "hex": "16進数 (Base 16)",
    "base32": "32進数",
    "base36": "36進数",
    "base62": "62進数",
    "base64": "64進数",
    "customBase": "カスタム基数",
    "enterBinary": "2進数を入力...",
    "enterOctal": "8進数を入力...",
    "enterDecimal": "10進数を入力...",
    "enterHex": "16進数を入力...",
    "enterBase32": "32進数を入力...",
    "enterBase36": "36進数を入力...",
    "enterBase62": "62進数を入力...",
    "enterBase64": "64進数を入力...",
    "enterCustom": "数値を入力..."
  },
  "ko": {
    "binary": "2진수 (Base 2)",
    "octal": "8진수 (Base 8)",
    "decimal": "10진수 (Base 10)",
    "hex": "16진수 (Base 16)",
    "base32": "32진수",
    "base36": "36진수",
    "base62": "62진수",
    "base64": "64진수",
    "customBase": "사용자 정의 진수",
    "enterBinary": "2진수 입력...",
    "enterOctal": "8진수 입력...",
    "enterDecimal": "10진수 입력...",
    "enterHex": "16진수 입력...",
    "enterBase32": "32진수 입력...",
    "enterBase36": "36진수 입력...",
    "enterBase62": "62진수 입력...",
    "enterBase64": "64진수 입력...",
    "enterCustom": "숫자 입력..."
  },
  "ru": {
    "binary": "Двоичная (Base 2)",
    "octal": "Восьмеричная (Base 8)",
    "decimal": "Десятичная (Base 10)",
    "hex": "Шестнадцатеричная (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Пользовательская база",
    "enterBinary": "Введите двоичное...",
    "enterOctal": "Введите восьмеричное...",
    "enterDecimal": "Введите десятичное...",
    "enterHex": "Введите шестнадцатеричное...",
    "enterBase32": "Введите base32...",
    "enterBase36": "Введите base36...",
    "enterBase62": "Введите base62...",
    "enterBase64": "Введите base64...",
    "enterCustom": "Введите число..."
  },
  "pt": {
    "binary": "Binario (Base 2)",
    "octal": "Octal (Base 8)",
    "decimal": "Decimal (Base 10)",
    "hex": "Hexadecimal (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Base personalizada",
    "enterBinary": "Digite binario...",
    "enterOctal": "Digite octal...",
    "enterDecimal": "Digite decimal...",
    "enterHex": "Digite hexadecimal...",
    "enterBase32": "Digite base32...",
    "enterBase36": "Digite base36...",
    "enterBase62": "Digite base62...",
    "enterBase64": "Digite base64...",
    "enterCustom": "Digite numero..."
  },
  "ar": {
    "binary": "ثنائي (Base 2)",
    "octal": "ثماني (Base 8)",
    "decimal": "عشري (Base 10)",
    "hex": "سداسي عشر (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "قاعدة مخصصة",
    "enterBinary": "ادخل ثنائي...",
    "enterOctal": "ادخل ثماني...",
    "enterDecimal": "ادخل عشري...",
    "enterHex": "ادخل سداسي عشر...",
    "enterBase32": "ادخل base32...",
    "enterBase36": "ادخل base36...",
    "enterBase62": "ادخل base62...",
    "enterBase64": "ادخل base64...",
    "enterCustom": "ادخل رقم..."
  },
  "hi": {
    "binary": "बाइनरी (Base 2)",
    "octal": "ऑक्टल (Base 8)",
    "decimal": "दशमलव (Base 10)",
    "hex": "हेक्साडेसिमल (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "कस्टम बेस",
    "enterBinary": "बाइनरी दर्ज करें...",
    "enterOctal": "ऑक्टल दर्ज करें...",
    "enterDecimal": "दशमलव दर्ज करें...",
    "enterHex": "हेक्साडेसिमल दर्ज करें...",
    "enterBase32": "Base32 दर्ज करें...",
    "enterBase36": "Base36 दर्ज करें...",
    "enterBase62": "Base62 दर्ज करें...",
    "enterBase64": "Base64 दर्ज करें...",
    "enterCustom": "संख्या दर्ज करें..."
  },
  "tr": {
    "binary": "Ikili (Base 2)",
    "octal": "Sekizli (Base 8)",
    "decimal": "Onlu (Base 10)",
    "hex": "Onaltilik (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Ozel taban",
    "enterBinary": "Ikili girin...",
    "enterOctal": "Sekizli girin...",
    "enterDecimal": "Onlu girin...",
    "enterHex": "Onaltilik girin...",
    "enterBase32": "Base32 girin...",
    "enterBase36": "Base36 girin...",
    "enterBase62": "Base62 girin...",
    "enterBase64": "Base64 girin...",
    "enterCustom": "Sayi girin..."
  },
  "nl": {
    "binary": "Binair (Base 2)",
    "octal": "Octaal (Base 8)",
    "decimal": "Decimaal (Base 10)",
    "hex": "Hexadecimaal (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Aangepaste basis",
    "enterBinary": "Voer binair in...",
    "enterOctal": "Voer octaal in...",
    "enterDecimal": "Voer decimaal in...",
    "enterHex": "Voer hexadecimaal in...",
    "enterBase32": "Voer base32 in...",
    "enterBase36": "Voer base36 in...",
    "enterBase62": "Voer base62 in...",
    "enterBase64": "Voer base64 in...",
    "enterCustom": "Voer nummer in..."
  },
  "sv": {
    "binary": "Binar (Bas 2)",
    "octal": "Oktal (Bas 8)",
    "decimal": "Decimal (Bas 10)",
    "hex": "Hexadecimal (Bas 16)",
    "base32": "Bas 32",
    "base36": "Bas 36",
    "base62": "Bas 62",
    "base64": "Bas 64",
    "customBase": "Anpassad bas",
    "enterBinary": "Ange binar...",
    "enterOctal": "Ange oktal...",
    "enterDecimal": "Ange decimal...",
    "enterHex": "Ange hexadecimal...",
    "enterBase32": "Ange base32...",
    "enterBase36": "Ange base36...",
    "enterBase62": "Ange base62...",
    "enterBase64": "Ange base64...",
    "enterCustom": "Ange nummer..."
  },
  "pl": {
    "binary": "Binarny (Base 2)",
    "octal": "Osemkowy (Base 8)",
    "decimal": "Dziesietny (Base 10)",
    "hex": "Szesnastkowy (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Niestandardowa podstawa",
    "enterBinary": "Wprowadz binarny...",
    "enterOctal": "Wprowadz osemkowy...",
    "enterDecimal": "Wprowadz dziesietny...",
    "enterHex": "Wprowadz szesnastkowy...",
    "enterBase32": "Wprowadz base32...",
    "enterBase36": "Wprowadz base36...",
    "enterBase62": "Wprowadz base62...",
    "enterBase64": "Wprowadz base64...",
    "enterCustom": "Wprowadz liczbe..."
  },
  "vi": {
    "binary": "Nhi phan (Base 2)",
    "octal": "Bat phan (Base 8)",
    "decimal": "Thap phan (Base 10)",
    "hex": "Thap luc phan (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Co so tuy chinh",
    "enterBinary": "Nhap nhi phan...",
    "enterOctal": "Nhap bat phan...",
    "enterDecimal": "Nhap thap phan...",
    "enterHex": "Nhap thap luc phan...",
    "enterBase32": "Nhap base32...",
    "enterBase36": "Nhap base36...",
    "enterBase62": "Nhap base62...",
    "enterBase64": "Nhap base64...",
    "enterCustom": "Nhap so..."
  },
  "th": {
    "binary": "เลขฐานสอง (Base 2)",
    "octal": "เลขฐานแปด (Base 8)",
    "decimal": "เลขฐานสิบ (Base 10)",
    "hex": "เลขฐานสิบหก (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "ฐานกำหนดเอง",
    "enterBinary": "ป้อนเลขฐานสอง...",
    "enterOctal": "ป้อนเลขฐานแปด...",
    "enterDecimal": "ป้อนเลขฐานสิบ...",
    "enterHex": "ป้อนเลขฐานสิบหก...",
    "enterBase32": "ป้อน base32...",
    "enterBase36": "ป้อน base36...",
    "enterBase62": "ป้อน base62...",
    "enterBase64": "ป้อน base64...",
    "enterCustom": "ป้อนตัวเลข..."
  },
  "id": {
    "binary": "Biner (Base 2)",
    "octal": "Oktal (Base 8)",
    "decimal": "Desimal (Base 10)",
    "hex": "Heksadesimal (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Basis kustom",
    "enterBinary": "Masukkan biner...",
    "enterOctal": "Masukkan oktal...",
    "enterDecimal": "Masukkan desimal...",
    "enterHex": "Masukkan heksadesimal...",
    "enterBase32": "Masukkan base32...",
    "enterBase36": "Masukkan base36...",
    "enterBase62": "Masukkan base62...",
    "enterBase64": "Masukkan base64...",
    "enterCustom": "Masukkan angka..."
  },
  "he": {
    "binary": "בינארי (Base 2)",
    "octal": "אוקטלי (Base 8)",
    "decimal": "עשרוני (Base 10)",
    "hex": "הקסדצימלי (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "בסיס מותאם אישית",
    "enterBinary": "הזן בינארי...",
    "enterOctal": "הזן אוקטלי...",
    "enterDecimal": "הזן עשרוני...",
    "enterHex": "הזן הקסדצימלי...",
    "enterBase32": "הזן base32...",
    "enterBase36": "הזן base36...",
    "enterBase62": "הזן base62...",
    "enterBase64": "הזן base64...",
    "enterCustom": "הזן מספר..."
  },
  "ms": {
    "binary": "Perduaan (Base 2)",
    "octal": "Perlapanan (Base 8)",
    "decimal": "Perpuluhan (Base 10)",
    "hex": "Perenambelasan (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Asas tersuai",
    "enterBinary": "Masukkan perduaan...",
    "enterOctal": "Masukkan perlapanan...",
    "enterDecimal": "Masukkan perpuluhan...",
    "enterHex": "Masukkan perenambelasan...",
    "enterBase32": "Masukkan base32...",
    "enterBase36": "Masukkan base36...",
    "enterBase62": "Masukkan base62...",
    "enterBase64": "Masukkan base64...",
    "enterCustom": "Masukkan nombor..."
  },
  "no": {
    "binary": "Binar (Base 2)",
    "octal": "Oktal (Base 8)",
    "decimal": "Desimal (Base 10)",
    "hex": "Heksadesimal (Base 16)",
    "base32": "Base 32",
    "base36": "Base 36",
    "base62": "Base 62",
    "base64": "Base 64",
    "customBase": "Egendefinert base",
    "enterBinary": "Skriv inn binar...",
    "enterOctal": "Skriv inn oktal...",
    "enterDecimal": "Skriv inn desimal...",
    "enterHex": "Skriv inn heksadesimal...",
    "enterBase32": "Skriv inn base32...",
    "enterBase36": "Skriv inn base36...",
    "enterBase62": "Skriv inn base62...",
    "enterBase64": "Skriv inn base64...",
    "enterCustom": "Skriv inn nummer..."
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
