<template>
  <ToolSectionHeader>{{ t('data-uri-input') }}</ToolSectionHeader>
  <ToolSection>
    <n-input
      v-model:value="dataUriModel"
      class="data-uri-input"
      type="textarea"
      :placeholder="t('data-uri-placeholder')"
      :autosize="{ minRows: 4, maxRows: 12 }"
    />
  </ToolSection>
  <ToolSection v-if="showError">
    <n-text type="error">{{ t('invalid-data-uri') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NInput, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  dataUri: string
  showError: boolean
}>()

const emit = defineEmits<{
  (event: 'update:dataUri', value: string): void
}>()

const { t } = useI18n()

const dataUriModel = computed({
  get: () => props.dataUri,
  set: (value: string) => emit('update:dataUri', value),
})
</script>

<style scoped>
.data-uri-input :deep(textarea) {
  white-space: pre-wrap !important;
  word-break: break-all !important;
  overflow-wrap: anywhere;
}
</style>

<i18n lang="json">
{
  "en": {
    "data-uri-input": "Data URI Input",
    "data-uri-placeholder": "Paste Data URI here...",
    "invalid-data-uri": "Invalid Data URI"
  },
  "zh": {
    "data-uri-input": "Data URI 输入",
    "data-uri-placeholder": "在此粘贴 Data URI...",
    "invalid-data-uri": "无效的 Data URI"
  },
  "zh-CN": {
    "data-uri-input": "Data URI 输入",
    "data-uri-placeholder": "在此粘贴 Data URI...",
    "invalid-data-uri": "无效的 Data URI"
  },
  "zh-TW": {
    "data-uri-input": "Data URI 輸入",
    "data-uri-placeholder": "在此貼上 Data URI...",
    "invalid-data-uri": "無效的 Data URI"
  },
  "zh-HK": {
    "data-uri-input": "Data URI 輸入",
    "data-uri-placeholder": "在此貼上 Data URI...",
    "invalid-data-uri": "無效的 Data URI"
  },
  "es": {
    "data-uri-input": "Entrada Data URI",
    "data-uri-placeholder": "Pega Data URI aquí...",
    "invalid-data-uri": "Data URI inválido"
  },
  "fr": {
    "data-uri-input": "Entrée Data URI",
    "data-uri-placeholder": "Collez le Data URI ici...",
    "invalid-data-uri": "Data URI invalide"
  },
  "de": {
    "data-uri-input": "Data-URI-Eingabe",
    "data-uri-placeholder": "Data URI hier einfügen...",
    "invalid-data-uri": "Ungültiger Data URI"
  },
  "it": {
    "data-uri-input": "Input Data URI",
    "data-uri-placeholder": "Incolla Data URI qui...",
    "invalid-data-uri": "Data URI non valido"
  },
  "ja": {
    "data-uri-input": "Data URI 入力",
    "data-uri-placeholder": "ここに Data URI を貼り付け...",
    "invalid-data-uri": "無効な Data URI"
  },
  "ko": {
    "data-uri-input": "Data URI 입력",
    "data-uri-placeholder": "여기에 Data URI를 붙여넣기...",
    "invalid-data-uri": "유효하지 않은 Data URI"
  },
  "ru": {
    "data-uri-input": "Ввод Data URI",
    "data-uri-placeholder": "Вставьте Data URI здесь...",
    "invalid-data-uri": "Неверный Data URI"
  },
  "pt": {
    "data-uri-input": "Entrada Data URI",
    "data-uri-placeholder": "Cole o Data URI aqui...",
    "invalid-data-uri": "Data URI inválido"
  },
  "ar": {
    "data-uri-input": "إدخال Data URI",
    "data-uri-placeholder": "الصق Data URI هنا...",
    "invalid-data-uri": "Data URI غير صالح"
  },
  "hi": {
    "data-uri-input": "Data URI इनपुट",
    "data-uri-placeholder": "यहाँ Data URI पेस्ट करें...",
    "invalid-data-uri": "अमान्य Data URI"
  },
  "tr": {
    "data-uri-input": "Data URI Girişi",
    "data-uri-placeholder": "Data URI'yi buraya yapıştırın...",
    "invalid-data-uri": "Geçersiz Data URI"
  },
  "nl": {
    "data-uri-input": "Data URI-invoer",
    "data-uri-placeholder": "Plak Data URI hier...",
    "invalid-data-uri": "Ongeldige Data URI"
  },
  "sv": {
    "data-uri-input": "Data URI-indata",
    "data-uri-placeholder": "Klistra in Data URI här...",
    "invalid-data-uri": "Ogiltig Data URI"
  },
  "pl": {
    "data-uri-input": "Wejście Data URI",
    "data-uri-placeholder": "Wklej Data URI tutaj...",
    "invalid-data-uri": "Nieprawidłowy Data URI"
  },
  "vi": {
    "data-uri-input": "Nhập Data URI",
    "data-uri-placeholder": "Dán Data URI vào đây...",
    "invalid-data-uri": "Data URI không hợp lệ"
  },
  "th": {
    "data-uri-input": "อินพุต Data URI",
    "data-uri-placeholder": "วาง Data URI ที่นี่...",
    "invalid-data-uri": "Data URI ไม่ถูกต้อง"
  },
  "id": {
    "data-uri-input": "Masukan Data URI",
    "data-uri-placeholder": "Tempel Data URI di sini...",
    "invalid-data-uri": "Data URI tidak valid"
  },
  "he": {
    "data-uri-input": "קלט Data URI",
    "data-uri-placeholder": "הדבק Data URI כאן...",
    "invalid-data-uri": "Data URI לא תקין"
  },
  "ms": {
    "data-uri-input": "Input Data URI",
    "data-uri-placeholder": "Tampal Data URI di sini...",
    "invalid-data-uri": "Data URI tidak sah"
  },
  "no": {
    "data-uri-input": "Data URI-inndata",
    "data-uri-placeholder": "Lim inn Data URI her...",
    "invalid-data-uri": "Ugyldig Data URI"
  }
}
</i18n>
