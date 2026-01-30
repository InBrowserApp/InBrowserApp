<template>
  <div class="export-block">
    <n-flex align="center" justify="space-between" :wrap="true" :size="12">
      <div>
        <div class="export-title">{{ t('export') }}</div>
        <div class="export-subtitle">{{ t('exportHint') }}</div>
      </div>
      <n-flex align="center" :size="8">
        <n-text depth="3">{{ t('formatting') }}</n-text>
        <n-select
          v-model:value="exportFormat"
          :options="exportOptions"
          size="small"
          class="export-select"
        />
      </n-flex>
    </n-flex>

    <n-input type="textarea" :value="exportContent" readonly :autosize="{ minRows: 4 }" />

    <n-flex align="center" :size="12" class="export-actions">
      <CopyToClipboardButton :content="exportContent" type="primary">
        {{ t('copy') }}
      </CopyToClipboardButton>
      <n-button
        text
        tag="a"
        :href="downloadUrl ?? undefined"
        :download="downloadName"
        :disabled="!downloadUrl"
      >
        <template #icon>
          <n-icon><DownloadIcon /></n-icon>
        </template>
        {{ t('download') }}
      </n-button>
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl, useStorage } from '@vueuse/core'
import { NButton, NFlex, NIcon, NInput, NSelect, NText } from 'naive-ui'
import DownloadIcon from '@vicons/fluent/ArrowDownload24Regular'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import type { PaletteSwatch } from '../types'
import {
  formatPaletteExport,
  getExportFileName,
  getExportMimeType,
  type PaletteExportFormat,
} from '../utils/palette-export'

const props = defineProps<{ colors: PaletteSwatch[]; fileName: string }>()

const { t } = useI18n({ useScope: 'local' })

const exportFormat = useStorage<PaletteExportFormat>(
  'tools:image-palette-extractor:export-format',
  'css',
)

const exportOptions = computed(() => [
  { label: t('formatHex'), value: 'hex' },
  { label: t('formatCss'), value: 'css' },
  { label: t('formatJson'), value: 'json' },
])

const exportColors = computed(() =>
  props.colors.map((color) => ({
    hex: color.hex,
    rgb: color.rgb,
    hsl: color.hsl,
    ratio: color.ratio,
  })),
)

const exportContent = computed(() => formatPaletteExport(exportColors.value, exportFormat.value))

const downloadBlob = computed(
  () => new Blob([exportContent.value], { type: getExportMimeType(exportFormat.value) }),
)
const downloadUrl = useObjectUrl(downloadBlob)
const downloadName = computed(() => getExportFileName(props.fileName, exportFormat.value))
</script>

