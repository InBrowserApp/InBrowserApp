<template>
  <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-button
        type="primary"
        :loading="isGenerating"
        :disabled="!canGenerate"
        @click="emit('generate')"
      >
        {{ isGenerating ? t('generating') : t('generate') }}
      </n-button>

      <n-alert v-if="rangeErrorMessage" type="error" :title="rangeErrorMessage" />
      <n-alert v-if="generateErrorMessage" type="error" :title="generateErrorMessage" />

      <n-flex v-if="hasResult && downloadUrl" align="center" justify="space-between" :wrap="false">
        <n-text>
          {{ t('resultReady') }} {{ resultFileCount }}
          {{ resultFileCount === 1 ? t('file') : t('files') }}.
        </n-text>
        <n-button tag="a" type="primary" :href="downloadUrl" :download="resultFilename">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NAlert, NButton, NFlex, NIcon, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

defineProps<{
  isGenerating: boolean
  canGenerate: boolean
  rangeErrorMessage: string
  generateErrorMessage: string
  hasResult: boolean
  downloadUrl: string | null
  resultFilename: string
  resultFileCount: number
}>()

const emit = defineEmits<{
  (event: 'generate'): void
}>()
const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "title": "Generate",
    "generating": "Generating...",
    "generate": "Generate Result",
    "resultReady": "Result ready:",
    "file": "file",
    "files": "files",
    "download": "Download"
  },
  "zh": {
    "title": "生成",
    "generating": "生成中...",
    "generate": "生成结果",
    "resultReady": "结果已生成：",
    "file": "个文件",
    "files": "个文件",
    "download": "下载"
  },
  "zh-CN": {
    "title": "生成",
    "generating": "生成中...",
    "generate": "生成结果",
    "resultReady": "结果已生成：",
    "file": "个文件",
    "files": "个文件",
    "download": "下载"
  },
  "zh-TW": {
    "title": "產生",
    "generating": "產生中...",
    "generate": "產生結果",
    "resultReady": "結果已產生：",
    "file": "個檔案",
    "files": "個檔案",
    "download": "下載"
  },
  "zh-HK": {
    "title": "產生",
    "generating": "產生中...",
    "generate": "產生結果",
    "resultReady": "結果已產生：",
    "file": "個檔案",
    "files": "個檔案",
    "download": "下載"
  },
  "es": {
    "title": "Generar",
    "generating": "Generando...",
    "generate": "Generar resultado",
    "resultReady": "Resultado listo:",
    "file": "archivo",
    "files": "archivos",
    "download": "Descargar"
  },
  "fr": {
    "title": "Générer",
    "generating": "Génération...",
    "generate": "Générer le résultat",
    "resultReady": "Résultat prêt :",
    "file": "fichier",
    "files": "fichiers",
    "download": "Télécharger"
  },
  "de": {
    "title": "Erzeugen",
    "generating": "Wird erzeugt...",
    "generate": "Ergebnis erzeugen",
    "resultReady": "Ergebnis bereit:",
    "file": "Datei",
    "files": "Dateien",
    "download": "Herunterladen"
  },
  "it": {
    "title": "Genera",
    "generating": "Generazione...",
    "generate": "Genera risultato",
    "resultReady": "Risultato pronto:",
    "file": "file",
    "files": "file",
    "download": "Scarica"
  },
  "ja": {
    "title": "生成",
    "generating": "生成中...",
    "generate": "結果を生成",
    "resultReady": "結果の準備完了:",
    "file": "ファイル",
    "files": "ファイル",
    "download": "ダウンロード"
  },
  "ko": {
    "title": "생성",
    "generating": "생성 중...",
    "generate": "결과 생성",
    "resultReady": "결과 준비 완료:",
    "file": "파일",
    "files": "파일",
    "download": "다운로드"
  },
  "ru": {
    "title": "Сгенерировать",
    "generating": "Генерация...",
    "generate": "Сгенерировать результат",
    "resultReady": "Результат готов:",
    "file": "файл",
    "files": "файлов",
    "download": "Скачать"
  },
  "pt": {
    "title": "Gerar",
    "generating": "Gerando...",
    "generate": "Gerar resultado",
    "resultReady": "Resultado pronto:",
    "file": "arquivo",
    "files": "arquivos",
    "download": "Baixar"
  },
  "ar": {
    "title": "إنشاء",
    "generating": "جارٍ الإنشاء...",
    "generate": "إنشاء النتيجة",
    "resultReady": "النتيجة جاهزة:",
    "file": "ملف",
    "files": "ملفات",
    "download": "تنزيل"
  },
  "hi": {
    "title": "जनरेट करें",
    "generating": "जनरेट हो रहा है...",
    "generate": "परिणाम जनरेट करें",
    "resultReady": "परिणाम तैयार:",
    "file": "फाइल",
    "files": "फाइलें",
    "download": "डाउनलोड"
  },
  "tr": {
    "title": "Oluştur",
    "generating": "Oluşturuluyor...",
    "generate": "Sonucu oluştur",
    "resultReady": "Sonuç hazır:",
    "file": "dosya",
    "files": "dosya",
    "download": "İndir"
  },
  "nl": {
    "title": "Genereren",
    "generating": "Genereren...",
    "generate": "Resultaat genereren",
    "resultReady": "Resultaat gereed:",
    "file": "bestand",
    "files": "bestanden",
    "download": "Downloaden"
  },
  "sv": {
    "title": "Generera",
    "generating": "Genererar...",
    "generate": "Generera resultat",
    "resultReady": "Resultat klart:",
    "file": "fil",
    "files": "filer",
    "download": "Ladda ner"
  },
  "pl": {
    "title": "Generuj",
    "generating": "Generowanie...",
    "generate": "Generuj wynik",
    "resultReady": "Wynik gotowy:",
    "file": "plik",
    "files": "pliki",
    "download": "Pobierz"
  },
  "vi": {
    "title": "Tạo",
    "generating": "Đang tạo...",
    "generate": "Tạo kết quả",
    "resultReady": "Kết quả sẵn sàng:",
    "file": "tệp",
    "files": "tệp",
    "download": "Tải xuống"
  },
  "th": {
    "title": "สร้าง",
    "generating": "กำลังสร้าง...",
    "generate": "สร้างผลลัพธ์",
    "resultReady": "ผลลัพธ์พร้อมแล้ว:",
    "file": "ไฟล์",
    "files": "ไฟล์",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "title": "Buat",
    "generating": "Sedang membuat...",
    "generate": "Buat hasil",
    "resultReady": "Hasil siap:",
    "file": "file",
    "files": "file",
    "download": "Unduh"
  },
  "he": {
    "title": "צור",
    "generating": "יוצר...",
    "generate": "צור תוצאה",
    "resultReady": "התוצאה מוכנה:",
    "file": "קובץ",
    "files": "קבצים",
    "download": "הורדה"
  },
  "ms": {
    "title": "Jana",
    "generating": "Sedang menjana...",
    "generate": "Jana hasil",
    "resultReady": "Hasil sedia:",
    "file": "fail",
    "files": "fail",
    "download": "Muat turun"
  },
  "no": {
    "title": "Generer",
    "generating": "Genererer...",
    "generate": "Generer resultat",
    "resultReady": "Resultat klart:",
    "file": "fil",
    "files": "filer",
    "download": "Last ned"
  }
}
</i18n>
