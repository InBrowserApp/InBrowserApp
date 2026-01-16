<template>
  <ToolSection>
    <n-flex align="center" justify="space-between">
      <n-flex align="center">
        <n-button @click="importFromFile" text>
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>
      </n-flex>

      <n-flex>
        <CopyToClipboardButton :content="renderedMarkdown" />
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="converted.md">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-markdown') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('html')" :show-feedback="false">
        <n-input
          v-model:value="html"
          type="textarea"
          autosize
          :placeholder="t('html-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('markdown')" :show-feedback="false">
        <n-card size="small">
          <n-code :code="renderedMarkdown" language="markdown" :hljs="hljs" word-wrap></n-code>
        </n-card>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import TurndownService from 'turndown'
import { ToolSection } from '@shared/ui/tool'
import { NButton, NIcon, NCard, NFormItemGi, NGrid, NInput, NCode, NFlex } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ArrowDownload16Regular, Document16Regular } from '@shared/icons/fluent'
import hljs from 'highlight.js/lib/core'
import markdown from 'highlight.js/lib/languages/markdown'
import { fileOpen } from 'browser-fs-access'

hljs.registerLanguage('markdown', markdown)

const { t } = useI18n()

const html = ref<string>(`<h1>Hello world!</h1>\n<p>Paste HTML here…</p>`)

const turndownService = new TurndownService()

const renderedMarkdown = computed<string>(() => turndownService.turndown(html.value))

const downloadBlob = computed(
  () => new Blob([renderedMarkdown.value], { type: 'text/markdown;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  const file = await fileOpen({
    extensions: ['.html', '.htm', '.txt'],
  })
  html.value = await file.text()
}
</script>

<i18n lang="json">
{
  "en": {
    "html": "HTML",
    "html-placeholder": "Paste HTML here...",
    "markdown": "Markdown",
    "download-markdown": "Download Markdown",
    "import-from-file": "Import from file"
  },
  "zh": {
    "html": "HTML",
    "html-placeholder": "在此粘贴 HTML...",
    "markdown": "Markdown",
    "download-markdown": "下载 Markdown",
    "import-from-file": "从文件导入"
  },
  "zh-CN": {
    "html": "HTML",
    "html-placeholder": "在此粘贴 HTML...",
    "markdown": "Markdown",
    "download-markdown": "下载 Markdown",
    "import-from-file": "从文件导入"
  },
  "zh-TW": {
    "html": "HTML",
    "html-placeholder": "在此貼上 HTML...",
    "markdown": "Markdown",
    "download-markdown": "下載 Markdown",
    "import-from-file": "從檔案匯入"
  },
  "zh-HK": {
    "html": "HTML",
    "html-placeholder": "在此貼上 HTML...",
    "markdown": "Markdown",
    "download-markdown": "下載 Markdown",
    "import-from-file": "從檔案匯入"
  },
  "es": {
    "html": "HTML",
    "html-placeholder": "Pega HTML aquí...",
    "markdown": "Markdown",
    "download-markdown": "Descargar Markdown",
    "import-from-file": "Importar desde archivo"
  },
  "fr": {
    "html": "HTML",
    "html-placeholder": "Collez du HTML ici...",
    "markdown": "Markdown",
    "download-markdown": "Télécharger le Markdown",
    "import-from-file": "Importer depuis un fichier"
  },
  "de": {
    "html": "HTML",
    "html-placeholder": "HTML hier einfügen...",
    "markdown": "Markdown",
    "download-markdown": "Markdown herunterladen",
    "import-from-file": "Aus Datei importieren"
  },
  "it": {
    "html": "HTML",
    "html-placeholder": "Incolla HTML qui...",
    "markdown": "Markdown",
    "download-markdown": "Scarica Markdown",
    "import-from-file": "Importa da file"
  },
  "ja": {
    "html": "HTML",
    "html-placeholder": "ここにHTMLを貼り付け...",
    "markdown": "Markdown",
    "download-markdown": "Markdownをダウンロード",
    "import-from-file": "ファイルからインポート"
  },
  "ko": {
    "html": "HTML",
    "html-placeholder": "여기에 HTML 붙여넣기...",
    "markdown": "Markdown",
    "download-markdown": "Markdown 다운로드",
    "import-from-file": "파일에서 가져오기"
  },
  "ru": {
    "html": "HTML",
    "html-placeholder": "Вставьте HTML здесь...",
    "markdown": "Markdown",
    "download-markdown": "Скачать Markdown",
    "import-from-file": "Импорт из файла"
  },
  "pt": {
    "html": "HTML",
    "html-placeholder": "Cole HTML aqui...",
    "markdown": "Markdown",
    "download-markdown": "Baixar Markdown",
    "import-from-file": "Importar de arquivo"
  },
  "ar": {
    "html": "HTML",
    "html-placeholder": "الصق HTML هنا...",
    "markdown": "Markdown",
    "download-markdown": "تنزيل Markdown",
    "import-from-file": "استيراد من ملف"
  },
  "hi": {
    "html": "HTML",
    "html-placeholder": "यहाँ HTML पेस्ट करें...",
    "markdown": "Markdown",
    "download-markdown": "Markdown डाउनलोड करें",
    "import-from-file": "फ़ाइल से आयात करें"
  },
  "tr": {
    "html": "HTML",
    "html-placeholder": "Buraya HTML yapıştırın...",
    "markdown": "Markdown",
    "download-markdown": "Markdown İndir",
    "import-from-file": "Dosyadan içe aktar"
  },
  "nl": {
    "html": "HTML",
    "html-placeholder": "Plak hier HTML...",
    "markdown": "Markdown",
    "download-markdown": "Markdown downloaden",
    "import-from-file": "Importeren uit bestand"
  },
  "sv": {
    "html": "HTML",
    "html-placeholder": "Klistra in HTML här...",
    "markdown": "Markdown",
    "download-markdown": "Ladda ner Markdown",
    "import-from-file": "Importera från fil"
  },
  "pl": {
    "html": "HTML",
    "html-placeholder": "Wklej HTML tutaj...",
    "markdown": "Markdown",
    "download-markdown": "Pobierz Markdown",
    "import-from-file": "Importuj z pliku"
  },
  "vi": {
    "html": "HTML",
    "html-placeholder": "Dán HTML vào đây...",
    "markdown": "Markdown",
    "download-markdown": "Tải Markdown",
    "import-from-file": "Nhập từ tệp"
  },
  "th": {
    "html": "HTML",
    "html-placeholder": "วาง HTML ที่นี่...",
    "markdown": "Markdown",
    "download-markdown": "ดาวน์โหลด Markdown",
    "import-from-file": "นำเข้าจากไฟล์"
  },
  "id": {
    "html": "HTML",
    "html-placeholder": "Tempel HTML di sini...",
    "markdown": "Markdown",
    "download-markdown": "Unduh Markdown",
    "import-from-file": "Impor dari file"
  },
  "he": {
    "html": "HTML",
    "html-placeholder": "הדביקו HTML כאן...",
    "markdown": "Markdown",
    "download-markdown": "הורד Markdown",
    "import-from-file": "יבוא מקובץ"
  },
  "ms": {
    "html": "HTML",
    "html-placeholder": "Tampal HTML di sini...",
    "markdown": "Markdown",
    "download-markdown": "Muat turun Markdown",
    "import-from-file": "Import dari fail"
  },
  "no": {
    "html": "HTML",
    "html-placeholder": "Lim inn HTML her...",
    "markdown": "Markdown",
    "download-markdown": "Last ned Markdown",
    "import-from-file": "Importer fra fil"
  }
}
</i18n>