<style scoped>
.export-block {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.export-title {
  font-weight: 600;
}

.export-subtitle {
  font-size: 12px;
  color: var(--n-text-color-3);
}

.export-actions {
  flex-wrap: wrap;
}

.export-select {
  min-width: 180px;
}
</style>

<i18n lang="json">
{
  "en": {
    "export": "Export palette",
    "exportHint": "Copy or download the palette for design handoff.",
    "formatting": "Format",
    "formatHex": "HEX list",
    "formatCss": "CSS variables",
    "formatJson": "JSON",
    "copy": "Copy",
    "download": "Download"
  },
  "zh": {
    "export": "导出调色板",
    "exportHint": "复制或下载调色板，方便设计交接。",
    "formatting": "格式",
    "formatHex": "HEX 列表",
    "formatCss": "CSS 变量",
    "formatJson": "JSON",
    "copy": "复制",
    "download": "下载"
  },
  "zh-CN": {
    "export": "导出调色板",
    "exportHint": "复制或下载调色板，方便设计交接。",
    "formatting": "格式",
    "formatHex": "HEX 列表",
    "formatCss": "CSS 变量",
    "formatJson": "JSON",
    "copy": "复制",
    "download": "下载"
  },
  "zh-TW": {
    "export": "匯出調色板",
    "exportHint": "複製或下載調色板，便於設計交接。",
    "formatting": "格式",
    "formatHex": "HEX 清單",
    "formatCss": "CSS 變數",
    "formatJson": "JSON",
    "copy": "複製",
    "download": "下載"
  },
  "zh-HK": {
    "export": "匯出調色板",
    "exportHint": "複製或下載調色板，便於設計交接。",
    "formatting": "格式",
    "formatHex": "HEX 清單",
    "formatCss": "CSS 變數",
    "formatJson": "JSON",
    "copy": "複製",
    "download": "下載"
  },
  "es": {
    "export": "Exportar paleta",
    "exportHint": "Copia o descarga la paleta para compartirla.",
    "formatting": "Formato",
    "formatHex": "Lista HEX",
    "formatCss": "Variables CSS",
    "formatJson": "JSON",
    "copy": "Copiar",
    "download": "Descargar"
  },
  "fr": {
    "export": "Exporter la palette",
    "exportHint": "Copiez ou téléchargez la palette pour le partage.",
    "formatting": "Format",
    "formatHex": "Liste HEX",
    "formatCss": "Variables CSS",
    "formatJson": "JSON",
    "copy": "Copier",
    "download": "Télécharger"
  },
  "de": {
    "export": "Palette exportieren",
    "exportHint": "Kopieren oder laden Sie die Palette herunter.",
    "formatting": "Format",
    "formatHex": "HEX-Liste",
    "formatCss": "CSS-Variablen",
    "formatJson": "JSON",
    "copy": "Kopieren",
    "download": "Herunterladen"
  },
  "it": {
    "export": "Esporta palette",
    "exportHint": "Copia o scarica la palette per la condivisione.",
    "formatting": "Formato",
    "formatHex": "Elenco HEX",
    "formatCss": "Variabili CSS",
    "formatJson": "JSON",
    "copy": "Copia",
    "download": "Scarica"
  },
  "ja": {
    "export": "パレットをエクスポート",
    "exportHint": "パレットをコピーまたはダウンロードできます。",
    "formatting": "形式",
    "formatHex": "HEX リスト",
    "formatCss": "CSS 変数",
    "formatJson": "JSON",
    "copy": "コピー",
    "download": "ダウンロード"
  },
  "ko": {
    "export": "팔레트 내보내기",
    "exportHint": "팔레트를 복사하거나 다운로드하세요.",
    "formatting": "형식",
    "formatHex": "HEX 목록",
    "formatCss": "CSS 변수",
    "formatJson": "JSON",
    "copy": "복사",
    "download": "다운로드"
  },
  "ru": {
    "export": "Экспорт палитры",
    "exportHint": "Скопируйте или скачайте палитру для передачи.",
    "formatting": "Формат",
    "formatHex": "Список HEX",
    "formatCss": "CSS-переменные",
    "formatJson": "JSON",
    "copy": "Копировать",
    "download": "Скачать"
  },
  "pt": {
    "export": "Exportar paleta",
    "exportHint": "Copie ou baixe a paleta para compartilhar.",
    "formatting": "Formato",
    "formatHex": "Lista HEX",
    "formatCss": "Variáveis CSS",
    "formatJson": "JSON",
    "copy": "Copiar",
    "download": "Baixar"
  },
  "ar": {
    "export": "تصدير اللوحة",
    "exportHint": "انسخ اللوحة أو قم بتنزيلها للمشاركة.",
    "formatting": "التنسيق",
    "formatHex": "قائمة HEX",
    "formatCss": "متغيرات CSS",
    "formatJson": "JSON",
    "copy": "نسخ",
    "download": "تحميل"
  },
  "hi": {
    "export": "पैलेट निर्यात",
    "exportHint": "पैलेट को कॉपी या डाउनलोड करें।",
    "formatting": "प्रारूप",
    "formatHex": "HEX सूची",
    "formatCss": "CSS वेरिएबल्स",
    "formatJson": "JSON",
    "copy": "कॉपी",
    "download": "डाउनलोड"
  },
  "tr": {
    "export": "Paleti disari aktar",
    "exportHint": "Paleti kopyalayin veya indirin.",
    "formatting": "Bicim",
    "formatHex": "HEX listesi",
    "formatCss": "CSS degiskenleri",
    "formatJson": "JSON",
    "copy": "Kopyala",
    "download": "Indir"
  },
  "nl": {
    "export": "Palette exporteren",
    "exportHint": "Kopieer of download de palette om te delen.",
    "formatting": "Indeling",
    "formatHex": "HEX-lijst",
    "formatCss": "CSS-variabelen",
    "formatJson": "JSON",
    "copy": "Kopiëren",
    "download": "Download"
  },
  "sv": {
    "export": "Exportera palett",
    "exportHint": "Kopiera eller ladda ner paletten.",
    "formatting": "Format",
    "formatHex": "HEX-lista",
    "formatCss": "CSS-variabler",
    "formatJson": "JSON",
    "copy": "Kopiera",
    "download": "Ladda ner"
  },
  "pl": {
    "export": "Eksportuj paletę",
    "exportHint": "Skopiuj lub pobierz paletę.",
    "formatting": "Format",
    "formatHex": "Lista HEX",
    "formatCss": "Zmienne CSS",
    "formatJson": "JSON",
    "copy": "Kopiuj",
    "download": "Pobierz"
  },
  "vi": {
    "export": "Xuất bảng màu",
    "exportHint": "Sao chép hoặc tải xuống bảng màu.",
    "formatting": "Định dạng",
    "formatHex": "Danh sách HEX",
    "formatCss": "Biến CSS",
    "formatJson": "JSON",
    "copy": "Sao chép",
    "download": "Tải xuống"
  },
  "th": {
    "export": "ส่งออกพาเล็ต",
    "exportHint": "คัดลอกหรือดาวน์โหลดพาเล็ตเพื่อแชร์.",
    "formatting": "รูปแบบ",
    "formatHex": "รายการ HEX",
    "formatCss": "ตัวแปร CSS",
    "formatJson": "JSON",
    "copy": "คัดลอก",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "export": "Ekspor palet",
    "exportHint": "Salin atau unduh palet untuk dibagikan.",
    "formatting": "Format",
    "formatHex": "Daftar HEX",
    "formatCss": "Variabel CSS",
    "formatJson": "JSON",
    "copy": "Salin",
    "download": "Unduh"
  },
  "he": {
    "export": "ייצוא פלטה",
    "exportHint": "העתק או הורד את הפלטה לשיתוף.",
    "formatting": "פורמט",
    "formatHex": "רשימת HEX",
    "formatCss": "משתני CSS",
    "formatJson": "JSON",
    "copy": "העתק",
    "download": "הורדה"
  },
  "ms": {
    "export": "Eksport palet",
    "exportHint": "Salin atau muat turun palet.",
    "formatting": "Format",
    "formatHex": "Senarai HEX",
    "formatCss": "Pemboleh ubah CSS",
    "formatJson": "JSON",
    "copy": "Salin",
    "download": "Muat turun"
  },
  "no": {
    "export": "Eksporter palett",
    "exportHint": "Kopier eller last ned paletten.",
    "formatting": "Format",
    "formatHex": "HEX-liste",
    "formatCss": "CSS-variabler",
    "formatJson": "JSON",
    "copy": "Kopier",
    "download": "Last ned"
  }
}
</i18n>
