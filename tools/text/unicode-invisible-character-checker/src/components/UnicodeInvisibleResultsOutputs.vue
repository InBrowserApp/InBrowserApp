<template>
  <n-grid cols="1 m:2" responsive="screen" :x-gap="12" :y-gap="12" class="output-grid">
    <n-form-item-gi :show-feedback="false" label-style="width: 100%">
      <template #label>
        <n-flex align="center" justify="space-between" class="output-label">
          <span>{{ t('cleaned-title') }}</span>
          <n-flex align="center" :size="8" class="output-actions">
            <CopyToClipboardButton :content="cleanedText" />
            <n-button
              tag="a"
              text
              :href="downloadUrl"
              download="cleaned.txt"
              :disabled="!cleanedText"
            >
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('download-cleaned') }}
            </n-button>
          </n-flex>
        </n-flex>
      </template>
      <n-input
        :value="cleanedText"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 14 }"
        readonly
      />
    </n-form-item-gi>

    <n-form-item-gi :show-feedback="false" label-style="width: 100%">
      <template #label>
        <n-flex align="center" justify="space-between" class="output-label">
          <span>{{ t('annotated-title') }}</span>
          <n-flex align="center" :size="8" class="output-actions">
            <CopyToClipboardButton :content="annotatedText" />
            <n-button
              tag="a"
              text
              :href="annotatedDownloadUrl"
              download="annotated.txt"
              :disabled="!annotatedText"
            >
              <template #icon>
                <n-icon :component="ArrowDownload16Regular" />
              </template>
              {{ t('download-annotated') }}
            </n-button>
          </n-flex>
        </n-flex>
      </template>
      <n-input
        :value="annotatedText"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 14 }"
        readonly
      />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NFormItemGi, NGrid, NIcon, NInput } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { CopyToClipboardButton } from '@shared/ui/base'

const props = defineProps<{
  cleanedText: string
  annotatedText: string
}>()

const { t } = useI18n()

