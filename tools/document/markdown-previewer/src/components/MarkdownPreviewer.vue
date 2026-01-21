<template>
  <ToolSection>
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
          <n-select
            v-model:value="theme"
            :options="themeOptions"
            size="small"
            style="width: 140px"
          />
        </n-flex>
        <n-button @click="importFromFile" text>
          <template #icon>
            <n-icon :component="Document16Regular" />
          </template>
          {{ t('import-from-file') }}
        </n-button>
      </n-flex>
      <n-flex align="center" :size="8">
        <n-button tag="a" text :href="downloadUrl ?? undefined" download="markdown.html">
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('download-html') }}
        </n-button>
        <n-button @click="printHtml" text>
          <template #icon>
            <n-icon :component="Print20Regular" />
          </template>
          {{ t('print-html') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>

  <ToolSection>
    <n-grid :cols="gridCols" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi v-if="isSplit" :label="t('markdown')" :show-feedback="false">
        <n-input
          v-model:value="markdown"
          type="textarea"
          autosize
          :placeholder="t('markdown-placeholder')"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('preview')" :show-feedback="false">
        <n-flex :wrap="true" :size="12" align="start" class="preview-row">
          <n-card size="small" class="preview-card">
            <component :is="'style'" :textContent="scopedMarkdownCss" />
            <div :class="markdownScopeClass">
              <article class="markdown-body" v-html="renderedHtml"></article>
            </div>
          </n-card>
          <n-card v-if="showToc" size="small" class="toc-card">
            <n-text strong>{{ t('toc-title') }}</n-text>
            <n-scrollbar style="max-height: 360px">
              <div v-if="!tocItems.length" class="toc-empty">
                <n-text depth="3">{{ t('toc-empty') }}</n-text>
              </div>
              <div v-else class="toc-list">
                <a
                  v-for="item in tocItems"
                  :key="item.id"
                  :href="`#${item.id}`"
                  class="toc-link"
                  :style="{ paddingLeft: `${(item.level - 1) * 12}px` }"
                >
                  {{ item.text }}
                </a>
              </div>
            </n-scrollbar>
          </n-card>
        </n-flex>
      </n-form-item-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { marked, type Tokens } from 'marked'
import DOMPurify from 'dompurify'
import { ToolSection } from '@shared/ui/tool'
import {
  NButton,
  NCard,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInput,
  NRadioButton,
  NRadioGroup,
  NScrollbar,
  NSelect,
  NSwitch,
  NText,
} from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Document16Regular from '@vicons/fluent/Document16Regular'
import Print20Regular from '@vicons/fluent/Print20Regular'
import GitHubLightCss from 'github-markdown-css/github-markdown-light.css?raw'
import GitHubDarkCss from 'github-markdown-css/github-markdown-dark.css?raw'
import { fileOpen } from 'browser-fs-access'

type ViewMode = 'split' | 'preview'

type ThemeMode = 'light' | 'dark'

type TocItem = {
  id: string
  text: string
  level: number
}

const { t } = useI18n()

const markdown = ref<string>(`# Markdown Preview

## Features
- Live preview
- Table of contents
- Export HTML

## Notes
Write here...`)
const sanitize = ref(true)
const showToc = ref(true)
const viewMode = ref<ViewMode>('split')
const theme = ref<ThemeMode>('light')

const themeOptions = computed(() => [
  { label: t('theme-light'), value: 'light' },
  { label: t('theme-dark'), value: 'dark' },
])

const markdownScopeClass = 'markdown-preview'

const gridCols = computed(() => (viewMode.value === 'split' ? '1 s:2' : '1'))
const isSplit = computed(() => viewMode.value === 'split')

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, '').trim()

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')

const createSlugger = () => {
  const seen = new Map<string, number>()
  return (value: string) => {
    const base = slugify(value) || 'section'
    const count = seen.get(base) ?? 0
    seen.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }
}

const buildMarkdownPreview = (source: string) => {
  const slugger = createSlugger()
  const toc: TocItem[] = []
  const renderer = new marked.Renderer()

  renderer.heading = (token: Tokens.Heading | string, level?: number) => {
    if (typeof token === 'string') {
      const plainText = stripHtml(token)
      const headingLevel = level ?? 1
      const id = slugger(plainText)
      toc.push({
        id,
        level: headingLevel,
        text: plainText || t('untitled-heading'),
      })
      return `<h${headingLevel} id="${id}">${token}</h${headingLevel}>`
    }

    const plainText = stripHtml(token.text)
    const id = slugger(plainText)
    toc.push({
      id,
      level: token.depth,
      text: plainText || t('untitled-heading'),
    })
    const html = renderer.parser.parseInline(token.tokens ?? []) as string
    return `<h${token.depth} id="${id}">${html}</h${token.depth}>`
  }

  const html = marked.parse(source, { renderer }) as string

  return {
    html,
    toc,
  }
}

const previewData = computed(() => buildMarkdownPreview(markdown.value))
const renderedHtml = computed(() => {
  const html = previewData.value.html
  return sanitize.value ? DOMPurify.sanitize(html) : html
})
const tocItems = computed(() => previewData.value.toc)

const scopedMarkdownCss = computed(() => {
  const css = theme.value === 'light' ? GitHubLightCss : GitHubDarkCss
  return css.replace(/\.markdown-body/g, `.${markdownScopeClass} .markdown-body`)
})

const exportedHtml = computed(() => {
  const css = theme.value === 'light' ? GitHubLightCss : GitHubDarkCss
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${css}</style>
  </head>
  <body>
    <article class="markdown-body">${renderedHtml.value}</article>
  </body>
</html>`
})

const downloadBlob = computed(
  () => new Blob([exportedHtml.value], { type: 'text/html;charset=utf-8' }),
)
const downloadUrl = useObjectUrl(downloadBlob)

async function importFromFile(): Promise<void> {
  try {
    const file = await fileOpen({
      extensions: ['.md', '.markdown', '.txt'],
    })
    markdown.value = await file.text()
  } catch {
    // User cancelled
  }
}

function printHtml(): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.open()
  printWindow.document.write(exportedHtml.value)
  printWindow.document.close()
  printWindow.focus()
  printWindow.onafterprint = () => {
    printWindow.close()
  }
  printWindow.addEventListener('load', () => printWindow.print())
}
</script>

<style scoped>
.preview-row {
  width: 100%;
}

.preview-card {
  flex: 1 1 360px;
  min-width: 280px;
}

.toc-card {
  flex: 0 0 220px;
  width: 220px;
}

.toc-list {
  margin-top: 8px;
}

.toc-link {
  display: block;
  color: inherit;
  text-decoration: none;
  padding: 4px 0;
}

.toc-link:hover {
  text-decoration: underline;
}

.toc-empty {
  margin-top: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "markdown": "Markdown",
    "markdown-placeholder": "Enter Markdown here...",
    "preview": "Preview",
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
    "print-html": "Print HTML",
    "toc-title": "Table of contents",
    "toc-empty": "No headings yet.",
    "untitled-heading": "Untitled"
  },
  "zh": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此输入 Markdown...",
    "preview": "预览",
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
    "print-html": "打印 HTML",
    "toc-title": "目录",
    "toc-empty": "暂无标题",
    "untitled-heading": "未命名"
  },
  "zh-CN": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此输入 Markdown...",
    "preview": "预览",
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
    "print-html": "打印 HTML",
    "toc-title": "目录",
    "toc-empty": "暂无标题",
    "untitled-heading": "未命名"
  },
  "zh-TW": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此輸入 Markdown...",
    "preview": "預覽",
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
    "print-html": "列印 HTML",
    "toc-title": "目錄",
    "toc-empty": "尚無標題",
    "untitled-heading": "未命名"
  },
  "zh-HK": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此輸入 Markdown...",
    "preview": "預覽",
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
    "print-html": "列印 HTML",
    "toc-title": "目錄",
    "toc-empty": "尚無標題",
    "untitled-heading": "未命名"
  },
  "es": {
    "markdown": "Markdown",
    "markdown-placeholder": "Introduce Markdown aquí...",
    "preview": "Vista previa",
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
    "print-html": "Imprimir HTML",
    "toc-title": "Índice",
    "toc-empty": "Aún no hay títulos.",
    "untitled-heading": "Sin título"
  },
  "fr": {
    "markdown": "Markdown",
    "markdown-placeholder": "Saisissez du Markdown ici...",
    "preview": "Aperçu",
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
    "print-html": "Imprimer le HTML",
    "toc-title": "Sommaire",
    "toc-empty": "Aucun titre pour l'instant.",
    "untitled-heading": "Sans titre"
  },
  "de": {
    "markdown": "Markdown",
    "markdown-placeholder": "Markdown hier eingeben...",
    "preview": "Vorschau",
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
    "print-html": "HTML drucken",
    "toc-title": "Inhaltsverzeichnis",
    "toc-empty": "Noch keine Überschriften.",
    "untitled-heading": "Ohne Titel"
  },
  "it": {
    "markdown": "Markdown",
    "markdown-placeholder": "Inserisci Markdown qui...",
    "preview": "Anteprima",
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
    "print-html": "Stampa HTML",
    "toc-title": "Sommario",
    "toc-empty": "Nessun titolo al momento.",
    "untitled-heading": "Senza titolo"
  },
  "ja": {
    "markdown": "Markdown",
    "markdown-placeholder": "ここにMarkdownを入力...",
    "preview": "プレビュー",
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
    "print-html": "HTML を印刷",
    "toc-title": "目次",
    "toc-empty": "見出しはまだありません。",
    "untitled-heading": "無題"
  },
  "ko": {
    "markdown": "Markdown",
    "markdown-placeholder": "여기에 Markdown 입력...",
    "preview": "미리보기",
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
    "print-html": "HTML 인쇄",
    "toc-title": "목차",
    "toc-empty": "제목이 아직 없습니다.",
    "untitled-heading": "제목 없음"
  },
  "ru": {
    "markdown": "Markdown",
    "markdown-placeholder": "Введите Markdown...",
    "preview": "Предпросмотр",
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
    "print-html": "Печать HTML",
    "toc-title": "Оглавление",
    "toc-empty": "Пока нет заголовков.",
    "untitled-heading": "Без названия"
  },
  "pt": {
    "markdown": "Markdown",
    "markdown-placeholder": "Digite Markdown aqui...",
    "preview": "Pré-visualização",
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
    "print-html": "Imprimir HTML",
    "toc-title": "Sumário",
    "toc-empty": "Ainda sem títulos.",
    "untitled-heading": "Sem título"
  },
  "ar": {
    "markdown": "Markdown",
    "markdown-placeholder": "أدخل Markdown هنا...",
    "preview": "معاينة",
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
    "print-html": "طباعة HTML",
    "toc-title": "جدول المحتويات",
    "toc-empty": "لا توجد عناوين بعد.",
    "untitled-heading": "بدون عنوان"
  },
  "hi": {
    "markdown": "Markdown",
    "markdown-placeholder": "यहां Markdown लिखें...",
    "preview": "पूर्वावलोकन",
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
    "print-html": "HTML प्रिंट करें",
    "toc-title": "सामग्री सूची",
    "toc-empty": "अभी कोई शीर्षक नहीं।",
    "untitled-heading": "बिना शीर्षक"
  },
  "tr": {
    "markdown": "Markdown",
    "markdown-placeholder": "Markdown'u buraya girin...",
    "preview": "Önizleme",
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
    "print-html": "HTML yazdır",
    "toc-title": "İçindekiler",
    "toc-empty": "Henüz başlık yok.",
    "untitled-heading": "Başlıksız"
  },
  "nl": {
    "markdown": "Markdown",
    "markdown-placeholder": "Voer Markdown hier in...",
    "preview": "Voorbeeld",
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
    "print-html": "HTML afdrukken",
    "toc-title": "Inhoudsopgave",
    "toc-empty": "Nog geen koppen.",
    "untitled-heading": "Zonder titel"
  },
  "sv": {
    "markdown": "Markdown",
    "markdown-placeholder": "Skriv Markdown här...",
    "preview": "Förhandsgranskning",
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
    "print-html": "Skriv ut HTML",
    "toc-title": "Innehållsförteckning",
    "toc-empty": "Inga rubriker ännu.",
    "untitled-heading": "Utan titel"
  },
  "pl": {
    "markdown": "Markdown",
    "markdown-placeholder": "Wpisz Markdown tutaj...",
    "preview": "Podgląd",
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
    "print-html": "Drukuj HTML",
    "toc-title": "Spis treści",
    "toc-empty": "Brak nagłówków.",
    "untitled-heading": "Bez tytułu"
  },
  "vi": {
    "markdown": "Markdown",
    "markdown-placeholder": "Nhập Markdown ở đây...",
    "preview": "Xem trước",
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
    "print-html": "In HTML",
    "toc-title": "Mục lục",
    "toc-empty": "Chưa có tiêu đề.",
    "untitled-heading": "Không tiêu đề"
  },
  "th": {
    "markdown": "Markdown",
    "markdown-placeholder": "พิมพ์ Markdown ที่นี่...",
    "preview": "ตัวอย่าง",
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
    "print-html": "พิมพ์ HTML",
    "toc-title": "สารบัญ",
    "toc-empty": "ยังไม่มีหัวข้อ",
    "untitled-heading": "ไม่มีชื่อ"
  },
  "id": {
    "markdown": "Markdown",
    "markdown-placeholder": "Masukkan Markdown di sini...",
    "preview": "Pratinjau",
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
    "print-html": "Cetak HTML",
    "toc-title": "Daftar isi",
    "toc-empty": "Belum ada judul.",
    "untitled-heading": "Tanpa judul"
  },
  "he": {
    "markdown": "Markdown",
    "markdown-placeholder": "הזן Markdown כאן...",
    "preview": "תצוגה מקדימה",
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
    "print-html": "הדפס HTML",
    "toc-title": "תוכן עניינים",
    "toc-empty": "אין כותרות עדיין.",
    "untitled-heading": "ללא כותרת"
  },
  "ms": {
    "markdown": "Markdown",
    "markdown-placeholder": "Masukkan Markdown di sini...",
    "preview": "Pratonton",
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
    "print-html": "Cetak HTML",
    "toc-title": "Jadual kandungan",
    "toc-empty": "Tiada tajuk lagi.",
    "untitled-heading": "Tanpa tajuk"
  },
  "no": {
    "markdown": "Markdown",
    "markdown-placeholder": "Skriv Markdown her...",
    "preview": "Forhåndsvisning",
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
    "print-html": "Skriv ut HTML",
    "toc-title": "Innholdsfortegnelse",
    "toc-empty": "Ingen overskrifter ennå.",
    "untitled-heading": "Uten tittel"
  }
}
</i18n>
