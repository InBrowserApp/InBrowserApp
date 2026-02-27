<template>
  <n-modal
    :show="show"
    :mask-closable="true"
    @update:show="handleUpdateShow"
    @after-leave="emit('after-leave')"
  >
    <n-card
      closable
      role="dialog"
      style="width: min(860px, 92vw)"
      :title="selectedEntry?.path || t('preview-title')"
      @close="handleClose"
    >
      <template v-if="selectedEntry">
        <n-flex vertical :size="10">
          <n-flex justify="space-between" align="center" :size="10">
            <n-text depth="3">{{ formatBytes(selectedEntry.size) }}</n-text>

            <n-flex align="center" :size="8">
              <CopyToClipboardButton
                v-if="shouldShowCopyPreview"
                variant="text"
                :content="previewText"
              >
                <template #label>
                  {{ t('copy-preview') }}
                </template>
              </CopyToClipboardButton>

              <n-button
                v-if="selectedBlobUrl && selectedEntry.kind === 'file'"
                tag="a"
                text
                :href="selectedBlobUrl"
                :download="downloadName"
              >
                <template #icon>
                  <n-icon :component="ArrowDownload16Regular" />
                </template>
                {{ t('download-entry') }}
              </n-button>
            </n-flex>
          </n-flex>

          <n-scrollbar style="max-height: 80vh">
            <n-flex v-if="isLoadingPreview" align="center" :size="8">
              <n-spin size="small" />
              <n-text>{{ t('loading-preview') }}</n-text>
            </n-flex>

            <div
              v-else-if="previewKind === 'image' && selectedBlobUrl"
              style="display: flex; justify-content: center; align-items: center; padding: 8px 0"
            >
              <img
                style="max-width: 100%; max-height: 76vh; object-fit: contain; display: block"
                :src="selectedBlobUrl"
                :alt="selectedEntry.path"
              />
            </div>

            <n-code
              v-else-if="previewKind === 'text'"
              :code="previewText"
              :language="previewLanguage"
              :hljs="hljs"
              show-line-numbers
              word-wrap
            />

            <n-alert v-else type="info">{{ previewText || t('no-preview') }}</n-alert>
          </n-scrollbar>
        </n-flex>
      </template>
      <template v-else>
        <n-text depth="3">{{ t('no-selection') }}</n-text>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NCard,
  NCode,
  NFlex,
  NIcon,
  NModal,
  NScrollbar,
  NSpin,
  NText,
} from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { useI18n } from 'vue-i18n'
import hljs from 'highlight.js/lib/core'
import bashLang from 'highlight.js/lib/languages/bash'
import cssLang from 'highlight.js/lib/languages/css'
import goLang from 'highlight.js/lib/languages/go'
import iniLang from 'highlight.js/lib/languages/ini'
import javaLang from 'highlight.js/lib/languages/java'
import javascriptLang from 'highlight.js/lib/languages/javascript'
import jsonLang from 'highlight.js/lib/languages/json'
import kotlinLang from 'highlight.js/lib/languages/kotlin'
import markdownLang from 'highlight.js/lib/languages/markdown'
import phpLang from 'highlight.js/lib/languages/php'
import plaintextLang from 'highlight.js/lib/languages/plaintext'
import pythonLang from 'highlight.js/lib/languages/python'
import rubyLang from 'highlight.js/lib/languages/ruby'
import rustLang from 'highlight.js/lib/languages/rust'
import sqlLang from 'highlight.js/lib/languages/sql'
import typescriptLang from 'highlight.js/lib/languages/typescript'
import xmlLang from 'highlight.js/lib/languages/xml'
import yamlLang from 'highlight.js/lib/languages/yaml'
import type { ArchiveEntry } from '../types'

defineProps<{
  show: boolean
  selectedEntry: ArchiveEntry | null
  selectedBlobUrl?: string
  previewKind: 'none' | 'text' | 'image'
  previewText: string
  previewLanguage: string
  isLoadingPreview: boolean
  downloadName: string
  shouldShowCopyPreview: boolean
  formatBytes: (value: number) => string
}>()

const emit = defineEmits<{
  (event: 'update:show', value: boolean): void
  (event: 'after-leave'): void
}>()

const { t } = useI18n()

