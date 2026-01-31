<template>
  <template v-if="secretKey && message">
    <ToolSectionHeader>{{ t('output-header') }}</ToolSectionHeader>
    <ToolSection>
      <n-descriptions label-placement="left" bordered :column="1" content-style="width: 100%">
        <n-descriptions-item>
          <template #label>
            <span class="hmac-result-label">{{ t('hex') }}</span>
          </template>
          <CopyToClipboardTooltip :content="hmacHex" #="{ copy }">
            <n-text
              code
              class="hmac-result"
              :class="{ 'hmac-result-evaluating': evaluating }"
              @click="copy"
            >
              {{ hmacHex || '...' }}
            </n-text>
          </CopyToClipboardTooltip>
        </n-descriptions-item>
        <n-descriptions-item>
          <template #label>
            <span class="hmac-result-label">{{ t('base64') }}</span>
          </template>
          <CopyToClipboardTooltip :content="hmacBase64" #="{ copy }">
            <n-text
              code
              class="hmac-result"
              :class="{ 'hmac-result-evaluating': evaluating }"
              @click="copy"
            >
              {{ hmacBase64 || '...' }}
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
import type { HmacAlgorithm } from '../types'
import { generateHmac } from '../hmac'

const props = defineProps<{
  secretKey: string
  algorithm: HmacAlgorithm
  message: string | File
}>()

const { t } = useI18n()

const evaluating = shallowRef(false)

const hmacBuffer = computedAsync<ArrayBuffer | undefined>(
  async () => {
    // Access all reactive props before any await to ensure they're tracked
    const secretKey = props.secretKey
    const message = props.message
    const algorithm = props.algorithm

    if (!secretKey || !message) {
      return undefined
    }

    return generateHmac(message, secretKey, algorithm)
  },
  undefined,
  evaluating,
)

const hmacHex = computed<string>(() => {
  if (!hmacBuffer.value) return ''
  return Array.from(new Uint8Array(hmacBuffer.value))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
})

const hmacBase64 = computed<string>(() => {
  if (!hmacBuffer.value) return ''
  return btoa(String.fromCharCode(...new Uint8Array(hmacBuffer.value)))
})
</script>

<style scoped>
.hmac-result {
  font-size: 1.5em;
  cursor: pointer;
  word-break: break-all;
  transition: filter 0.3s ease-in-out;
}

.hmac-result-label {
  white-space: nowrap;
}

.hmac-result-evaluating {
  filter: blur(10px);
}
</style>

<i18n lang="json">
{
  "en": {
    "output-header": "HMAC Output",
    "hex": "Hexadecimal",
    "base64": "Base64"
  },
  "zh": {
    "output-header": "HMAC 输出",
    "hex": "十六进制",
    "base64": "Base64"
  },
  "zh-CN": {
    "output-header": "HMAC 输出",
    "hex": "十六进制",
    "base64": "Base64"
  },
  "zh-TW": {
    "output-header": "HMAC 輸出",
    "hex": "十六進位",
    "base64": "Base64"
  },
  "zh-HK": {
    "output-header": "HMAC 輸出",
    "hex": "十六進位",
    "base64": "Base64"
  },
  "es": {
    "output-header": "Salida HMAC",
    "hex": "Hexadecimal",
    "base64": "Base64"
  },
  "fr": {
    "output-header": "Sortie HMAC",
    "hex": "Hexadécimal",
    "base64": "Base64"
  },
  "de": {
    "output-header": "HMAC-Ausgabe",
    "hex": "Hexadezimal",
    "base64": "Base64"
  },
  "it": {
    "output-header": "Output HMAC",
    "hex": "Esadecimale",
    "base64": "Base64"
  },
  "ja": {
    "output-header": "HMAC 出力",
    "hex": "16進数",
    "base64": "Base64"
  },
  "ko": {
    "output-header": "HMAC 출력",
    "hex": "16진수",
    "base64": "Base64"
  },
  "ru": {
    "output-header": "Вывод HMAC",
    "hex": "Шестнадцатеричный",
    "base64": "Base64"
  },
  "pt": {
    "output-header": "Saída HMAC",
    "hex": "Hexadecimal",
    "base64": "Base64"
  },
  "ar": {
    "output-header": "إخراج HMAC",
    "hex": "سداسي عشري",
    "base64": "Base64"
  },
  "hi": {
    "output-header": "HMAC आउटपुट",
    "hex": "हेक्साडेसिमल",
    "base64": "Base64"
  },
  "tr": {
    "output-header": "HMAC Çıktısı",
    "hex": "Onaltılık",
    "base64": "Base64"
  },
  "nl": {
    "output-header": "HMAC-uitvoer",
    "hex": "Hexadecimaal",
    "base64": "Base64"
  },
  "sv": {
    "output-header": "HMAC-utdata",
    "hex": "Hexadecimal",
    "base64": "Base64"
  },
  "pl": {
    "output-header": "Wynik HMAC",
    "hex": "Szesnastkowy",
    "base64": "Base64"
  },
  "vi": {
    "output-header": "Đầu ra HMAC",
    "hex": "Thập lục phân",
    "base64": "Base64"
  },
  "th": {
    "output-header": "เอาต์พุต HMAC",
    "hex": "เลขฐานสิบหก",
    "base64": "Base64"
  },
  "id": {
    "output-header": "Output HMAC",
    "hex": "Heksadesimal",
    "base64": "Base64"
  },
  "he": {
    "output-header": "פלט HMAC",
    "hex": "הקסדצימלי",
    "base64": "Base64"
  },
  "ms": {
    "output-header": "Output HMAC",
    "hex": "Heksadesimal",
    "base64": "Base64"
  },
  "no": {
    "output-header": "HMAC-utdata",
    "hex": "Heksadesimal",
    "base64": "Base64"
  }
}
</i18n>
