<template>
  <ToolSectionHeader>{{ t('output-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-input
      :value="previewText"
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 12 }"
      :placeholder="t('output-placeholder')"
      readonly
    />
    <n-text v-show="isTruncated" depth="3" class="preview-note">{{
      t('preview-truncated')
    }}</n-text>
  </ToolSection>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-flex align="center" :size="8">
        <CopyToClipboardButton :content="decodedText" />
        <n-button
          tag="a"
          text
          :href="downloadUrl ?? undefined"
          :download="downloadName"
          :disabled="!decodedBytes"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download') }}
        </n-button>
      </n-flex>
      <n-text v-show="error" type="error">{{ error }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NInput, NText } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

defineProps<{
  previewText: string
  isTruncated: boolean
  decodedText: string
  decodedBytes: Uint8Array | null
  downloadUrl?: string | null
  downloadName: string
  error: string
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<style scoped>
.preview-note {
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "output-title": "Decoded Output",
    "output-placeholder": "Decoded text will appear here...",
    "download": "Download file",
    "preview-truncated": "Preview truncated"
  },
  "zh": {
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "preview-truncated": "预览已截断"
  },
  "zh-CN": {
    "output-title": "解码结果",
    "output-placeholder": "解码后的文本将显示在这里...",
    "download": "下载文件",
    "preview-truncated": "预览已截断"
  },
  "zh-TW": {
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "preview-truncated": "預覽已截斷"
  },
  "zh-HK": {
    "output-title": "解碼結果",
    "output-placeholder": "解碼後的文字會顯示在這裡...",
    "download": "下載檔案",
    "preview-truncated": "預覽已截斷"
  },
  "es": {
    "output-title": "Salida Decodificada",
    "output-placeholder": "El texto decodificado aparecerá aquí...",
    "download": "Descargar archivo",
    "preview-truncated": "Vista previa truncada"
  },
  "fr": {
    "output-title": "Sortie décodée",
    "output-placeholder": "Le texte décodé apparaîtra ici...",
    "download": "Télécharger le fichier",
    "preview-truncated": "Aperçu tronqué"
  },
  "de": {
    "output-title": "Dekodierte Ausgabe",
    "output-placeholder": "Der decodierte Text erscheint hier...",
    "download": "Datei herunterladen",
    "preview-truncated": "Vorschau gekürzt"
  },
  "it": {
    "output-title": "Output decodificato",
    "output-placeholder": "Il testo decodificato apparirà qui...",
    "download": "Scarica file",
    "preview-truncated": "Anteprima troncata"
  },
  "ja": {
    "output-title": "デコード結果",
    "output-placeholder": "デコードされたテキストがここに表示されます...",
    "download": "ファイルをダウンロード",
    "preview-truncated": "プレビューは切り詰められました"
  },
  "ko": {
    "output-title": "디코딩된 출력",
    "output-placeholder": "디코딩된 텍스트가 여기에 표시됩니다...",
    "download": "파일 다운로드",
    "preview-truncated": "미리보기 잘림"
  },
  "ru": {
    "output-title": "Декодированный вывод",
    "output-placeholder": "Декодированный текст появится здесь...",
    "download": "Скачать файл",
    "preview-truncated": "Предпросмотр обрезан"
  },
  "pt": {
    "output-title": "Saída decodificada",
    "output-placeholder": "O texto decodificado aparecerá aqui...",
    "download": "Baixar arquivo",
    "preview-truncated": "Pré-visualização truncada"
  },
  "ar": {
    "output-title": "المخرجات المفككة",
    "output-placeholder": "سيظهر النص المفكك هنا...",
    "download": "تنزيل الملف",
    "preview-truncated": "تم اقتطاع المعاينة"
  },
  "hi": {
    "output-title": "डिकोडेड आउटपुट",
    "output-placeholder": "डिकोड किया गया पाठ यहां दिखाई देगा...",
    "download": "फ़ाइल डाउनलोड करें",
    "preview-truncated": "प्रीव्यू संक्षिप्त किया गया"
  },
  "tr": {
    "output-title": "Çözümlenen Çıktı",
    "output-placeholder": "Çözümlenen metin burada görünecek...",
    "download": "Dosyayı indir",
    "preview-truncated": "Önizleme kısaltıldı"
  },
  "nl": {
    "output-title": "Gedecodeerde uitvoer",
    "output-placeholder": "Gedecodeerde tekst verschijnt hier...",
    "download": "Bestand downloaden",
    "preview-truncated": "Voorbeeld ingekort"
  },
  "sv": {
    "output-title": "Avkodad utdata",
    "output-placeholder": "Avkodad text visas här...",
    "download": "Ladda ner fil",
    "preview-truncated": "Förhandsvisning avkortad"
  },
  "pl": {
    "output-title": "Zdekodowane dane",
    "output-placeholder": "Zdekodowany tekst pojawi się tutaj...",
    "download": "Pobierz plik",
    "preview-truncated": "Podgląd skrócony"
  },
  "vi": {
    "output-title": "Đầu ra đã giải mã",
    "output-placeholder": "Văn bản đã giải mã sẽ xuất hiện ở đây...",
    "download": "Tải tệp",
    "preview-truncated": "Bản xem trước bị cắt"
  },
  "th": {
    "output-title": "ผลลัพธ์ที่ถอดรหัส",
    "output-placeholder": "ข้อความที่ถอดรหัสจะปรากฏที่นี่...",
    "download": "ดาวน์โหลดไฟล์",
    "preview-truncated": "ตัวอย่างถูกตัดทอน"
  },
  "id": {
    "output-title": "Output terdekode",
    "output-placeholder": "Teks yang didekodekan akan muncul di sini...",
    "download": "Unduh file",
    "preview-truncated": "Pratinjau dipotong"
  },
  "he": {
    "output-title": "פלט מפוענח",
    "output-placeholder": "הטקסט המפוענח יוצג כאן...",
    "download": "הורד קובץ",
    "preview-truncated": "התצוגה המקדימה קוצרה"
  },
  "ms": {
    "output-title": "Output dinyahkod",
    "output-placeholder": "Teks yang dinyahkod akan dipaparkan di sini...",
    "download": "Muat turun fail",
    "preview-truncated": "Pratonton dipendekkan"
  },
  "no": {
    "output-title": "Dekodet output",
    "output-placeholder": "Dekodet tekst vises her...",
    "download": "Last ned fil",
    "preview-truncated": "Forhåndsvisning avkortet"
  }
}
</i18n>