const downloadBlob = computed(
  () => new Blob([props.cleanedText], { type: 'text/plain;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)
const annotatedBlob = computed(
  () => new Blob([props.annotatedText], { type: 'text/plain;charset=utf-8' }),
)
const annotatedDownloadUrl = useObjectUrl(annotatedBlob)
</script>

<style scoped>
.output-grid {
  margin-top: 12px;
}

.output-label {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  width: 100%;
}

.output-actions {
  align-items: center;
  display: inline-flex;
  flex-shrink: 0;
  gap: 8px;
}

:deep(.n-form-item-label__text) {
  display: block;
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "cleaned-title": "Cleaned text",
    "download-cleaned": "Download cleaned text",
    "download-annotated": "Download annotated preview",
    "annotated-title": "Annotated preview"
  },
  "zh": {
    "cleaned-title": "清理后的文本",
    "download-cleaned": "下载清理文本",
    "download-annotated": "下载标注预览",
    "annotated-title": "标注预览"
  },
  "zh-CN": {
    "cleaned-title": "清理后的文本",
    "download-cleaned": "下载清理文本",
    "download-annotated": "下载标注预览",
    "annotated-title": "标注预览"
  },
  "zh-TW": {
    "cleaned-title": "清理後的文字",
    "download-cleaned": "下載清理文字",
    "download-annotated": "下載標註預覽",
    "annotated-title": "標註預覽"
  },
  "zh-HK": {
    "cleaned-title": "清理後的文字",
    "download-cleaned": "下載清理文字",
    "download-annotated": "下載標註預覽",
    "annotated-title": "標註預覽"
  },
  "es": {
    "cleaned-title": "Texto limpio",
    "download-cleaned": "Descargar texto limpio",
    "download-annotated": "Descargar vista anotada",
    "annotated-title": "Vista anotada"
  },
  "fr": {
    "cleaned-title": "Texte nettoyé",
    "download-cleaned": "Télécharger le texte nettoyé",
    "download-annotated": "Télécharger l'aperçu annoté",
    "annotated-title": "Aperçu annoté"
  },
  "de": {
    "cleaned-title": "Bereinigter Text",
    "download-cleaned": "Bereinigten Text herunterladen",
    "download-annotated": "Annotierte Vorschau herunterladen",
    "annotated-title": "Annotierte Vorschau"
  },
  "it": {
    "cleaned-title": "Testo pulito",
    "download-cleaned": "Scarica testo pulito",
    "download-annotated": "Scarica anteprima annotata",
    "annotated-title": "Anteprima annotata"
  },
  "ja": {
    "cleaned-title": "クリーンなテキスト",
    "download-cleaned": "クリーンテキストをダウンロード",
    "download-annotated": "注釈付きプレビューをダウンロード",
    "annotated-title": "注釈付きプレビュー"
  },
  "ko": {
    "cleaned-title": "정리된 텍스트",
    "download-cleaned": "정리된 텍스트 다운로드",
    "download-annotated": "주석 미리보기 다운로드",
    "annotated-title": "주석 미리보기"
  },
  "ru": {
    "cleaned-title": "Очищенный текст",
    "download-cleaned": "Скачать очищенный текст",
    "download-annotated": "Скачать аннотированный просмотр",
    "annotated-title": "Аннотированный просмотр"
  },
  "pt": {
    "cleaned-title": "Texto limpo",
    "download-cleaned": "Baixar texto limpo",
    "download-annotated": "Baixar pré-visualização anotada",
    "annotated-title": "Pré-visualização anotada"
  },
  "ar": {
    "cleaned-title": "نص نظيف",
    "download-cleaned": "تنزيل النص النظيف",
    "download-annotated": "تنزيل المعاينة مع تعليقات",
    "annotated-title": "معاينة مع تعليقات"
  },
  "hi": {
    "cleaned-title": "साफ़ किया गया टेक्स्ट",
    "download-cleaned": "साफ़ टेक्स्ट डाउनलोड करें",
    "download-annotated": "एनोटेटेड पूर्वावलोकन डाउनलोड करें",
    "annotated-title": "एनोटेटेड पूर्वावलोकन"
  },
  "tr": {
    "cleaned-title": "Temizlenmiş metin",
    "download-cleaned": "Temizlenmiş metni indir",
    "download-annotated": "Açıklamalı önizlemeyi indir",
    "annotated-title": "Açıklamalı önizleme"
  },
  "nl": {
    "cleaned-title": "Schone tekst",
    "download-cleaned": "Schone tekst downloaden",
    "download-annotated": "Geannoteerd voorbeeld downloaden",
    "annotated-title": "Geannoteerd voorbeeld"
  },
  "sv": {
    "cleaned-title": "Rensad text",
    "download-cleaned": "Ladda ner rensad text",
    "download-annotated": "Ladda ner annoterad förhandsvisning",
    "annotated-title": "Annoterad förhandsvisning"
  },
  "pl": {
    "cleaned-title": "Oczyszczony tekst",
    "download-cleaned": "Pobierz oczyszczony tekst",
    "download-annotated": "Pobierz podgląd z adnotacjami",
    "annotated-title": "Podgląd z adnotacjami"
  },
  "vi": {
    "cleaned-title": "Văn bản đã làm sạch",
    "download-cleaned": "Tải văn bản đã làm sạch",
    "download-annotated": "Tải bản xem trước có chú thích",
    "annotated-title": "Xem trước có chú thích"
  },
  "th": {
    "cleaned-title": "ข้อความที่ทำความสะอาดแล้ว",
    "download-cleaned": "ดาวน์โหลดข้อความที่ทำความสะอาดแล้ว",
    "download-annotated": "ดาวน์โหลดตัวอย่างที่มีคำอธิบาย",
    "annotated-title": "ตัวอย่างที่มีคำอธิบาย"
  },
  "id": {
    "cleaned-title": "Teks bersih",
    "download-cleaned": "Unduh teks bersih",
    "download-annotated": "Unduh pratinjau beranotasi",
    "annotated-title": "Pratinjau beranotasi"
  },
  "he": {
    "cleaned-title": "טקסט נקי",
    "download-cleaned": "הורד טקסט נקי",
    "download-annotated": "הורד תצוגה מוערת",
    "annotated-title": "תצוגה מוערת"
  },
  "ms": {
    "cleaned-title": "Teks bersih",
    "download-cleaned": "Muat turun teks bersih",
    "download-annotated": "Muat turun pratonton beranotasi",
    "annotated-title": "Pratonton beranotasi"
  },
  "no": {
    "cleaned-title": "Renset tekst",
    "download-cleaned": "Last ned renset tekst",
    "download-annotated": "Last ned annotert forhåndsvisning",
    "annotated-title": "Annotert forhåndsvisning"
  }
}
</i18n>
