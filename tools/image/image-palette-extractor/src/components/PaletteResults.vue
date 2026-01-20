<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
    <n-spin :show="isLoading">
      <template v-if="colors.length">
        <n-flex vertical :size="16" class="overview-stack">
          <div class="palette-bar">
            <div
              v-for="color in colors"
              :key="color.hex"
              class="palette-slice"
              :style="{ backgroundColor: color.hex, flex: color.count }"
              :title="`${color.hex} · ${formatPercent(color.ratio)}`"
            />
          </div>

          <n-grid cols="1 700:3" :x-gap="16" :y-gap="16" class="stats-grid">
            <n-grid-item>
              <n-statistic :label="t('colorCount')">
                {{ colors.length }}
              </n-statistic>
            </n-grid-item>
            <n-grid-item>
              <n-statistic :label="t('pixels')">
                {{ formattedPixels }}
              </n-statistic>
            </n-grid-item>
            <n-grid-item>
              <n-statistic :label="t('dominant')">
                <n-flex align="center" :size="8">
                  <span class="dominant-dot" :style="{ backgroundColor: dominantColor?.hex }" />
                  <span>{{ dominantColor?.hex }}</span>
                </n-flex>
              </n-statistic>
            </n-grid-item>
          </n-grid>
        </n-flex>

        <n-grid cols="1 s:2 l:3" :x-gap="16" :y-gap="16" class="swatch-grid">
          <n-grid-item v-for="color in colors" :key="color.hex">
            <div
              class="swatch-card"
              :style="{ backgroundColor: color.hex, color: color.textColor }"
            >
              <div class="swatch-overlay">
                <CopyToClipboardTooltip :content="color.hex" #="{ copy }">
                  <button type="button" class="swatch-hex" :aria-label="t('copy')" @click="copy">
                    {{ color.hex }}
                  </button>
                </CopyToClipboardTooltip>
                <span class="swatch-percent">{{ formatPercent(color.ratio) }}</span>
              </div>
            </div>
          </n-grid-item>
        </n-grid>

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
      <n-empty v-else :description="t('empty')" />
    </n-spin>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useObjectUrl, useStorage } from '@vueuse/core'
import {
  NSpin,
  NGrid,
  NGridItem,
  NStatistic,
  NFlex,
  NSelect,
  NText,
  NInput,
  NButton,
  NIcon,
  NEmpty,
} from 'naive-ui'
import DownloadIcon from '@vicons/fluent/ArrowDownload24Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton, CopyToClipboardTooltip } from '@shared/ui/base'
import type { PaletteSwatch } from '../types'
import {
  formatPaletteExport,
  getExportFileName,
  getExportMimeType,
  type PaletteExportFormat,
} from '../utils/palette-export'

const { t } = useI18n()

const props = defineProps<{
  colors: PaletteSwatch[]
  dominant: PaletteSwatch | null
  totalPixels: number
  fileName: string
  isLoading: boolean
}>()

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

const dominantColor = computed(() => props.dominant)
const formattedPixels = computed(() => props.totalPixels.toLocaleString())

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}
</script>

<style scoped>
.palette-bar {
  display: flex;
  height: 18px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--n-border-color);
}

.palette-slice {
  min-width: 6px;
}

.swatch-grid {
  margin-top: 20px;
}

.swatch-card {
  border: 1px solid var(--n-border-color);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
}

.swatch-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  text-align: center;
}

.swatch-hex {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.3px;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.swatch-hex:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
  border-radius: 999px;
}

.swatch-percent {
  font-weight: 600;
  font-size: 12px;
  opacity: 0.9;
}