hljs.registerLanguage('bash', bashLang)
hljs.registerLanguage('css', cssLang)
hljs.registerLanguage('go', goLang)
hljs.registerLanguage('ini', iniLang)
hljs.registerLanguage('java', javaLang)
hljs.registerLanguage('javascript', javascriptLang)
hljs.registerLanguage('json', jsonLang)
hljs.registerLanguage('kotlin', kotlinLang)
hljs.registerLanguage('markdown', markdownLang)
hljs.registerLanguage('php', phpLang)
hljs.registerLanguage('plaintext', plaintextLang)
hljs.registerLanguage('python', pythonLang)
hljs.registerLanguage('ruby', rubyLang)
hljs.registerLanguage('rust', rustLang)
hljs.registerLanguage('sql', sqlLang)
hljs.registerLanguage('typescript', typescriptLang)
hljs.registerLanguage('xml', xmlLang)
hljs.registerLanguage('yaml', yamlLang)

function handleClose() {
  emit('update:show', false)
}

function handleUpdateShow(value: boolean) {
  emit('update:show', value)
}
</script>

<i18n lang="json">
{
  "en": {
    "preview-title": "Preview",
    "no-selection": "Select a file entry to preview.",
    "loading-preview": "Loading preview...",
    "no-preview": "Preview is not available for this file type.",
    "download-entry": "Download",
    "copy-preview": "Copy"
  },
  "zh": {
    "preview-title": "预览",
    "no-selection": "请选择要预览的文件。",
    "loading-preview": "正在加载预览...",
    "no-preview": "此文件类型暂不支持预览。",
    "download-entry": "下载",
    "copy-preview": "复制"
  },
  "zh-CN": {
    "preview-title": "预览",
    "no-selection": "请选择要预览的文件。",
    "loading-preview": "正在加载预览...",
    "no-preview": "此文件类型暂不支持预览。",
    "download-entry": "下载",
    "copy-preview": "复制"
  },
  "zh-TW": {
    "preview-title": "預覽",
    "no-selection": "請選擇要預覽的檔案。",
    "loading-preview": "正在載入預覽...",
    "no-preview": "此檔案類型暫不支援預覽。",
    "download-entry": "下載",
    "copy-preview": "複製"
  },
  "zh-HK": {
    "preview-title": "預覽",
    "no-selection": "請選擇要預覽的檔案。",
    "loading-preview": "正在載入預覽...",
    "no-preview": "此檔案類型暫不支援預覽。",
    "download-entry": "下載",
    "copy-preview": "複製"
  },
  "es": {
    "preview-title": "Vista previa",
    "no-selection": "Selecciona un archivo para previsualizar.",
    "loading-preview": "Cargando vista previa...",
    "no-preview": "No hay vista previa para este tipo de archivo.",
    "download-entry": "Descargar",
    "copy-preview": "Copiar"
  },
  "fr": {
    "preview-title": "Aperçu",
    "no-selection": "Sélectionnez un fichier à prévisualiser.",
    "loading-preview": "Chargement de l’aperçu...",
    "no-preview": "Aucun aperçu pour ce type de fichier.",
    "download-entry": "Télécharger",
    "copy-preview": "Copier"
  },
  "de": {
    "preview-title": "Vorschau",
    "no-selection": "Wähle eine Datei zur Vorschau aus.",
    "loading-preview": "Vorschau wird geladen...",
    "no-preview": "Für diesen Dateityp ist keine Vorschau verfügbar.",
    "download-entry": "Herunterladen",
    "copy-preview": "Kopieren"
  },
  "it": {
    "preview-title": "Anteprima",
    "no-selection": "Seleziona un file da visualizzare.",
    "loading-preview": "Caricamento anteprima...",
    "no-preview": "Anteprima non disponibile per questo tipo di file.",
    "download-entry": "Scarica",
    "copy-preview": "Copia"
  },
  "pt": {
    "preview-title": "Visualização",
    "no-selection": "Selecione um arquivo para visualizar.",
    "loading-preview": "Carregando visualização...",
    "no-preview": "Visualização não disponível para este tipo de arquivo.",
    "download-entry": "Baixar",
    "copy-preview": "Copiar"
  },
  "ru": {
    "preview-title": "Предпросмотр",
    "no-selection": "Выберите файл для предпросмотра.",
    "loading-preview": "Загрузка предпросмотра...",
    "no-preview": "Предпросмотр для этого типа файла недоступен.",
    "download-entry": "Скачать",
    "copy-preview": "Копировать"
  },
  "tr": {
    "preview-title": "Önizleme",
    "no-selection": "Önizlemek için bir dosya seçin.",
    "loading-preview": "Önizleme yükleniyor...",
    "no-preview": "Bu dosya türü için önizleme yok.",
    "download-entry": "İndir",
    "copy-preview": "Kopyala"
  },
  "nl": {
    "preview-title": "Voorbeeld",
    "no-selection": "Selecteer een bestand voor voorbeeld.",
    "loading-preview": "Voorbeeld laden...",
    "no-preview": "Voorbeeld is niet beschikbaar voor dit bestandstype.",
    "download-entry": "Downloaden",
    "copy-preview": "Kopiëren"
  },
  "sv": {
    "preview-title": "Förhandsvisning",
    "no-selection": "Välj en fil för förhandsvisning.",
    "loading-preview": "Laddar förhandsvisning...",
    "no-preview": "Förhandsvisning finns inte för den här filtypen.",
    "download-entry": "Ladda ner",
    "copy-preview": "Kopiera"
  },
  "pl": {
    "preview-title": "Podgląd",
    "no-selection": "Wybierz plik do podglądu.",
    "loading-preview": "Ładowanie podglądu...",
    "no-preview": "Podgląd jest niedostępny dla tego typu pliku.",
    "download-entry": "Pobierz",
    "copy-preview": "Kopiuj"
  },
  "no": {
    "preview-title": "Forhåndsvisning",
    "no-selection": "Velg en fil for forhåndsvisning.",
    "loading-preview": "Laster forhåndsvisning...",
    "no-preview": "Forhåndsvisning er ikke tilgjengelig for denne filtypen.",
    "download-entry": "Last ned",
    "copy-preview": "Kopier"
  },
  "ja": {
    "preview-title": "プレビュー",
    "no-selection": "プレビューするファイルを選択してください。",
    "loading-preview": "プレビューを読み込み中...",
    "no-preview": "このファイル形式はプレビューできません。",
    "download-entry": "ダウンロード",
    "copy-preview": "コピー"
  },
  "ko": {
    "preview-title": "미리보기",
    "no-selection": "미리볼 파일을 선택하세요.",
    "loading-preview": "미리보기를 불러오는 중...",
    "no-preview": "이 파일 형식은 미리보기를 지원하지 않습니다.",
    "download-entry": "다운로드",
    "copy-preview": "복사"
  },
  "ar": {
    "preview-title": "معاينة",
    "no-selection": "اختر ملفًا للمعاينة.",
    "loading-preview": "جارٍ تحميل المعاينة...",
    "no-preview": "المعاينة غير متاحة لهذا النوع من الملفات.",
    "download-entry": "تنزيل",
    "copy-preview": "نسخ"
  },
  "hi": {
    "preview-title": "प्रीव्यू",
    "no-selection": "प्रीव्यू के लिए कोई फ़ाइल चुनें।",
    "loading-preview": "प्रीव्यू लोड हो रहा है...",
    "no-preview": "इस फ़ाइल प्रकार के लिए प्रीव्यू उपलब्ध नहीं है।",
    "download-entry": "डाउनलोड",
    "copy-preview": "कॉपी"
  },
  "vi": {
    "preview-title": "Xem trước",
    "no-selection": "Chọn một tệp để xem trước.",
    "loading-preview": "Đang tải xem trước...",
    "no-preview": "Không thể xem trước cho loại tệp này.",
    "download-entry": "Tải xuống",
    "copy-preview": "Sao chép"
  },
  "th": {
    "preview-title": "พรีวิว",
    "no-selection": "เลือกไฟล์เพื่อพรีวิว",
    "loading-preview": "กำลังโหลดพรีวิว...",
    "no-preview": "ไม่รองรับพรีวิวสำหรับไฟล์ประเภทนี้",
    "download-entry": "ดาวน์โหลด",
    "copy-preview": "คัดลอก"
  },
  "id": {
    "preview-title": "Pratinjau",
    "no-selection": "Pilih file untuk pratinjau.",
    "loading-preview": "Memuat pratinjau...",
    "no-preview": "Pratinjau tidak tersedia untuk jenis file ini.",
    "download-entry": "Unduh",
    "copy-preview": "Salin"
  },
  "he": {
    "preview-title": "תצוגה מקדימה",
    "no-selection": "בחר קובץ לתצוגה מקדימה.",
    "loading-preview": "טוען תצוגה מקדימה...",
    "no-preview": "אין תצוגה מקדימה לסוג קובץ זה.",
    "download-entry": "הורדה",
    "copy-preview": "העתקה"
  },
  "ms": {
    "preview-title": "Pratonton",
    "no-selection": "Pilih fail untuk pratonton.",
    "loading-preview": "Memuatkan pratonton...",
    "no-preview": "Pratonton tidak tersedia untuk jenis fail ini.",
    "download-entry": "Muat turun",
    "copy-preview": "Salin"
  }
}
</i18n>
