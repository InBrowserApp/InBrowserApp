<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ToolSectionHeader>
      {{ t('hash-input') }}
    </ToolSectionHeader>
    <TextOrFileInput v-model:value="textOrFile" />
    <ToolSectionHeader v-if="textOrFile">
      {{ t('hash-result') }}
    </ToolSectionHeader>
    <ToolSection v-show="textOrFile">
      <n-descriptions
        v-if="sri"
        label-placement="left"
        bordered
        :column="1"
        content-style="width: 100%"
      >
        <n-descriptions-item>
          <template #label>
            <span class="hash-result-label"> SHA-256 SRI </span>
          </template>
          <CopyToClipboardTooltip :content="sri.sha256" #="{ copy }">
            <n-text
              code
              class="hash-result"
              :class="{ 'hash-result-evaluating': processing }"
              @click="copy"
              >{{ sri.sha256 }}</n-text
            >
          </CopyToClipboardTooltip>
        </n-descriptions-item>

        <n-descriptions-item>
          <template #label>
            <span class="hash-result-label"> SHA-384 SRI </span>
          </template>
          <CopyToClipboardTooltip :content="sri.sha384" #="{ copy }">
            <n-text
              code
              class="hash-result"
              :class="{ 'hash-result-evaluating': processing }"
              @click="copy"
              >{{ sri.sha384 }}</n-text
            >
          </CopyToClipboardTooltip>
        </n-descriptions-item>

        <n-descriptions-item>
          <template #label>
            <span class="hash-result-label"> SHA-512 SRI </span>
          </template>
          <CopyToClipboardTooltip :content="sri.sha512" #="{ copy }">
            <n-text
              code
              class="hash-result"
              :class="{ 'hash-result-evaluating': processing }"
              @click="copy"
              >{{ sri.sha512 }}</n-text
            >
          </CopyToClipboardTooltip>
        </n-descriptions-item>
      </n-descriptions>
    </ToolSection>

    <WhatIsSRI />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import * as toolInfo from './info'
import { ToolDefaultPageLayout, ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import WhatIsSRI from './WhatIsSRI.vue'
import { TextOrFileInput } from '@shared/ui/base'
import { computedAsync } from '@vueuse/core'
import { ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import { CopyToClipboardTooltip } from '@shared/ui/base'

const { t } = useI18n()

const textOrFile = ref<string | File>('')
const processing = shallowRef(false)

const sri = computedAsync<{
  sha256: `sha256-${string}`
  sha384: `sha384-${string}`
  sha512: `sha512-${string}`
}>(
  async () => {
    const input = textOrFile.value
    const blob = typeof input === 'string' ? new Blob([input], { type: 'text/plain' }) : input
    const buffer = await blob.arrayBuffer()

    const [sha256Hash, sha384Hash, sha512Hash] = await Promise.all([
      crypto.subtle.digest('SHA-256', buffer),
      crypto.subtle.digest('SHA-384', buffer),
      crypto.subtle.digest('SHA-512', buffer),
    ])

    // Convert hash to base64 properly for SRI
    const toBase64 = (hash: ArrayBuffer): string => {
      const bytes = new Uint8Array(hash)
      let binary = ''
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]!)
      }
      return btoa(binary)
    }

    return {
      sha256: `sha256-${toBase64(sha256Hash)}`,
      sha384: `sha384-${toBase64(sha384Hash)}`,
      sha512: `sha512-${toBase64(sha512Hash)}`,
    }
  },
  undefined,
  processing,
)
</script>

<i18n lang="json">
{
  "en": {
    "hash-input": "Input",
    "hash-result": "Hash Result"
  },
  "zh": {
    "hash-input": "输入",
    "hash-result": "哈希结果"
  },
  "zh-CN": {
    "hash-input": "输入",
    "hash-result": "哈希结果"
  },
  "zh-TW": {
    "hash-input": "輸入",
    "hash-result": "雜湊結果"
  },
  "zh-HK": {
    "hash-input": "輸入",
    "hash-result": "雜湊結果"
  },
  "es": {
    "hash-input": "Entrada",
    "hash-result": "Resultado del Hash"
  },
  "fr": {
    "hash-input": "Entrée",
    "hash-result": "Résultat du Hash"
  },
  "de": {
    "hash-input": "Eingabe",
    "hash-result": "Hash-Ergebnis"
  },
  "it": {
    "hash-input": "Input",
    "hash-result": "Risultato Hash"
  },
  "ja": {
    "hash-input": "入力",
    "hash-result": "ハッシュ結果"
  },
  "ko": {
    "hash-input": "입력",
    "hash-result": "해시 결과"
  },
  "ru": {
    "hash-input": "Ввод",
    "hash-result": "Результат хеша"
  },
  "pt": {
    "hash-input": "Entrada",
    "hash-result": "Resultado do Hash"
  },
  "ar": {
    "hash-input": "الإدخال",
    "hash-result": "نتيجة الهاش"
  },
  "hi": {
    "hash-input": "इनपुट",
    "hash-result": "हैश परिणाम"
  },
  "tr": {
    "hash-input": "Giriş",
    "hash-result": "Hash Sonucu"
  },
  "nl": {
    "hash-input": "Invoer",
    "hash-result": "Hash Resultaat"
  },
  "sv": {
    "hash-input": "Inmatning",
    "hash-result": "Hash Resultat"
  },
  "pl": {
    "hash-input": "Wejście",
    "hash-result": "Wynik Hash"
  },
  "vi": {
    "hash-input": "Đầu vào",
    "hash-result": "Kết quả Hash"
  },
  "th": {
    "hash-input": "ข้อมูลนำเข้า",
    "hash-result": "ผลลัพธ์แฮช"
  },
  "id": {
    "hash-input": "Input",
    "hash-result": "Hasil Hash"
  },
  "he": {
    "hash-input": "קלט",
    "hash-result": "תוצאת האש"
  },
  "ms": {
    "hash-input": "Input",
    "hash-result": "Hasil Hash"
  },
  "no": {
    "hash-input": "Inndata",
    "hash-result": "Hash Resultat"
  }
}
</i18n>

<style scoped>
.hash-result-label {
  white-space: nowrap;
}

.hash-result {
  word-break: break-all;
  cursor: pointer;
  transition: filter 0.3s ease-in-out;
}

.hash-result-evaluating {
  filter: blur(10px);
}
</style>
