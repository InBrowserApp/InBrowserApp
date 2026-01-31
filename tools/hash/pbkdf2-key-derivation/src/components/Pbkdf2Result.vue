<template>
  <template v-if="showOutput">
    <ToolSectionHeader>{{ t('output-header') }}</ToolSectionHeader>
    <ToolSection>
      <n-descriptions label-placement="left" bordered :column="1" content-style="width: 100%">
        <n-descriptions-item>
          <template #label>
            <span class="pbkdf2-result-label">{{ t('hex') }}</span>
          </template>
          <CopyToClipboardTooltip :content="derivedHex" #="{ copy }">
            <n-text
              code
              class="pbkdf2-result"
              :class="{ 'pbkdf2-result-evaluating': evaluating }"
              @click="copy"
            >
              {{ derivedHex || '...' }}
            </n-text>
          </CopyToClipboardTooltip>
        </n-descriptions-item>
        <n-descriptions-item>
          <template #label>
            <span class="pbkdf2-result-label">{{ t('base64') }}</span>
          </template>
          <CopyToClipboardTooltip :content="derivedBase64" #="{ copy }">
            <n-text
              code
              class="pbkdf2-result"
              :class="{ 'pbkdf2-result-evaluating': evaluating }"
              @click="copy"
            >
              {{ derivedBase64 || '...' }}
            </n-text>
          </CopyToClipboardTooltip>
        </n-descriptions-item>
      </n-descriptions>
    </ToolSection>
  </template>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { computedAsync } from '@vueuse/core'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { Pbkdf2Algorithm, SaltFormat } from '../types'
import { bytesToBase64, bytesToHex, derivePbkdf2 } from '../utils'

const props = defineProps<{
  password: string
  salt: string | File
  saltFormat: SaltFormat
  algorithm: Pbkdf2Algorithm
  iterations: number
  length: number
  saltErrorType: '' | 'hex' | 'base64'
  iterationsValid: boolean
  lengthValid: boolean
}>()

const { t } = useI18n()

const evaluating = shallowRef(false)

const showOutput = computed(() => {
  return (
    Boolean(props.password) &&
    Boolean(props.salt) &&
    !props.saltErrorType &&
    props.iterationsValid &&
    props.lengthValid
  )
})

const derivedBytes = computedAsync<Uint8Array | undefined>(
  async () => {
    const {
      password,
      salt,
      saltFormat,
      algorithm,
      iterations,
      length,
      saltErrorType,
      iterationsValid,
      lengthValid,
    } = props

    if (!password || !salt || saltErrorType || !iterationsValid || !lengthValid) {
      return undefined
    }

    return derivePbkdf2({
      password,
      salt,
      saltFormat,
      hash: algorithm,
      iterations,
      lengthBytes: length,
    })
  },
  undefined,
  evaluating,
)

const derivedHex = computed(() => (derivedBytes.value ? bytesToHex(derivedBytes.value) : ''))
const derivedBase64 = computed(() => (derivedBytes.value ? bytesToBase64(derivedBytes.value) : ''))
</script>

<style scoped>
.pbkdf2-result {
  font-size: 1.5em;
  cursor: pointer;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.pbkdf2-result-label {
  white-space: nowrap;
}

.pbkdf2-result-evaluating {
  filter: blur(10px);
}
</style>

<i18n lang="json">
{
  "en": {
    "output-header": "Derived Key",
    "hex": "Hexadecimal",
    "base64": "Base64"
  },
  "zh": {
    "output-header": "派生密钥",
    "hex": "十六进制",
    "base64": "Base64"
  },
  "zh-CN": {
    "output-header": "派生密钥",
    "hex": "十六进制",
    "base64": "Base64"
  },
  "zh-TW": {
    "output-header": "派生金鑰",
    "hex": "十六進位",
    "base64": "Base64"
  },
  "zh-HK": {
    "output-header": "派生金鑰",
    "hex": "十六進位",
    "base64": "Base64"
  },
  "es": {
    "output-header": "Clave Derivada",
    "hex": "Hexadecimal",
    "base64": "Base64"
  },
  "fr": {
    "output-header": "Clé Dérivée",
    "hex": "Hexadécimal",
    "base64": "Base64"
  },
  "de": {
    "output-header": "Abgeleiteter Schlüssel",
    "hex": "Hexadezimal",
    "base64": "Base64"
  },
  "it": {
    "output-header": "Chiave Derivata",
    "hex": "Esadecimale",
    "base64": "Base64"
  },
  "ja": {
    "output-header": "派生鍵",
    "hex": "16進数",
    "base64": "Base64"
  },
  "ko": {
    "output-header": "파생 키",
    "hex": "16진수",
    "base64": "Base64"
  },
  "ru": {
    "output-header": "Производный ключ",
    "hex": "Шестнадцатеричный",
    "base64": "Base64"
  },
  "pt": {
    "output-header": "Chave Derivada",
    "hex": "Hexadecimal",
    "base64": "Base64"
  },
  "ar": {
    "output-header": "المفتاح المشتق",
    "hex": "سداسي عشري",
    "base64": "Base64"
  },
  "hi": {
    "output-header": "व्युत्पन्न कुंजी",
    "hex": "हेक्साडेसिमल",
    "base64": "Base64"
  },
  "tr": {
    "output-header": "Türetilen Anahtar",
    "hex": "Onaltılık",
    "base64": "Base64"
  },
  "nl": {
    "output-header": "Afgeleide Sleutel",
    "hex": "Hexadecimaal",
    "base64": "Base64"
  },
  "sv": {
    "output-header": "Härledd Nyckel",
    "hex": "Hexadecimal",
    "base64": "Base64"
  },
  "pl": {
    "output-header": "Klucz Pochodny",
    "hex": "Szesnastkowy",
    "base64": "Base64"
  },
  "vi": {
    "output-header": "Khóa Suy Xuất",
    "hex": "Thập lục phân",
    "base64": "Base64"
  },
  "th": {
    "output-header": "คีย์ที่ได้",
    "hex": "ฐานสิบหก",
    "base64": "Base64"
  },
  "id": {
    "output-header": "Kunci Turunan",
    "hex": "Heksadesimal",
    "base64": "Base64"
  },
  "he": {
    "output-header": "מפתח נגזר",
    "hex": "הקסדצימלי",
    "base64": "Base64"
  },
  "ms": {
    "output-header": "Kunci Terbitan",
    "hex": "Heksadesimal",
    "base64": "Base64"
  },
  "no": {
    "output-header": "Avledet nøkkel",
    "hex": "Heksadesimal",
    "base64": "Base64"
  }
}
</i18n>
