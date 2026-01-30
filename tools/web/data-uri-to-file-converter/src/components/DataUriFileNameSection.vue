<template>
  <ToolSection>
    <n-form-item :label="t('file-name')" :show-feedback="false">
      <n-input v-model:value="fileNameModel" :placeholder="t('file-name-placeholder')" />
    </n-form-item>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFormItem, NInput } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection } from '@shared/ui/tool'

const props = defineProps<{
  fileName: string
}>()

const emit = defineEmits<{
  (event: 'update:fileName', value: string): void
}>()

const { t } = useI18n()

const fileNameModel = computed({
  get: () => props.fileName,
  set: (value: string) => emit('update:fileName', value),
})
</script>

<i18n lang="json">
{
  "en": {
    "file-name": "File name",
    "file-name-placeholder": "e.g. data.png"
  },
  "zh": {
    "file-name": "文件名",
    "file-name-placeholder": "例如 data.png"
  },
  "zh-CN": {
    "file-name": "文件名",
    "file-name-placeholder": "例如 data.png"
  },
  "zh-TW": {
    "file-name": "檔案名稱",
    "file-name-placeholder": "例如 data.png"
  },
  "zh-HK": {
    "file-name": "檔案名稱",
    "file-name-placeholder": "例如 data.png"
  },
  "es": {
    "file-name": "Nombre de archivo",
    "file-name-placeholder": "p. ej. data.png"
  },
  "fr": {
    "file-name": "Nom de fichier",
    "file-name-placeholder": "ex. data.png"
  },
  "de": {
    "file-name": "Dateiname",
    "file-name-placeholder": "z. B. data.png"
  },
  "it": {
    "file-name": "Nome file",
    "file-name-placeholder": "es. data.png"
  },
  "ja": {
    "file-name": "ファイル名",
    "file-name-placeholder": "例: data.png"
  },
  "ko": {
    "file-name": "파일 이름",
    "file-name-placeholder": "예: data.png"
  },
  "ru": {
    "file-name": "Имя файла",
    "file-name-placeholder": "например, data.png"
  },
  "pt": {
    "file-name": "Nome do arquivo",
    "file-name-placeholder": "ex.: data.png"
  },
  "ar": {
    "file-name": "اسم الملف",
    "file-name-placeholder": "مثل data.png"
  },
  "hi": {
    "file-name": "फ़ाइल नाम",
    "file-name-placeholder": "जैसे data.png"
  },
  "tr": {
    "file-name": "Dosya adı",
    "file-name-placeholder": "örn. data.png"
  },
  "nl": {
    "file-name": "Bestandsnaam",
    "file-name-placeholder": "bijv. data.png"
  },
  "sv": {
    "file-name": "Filnamn",
    "file-name-placeholder": "t.ex. data.png"
  },
  "pl": {
    "file-name": "Nazwa pliku",
    "file-name-placeholder": "np. data.png"
  },
  "vi": {
    "file-name": "Tên tệp",
    "file-name-placeholder": "vd. data.png"
  },
  "th": {
    "file-name": "ชื่อไฟล์",
    "file-name-placeholder": "เช่น data.png"
  },
  "id": {
    "file-name": "Nama file",
    "file-name-placeholder": "mis. data.png"
  },
  "he": {
    "file-name": "שם קובץ",
    "file-name-placeholder": "למשל data.png"
  },
  "ms": {
    "file-name": "Nama fail",
    "file-name-placeholder": "cth. data.png"
  },
  "no": {
    "file-name": "Filnavn",
    "file-name-placeholder": "f.eks. data.png"
  }
}
</i18n>
