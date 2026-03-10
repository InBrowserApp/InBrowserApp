<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-form label-placement="top">
      <n-form-item :label="t('outputName')" :show-feedback="false">
        <n-input
          :value="outputName"
          :placeholder="t('outputPlaceholder')"
          @update:value="emit('update:output-name', $event)"
        />
      </n-form-item>
    </n-form>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NForm, NFormItem, NInput } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  outputName: string
}>()

const emit = defineEmits<{
  (event: 'update:output-name', value: string): void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": { "title": "Document", "outputName": "File name", "outputPlaceholder": "images" },
  "zh": { "title": "文档", "outputName": "文件名", "outputPlaceholder": "images" },
  "zh-CN": { "title": "文档", "outputName": "文件名", "outputPlaceholder": "images" },
  "zh-TW": { "title": "文件", "outputName": "檔名", "outputPlaceholder": "images" },
  "zh-HK": { "title": "文件", "outputName": "檔名", "outputPlaceholder": "images" },
  "es": { "title": "Documento", "outputName": "Nombre del archivo", "outputPlaceholder": "images" },
  "fr": { "title": "Document", "outputName": "Nom du fichier", "outputPlaceholder": "images" },
  "de": { "title": "Dokument", "outputName": "Dateiname", "outputPlaceholder": "images" },
  "it": { "title": "Documento", "outputName": "Nome file", "outputPlaceholder": "images" },
  "ja": { "title": "ドキュメント", "outputName": "ファイル名", "outputPlaceholder": "images" },
  "ko": { "title": "문서", "outputName": "파일 이름", "outputPlaceholder": "images" },
  "ru": { "title": "Документ", "outputName": "Имя файла", "outputPlaceholder": "images" },
  "pt": { "title": "Documento", "outputName": "Nome do arquivo", "outputPlaceholder": "images" },
  "ar": { "title": "المستند", "outputName": "اسم الملف", "outputPlaceholder": "images" },
  "hi": { "title": "दस्तावेज़", "outputName": "फ़ाइल नाम", "outputPlaceholder": "images" },
  "tr": { "title": "Belge", "outputName": "Dosya adı", "outputPlaceholder": "images" },
  "nl": { "title": "Document", "outputName": "Bestandsnaam", "outputPlaceholder": "images" },
  "sv": { "title": "Dokument", "outputName": "Filnamn", "outputPlaceholder": "images" },
  "pl": { "title": "Dokument", "outputName": "Nazwa pliku", "outputPlaceholder": "images" },
  "vi": { "title": "Tài liệu", "outputName": "Tên tệp", "outputPlaceholder": "images" },
  "th": { "title": "เอกสาร", "outputName": "ชื่อไฟล์", "outputPlaceholder": "images" },
  "id": { "title": "Dokumen", "outputName": "Nama file", "outputPlaceholder": "images" },
  "he": { "title": "מסמך", "outputName": "שם קובץ", "outputPlaceholder": "images" },
  "ms": { "title": "Dokumen", "outputName": "Nama fail", "outputPlaceholder": "images" },
  "no": { "title": "Dokument", "outputName": "Filnavn", "outputPlaceholder": "images" }
}
</i18n>
