<template>
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCard, NFlex, NFormItemGi, NGrid, NInput, NScrollbar, NText } from 'naive-ui'
import type { MarkdownViewMode, TocItem } from '../types'

const props = defineProps<{
  viewMode: MarkdownViewMode
  showToc: boolean
  renderedHtml: string
  tocItems: TocItem[]
  scopedMarkdownCss: string
  markdownScopeClass: string
}>()

const markdown = defineModel<string>('markdown', { required: true })

const { t } = useI18n({ useScope: 'local' })

const gridCols = computed(() => (props.viewMode === 'split' ? '1 s:2' : '1'))
const isSplit = computed(() => props.viewMode === 'split')
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
    "toc-title": "Table of contents",
    "toc-empty": "No headings yet."
  },
  "zh": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此输入 Markdown...",
    "preview": "预览",
    "toc-title": "目录",
    "toc-empty": "暂无标题"
  },
  "zh-CN": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此输入 Markdown...",
    "preview": "预览",
    "toc-title": "目录",
    "toc-empty": "暂无标题"
  },
  "zh-TW": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此輸入 Markdown...",
    "preview": "預覽",
    "toc-title": "目錄",
    "toc-empty": "尚無標題"
  },
  "zh-HK": {
    "markdown": "Markdown",
    "markdown-placeholder": "在此輸入 Markdown...",
    "preview": "預覽",
    "toc-title": "目錄",
    "toc-empty": "尚無標題"
  },
  "es": {
    "markdown": "Markdown",
    "markdown-placeholder": "Introduce Markdown aquí...",
    "preview": "Vista previa",
    "toc-title": "Índice",
    "toc-empty": "Aún no hay títulos."
  },
  "fr": {
    "markdown": "Markdown",
    "markdown-placeholder": "Saisissez du Markdown ici...",
    "preview": "Aperçu",
    "toc-title": "Sommaire",
    "toc-empty": "Aucun titre pour l'instant."
  },
  "de": {
    "markdown": "Markdown",
    "markdown-placeholder": "Markdown hier eingeben...",
    "preview": "Vorschau",
    "toc-title": "Inhaltsverzeichnis",
    "toc-empty": "Noch keine Überschriften."
  },
  "it": {
    "markdown": "Markdown",
    "markdown-placeholder": "Inserisci Markdown qui...",
    "preview": "Anteprima",
    "toc-title": "Sommario",
    "toc-empty": "Nessun titolo al momento."
  },
  "ja": {
    "markdown": "Markdown",
    "markdown-placeholder": "ここにMarkdownを入力...",
    "preview": "プレビュー",
    "toc-title": "目次",
    "toc-empty": "見出しはまだありません。"
  },
  "ko": {
    "markdown": "Markdown",
    "markdown-placeholder": "여기에 Markdown 입력...",
    "preview": "미리보기",
    "toc-title": "목차",
    "toc-empty": "제목이 아직 없습니다."
  },
  "ru": {
    "markdown": "Markdown",
    "markdown-placeholder": "Введите Markdown...",
    "preview": "Предпросмотр",
    "toc-title": "Оглавление",
    "toc-empty": "Пока нет заголовков."
  },
  "pt": {
    "markdown": "Markdown",
    "markdown-placeholder": "Digite Markdown aqui...",
    "preview": "Pré-visualização",
    "toc-title": "Sumário",
    "toc-empty": "Ainda sem títulos."
  },
  "ar": {
    "markdown": "Markdown",
    "markdown-placeholder": "أدخل Markdown هنا...",
    "preview": "معاينة",
    "toc-title": "جدول المحتويات",
    "toc-empty": "لا توجد عناوين بعد."
  },
  "hi": {
    "markdown": "Markdown",
    "markdown-placeholder": "यहां Markdown लिखें...",
    "preview": "पूर्वावलोकन",
    "toc-title": "सामग्री सूची",
    "toc-empty": "अभी कोई शीर्षक नहीं।"
  },
  "tr": {
    "markdown": "Markdown",
    "markdown-placeholder": "Markdown'u buraya girin...",
    "preview": "Önizleme",
    "toc-title": "İçindekiler",
    "toc-empty": "Henüz başlık yok."
  },
  "nl": {
    "markdown": "Markdown",
    "markdown-placeholder": "Voer Markdown hier in...",
    "preview": "Voorbeeld",
    "toc-title": "Inhoudsopgave",
    "toc-empty": "Nog geen koppen."
  },
  "sv": {
    "markdown": "Markdown",
    "markdown-placeholder": "Skriv Markdown här...",
    "preview": "Förhandsgranskning",
    "toc-title": "Innehållsförteckning",
    "toc-empty": "Inga rubriker ännu."
  },
  "pl": {
    "markdown": "Markdown",
    "markdown-placeholder": "Wpisz Markdown tutaj...",
    "preview": "Podgląd",
    "toc-title": "Spis treści",
    "toc-empty": "Brak nagłówków."
  },
  "vi": {
    "markdown": "Markdown",
    "markdown-placeholder": "Nhập Markdown ở đây...",
    "preview": "Xem trước",
    "toc-title": "Mục lục",
    "toc-empty": "Chưa có tiêu đề."
  },
  "th": {
    "markdown": "Markdown",
    "markdown-placeholder": "พิมพ์ Markdown ที่นี่...",
    "preview": "ตัวอย่าง",
    "toc-title": "สารบัญ",
    "toc-empty": "ยังไม่มีหัวข้อ"
  },
  "id": {
    "markdown": "Markdown",
    "markdown-placeholder": "Masukkan Markdown di sini...",
    "preview": "Pratinjau",
    "toc-title": "Daftar isi",
    "toc-empty": "Belum ada judul."
  },
  "he": {
    "markdown": "Markdown",
    "markdown-placeholder": "הזן Markdown כאן...",
    "preview": "תצוגה מקדימה",
    "toc-title": "תוכן עניינים",
    "toc-empty": "אין כותרות עדיין."
  },
  "ms": {
    "markdown": "Markdown",
    "markdown-placeholder": "Masukkan Markdown di sini...",
    "preview": "Pratonton",
    "toc-title": "Jadual kandungan",
    "toc-empty": "Tiada tajuk lagi."
  },
  "no": {
    "markdown": "Markdown",
    "markdown-placeholder": "Skriv Markdown her...",
    "preview": "Forhåndsvisning",
    "toc-title": "Innholdsfortegnelse",
    "toc-empty": "Ingen overskrifter ennå."
  }
}
</i18n>
