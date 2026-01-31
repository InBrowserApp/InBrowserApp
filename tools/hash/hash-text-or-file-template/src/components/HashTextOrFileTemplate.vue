<template>
  <ToolSectionHeader>
    {{ t('hash-input') }}
  </ToolSectionHeader>
  <TextOrFileInput v-model:value="textOrFile" />
  <ToolSectionHeader v-if="textOrFile">
    {{ t('hash-result') }}
  </ToolSectionHeader>
  <ToolSection>
    <HashResult
      v-show="textOrFile"
      :hash="props.hash"
      :content="textOrFile"
      :hide-hex="props.hideHex"
      :hide-base64="props.hideBase64"
      :hide-binary="props.hideBinary"
      :hide-decimal="props.hideDecimal"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { TextOrFileInput } from '@shared/ui/base'
import { ref } from 'vue'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import HashResult from './HashResult.vue'

const props = defineProps<{
  hash: (blob: Blob) => Promise<ArrayBuffer>
  hideHex?: boolean
  hideBase64?: boolean
  hideBinary?: boolean
  hideDecimal?: boolean
}>()

const { t } = useI18n()

const textOrFile = ref<string | File>('')
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
    "hash-result": "Résultat du Hachage"
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
    "hash-result": "Результат Хеширования"
  },
  "pt": {
    "hash-input": "Entrada",
    "hash-result": "Resultado do Hash"
  },
  "ar": {
    "hash-input": "الإدخال",
    "hash-result": "نتيجة التشفير"
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
    "hash-result": "Hash-resultat"
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
    "hash-input": "ข้อมูลเข้า",
    "hash-result": "ผลลัพธ์ Hash"
  },
  "id": {
    "hash-input": "Input",
    "hash-result": "Hasil Hash"
  },
  "he": {
    "hash-input": "קלט",
    "hash-result": "תוצאת Hash"
  },
  "ms": {
    "hash-input": "Input",
    "hash-result": "Hasil Hash"
  },
  "no": {
    "hash-input": "Inndata",
    "hash-result": "Hash-resultat"
  }
}
</i18n>
