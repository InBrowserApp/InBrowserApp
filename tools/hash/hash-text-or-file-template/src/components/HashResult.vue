<template>
  <n-descriptions label-placement="left" bordered :column="1" content-style="width: 100%">
    <n-descriptions-item v-if="!props.hideHex">
      <template #label>
        <span class="hash-result-label">
          {{ t('hash-result-hex') }}
        </span>
      </template>

      <CopyToClipboardTooltip :content="hashHex" #="{ copy }">
        <n-text
          code
          class="hash-result"
          :class="{ 'hash-result-evaluating': evaluating }"
          @click="copy"
          >{{ hashHex }}</n-text
        >
      </CopyToClipboardTooltip>
    </n-descriptions-item>
    <n-descriptions-item v-if="!props.hideBase64">
      <template #label>
        <span class="hash-result-label">
          {{ t('hash-result-base64') }}
        </span>
      </template>
      <CopyToClipboardTooltip :content="hashBase64" #="{ copy }">
        <n-text
          code
          class="hash-result"
          :class="{ 'hash-result-evaluating': evaluating }"
          @click="copy"
          >{{ hashBase64 }}</n-text
        >
      </CopyToClipboardTooltip>
    </n-descriptions-item>

    <n-descriptions-item v-if="!props.hideDecimal">
      <template #label>
        <span class="hash-result-label">
          {{ t('hash-result-decimal') }}
        </span>
      </template>
      <CopyToClipboardTooltip :content="hashDecimal" #="{ copy }">
        <n-text
          code
          class="hash-result"
          :class="{ 'hash-result-evaluating': evaluating }"
          @click="copy"
          >{{ hashDecimal }}</n-text
        >
      </CopyToClipboardTooltip>
    </n-descriptions-item>

    <n-descriptions-item v-if="!props.hideBinary">
      <template #label>
        <span class="hash-result-label">
          {{ t('hash-result-binary') }}
        </span>
      </template>
      <CopyToClipboardTooltip :content="hashBinary" #="{ copy }">
        <n-text
          code
          class="hash-result"
          :class="{ 'hash-result-evaluating': evaluating }"
          @click="copy"
          >{{ hashBinary }}</n-text
        >
      </CopyToClipboardTooltip>
    </n-descriptions-item>
  </n-descriptions>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import { NText, NDescriptions, NDescriptionsItem } from 'naive-ui'
import { computed, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  hash: (blob: Blob) => Promise<ArrayBuffer>
  content: string | File
  hideHex?: boolean
  hideBase64?: boolean
  hideBinary?: boolean
  hideDecimal?: boolean
}>()

const { t } = useI18n()

const evaluating = shallowRef(false)

const hashBuffer = computedAsync<ArrayBuffer>(
  async () => {
    const blob = typeof props.content === 'string' ? new Blob([props.content]) : props.content
    const arrayBuffer = await props.hash(blob)
    return arrayBuffer
  },
  undefined,
  evaluating,
)

const hashHex = computed<string>(() => {
  if (!hashBuffer.value) return ''
  return Array.from(new Uint8Array(hashBuffer.value))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
})

const hashBase64 = computed<string>(() => {
  if (!hashBuffer.value) return ''
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer.value)))
})

const hashBinary = computed<string>(() => {
  if (!hashBuffer.value) return ''
  return Array.from(new Uint8Array(hashBuffer.value))
    .map((b) => b.toString(2).padStart(8, '0'))
    .join('')
})

const hashDecimal = computed<string>(() => {
  if (!hashBuffer.value) return 0n.toString()
  const bytes = new Uint8Array(hashBuffer.value)
  let result = 0n
  for (let i = 0; i < bytes.length; i++) {
    result = (result << 8n) + BigInt(bytes[i]!)
  }
  return result.toString()
})
</script>

<i18n lang="json">
{
  "en": {
    "hash-result-hex": "Hexadecimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Decimal",
    "hash-result-binary": "Binary"
  },
  "zh": {
    "hash-result-hex": "十六进制",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "十进制",
    "hash-result-binary": "二进制"
  },
  "zh-CN": {
    "hash-result-hex": "十六进制",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "十进制",
    "hash-result-binary": "二进制"
  },
  "zh-TW": {
    "hash-result-hex": "十六進制",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "十進制",
    "hash-result-binary": "二進制"
  },
  "zh-HK": {
    "hash-result-hex": "十六進制",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "十進制",
    "hash-result-binary": "二進制"
  },
  "es": {
    "hash-result-hex": "Hexadecimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Decimal",
    "hash-result-binary": "Binario"
  },
  "fr": {
    "hash-result-hex": "Hexadécimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Décimal",
    "hash-result-binary": "Binaire"
  },
  "de": {
    "hash-result-hex": "Hexadezimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Dezimal",
    "hash-result-binary": "Binär"
  },
  "it": {
    "hash-result-hex": "Esadecimale",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Decimale",
    "hash-result-binary": "Binario"
  },
  "ja": {
    "hash-result-hex": "十六進数",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "十進数",
    "hash-result-binary": "二進数"
  },
  "ko": {
    "hash-result-hex": "16진수",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "10진수",
    "hash-result-binary": "2진수"
  },
  "ru": {
    "hash-result-hex": "Шестнадцатеричный",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Десятичный",
    "hash-result-binary": "Двоичный"
  },
  "pt": {
    "hash-result-hex": "Hexadecimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Decimal",
    "hash-result-binary": "Binário"
  },
  "ar": {
    "hash-result-hex": "سادس عشر",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "عشري",
    "hash-result-binary": "ثنائي"
  },
  "hi": {
    "hash-result-hex": "हेक्साडेसिमल",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "दशमलव",
    "hash-result-binary": "बाइनरी"
  },
  "tr": {
    "hash-result-hex": "Onaltılık",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Ondalık",
    "hash-result-binary": "İkili"
  },
  "nl": {
    "hash-result-hex": "Hexadecimaal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Decimaal",
    "hash-result-binary": "Binair"
  },
  "sv": {
    "hash-result-hex": "Hexadecimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Decimal",
    "hash-result-binary": "Binär"
  },
  "pl": {
    "hash-result-hex": "Szesnastkowy",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Dziesiętny",
    "hash-result-binary": "Binarny"
  },
  "vi": {
    "hash-result-hex": "Thập lục phân",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Thập phân",
    "hash-result-binary": "Nhị phân"
  },
  "th": {
    "hash-result-hex": "เลขฐานสิบหก",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "เลขฐานสิบ",
    "hash-result-binary": "เลขฐานสอง"
  },
  "id": {
    "hash-result-hex": "Heksadesimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Desimal",
    "hash-result-binary": "Biner"
  },
  "he": {
    "hash-result-hex": "הקסדצימלי",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "עשרוני",
    "hash-result-binary": "בינארי"
  },
  "ms": {
    "hash-result-hex": "Heksadesimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Perpuluhan",
    "hash-result-binary": "Binari"
  },
  "no": {
    "hash-result-hex": "Heksadesimal",
    "hash-result-base64": "Base64",
    "hash-result-decimal": "Desimal",
    "hash-result-binary": "Binær"
  }
}
</i18n>

<style scoped>
.hash-result {
  font-size: 1.5em;
  cursor: pointer;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.hash-result-label {
  white-space: nowrap;
}

.hash-result-evaluating {
  filter: blur(10px);
}
</style>
