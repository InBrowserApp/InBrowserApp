<template>
  <ToolSection>
    <n-flex justify="space-between" align="center" class="section-header">
      <span class="section-title">{{ t('input') }}</span>
      <n-button size="small" quaternary @click="inputText = ''">
        {{ t('clear') }}
      </n-button>
    </n-flex>
    <n-input
      v-model:value="inputText"
      type="textarea"
      :placeholder="t('placeholder')"
      :autosize="{ minRows: 2, maxRows: 5 }"
    />
  </ToolSection>

  <n-grid cols="1 s:2 l:3" :x-gap="24" :y-gap="24" responsive="screen" class="outputs-grid">
    <n-gi>
      <CaseOutput label="camelCase" :value="outputs.camelCase" />
    </n-gi>
    <n-gi>
      <CaseOutput label="PascalCase" :value="outputs.PascalCase" />
    </n-gi>
    <n-gi>
      <CaseOutput label="snake_case" :value="outputs.snake_case" />
    </n-gi>
    <n-gi>
      <CaseOutput label="SCREAMING_SNAKE_CASE" :value="outputs.SCREAMING_SNAKE_CASE" />
    </n-gi>
    <n-gi>
      <CaseOutput label="kebab-case" :value="outputs.kebabCase" />
    </n-gi>
    <n-gi>
      <CaseOutput label="SCREAMING-KEBAB-CASE" :value="outputs.SCREAMING_KEBAB_CASE" />
    </n-gi>
    <n-gi>
      <CaseOutput label="dot.case" :value="outputs.dotCase" />
    </n-gi>
    <n-gi>
      <CaseOutput label="path/case" :value="outputs.pathCase" />
    </n-gi>
    <n-gi>
      <CaseOutput label="Title Case" :value="outputs.TitleCase" />
    </n-gi>
    <n-gi>
      <CaseOutput label="Sentence case" :value="outputs.SentenceCase" />
    </n-gi>
    <n-gi>
      <CaseOutput label="UPPERCASE" :value="outputs.UPPERCASE" />
    </n-gi>
    <n-gi>
      <CaseOutput label="lowercase" :value="outputs.lowercase" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NFlex, NInput, NButton, NGrid, NGi } from 'naive-ui'
import { ToolSection } from '@shared/ui/tool'
import CaseOutput from './CaseOutput.vue'
import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toScreamingSnakeCase,
  toKebabCase,
  toScreamingKebabCase,
  toDotCase,
  toPathCase,
  toTitleCase,
  toSentenceCase,
  toUpperCase,
  toLowerCase,
} from '../utils'

const { t } = useI18n()

const inputText = useStorage('tools:case-converter:input', 'Hello World Example')

const outputs = computed(() => ({
  camelCase: toCamelCase(inputText.value),
  PascalCase: toPascalCase(inputText.value),
  snake_case: toSnakeCase(inputText.value),
  SCREAMING_SNAKE_CASE: toScreamingSnakeCase(inputText.value),
  kebabCase: toKebabCase(inputText.value),
  SCREAMING_KEBAB_CASE: toScreamingKebabCase(inputText.value),
  dotCase: toDotCase(inputText.value),
  pathCase: toPathCase(inputText.value),
  TitleCase: toTitleCase(inputText.value),
  SentenceCase: toSentenceCase(inputText.value),
  UPPERCASE: toUpperCase(inputText.value),
  lowercase: toLowerCase(inputText.value),
}))
</script>

<style scoped>
.section-header {
  margin-bottom: 8px;
}

.section-title {
  font-weight: 500;
  font-size: 14px;
}

.outputs-grid {
  margin-top: 24px;
}
</style>

<i18n lang="json">
{
  "en": {
    "input": "Input Text",
    "clear": "Clear",
    "placeholder": "Enter text to convert..."
  },
  "zh": {
    "input": "输入文本",
    "clear": "清空",
    "placeholder": "输入要转换的文本..."
  },
  "zh-CN": {
    "input": "输入文本",
    "clear": "清空",
    "placeholder": "输入要转换的文本..."
  },
  "zh-TW": {
    "input": "輸入文字",
    "clear": "清空",
    "placeholder": "輸入要轉換的文字..."
  },
  "zh-HK": {
    "input": "輸入文字",
    "clear": "清空",
    "placeholder": "輸入要轉換的文字..."
  },
  "es": {
    "input": "Texto de Entrada",
    "clear": "Limpiar",
    "placeholder": "Ingrese texto para convertir..."
  },
  "fr": {
    "input": "Texte d'Entrée",
    "clear": "Effacer",
    "placeholder": "Entrez le texte à convertir..."
  },
  "de": {
    "input": "Eingabetext",
    "clear": "Löschen",
    "placeholder": "Text zum Konvertieren eingeben..."
  },
  "it": {
    "input": "Testo di Input",
    "clear": "Cancella",
    "placeholder": "Inserisci il testo da convertire..."
  },
  "ja": {
    "input": "入力テキスト",
    "clear": "クリア",
    "placeholder": "変換するテキストを入力..."
  },
  "ko": {
    "input": "입력 텍스트",
    "clear": "지우기",
    "placeholder": "변환할 텍스트 입력..."
  },
  "ru": {
    "input": "Входной Текст",
    "clear": "Очистить",
    "placeholder": "Введите текст для преобразования..."
  },
  "pt": {
    "input": "Texto de Entrada",
    "clear": "Limpar",
    "placeholder": "Digite o texto para converter..."
  },
  "ar": {
    "input": "نص الإدخال",
    "clear": "مسح",
    "placeholder": "أدخل النص للتحويل..."
  },
  "hi": {
    "input": "इनपुट टेक्स्ट",
    "clear": "साफ़ करें",
    "placeholder": "कन्वर्ट करने के लिए टेक्स्ट दर्ज करें..."
  },
  "tr": {
    "input": "Giriş Metni",
    "clear": "Temizle",
    "placeholder": "Dönüştürülecek metni girin..."
  },
  "nl": {
    "input": "Invoertekst",
    "clear": "Wissen",
    "placeholder": "Voer tekst in om te converteren..."
  },
  "sv": {
    "input": "Inmatningstext",
    "clear": "Rensa",
    "placeholder": "Ange text att konvertera..."
  },
  "pl": {
    "input": "Tekst Wejściowy",
    "clear": "Wyczyść",
    "placeholder": "Wprowadź tekst do konwersji..."
  },
  "vi": {
    "input": "Văn Bản Nhập",
    "clear": "Xóa",
    "placeholder": "Nhập văn bản để chuyển đổi..."
  },
  "th": {
    "input": "ข้อความนำเข้า",
    "clear": "ล้าง",
    "placeholder": "ป้อนข้อความเพื่อแปลง..."
  },
  "id": {
    "input": "Teks Masukan",
    "clear": "Hapus",
    "placeholder": "Masukkan teks untuk dikonversi..."
  },
  "he": {
    "input": "טקסט קלט",
    "clear": "נקה",
    "placeholder": "הזן טקסט להמרה..."
  },
  "ms": {
    "input": "Teks Input",
    "clear": "Kosongkan",
    "placeholder": "Masukkan teks untuk ditukar..."
  },
  "no": {
    "input": "Inndatatekst",
    "clear": "Tøm",
    "placeholder": "Skriv inn tekst å konvertere..."
  }
}
</i18n>
