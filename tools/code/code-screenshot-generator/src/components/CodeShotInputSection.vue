<template>
  <ToolSectionHeader>{{ t('inputTitle') }}</ToolSectionHeader>
  <ToolSection>
    <n-form-item :label="t('codeInputLabel')" :show-feedback="false">
      <n-input
        v-model:value="codeProxy"
        type="textarea"
        class="code-input"
        :autosize="{ minRows: 12, maxRows: 28 }"
        :placeholder="t('codePlaceholder')"
      />
    </n-form-item>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItem, NInput } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  code: string
}>()

const emit = defineEmits<{
  (e: 'update:code', value: string): void
}>()

const { t } = useI18n()

const codeProxy = computed({
  get: () => props.code,
  set: (value: string) => emit('update:code', value),
})
</script>

<style scoped>
.code-input {
  font-family:
    'JetBrains Mono', 'Fira Code', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas',
    'Liberation Mono', 'Courier New', monospace;
}
</style>

<i18n lang="json">
{
  "en": {
    "inputTitle": "Code",
    "codeInputLabel": "Code input",
    "codePlaceholder": "Paste or type your snippet here..."
  },
  "zh": {
    "inputTitle": "代码",
    "codeInputLabel": "代码输入",
    "codePlaceholder": "在这里粘贴或输入代码..."
  },
  "zh-CN": {
    "inputTitle": "代码",
    "codeInputLabel": "代码输入",
    "codePlaceholder": "在这里粘贴或输入代码..."
  },
  "zh-TW": {
    "inputTitle": "程式碼",
    "codeInputLabel": "程式碼輸入",
    "codePlaceholder": "在此貼上或輸入程式碼..."
  },
  "zh-HK": {
    "inputTitle": "程式碼",
    "codeInputLabel": "程式碼輸入",
    "codePlaceholder": "在此貼上或輸入程式碼..."
  },
  "es": {
    "inputTitle": "Código",
    "codeInputLabel": "Entrada de código",
    "codePlaceholder": "Pega o escribe tu fragmento aquí..."
  },
  "fr": {
    "inputTitle": "Code",
    "codeInputLabel": "Entrée du code",
    "codePlaceholder": "Collez ou tapez votre extrait ici..."
  },
  "de": {
    "inputTitle": "Code",
    "codeInputLabel": "Code-Eingabe",
    "codePlaceholder": "Füge deinen Code hier ein oder tippe ihn ein..."
  },
  "it": {
    "inputTitle": "Codice",
    "codeInputLabel": "Input codice",
    "codePlaceholder": "Incolla o digita il tuo snippet qui..."
  },
  "ja": {
    "inputTitle": "コード",
    "codeInputLabel": "コード入力",
    "codePlaceholder": "ここにコードを貼り付けるか入力してください..."
  },
  "ko": {
    "inputTitle": "코드",
    "codeInputLabel": "코드 입력",
    "codePlaceholder": "여기에 코드를 붙여넣거나 입력하세요..."
  },
  "ru": {
    "inputTitle": "Код",
    "codeInputLabel": "Ввод кода",
    "codePlaceholder": "Вставьте или введите фрагмент здесь..."
  },
  "pt": {
    "inputTitle": "Código",
    "codeInputLabel": "Entrada de código",
    "codePlaceholder": "Cole ou digite seu trecho aqui..."
  },
  "ar": {
    "inputTitle": "الكود",
    "codeInputLabel": "إدخال الكود",
    "codePlaceholder": "الصق أو اكتب المقتطف هنا..."
  },
  "hi": {
    "inputTitle": "कोड",
    "codeInputLabel": "कोड इनपुट",
    "codePlaceholder": "अपना स्निपेट यहां पेस्ट या टाइप करें..."
  },
  "tr": {
    "inputTitle": "Kod",
    "codeInputLabel": "Kod girişi",
    "codePlaceholder": "Parçayı buraya yapıştırın veya yazın..."
  },
  "nl": {
    "inputTitle": "Code",
    "codeInputLabel": "Code-invoer",
    "codePlaceholder": "Plak of typ je snippet hier..."
  },
  "sv": {
    "inputTitle": "Kod",
    "codeInputLabel": "Kodindata",
    "codePlaceholder": "Klistra in eller skriv ditt kodstycke här..."
  },
  "pl": {
    "inputTitle": "Kod",
    "codeInputLabel": "Wejście kodu",
    "codePlaceholder": "Wklej lub wpisz fragment tutaj..."
  },
  "vi": {
    "inputTitle": "Mã",
    "codeInputLabel": "Nhập mã",
    "codePlaceholder": "Dán hoặc nhập đoạn mã ở đây..."
  },
  "th": {
    "inputTitle": "โค้ด",
    "codeInputLabel": "ป้อนโค้ด",
    "codePlaceholder": "วางหรือพิมพ์โค้ดของคุณที่นี่..."
  },
  "id": {
    "inputTitle": "Kode",
    "codeInputLabel": "Input kode",
    "codePlaceholder": "Tempel atau ketik potongan kode di sini..."
  },
  "he": {
    "inputTitle": "קוד",
    "codeInputLabel": "קלט קוד",
    "codePlaceholder": "הדבק או הקלד את המקטע כאן..."
  },
  "ms": {
    "inputTitle": "Kod",
    "codeInputLabel": "Input kod",
    "codePlaceholder": "Tampal atau taip potongan kod di sini..."
  },
  "no": {
    "inputTitle": "Kode",
    "codeInputLabel": "Kodeinndata",
    "codePlaceholder": "Lim inn eller skriv utdraget her..."
  }
}
</i18n>
