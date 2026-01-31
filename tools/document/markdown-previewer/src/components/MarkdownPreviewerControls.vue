<template>
  <n-flex align="center" justify="space-between" :wrap="true" :size="12">
    <n-flex align="center" :wrap="true" :size="12">
      <n-flex align="center" :size="6">
        <n-switch v-model:value="sanitize" size="small" />
        <span>{{ t('sanitize-html') }}</span>
      </n-flex>
      <n-flex align="center" :size="6">
        <n-switch v-model:value="showToc" size="small" />
        <span>{{ t('show-toc') }}</span>
      </n-flex>
      <n-flex align="center" :size="8">
        <n-text depth="3">{{ t('view-mode') }}</n-text>
        <n-radio-group v-model:value="viewMode" size="small">
          <n-radio-button value="split">{{ t('view-split') }}</n-radio-button>
          <n-radio-button value="preview">{{ t('view-preview') }}</n-radio-button>
        </n-radio-group>
      </n-flex>
      <n-flex align="center" :size="8">
        <n-text depth="3">{{ t('theme') }}</n-text>
        <n-select v-model:value="theme" :options="themeOptions" size="small" style="width: 140px" />
      </n-flex>
      <n-button text @click="emitImport">
        <template #icon>
          <n-icon :component="Document16Regular" />
        </template>
        {{ t('import-from-file') }}
      </n-button>
    </n-flex>
    <n-flex align="center" :size="8">
      <n-button
        tag="a"
        text
        :href="downloadHref"
        download="markdown.html"
        :disabled="!downloadHref"
      >
        <template #icon>
          <n-icon :component="ArrowDownload16Regular" />
        </template>
        {{ t('download-html') }}
      </n-button>
      <n-button text @click="emitPrint">
        <template #icon>
          <n-icon :component="Print20Regular" />
        </template>
        {{ t('print-html') }}
      </n-button>
    </n-flex>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon, NRadioButton, NRadioGroup, NSelect, NSwitch, NText } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import Print20Regular from '@vicons/fluent/Print20Regular'
import type { MarkdownViewMode, ThemeMode } from '../types'

const props = defineProps<{
  downloadUrl?: string | null
}>()
const emit = defineEmits<{
  (event: 'import'): void
  (event: 'print'): void
}>()
const sanitize = defineModel<boolean>('sanitize', { required: true })
const showToc = defineModel<boolean>('showToc', { required: true })
const viewMode = defineModel<MarkdownViewMode>('viewMode', { required: true })
const theme = defineModel<ThemeMode>('theme', { required: true })

const { t } = useI18n({ useScope: 'local' })

const themeOptions = computed(() => [
  { label: t('theme-light'), value: 'light' },
  { label: t('theme-dark'), value: 'dark' },
])

const downloadHref = computed(() => props.downloadUrl ?? undefined)

const emitImport = () => emit('import')
const emitPrint = () => emit('print')
</script>

