<template>
  <ToolSection>
    <MarkdownPreviewerControls
      v-model:sanitize="sanitize"
      v-model:show-toc="showToc"
      v-model:view-mode="viewMode"
      v-model:theme="theme"
      :download-url="downloadUrl"
      @import="importFromFile"
      @print="printHtml"
    />
  </ToolSection>

  <ToolSection>
    <MarkdownPreviewerPanels
      v-model:markdown="markdown"
      :view-mode="viewMode"
      :show-toc="showToc"
      :rendered-html="renderedHtml"
      :toc-items="tocItems"
      :scoped-markdown-css="scopedMarkdownCss"
      :markdown-scope-class="markdownScopeClass"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { marked, type Tokens } from 'marked'
import DOMPurify from 'dompurify'
import { ToolSection } from '@shared/ui/tool'
import GitHubLightCss from 'github-markdown-css/github-markdown-light.css?raw'
import GitHubDarkCss from 'github-markdown-css/github-markdown-dark.css?raw'
import { fileOpen } from 'browser-fs-access'
import type { MarkdownViewMode, ThemeMode, TocItem } from '../types'
import MarkdownPreviewerControls from './MarkdownPreviewerControls.vue'
import MarkdownPreviewerPanels from './MarkdownPreviewerPanels.vue'

const { t } = useI18n({ useScope: 'local' })

const markdown = ref<string>(`# Markdown Preview

## Features
- Live preview
- Table of contents
- Export HTML

## Notes
Write here...`)
const sanitize = ref(true)
const showToc = ref(true)
const viewMode = ref<MarkdownViewMode>('split')
const theme = ref<ThemeMode>('light')

const markdownScopeClass = 'markdown-preview'

const stripHtml = (value: string) => {
  if (!value) return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(value, 'text/html')
  return (doc.body.textContent ?? '').trim()
}

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

<i18n lang="json">
{
  "en": {
    "untitled-heading": "Untitled"
  },
  "zh": {
    "untitled-heading": "未命名"
  },
  "zh-CN": {
    "untitled-heading": "未命名"
  },
  "zh-TW": {
    "untitled-heading": "未命名"
  },
  "zh-HK": {
    "untitled-heading": "未命名"
  },
  "es": {
    "untitled-heading": "Sin título"
  },
  "fr": {
    "untitled-heading": "Sans titre"
  },
  "de": {
    "untitled-heading": "Ohne Titel"
  },
  "it": {
    "untitled-heading": "Senza titolo"
  },
  "ja": {
    "untitled-heading": "無題"
  },
  "ko": {
    "untitled-heading": "제목 없음"
  },
  "ru": {
    "untitled-heading": "Без названия"
  },
  "pt": {
    "untitled-heading": "Sem título"
  },
  "ar": {
    "untitled-heading": "بدون عنوان"
  },
  "hi": {
    "untitled-heading": "बिना शीर्षक"
  },
  "tr": {
    "untitled-heading": "Başlıksız"
  },
  "nl": {
    "untitled-heading": "Zonder titel"
  },
  "sv": {
    "untitled-heading": "Utan titel"
  },
  "pl": {
    "untitled-heading": "Bez tytułu"
  },
  "vi": {
    "untitled-heading": "Không tiêu đề"
  },
  "th": {
    "untitled-heading": "ไม่มีชื่อ"
  },
  "id": {
    "untitled-heading": "Tanpa judul"
  },
  "he": {
    "untitled-heading": "ללא כותרת"
  },
  "ms": {
    "untitled-heading": "Tanpa tajuk"
  },
  "no": {
    "untitled-heading": "Uten tittel"
  }
}
</i18n>