.dominant-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--n-border-color);
  display: inline-block;
}

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
    "results": "Palette Results",
    "colorCount": "Colors",
    "pixels": "Sampled pixels",
    "dominant": "Dominant",
    "export": "Export palette",
    "exportHint": "Copy or download the palette for design handoff.",
    "formatHex": "HEX list",
    "formatCss": "CSS variables",
    "formatJson": "JSON",
    "copy": "Copy",
    "download": "Download",
    "empty": "No colors extracted yet.",
    "formatting": "Format"
  },
  "zh": {
    "results": "调色板结果",
    "colorCount": "颜色数量",
    "pixels": "采样像素",
    "dominant": "主色",
    "export": "导出调色板",
    "exportHint": "复制或下载调色板，方便设计交接。",
    "formatHex": "HEX 列表",
    "formatCss": "CSS 变量",
    "formatJson": "JSON",
    "copy": "复制",
    "download": "下载",
    "empty": "暂无可用颜色。",
    "formatting": "格式"
  },
  "zh-CN": {
    "results": "调色板结果",
    "colorCount": "颜色数量",
    "pixels": "采样像素",
    "dominant": "主色",
    "export": "导出调色板",
    "exportHint": "复制或下载调色板，方便设计交接。",
    "formatHex": "HEX 列表",
    "formatCss": "CSS 变量",
    "formatJson": "JSON",
    "copy": "复制",
    "download": "下载",
    "empty": "暂无可用颜色。",
    "formatting": "格式"
  },
  "zh-TW": {
    "results": "調色板結果",
    "colorCount": "顏色數量",
    "pixels": "取樣像素",
    "dominant": "主色",
    "export": "匯出調色板",
    "exportHint": "複製或下載調色板，便於設計交接。",
    "formatHex": "HEX 清單",
    "formatCss": "CSS 變數",
    "formatJson": "JSON",
    "copy": "複製",
    "download": "下載",
    "empty": "尚未擷取到顏色。",
    "formatting": "格式"
  },
  "zh-HK": {
    "results": "調色板結果",
    "colorCount": "顏色數量",
    "pixels": "取樣像素",
    "dominant": "主色",
    "export": "匯出調色板",
    "exportHint": "複製或下載調色板，便於設計交接。",
    "formatHex": "HEX 清單",
    "formatCss": "CSS 變數",
    "formatJson": "JSON",
    "copy": "複製",
    "download": "下載",
    "empty": "尚未擷取到顏色。",
    "formatting": "格式"
  },
  "es": {
    "results": "Resultados de la paleta",
    "colorCount": "Colores",
    "pixels": "Píxeles muestreados",
    "dominant": "Dominante",
    "export": "Exportar paleta",
    "exportHint": "Copia o descarga la paleta para compartirla.",
    "formatHex": "Lista HEX",
    "formatCss": "Variables CSS",
    "formatJson": "JSON",
    "copy": "Copiar",
    "download": "Descargar",
    "empty": "Aún no se han extraído colores.",
    "formatting": "Formato"
  },
  "fr": {
    "results": "Résultats de la palette",
    "colorCount": "Couleurs",
    "pixels": "Pixels échantillonnés",
    "dominant": "Dominante",
    "export": "Exporter la palette",
    "exportHint": "Copiez ou téléchargez la palette pour le partage.",
    "formatHex": "Liste HEX",
    "formatCss": "Variables CSS",
    "formatJson": "JSON",
    "copy": "Copier",
    "download": "Télécharger",
    "empty": "Aucune couleur extraite pour l'instant.",
    "formatting": "Format"
  },
  "de": {
    "results": "Palettenergebnisse",
    "colorCount": "Farben",
    "pixels": "Abgetastete Pixel",
    "dominant": "Dominant",
    "export": "Palette exportieren",
    "exportHint": "Kopieren oder laden Sie die Palette herunter.",
    "formatHex": "HEX-Liste",
    "formatCss": "CSS-Variablen",
    "formatJson": "JSON",
    "copy": "Kopieren",
    "download": "Herunterladen",
    "empty": "Noch keine Farben extrahiert.",
    "formatting": "Format"
  },
  "it": {
    "results": "Risultati della palette",
    "colorCount": "Colori",
    "pixels": "Pixel campionati",
    "dominant": "Dominante",
    "export": "Esporta palette",
    "exportHint": "Copia o scarica la palette per la condivisione.",
    "formatHex": "Elenco HEX",
    "formatCss": "Variabili CSS",
    "formatJson": "JSON",
    "copy": "Copia",
    "download": "Scarica",
    "empty": "Nessun colore estratto.",
    "formatting": "Formato"
  },
  "ja": {
    "results": "パレット結果",
    "colorCount": "色数",
    "pixels": "サンプルピクセル",
    "dominant": "主色",
    "export": "パレットをエクスポート",
    "exportHint": "パレットをコピーまたはダウンロードできます。",
    "formatHex": "HEX リスト",
    "formatCss": "CSS 変数",
    "formatJson": "JSON",
    "copy": "コピー",
    "download": "ダウンロード",
    "empty": "まだ色が抽出されていません。",
    "formatting": "形式"
  },
  "ko": {
    "results": "팔레트 결과",
    "colorCount": "색상 수",
    "pixels": "샘플 픽셀",
    "dominant": "대표 색상",
    "export": "팔레트 내보내기",
    "exportHint": "팔레트를 복사하거나 다운로드하세요.",
    "formatHex": "HEX 목록",
    "formatCss": "CSS 변수",
    "formatJson": "JSON",
    "copy": "복사",
    "download": "다운로드",
    "empty": "아직 색상이 추출되지 않았습니다.",
    "formatting": "형식"
  },
  "ru": {
    "results": "Результаты палитры",
    "colorCount": "Цвета",
    "pixels": "Выбранные пиксели",
    "dominant": "Доминирующий",
    "export": "Экспорт палитры",
    "exportHint": "Скопируйте или скачайте палитру для передачи.",
    "formatHex": "Список HEX",
    "formatCss": "CSS-переменные",
    "formatJson": "JSON",
    "copy": "Копировать",
    "download": "Скачать",
    "empty": "Цвета пока не извлечены.",
    "formatting": "Формат"
  },
  "pt": {
    "results": "Resultados da paleta",
    "colorCount": "Cores",
    "pixels": "Pixels amostrados",
    "dominant": "Dominante",
    "export": "Exportar paleta",
    "exportHint": "Copie ou baixe a paleta para compartilhar.",
    "formatHex": "Lista HEX",
    "formatCss": "Variáveis CSS",
    "formatJson": "JSON",
    "copy": "Copiar",
    "download": "Baixar",
    "empty": "Nenhuma cor extraída ainda.",
    "formatting": "Formato"
  },
  "ar": {
    "results": "نتائج اللوحة",
    "colorCount": "الألوان",
    "pixels": "بكسلات تم أخذها",
    "dominant": "الأكثر شيوعًا",
    "export": "تصدير اللوحة",
    "exportHint": "انسخ اللوحة أو قم بتنزيلها للمشاركة.",
    "formatHex": "قائمة HEX",
    "formatCss": "متغيرات CSS",
    "formatJson": "JSON",
    "copy": "نسخ",
    "download": "تحميل",
    "empty": "لم يتم استخراج ألوان بعد.",
    "formatting": "التنسيق"
  },
  "hi": {
    "results": "पैलेट परिणाम",
    "colorCount": "रंग",
    "pixels": "सैंपल पिक्सेल",
    "dominant": "प्रमुख",
    "export": "पैलेट निर्यात",
    "exportHint": "पैलेट को कॉपी या डाउनलोड करें।",
    "formatHex": "HEX सूची",
    "formatCss": "CSS वेरिएबल्स",
    "formatJson": "JSON",
    "copy": "कॉपी",
    "download": "डाउनलोड",
    "empty": "अब तक कोई रंग नहीं निकाला गया।",
    "formatting": "प्रारूप"
  },
  "tr": {
    "results": "Palet sonuclari",
    "colorCount": "Renkler",
    "pixels": "Orneklenen pikseller",
    "dominant": "Baskin",
    "export": "Paleti disari aktar",
    "exportHint": "Paleti kopyalayin veya indirin.",
    "formatHex": "HEX listesi",
    "formatCss": "CSS degiskenleri",
    "formatJson": "JSON",
    "copy": "Kopyala",
    "download": "Indir",
    "empty": "Henuz renk cikarilmadi.",
    "formatting": "Bicim"
  },
  "nl": {
    "results": "Palette-resultaten",
    "colorCount": "Kleuren",
    "pixels": "Bemonsterde pixels",
    "dominant": "Dominant",
    "export": "Palette exporteren",
    "exportHint": "Kopieer of download de palette om te delen.",
    "formatHex": "HEX-lijst",
    "formatCss": "CSS-variabelen",
    "formatJson": "JSON",
    "copy": "Kopiëren",
    "download": "Download",
    "empty": "Nog geen kleuren geëxtraheerd.",
    "formatting": "Indeling"
  },
  "sv": {
    "results": "Palettresultat",
    "colorCount": "Färger",
    "pixels": "Provtagna pixlar",
    "dominant": "Dominerande",
    "export": "Exportera palett",
    "exportHint": "Kopiera eller ladda ner paletten.",
    "formatHex": "HEX-lista",
    "formatCss": "CSS-variabler",
    "formatJson": "JSON",
    "copy": "Kopiera",
    "download": "Ladda ner",
    "empty": "Inga färger extraherade ännu.",
    "formatting": "Format"
  },
  "pl": {
    "results": "Wyniki palety",
    "colorCount": "Kolory",
    "pixels": "Próbkowane piksele",
    "dominant": "Dominujący",
    "export": "Eksportuj paletę",
    "exportHint": "Skopiuj lub pobierz paletę.",
    "formatHex": "Lista HEX",
    "formatCss": "Zmienne CSS",
    "formatJson": "JSON",
    "copy": "Kopiuj",
    "download": "Pobierz",
    "empty": "Brak wyodrębnionych kolorów.",
    "formatting": "Format"
  },
  "vi": {
    "results": "Kết quả bảng màu",
    "colorCount": "Màu sắc",
    "pixels": "Pixel đã lấy mẫu",
    "dominant": "Chủ đạo",
    "export": "Xuất bảng màu",
    "exportHint": "Sao chép hoặc tải xuống bảng màu.",
    "formatHex": "Danh sách HEX",
    "formatCss": "Biến CSS",
    "formatJson": "JSON",
    "copy": "Sao chép",
    "download": "Tải xuống",
    "empty": "Chưa trích xuất màu nào.",
    "formatting": "Định dạng"
  },
  "th": {
    "results": "ผลลัพธ์พาเล็ต",
    "colorCount": "สี",
    "pixels": "พิกเซลที่สุ่ม",
    "dominant": "สีหลัก",
    "export": "ส่งออกพาเล็ต",
    "exportHint": "คัดลอกหรือดาวน์โหลดพาเล็ตเพื่อแชร์.",
    "formatHex": "รายการ HEX",
    "formatCss": "ตัวแปร CSS",
    "formatJson": "JSON",
    "copy": "คัดลอก",
    "download": "ดาวน์โหลด",
    "empty": "ยังไม่มีสีที่ถูกดึงออกมา",
    "formatting": "รูปแบบ"
  },
  "id": {
    "results": "Hasil palet",
    "colorCount": "Warna",
    "pixels": "Piksel sampel",
    "dominant": "Dominan",
    "export": "Ekspor palet",
    "exportHint": "Salin atau unduh palet untuk dibagikan.",
    "formatHex": "Daftar HEX",
    "formatCss": "Variabel CSS",
    "formatJson": "JSON",
    "copy": "Salin",
    "download": "Unduh",
    "empty": "Belum ada warna yang diekstrak.",
    "formatting": "Format"
  },
  "he": {
    "results": "תוצאות הפלטה",
    "colorCount": "צבעים",
    "pixels": "פיקסלים שנדגמו",
    "dominant": "דומיננטי",
    "export": "ייצוא פלטה",
    "exportHint": "העתק או הורד את הפלטה לשיתוף.",
    "formatHex": "רשימת HEX",
    "formatCss": "משתני CSS",
    "formatJson": "JSON",
    "copy": "העתק",
    "download": "הורדה",
    "empty": "עדיין לא חולצו צבעים.",
    "formatting": "פורמט"
  },
  "ms": {
    "results": "Hasil palet",
    "colorCount": "Warna",
    "pixels": "Piksel sampel",
    "dominant": "Dominan",
    "export": "Eksport palet",
    "exportHint": "Salin atau muat turun palet.",
    "formatHex": "Senarai HEX",
    "formatCss": "Pemboleh ubah CSS",
    "formatJson": "JSON",
    "copy": "Salin",
    "download": "Muat turun",
    "empty": "Belum ada warna yang diekstrak.",
    "formatting": "Format"
  },
  "no": {
    "results": "Palettresultat",
    "colorCount": "Farger",
    "pixels": "Samplede piksler",
    "dominant": "Dominerende",
    "export": "Eksporter palett",
    "exportHint": "Kopier eller last ned paletten.",
    "formatHex": "HEX-liste",
    "formatCss": "CSS-variabler",
    "formatJson": "JSON",
    "copy": "Kopier",
    "download": "Last ned",
    "empty": "Ingen farger er hentet ut ennå.",
    "formatting": "Format"
  }
}
</i18n>
