<template>
  <n-grid cols="2 l:4" responsive="screen" :x-gap="40" :y-gap="20">
    <n-gi span="2 l:3">
      <ToolSectionHeader>{{ t('options') }}</ToolSectionHeader>
      <ToolSection>
        <PlaceholderOptionsForm
          v-model:width="width"
          v-model:height="height"
          v-model:bg-type="bgType"
          v-model:bg-color="bgColor"
          v-model:gradient-color1="gradientColor1"
          v-model:gradient-color2="gradientColor2"
          v-model:gradient-angle="gradientAngle"
          v-model:text-color="textColor"
          v-model:custom-text="customText"
          v-model:font-size="fontSize"
        />
      </ToolSection>
    </n-gi>
    <n-gi span="2 l:1">
      <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
      <ToolSection>
        <PlaceholderPreview
          :width="width"
          :height="height"
          :bg-type="bgType"
          :bg-color="bgColor"
          :gradient-color1="gradientColor1"
          :gradient-color2="gradientColor2"
          :gradient-angle="gradientAngle"
          :text-color="textColor"
          :custom-text="customText"
          :font-size="fontSize"
        />
      </ToolSection>
      <ToolSectionHeader>{{ t('export') }}</ToolSectionHeader>
      <ToolSection>
        <PlaceholderDownloadButtons :options="options" />
      </ToolSection>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NGrid, NGi } from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import PlaceholderOptionsForm from './PlaceholderOptionsForm.vue'
import PlaceholderPreview from './PlaceholderPreview.vue'
import PlaceholderDownloadButtons from './PlaceholderDownloadButtons.vue'

const { t } = useI18n()

const width = useStorage<number>('tools:placeholder:width', 800)
const height = useStorage<number>('tools:placeholder:height', 600)
const bgType = useStorage<'solid' | 'linear-gradient' | 'radial-gradient'>(
  'tools:placeholder:bgType',
  'solid',
)
const bgColor = useStorage<string>('tools:placeholder:bgColor', '#CCCCCC')
const gradientColor1 = useStorage<string>('tools:placeholder:gradientColor1', '#667eea')
const gradientColor2 = useStorage<string>('tools:placeholder:gradientColor2', '#764ba2')
const gradientAngle = useStorage<number>('tools:placeholder:gradientAngle', 45)
const textColor = useStorage<string>('tools:placeholder:textColor', '#969696')
const customText = useStorage<string>('tools:placeholder:customText', '')
const fontSize = useStorage<number>('tools:placeholder:fontSize', 0)

const options = computed(() => ({
  width: width.value,
  height: height.value,
  bgType: bgType.value,
  bgColor: bgColor.value,
  gradientColor1: gradientColor1.value,
  gradientColor2: gradientColor2.value,
  gradientAngle: gradientAngle.value,
  textColor: textColor.value,
  customText: customText.value,
  fontSize: fontSize.value,
}))
</script>

<i18n lang="json">
{
  "en": {
    "options": "Options",
    "preview": "Preview",
    "export": "Export"
  },
  "zh": {
    "options": "选项",
    "preview": "预览",
    "export": "导出"
  },
  "zh-CN": {
    "options": "选项",
    "preview": "预览",
    "export": "导出"
  },
  "zh-TW": {
    "options": "選項",
    "preview": "預覽",
    "export": "匯出"
  },
  "zh-HK": {
    "options": "選項",
    "preview": "預覽",
    "export": "匯出"
  },
  "es": {
    "options": "Opciones",
    "preview": "Vista previa",
    "export": "Exportar"
  },
  "fr": {
    "options": "Options",
    "preview": "Aperçu",
    "export": "Exporter"
  },
  "de": {
    "options": "Optionen",
    "preview": "Vorschau",
    "export": "Exportieren"
  },
  "it": {
    "options": "Opzioni",
    "preview": "Anteprima",
    "export": "Esporta"
  },
  "ja": {
    "options": "オプション",
    "preview": "プレビュー",
    "export": "エクスポート"
  },
  "ko": {
    "options": "옵션",
    "preview": "미리보기",
    "export": "내보내기"
  },
  "ru": {
    "options": "Параметры",
    "preview": "Предпросмотр",
    "export": "Экспорт"
  },
  "pt": {
    "options": "Opções",
    "preview": "Pré-visualização",
    "export": "Exportar"
  },
  "ar": {
    "options": "الخيارات",
    "preview": "معاينة",
    "export": "تصدير"
  },
  "hi": {
    "options": "विकल्प",
    "preview": "पूर्वावलोकन",
    "export": "निर्यात"
  },
  "tr": {
    "options": "Seçenekler",
    "preview": "Önizleme",
    "export": "Dışa aktar"
  },
  "nl": {
    "options": "Opties",
    "preview": "Voorbeeld",
    "export": "Exporteren"
  },
  "sv": {
    "options": "Alternativ",
    "preview": "Förhandsvisning",
    "export": "Exportera"
  },
  "pl": {
    "options": "Opcje",
    "preview": "Podgląd",
    "export": "Eksportuj"
  },
  "vi": {
    "options": "Tùy chọn",
    "preview": "Xem trước",
    "export": "Xuất"
  },
  "th": {
    "options": "ตัวเลือก",
    "preview": "ดูตัวอย่าง",
    "export": "ส่งออก"
  },
  "id": {
    "options": "Opsi",
    "preview": "Pratinjau",
    "export": "Ekspor"
  },
  "he": {
    "options": "אפשרויות",
    "preview": "תצוגה מקדימה",
    "export": "ייצוא"
  },
  "ms": {
    "options": "Pilihan",
    "preview": "Pratonton",
    "export": "Eksport"
  },
  "no": {
    "options": "Alternativer",
    "preview": "Forhåndsvisning",
    "export": "Eksporter"
  }
}
</i18n>
