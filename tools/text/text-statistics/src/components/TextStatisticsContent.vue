<template>
  <n-grid :cols="1" :x-gap="12" :y-gap="12">
    <n-gi>
      <n-input
        v-model:value="inputText"
        type="textarea"
        :placeholder="t('placeholder')"
        :rows="10"
      />
    </n-gi>
    <n-gi>
      <StatsDisplay :stats="stats" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NGrid, NGi, NInput } from 'naive-ui'
import { calculateTextStats } from '../utils/textStats'
import StatsDisplay from './StatsDisplay.vue'

const { t } = useI18n()
const inputText = useStorage('tools:text-statistics:text', '')
const stats = computed(() => calculateTextStats(inputText.value))
</script>

<i18n lang="json">
{
  "en": { "placeholder": "Enter or paste your text here..." },
  "zh": { "placeholder": "在此输入或粘贴文本..." },
  "zh-CN": { "placeholder": "在此输入或粘贴文本..." },
  "zh-TW": { "placeholder": "在此輸入或貼上文字..." },
  "zh-HK": { "placeholder": "在此輸入或貼上文字..." },
  "es": { "placeholder": "Introduce o pega tu texto aquí..." },
  "fr": { "placeholder": "Entrez ou collez votre texte ici..." },
  "de": { "placeholder": "Geben Sie hier Ihren Text ein oder fügen Sie ihn ein..." },
  "it": { "placeholder": "Inserisci o incolla il tuo testo qui..." },
  "ja": { "placeholder": "ここにテキストを入力または貼り付けてください..." },
  "ko": { "placeholder": "여기에 텍스트를 입력하거나 붙여넣으세요..." },
  "ru": { "placeholder": "Введите или вставьте текст здесь..." },
  "pt": { "placeholder": "Digite ou cole seu texto aqui..." },
  "ar": { "placeholder": "أدخل أو الصق النص هنا..." },
  "hi": { "placeholder": "यहाँ टेक्स्ट दर्ज करें या पेस्ट करें..." },
  "tr": { "placeholder": "Metninizi buraya girin veya yapıştırın..." },
  "nl": { "placeholder": "Voer hier uw tekst in of plak deze..." },
  "sv": { "placeholder": "Skriv eller klistra in din text här..." },
  "pl": { "placeholder": "Wprowadź lub wklej tekst tutaj..." },
  "vi": { "placeholder": "Nhập hoặc dán văn bản của bạn vào đây..." },
  "th": { "placeholder": "ป้อนหรือวางข้อความของคุณที่นี่..." },
  "id": { "placeholder": "Masukkan atau tempel teks Anda di sini..." },
  "he": { "placeholder": "הזן או הדבק את הטקסט שלך כאן..." },
  "ms": { "placeholder": "Masukkan atau tampal teks anda di sini..." },
  "no": { "placeholder": "Skriv inn eller lim inn teksten din her..." }
}
</i18n>
