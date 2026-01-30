<template>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-flex align="center">
        <n-switch v-model:value="sanitize" size="small"></n-switch>
        <span>{{ t('sanitize-html') }}</span>
        <n-button text @click="importFromFile">
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>
      </n-flex>

      <n-flex>
        <CopyToClipboardButton :content="renderedHtml" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="markdown.html">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-html') }}
        </n-button>
        <n-button text @click="printHtml">
          <template #icon>
            <n-icon :component="Print20Regular" />
          </template>
          {{ t('print-html') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('markdown')" :show-feedback="false">
        <n-input
          v-model:value="markdown"
          type="textarea"
          autosize
          :placeholder="t('markdown-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('html')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="renderedHtml" language="html" :hljs="hljs" word-wrap></n-code>
          <n-divider></n-divider>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <article :class="$style['markdown-body']" v-html="renderedHtml"></article>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { ToolSection } from '@shared/ui/tool'
import {
  NButton,
  NIcon,
  NCard,
  NFormItemGi,
  NGrid,
  NInput,
  NDivider,
  NCode,
  NSwitch,
  NFlex,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Print20Regular from '@vicons/fluent/Print20Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import GitHubLightCss from 'github-markdown-css/github-markdown-light.css?raw'
import hljs from 'highlight.js/lib/core'
import html from 'highlight.js/lib/languages/xml'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('html', html)

const { t } = useI18n()

const markdown = ref<string>('# Markdown\n\nType here...')
const sanitize = ref<boolean>(true)

console.log(GitHubLightCss)

const renderedHtml = computed<string>(() => {
  const rawHtml = marked.parse(markdown.value) as string
  return sanitize.value ? DOMPurify.sanitize(rawHtml) : rawHtml
})

const downloadBlob = computed(
  () => new Blob([renderedHtml.value], { type: 'text/html;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.md', '.markdown', '.txt'],
  })
  markdown.value = await file.text()
}

function printHtml(): void {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.documentElement.innerHTML = `
      <html>
        <head>
          <style>${GitHubLightCss}</style>
        </head>
        <body>
          <article class="markdown-body">${renderedHtml.value}</article>
        </body>
      </html>
    `
    printWindow.document.close()
    printWindow.focus()
    printWindow.onafterprint = () => {
      printWindow.close()
    }
    printWindow.addEventListener('load', () => printWindow.print())
  }
}
</script>

<style lang="css" module src="github-markdown-css/github-markdown-light.css"></style>

<i18n lang="json">
{
  "en": {
    "markdown": "Markdown",
    "markdown-placeholder": "Enter Markdown here...",
    "html": "HTML Preview",
    "sanitize-html": "Sanitize HTML",
    "download-html": "Download HTML",
    "print-html": "Print HTML",
    "import-from-file": "Import from file"
  },
  "zh": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此输入 Markdown...",
    "html": "HTML 预览",
    "sanitize-html": "清理 HTML",
    "download-html": "下载 HTML",
    "print-html": "打印 HTML",
    "import-from-file": "从文件导入"
  },
  "zh-CN": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此输入 Markdown...",
    "html": "HTML 预览",
    "sanitize-html": "清理 HTML",
    "download-html": "下载 HTML",
    "print-html": "打印 HTML",
    "import-from-file": "从文件导入"
  },
  "zh-TW": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此輸入 Markdown...",
    "html": "HTML 預覽",
    "sanitize-html": "清理 HTML",
    "download-html": "下載 HTML",
    "print-html": "列印 HTML",
    "import-from-file": "從檔案匯入"
  },
  "zh-HK": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此輸入 Markdown...",
    "html": "HTML 預覽",
    "sanitize-html": "清理 HTML",
    "download-html": "下載 HTML",
    "print-html": "列印 HTML",
    "import-from-file": "從檔案匯入"
  },
  "es": {
    "markdown": "Markdown",
    "markdown-placeholder": "Introduce Markdown aquí...",
    "html": "Vista previa HTML",
    "sanitize-html": "Sanear HTML",
    "download-html": "Descargar HTML",
    "print-html": "Imprimir HTML",
    "import-from-file": "Importar desde archivo"
  },
  "fr": {
    "markdown": "Markdown",
    "markdown-placeholder": "Saisissez du Markdown ici...",
    "html": "Aperçu HTML",
    "sanitize-html": "Nettoyer le HTML",
    "download-html": "Télécharger le HTML",
    "print-html": "Imprimer le HTML",
    "import-from-file": "Importer depuis un fichier"
  },
  "de": {
    "markdown": "Markdown",
    "markdown-placeholder": "Markdown hier eingeben...",
    "html": "HTML-Vorschau",
    "sanitize-html": "HTML bereinigen",
    "download-html": "HTML herunterladen",
    "print-html": "HTML drucken",
    "import-from-file": "Aus Datei importieren"
  },
  "it": {
    "markdown": "Markdown",
    "markdown-placeholder": "Inserisci Markdown qui...",
    "html": "Anteprima HTML",
    "sanitize-html": "Sanifica HTML",
    "download-html": "Scarica HTML",
    "print-html": "Stampa HTML",
    "import-from-file": "Importa da file"
  },
  "ja": {
    "markdown": "Markdown",
    "markdown-placeholder": "ここにMarkdownを入力...",
    "html": "HTMLプレビュー",
    "sanitize-html": "HTMLをサニタイズ",
    "download-html": "HTMLをダウンロード",
    "print-html": "HTMLを印刷",
    "import-from-file": "ファイルからインポート"
  },
  "ko": {
    "markdown": "Markdown",
    "markdown-placeholder": "여기에 Markdown 입력...",
    "html": "HTML 미리보기",
    "sanitize-html": "HTML 정화",
    "download-html": "HTML 다운로드",
    "print-html": "HTML 인쇄",
    "import-from-file": "파일에서 가져오기"
  },
  "ru": {
    "markdown": "Markdown",
    "markdown-placeholder": "Введите Markdown...",
    "html": "Предпросмотр HTML",
    "sanitize-html": "Очистить HTML",
    "download-html": "Скачать HTML",
    "print-html": "Печать HTML",
    "import-from-file": "Импорт из файла"
  },
  "pt": {
    "markdown": "Markdown",
    "markdown-placeholder": "Insira Markdown aqui...",
    "html": "Pré-visualização HTML",
    "sanitize-html": "Sanitizar HTML",
    "download-html": "Baixar HTML",
    "print-html": "Imprimir HTML",
    "import-from-file": "Importar de arquivo"
  },
  "ar": {
    "markdown": "Markdown",
    "markdown-placeholder": "أدخل Markdown هنا...",
    "html": "معاينة HTML",
    "sanitize-html": "تنقية HTML",
    "download-html": "تنزيل HTML",
    "print-html": "طباعة HTML",
    "import-from-file": "استيراد من ملف"
  },
  "hi": {
    "markdown": "Markdown",
    "markdown-placeholder": "यहाँ Markdown दर्ज करें...",
    "html": "HTML पूर्वावलोकन",
    "sanitize-html": "HTML सैनिटाइज़ करें",
    "download-html": "HTML डाउनलोड करें",
    "print-html": "HTML प्रिंट करें",
    "import-from-file": "फ़ाइल से आयात करें"
  },
  "tr": {
    "markdown": "Markdown",
    "markdown-placeholder": "Buraya Markdown girin...",
    "html": "HTML Önizleme",
    "sanitize-html": "HTML Temizle",
    "download-html": "HTML İndir",
    "print-html": "HTML Yazdır",
    "import-from-file": "Dosyadan içe aktar"
  },
  "nl": {
    "markdown": "Markdown",
    "markdown-placeholder": "Voer hier Markdown in...",
    "html": "HTML-voorbeeld",
    "sanitize-html": "HTML opschonen",
    "download-html": "HTML downloaden",
    "print-html": "HTML afdrukken",
    "import-from-file": "Importeren uit bestand"
  },
  "sv": {
    "markdown": "Markdown",
    "markdown-placeholder": "Ange Markdown här...",
    "html": "HTML-förhandsvisning",
    "sanitize-html": "Sanera HTML",
    "download-html": "Ladda ner HTML",
    "print-html": "Skriv ut HTML",
    "import-from-file": "Importera från fil"
  },
  "pl": {
    "markdown": "Markdown",
    "markdown-placeholder": "Wpisz tutaj Markdown...",
    "html": "Podgląd HTML",
    "sanitize-html": "Oczyść HTML",
    "download-html": "Pobierz HTML",
    "print-html": "Drukuj HTML",
    "import-from-file": "Importuj z pliku"
  },
  "vi": {
    "markdown": "Markdown",
    "markdown-placeholder": "Nhập Markdown tại đây...",
    "html": "Xem trước HTML",
    "sanitize-html": "Làm sạch HTML",
    "download-html": "Tải HTML",
    "print-html": "In HTML",
    "import-from-file": "Nhập từ tệp"
  },
  "th": {
    "markdown": "Markdown",
    "markdown-placeholder": "พิมพ์ Markdown ที่นี่...",
    "html": "ตัวอย่าง HTML",
    "sanitize-html": "กรอง HTML",
    "download-html": "ดาวน์โหลด HTML",
    "print-html": "พิมพ์ HTML",
    "import-from-file": "นำเข้าจากไฟล์"
  },
  "id": {
    "markdown": "Markdown",
    "markdown-placeholder": "Masukkan Markdown di sini...",
    "html": "Pratinjau HTML",
    "sanitize-html": "Bersihkan HTML",
    "download-html": "Unduh HTML",
    "print-html": "Cetak HTML",
    "import-from-file": "Impor dari file"
  },
  "he": {
    "markdown": "Markdown",
    "markdown-placeholder": "הקלידו Markdown כאן...",
    "html": "תצוגה מקדימה של HTML",
    "sanitize-html": "נקה HTML",
    "download-html": "הורד HTML",
    "print-html": "הדפס HTML",
    "import-from-file": "יבוא מקובץ"
  },
  "ms": {
    "markdown": "Markdown",
    "markdown-placeholder": "Masukkan Markdown di sini...",
    "html": "Pratonton HTML",
    "sanitize-html": "Bersihkan HTML",
    "download-html": "Muat turun HTML",
    "print-html": "Cetak HTML",
    "import-from-file": "Import dari fail"
  },
  "no": {
    "markdown": "Markdown",
    "markdown-placeholder": "Skriv Markdown her...",
    "html": "HTML-forhåndsvisning",
    "sanitize-html": "Rens HTML",
    "download-html": "Last ned HTML",
    "print-html": "Skriv ut HTML",
    "import-from-file": "Importer fra fil"
  }
}
</i18n>
