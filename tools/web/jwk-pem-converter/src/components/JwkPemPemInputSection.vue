<template>
  <ToolSectionHeader>{{ t('pemInputTitle') }}</ToolSectionHeader>
  <ToolSection>
    <TextOrFileInput
      v-model:value="inputModel"
      class="monospace-field"
      :placeholder="t('pemInputPlaceholder')"
      :accept="accept"
      :status="status"
      :wrap-with-form-item="false"
    />
    <n-text depth="3" class="input-hint">{{ t('pemInputHint') }}</n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { TextOrFileInput } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const props = defineProps<{
  modelValue: string | File
  accept: string
  status?: 'error' | 'success'
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | File): void
}>()

const { t } = useI18n()

const inputModel = computed({
  get: () => props.modelValue,
  set: (value: string | File) => emit('update:modelValue', value),
})
</script>

<style scoped>
.monospace-field :deep(textarea) {
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}

.input-hint {
  display: block;
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "pemInputTitle": "PEM Input",
    "pemInputPlaceholder": "Paste PEM content or drop a file...",
    "pemInputHint": "Supported: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "zh": {
    "pemInputTitle": "PEM 输入",
    "pemInputPlaceholder": "粘贴 PEM 内容或拖入文件...",
    "pemInputHint": "支持：PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "zh-CN": {
    "pemInputTitle": "PEM 输入",
    "pemInputPlaceholder": "粘贴 PEM 内容或拖入文件...",
    "pemInputHint": "支持：PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "zh-TW": {
    "pemInputTitle": "PEM 輸入",
    "pemInputPlaceholder": "貼上 PEM 內容或拖曳檔案...",
    "pemInputHint": "支援：PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "zh-HK": {
    "pemInputTitle": "PEM 輸入",
    "pemInputPlaceholder": "貼上 PEM 內容或拖曳檔案...",
    "pemInputHint": "支援：PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "es": {
    "pemInputTitle": "Entrada PEM",
    "pemInputPlaceholder": "Pega el contenido PEM o suelta un archivo...",
    "pemInputHint": "Compatible: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "fr": {
    "pemInputTitle": "Entrée PEM",
    "pemInputPlaceholder": "Collez le contenu PEM ou déposez un fichier...",
    "pemInputHint": "Pris en charge : PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "de": {
    "pemInputTitle": "PEM-Eingabe",
    "pemInputPlaceholder": "PEM-Inhalt einfügen oder Datei ablegen...",
    "pemInputHint": "Unterstützt: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "it": {
    "pemInputTitle": "Input PEM",
    "pemInputPlaceholder": "Incolla il contenuto PEM o trascina un file...",
    "pemInputHint": "Supportati: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "ja": {
    "pemInputTitle": "PEM 入力",
    "pemInputPlaceholder": "PEM を貼り付けるかファイルをドロップ...",
    "pemInputHint": "対応形式: PUBLIC KEY、PRIVATE KEY、RSA PUBLIC KEY、RSA PRIVATE KEY、EC PRIVATE KEY。"
  },
  "ko": {
    "pemInputTitle": "PEM 입력",
    "pemInputPlaceholder": "PEM 내용을 붙여넣거나 파일을 드롭...",
    "pemInputHint": "지원: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "ru": {
    "pemInputTitle": "Ввод PEM",
    "pemInputPlaceholder": "Вставьте PEM или перетащите файл...",
    "pemInputHint": "Поддерживается: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "pt": {
    "pemInputTitle": "Entrada PEM",
    "pemInputPlaceholder": "Cole o conteúdo PEM ou solte um arquivo...",
    "pemInputHint": "Compatível: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "ar": {
    "pemInputTitle": "إدخال PEM",
    "pemInputPlaceholder": "الصق محتوى PEM أو اسحب ملفًا...",
    "pemInputHint": "المدعوم: PUBLIC KEY وPRIVATE KEY وRSA PUBLIC KEY وRSA PRIVATE KEY وEC PRIVATE KEY."
  },
  "hi": {
    "pemInputTitle": "PEM इनपुट",
    "pemInputPlaceholder": "PEM सामग्री पेस्ट करें या फ़ाइल ड्रॉप करें...",
    "pemInputHint": "समर्थित: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "tr": {
    "pemInputTitle": "PEM Girdi",
    "pemInputPlaceholder": "PEM içeriği yapıştırın veya dosya bırakın...",
    "pemInputHint": "Desteklenen: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "nl": {
    "pemInputTitle": "PEM-invoer",
    "pemInputPlaceholder": "Plak PEM-inhoud of sleep een bestand...",
    "pemInputHint": "Ondersteund: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "sv": {
    "pemInputTitle": "PEM-inmatning",
    "pemInputPlaceholder": "Klistra in PEM eller släpp en fil...",
    "pemInputHint": "Stöds: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "pl": {
    "pemInputTitle": "Wejście PEM",
    "pemInputPlaceholder": "Wklej PEM lub upuść plik...",
    "pemInputHint": "Obsługiwane: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "vi": {
    "pemInputTitle": "Nhập PEM",
    "pemInputPlaceholder": "Dán nội dung PEM hoặc thả tệp...",
    "pemInputHint": "Hỗ trợ: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "th": {
    "pemInputTitle": "อินพุต PEM",
    "pemInputPlaceholder": "วางเนื้อหา PEM หรือวางไฟล์...",
    "pemInputHint": "รองรับ: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "id": {
    "pemInputTitle": "Input PEM",
    "pemInputPlaceholder": "Tempel konten PEM atau jatuhkan file...",
    "pemInputHint": "Didukung: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "he": {
    "pemInputTitle": "קלט PEM",
    "pemInputPlaceholder": "הדבק תוכן PEM או גרור קובץ...",
    "pemInputHint": "נתמך: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "ms": {
    "pemInputTitle": "Input PEM",
    "pemInputPlaceholder": "Tampal kandungan PEM atau seret fail...",
    "pemInputHint": "Disokong: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  },
  "no": {
    "pemInputTitle": "PEM-inndata",
    "pemInputPlaceholder": "Lim inn PEM eller dra inn en fil...",
    "pemInputHint": "Støttet: PUBLIC KEY, PRIVATE KEY, RSA PUBLIC KEY, RSA PRIVATE KEY, EC PRIVATE KEY."
  }
}
</i18n>