<i18n lang="json">
{
  "en": {
    "sanitize-html": "Sanitize HTML",
    "show-toc": "Show table of contents",
    "view-mode": "View",
    "view-split": "Split",
    "view-preview": "Preview only",
    "theme": "Theme",
    "theme-light": "Light",
    "theme-dark": "Dark",
    "import-from-file": "Import from file",
    "download-html": "Download HTML",
    "print-html": "Print HTML"
  },
  "zh": {
    "sanitize-html": "清理 HTML",
    "show-toc": "显示目录",
    "view-mode": "视图",
    "view-split": "分栏",
    "view-preview": "仅预览",
    "theme": "主题",
    "theme-light": "浅色",
    "theme-dark": "深色",
    "import-from-file": "从文件导入",
    "download-html": "下载 HTML",
    "print-html": "打印 HTML"
  },
  "zh-CN": {
    "sanitize-html": "清理 HTML",
    "show-toc": "显示目录",
    "view-mode": "视图",
    "view-split": "分栏",
    "view-preview": "仅预览",
    "theme": "主题",
    "theme-light": "浅色",
    "theme-dark": "深色",
    "import-from-file": "从文件导入",
    "download-html": "下载 HTML",
    "print-html": "打印 HTML"
  },
  "zh-TW": {
    "sanitize-html": "清理 HTML",
    "show-toc": "顯示目錄",
    "view-mode": "檢視",
    "view-split": "分欄",
    "view-preview": "僅預覽",
    "theme": "主題",
    "theme-light": "淺色",
    "theme-dark": "深色",
    "import-from-file": "從檔案匯入",
    "download-html": "下載 HTML",
    "print-html": "列印 HTML"
  },
  "zh-HK": {
    "sanitize-html": "清理 HTML",
    "show-toc": "顯示目錄",
    "view-mode": "檢視",
    "view-split": "分欄",
    "view-preview": "僅預覽",
    "theme": "主題",
    "theme-light": "淺色",
    "theme-dark": "深色",
    "import-from-file": "從檔案匯入",
    "download-html": "下載 HTML",
    "print-html": "列印 HTML"
  },
  "es": {
    "sanitize-html": "Sanear HTML",
    "show-toc": "Mostrar índice",
    "view-mode": "Vista",
    "view-split": "Dividida",
    "view-preview": "Solo vista previa",
    "theme": "Tema",
    "theme-light": "Claro",
    "theme-dark": "Oscuro",
    "import-from-file": "Importar desde archivo",
    "download-html": "Descargar HTML",
    "print-html": "Imprimir HTML"
  },
  "fr": {
    "sanitize-html": "Nettoyer le HTML",
    "show-toc": "Afficher le sommaire",
    "view-mode": "Vue",
    "view-split": "Séparée",
    "view-preview": "Aperçu seul",
    "theme": "Thème",
    "theme-light": "Clair",
    "theme-dark": "Sombre",
    "import-from-file": "Importer depuis un fichier",
    "download-html": "Télécharger le HTML",
    "print-html": "Imprimer le HTML"
  },
  "de": {
    "sanitize-html": "HTML bereinigen",
    "show-toc": "Inhaltsverzeichnis anzeigen",
    "view-mode": "Ansicht",
    "view-split": "Geteilt",
    "view-preview": "Nur Vorschau",
    "theme": "Design",
    "theme-light": "Hell",
    "theme-dark": "Dunkel",
    "import-from-file": "Aus Datei importieren",
    "download-html": "HTML herunterladen",
    "print-html": "HTML drucken"
  },
  "it": {
    "sanitize-html": "Sanifica HTML",
    "show-toc": "Mostra sommario",
    "view-mode": "Vista",
    "view-split": "Divisa",
    "view-preview": "Solo anteprima",
    "theme": "Tema",
    "theme-light": "Chiaro",
    "theme-dark": "Scuro",
    "import-from-file": "Importa da file",
    "download-html": "Scarica HTML",
    "print-html": "Stampa HTML"
  },
  "ja": {
    "sanitize-html": "HTML をサニタイズ",
    "show-toc": "目次を表示",
    "view-mode": "表示",
    "view-split": "分割",
    "view-preview": "プレビューのみ",
    "theme": "テーマ",
    "theme-light": "ライト",
    "theme-dark": "ダーク",
    "import-from-file": "ファイルからインポート",
    "download-html": "HTML をダウンロード",
    "print-html": "HTML を印刷"
  },
  "ko": {
    "sanitize-html": "HTML 정화",
    "show-toc": "목차 표시",
    "view-mode": "보기",
    "view-split": "분할",
    "view-preview": "미리보기만",
    "theme": "테마",
    "theme-light": "라이트",
    "theme-dark": "다크",
    "import-from-file": "파일에서 가져오기",
    "download-html": "HTML 다운로드",
    "print-html": "HTML 인쇄"
  },
  "ru": {
    "sanitize-html": "Очистить HTML",
    "show-toc": "Показать оглавление",
    "view-mode": "Вид",
    "view-split": "Разделенный",
    "view-preview": "Только предпросмотр",
    "theme": "Тема",
    "theme-light": "Светлая",
    "theme-dark": "Темная",
    "import-from-file": "Импорт из файла",
    "download-html": "Скачать HTML",
    "print-html": "Печать HTML"
  },
  "pt": {
    "sanitize-html": "Limpar HTML",
    "show-toc": "Mostrar sumário",
    "view-mode": "Visualização",
    "view-split": "Dividida",
    "view-preview": "Apenas prévia",
    "theme": "Tema",
    "theme-light": "Claro",
    "theme-dark": "Escuro",
    "import-from-file": "Importar de arquivo",
    "download-html": "Baixar HTML",
    "print-html": "Imprimir HTML"
  },
  "ar": {
    "sanitize-html": "تنقية HTML",
    "show-toc": "إظهار جدول المحتويات",
    "view-mode": "العرض",
    "view-split": "منقسم",
    "view-preview": "معاينة فقط",
    "theme": "السمة",
    "theme-light": "فاتح",
    "theme-dark": "داكن",
    "import-from-file": "استيراد من ملف",
    "download-html": "تنزيل HTML",
    "print-html": "طباعة HTML"
  },
  "hi": {
    "sanitize-html": "HTML साफ़ करें",
    "show-toc": "सामग्री सूची दिखाएँ",
    "view-mode": "दृश्य",
    "view-split": "विभाजित",
    "view-preview": "केवल पूर्वावलोकन",
    "theme": "थीम",
    "theme-light": "हल्का",
    "theme-dark": "गहरा",
    "import-from-file": "फ़ाइल से आयात करें",
    "download-html": "HTML डाउनलोड करें",
    "print-html": "HTML प्रिंट करें"
  },
  "tr": {
    "sanitize-html": "HTML temizle",
    "show-toc": "İçindekileri göster",
    "view-mode": "Görünüm",
    "view-split": "Bölünmüş",
    "view-preview": "Yalnızca önizleme",
    "theme": "Tema",
    "theme-light": "Açık",
    "theme-dark": "Koyu",
    "import-from-file": "Dosyadan içe aktar",
    "download-html": "HTML indir",
    "print-html": "HTML yazdır"
  },
  "nl": {
    "sanitize-html": "HTML opschonen",
    "show-toc": "Inhoudsopgave tonen",
    "view-mode": "Weergave",
    "view-split": "Gesplitst",
    "view-preview": "Alleen voorbeeld",
    "theme": "Thema",
    "theme-light": "Licht",
    "theme-dark": "Donker",
    "import-from-file": "Importeren uit bestand",
    "download-html": "HTML downloaden",
    "print-html": "HTML afdrukken"
  },
  "sv": {
    "sanitize-html": "Sanera HTML",
    "show-toc": "Visa innehållsförteckning",
    "view-mode": "Vy",
    "view-split": "Delad",
    "view-preview": "Endast förhandsgranskning",
    "theme": "Tema",
    "theme-light": "Ljus",
    "theme-dark": "Mörk",
    "import-from-file": "Importera från fil",
    "download-html": "Ladda ner HTML",
    "print-html": "Skriv ut HTML"
  },
  "pl": {
    "sanitize-html": "Oczyść HTML",
    "show-toc": "Pokaż spis treści",
    "view-mode": "Widok",
    "view-split": "Podzielony",
    "view-preview": "Tylko podgląd",
    "theme": "Motyw",
    "theme-light": "Jasny",
    "theme-dark": "Ciemny",
    "import-from-file": "Importuj z pliku",
    "download-html": "Pobierz HTML",
    "print-html": "Drukuj HTML"
  },
  "vi": {
    "sanitize-html": "Làm sạch HTML",
    "show-toc": "Hiển thị mục lục",
    "view-mode": "Chế độ xem",
    "view-split": "Chia đôi",
    "view-preview": "Chỉ xem trước",
    "theme": "Giao diện",
    "theme-light": "Sáng",
    "theme-dark": "Tối",
    "import-from-file": "Nhập từ tệp",
    "download-html": "Tải HTML",
    "print-html": "In HTML"
  },
  "th": {
    "sanitize-html": "ทำความสะอาด HTML",
    "show-toc": "แสดงสารบัญ",
    "view-mode": "มุมมอง",
    "view-split": "แบ่งสอง",
    "view-preview": "เฉพาะตัวอย่าง",
    "theme": "ธีม",
    "theme-light": "สว่าง",
    "theme-dark": "มืด",
    "import-from-file": "นำเข้าจากไฟล์",
    "download-html": "ดาวน์โหลด HTML",
    "print-html": "พิมพ์ HTML"
  },
  "id": {
    "sanitize-html": "Bersihkan HTML",
    "show-toc": "Tampilkan daftar isi",
    "view-mode": "Tampilan",
    "view-split": "Terbagi",
    "view-preview": "Hanya pratinjau",
    "theme": "Tema",
    "theme-light": "Terang",
    "theme-dark": "Gelap",
    "import-from-file": "Impor dari file",
    "download-html": "Unduh HTML",
    "print-html": "Cetak HTML"
  },
  "he": {
    "sanitize-html": "נקה HTML",
    "show-toc": "הצג תוכן עניינים",
    "view-mode": "תצוגה",
    "view-split": "מפוצל",
    "view-preview": "תצוגה בלבד",
    "theme": "ערכת נושא",
    "theme-light": "בהיר",
    "theme-dark": "כהה",
    "import-from-file": "ייבוא מקובץ",
    "download-html": "הורד HTML",
    "print-html": "הדפס HTML"
  },
  "ms": {
    "sanitize-html": "Bersihkan HTML",
    "show-toc": "Tunjukkan jadual kandungan",
    "view-mode": "Paparan",
    "view-split": "Terbahagi",
    "view-preview": "Pratonton sahaja",
    "theme": "Tema",
    "theme-light": "Cerah",
    "theme-dark": "Gelap",
    "import-from-file": "Import dari fail",
    "download-html": "Muat turun HTML",
    "print-html": "Cetak HTML"
  },
  "no": {
    "sanitize-html": "Rens HTML",
    "show-toc": "Vis innholdsfortegnelse",
    "view-mode": "Visning",
    "view-split": "Delt",
    "view-preview": "Kun forhåndsvisning",
    "theme": "Tema",
    "theme-light": "Lys",
    "theme-dark": "Mørk",
    "import-from-file": "Importer fra fil",
    "download-html": "Last ned HTML",
    "print-html": "Skriv ut HTML"
  }
}
</i18n>
