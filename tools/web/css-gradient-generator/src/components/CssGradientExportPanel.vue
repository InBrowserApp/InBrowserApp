<template>
  <n-card class="panel">
    <div class="panel__header">
      <div>
        <div class="panel__title">{{ t('exportTitle') }}</div>
        <div class="panel__subtitle">{{ t('exportSubtitle') }}</div>
      </div>
    </div>
    <n-flex vertical :size="12">
      <div class="form-row">
        <div class="form-label">{{ t('exportWidth') }}</div>
        <n-input-number v-model:value="exportWidthModel" :min="200" :max="4096" />
      </div>
      <div class="form-row">
        <div class="form-label">{{ t('exportHeight') }}</div>
        <n-input-number v-model:value="exportHeightModel" :min="200" :max="4096" />
      </div>
      <n-flex :size="8" :wrap="true">
        <n-button
          tag="a"
          text
          :href="pngUrl ?? undefined"
          download="gradient.png"
          data-testid="download-png"
          :loading="isExportingPng"
          @click="handleDownloadPng"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('downloadPng') }}
        </n-button>
        <n-button
          tag="a"
          text
          :href="svgUrl ?? undefined"
          download="gradient.svg"
          data-testid="download-svg"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('downloadSvg') }}
        </n-button>
      </n-flex>
      <n-alert
        v-if="showError"
        type="warning"
        :show-icon="false"
        class="panel__alert"
        data-testid="export-error"
      >
        {{ t('pngUnsupported') }}
      </n-alert>
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NAlert, NButton, NCard, NFlex, NIcon, NInputNumber } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'

const { t } = useI18n()

const props = defineProps<{
  exportWidth: number
  exportHeight: number
  pngUrl?: string
  svgUrl?: string
  isExportingPng: boolean
  showError: boolean
}>()

const emit = defineEmits<{
  (event: 'update:exportWidth', value: number): void
  (event: 'update:exportHeight', value: number): void
  (event: 'download-png', value: MouseEvent): void
}>()

const exportWidthModel = computed({
  get: () => props.exportWidth,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    emit('update:exportWidth', value)
  },
})

const exportHeightModel = computed({
  get: () => props.exportHeight,
  set: (value: number | null) => {
    if (typeof value !== 'number') return
    emit('update:exportHeight', value)
  },
})

function handleDownloadPng(event: MouseEvent) {
  emit('download-png', event)
}
</script>

<i18n lang="json">
{
  "en": {
    "exportTitle": "Export",
    "exportSubtitle": "Generate a PNG/SVG snapshot.",
    "exportWidth": "Width",
    "exportHeight": "Height",
    "downloadPng": "Download PNG",
    "downloadSvg": "Download SVG",
    "pngUnsupported": "PNG export is not supported in this browser."
  },
  "zh": {
    "exportTitle": "导出",
    "exportSubtitle": "生成 PNG/SVG 快照。",
    "exportWidth": "宽度",
    "exportHeight": "高度",
    "downloadPng": "下载 PNG",
    "downloadSvg": "下载 SVG",
    "pngUnsupported": "当前浏览器不支持 PNG 导出。"
  },
  "zh-CN": {
    "exportTitle": "导出",
    "exportSubtitle": "生成 PNG/SVG 快照。",
    "exportWidth": "宽度",
    "exportHeight": "高度",
    "downloadPng": "下载 PNG",
    "downloadSvg": "下载 SVG",
    "pngUnsupported": "当前浏览器不支持 PNG 导出。"
  },
  "zh-TW": {
    "exportTitle": "匯出",
    "exportSubtitle": "產生 PNG/SVG 快照。",
    "exportWidth": "寬度",
    "exportHeight": "高度",
    "downloadPng": "下載 PNG",
    "downloadSvg": "下載 SVG",
    "pngUnsupported": "此瀏覽器不支援 PNG 匯出。"
  },
  "zh-HK": {
    "exportTitle": "匯出",
    "exportSubtitle": "產生 PNG/SVG 快照。",
    "exportWidth": "寬度",
    "exportHeight": "高度",
    "downloadPng": "下載 PNG",
    "downloadSvg": "下載 SVG",
    "pngUnsupported": "此瀏覽器不支援 PNG 匯出。"
  },
  "es": {
    "exportTitle": "Exportar",
    "exportSubtitle": "Genera una captura PNG/SVG.",
    "exportWidth": "Ancho",
    "exportHeight": "Alto",
    "downloadPng": "Descargar PNG",
    "downloadSvg": "Descargar SVG",
    "pngUnsupported": "La exportación PNG no es compatible en este navegador."
  },
  "fr": {
    "exportTitle": "Exporter",
    "exportSubtitle": "Générez un instantané PNG/SVG.",
    "exportWidth": "Largeur",
    "exportHeight": "Hauteur",
    "downloadPng": "Télécharger PNG",
    "downloadSvg": "Télécharger SVG",
    "pngUnsupported": "L’export PNG n’est pas pris en charge dans ce navigateur."
  },
  "de": {
    "exportTitle": "Export",
    "exportSubtitle": "PNG/SVG-Schnappschuss erzeugen.",
    "exportWidth": "Breite",
    "exportHeight": "Höhe",
    "downloadPng": "PNG herunterladen",
    "downloadSvg": "SVG herunterladen",
    "pngUnsupported": "PNG-Export wird in diesem Browser nicht unterstützt."
  },
  "it": {
    "exportTitle": "Esporta",
    "exportSubtitle": "Genera uno snapshot PNG/SVG.",
    "exportWidth": "Larghezza",
    "exportHeight": "Altezza",
    "downloadPng": "Scarica PNG",
    "downloadSvg": "Scarica SVG",
    "pngUnsupported": "L’esportazione PNG non è supportata in questo browser."
  },
  "ja": {
    "exportTitle": "エクスポート",
    "exportSubtitle": "PNG/SVG スナップショットを生成。",
    "exportWidth": "幅",
    "exportHeight": "高さ",
    "downloadPng": "PNG をダウンロード",
    "downloadSvg": "SVG をダウンロード",
    "pngUnsupported": "このブラウザでは PNG 出力に対応していません。"
  },
  "ko": {
    "exportTitle": "내보내기",
    "exportSubtitle": "PNG/SVG 스냅샷을 생성합니다.",
    "exportWidth": "너비",
    "exportHeight": "높이",
    "downloadPng": "PNG 다운로드",
    "downloadSvg": "SVG 다운로드",
    "pngUnsupported": "이 브라우저는 PNG 내보내기를 지원하지 않습니다."
  },
  "ru": {
    "exportTitle": "Экспорт",
    "exportSubtitle": "Создайте PNG/SVG-снимок.",
    "exportWidth": "Ширина",
    "exportHeight": "Высота",
    "downloadPng": "Скачать PNG",
    "downloadSvg": "Скачать SVG",
    "pngUnsupported": "Экспорт PNG не поддерживается в этом браузере."
  },
  "pt": {
    "exportTitle": "Exportar",
    "exportSubtitle": "Gere um snapshot PNG/SVG.",
    "exportWidth": "Largura",
    "exportHeight": "Altura",
    "downloadPng": "Baixar PNG",
    "downloadSvg": "Baixar SVG",
    "pngUnsupported": "A exportação PNG não é suportada neste navegador."
  },
  "ar": {
    "exportTitle": "تصدير",
    "exportSubtitle": "إنشاء لقطة PNG/SVG.",
    "exportWidth": "العرض",
    "exportHeight": "الارتفاع",
    "downloadPng": "تنزيل PNG",
    "downloadSvg": "تنزيل SVG",
    "pngUnsupported": "تصدير PNG غير مدعوم في هذا المتصفح."
  },
  "hi": {
    "exportTitle": "निर्यात",
    "exportSubtitle": "PNG/SVG स्नैपशॉट बनाएं।",
    "exportWidth": "चौड़ाई",
    "exportHeight": "ऊंचाई",
    "downloadPng": "PNG डाउनलोड करें",
    "downloadSvg": "SVG डाउनलोड करें",
    "pngUnsupported": "इस ब्राउज़र में PNG निर्यात समर्थित नहीं है।"
  },
  "tr": {
    "exportTitle": "Dışa aktar",
    "exportSubtitle": "PNG/SVG anlık görüntü oluşturun.",
    "exportWidth": "Genişlik",
    "exportHeight": "Yükseklik",
    "downloadPng": "PNG indir",
    "downloadSvg": "SVG indir",
    "pngUnsupported": "PNG dışa aktarma bu tarayıcıda desteklenmiyor."
  },
  "nl": {
    "exportTitle": "Exporteren",
    "exportSubtitle": "Genereer een PNG/SVG-snapshot.",
    "exportWidth": "Breedte",
    "exportHeight": "Hoogte",
    "downloadPng": "PNG downloaden",
    "downloadSvg": "SVG downloaden",
    "pngUnsupported": "PNG-export wordt niet ondersteund in deze browser."
  },
  "sv": {
    "exportTitle": "Exportera",
    "exportSubtitle": "Generera en PNG/SVG-snapshot.",
    "exportWidth": "Bredd",
    "exportHeight": "Höjd",
    "downloadPng": "Ladda ner PNG",
    "downloadSvg": "Ladda ner SVG",
    "pngUnsupported": "PNG-export stöds inte i den här webbläsaren."
  },
  "pl": {
    "exportTitle": "Eksport",
    "exportSubtitle": "Wygeneruj zrzut PNG/SVG.",
    "exportWidth": "Szerokość",
    "exportHeight": "Wysokość",
    "downloadPng": "Pobierz PNG",
    "downloadSvg": "Pobierz SVG",
    "pngUnsupported": "Eksport PNG nie jest wspierany w tej przeglądarce."
  },
  "vi": {
    "exportTitle": "Xuất",
    "exportSubtitle": "Tạo ảnh PNG/SVG.",
    "exportWidth": "Chiều rộng",
    "exportHeight": "Chiều cao",
    "downloadPng": "Tải PNG",
    "downloadSvg": "Tải SVG",
    "pngUnsupported": "Trình duyệt này không hỗ trợ xuất PNG."
  },
  "th": {
    "exportTitle": "ส่งออก",
    "exportSubtitle": "สร้างภาพ PNG/SVG",
    "exportWidth": "ความกว้าง",
    "exportHeight": "ความสูง",
    "downloadPng": "ดาวน์โหลด PNG",
    "downloadSvg": "ดาวน์โหลด SVG",
    "pngUnsupported": "เบราว์เซอร์นี้ไม่รองรับการส่งออก PNG"
  },
  "id": {
    "exportTitle": "Ekspor",
    "exportSubtitle": "Buat snapshot PNG/SVG.",
    "exportWidth": "Lebar",
    "exportHeight": "Tinggi",
    "downloadPng": "Unduh PNG",
    "downloadSvg": "Unduh SVG",
    "pngUnsupported": "Ekspor PNG tidak didukung di browser ini."
  },
  "he": {
    "exportTitle": "ייצוא",
    "exportSubtitle": "צרו תמונת PNG/SVG.",
    "exportWidth": "רוחב",
    "exportHeight": "גובה",
    "downloadPng": "הורד PNG",
    "downloadSvg": "הורד SVG",
    "pngUnsupported": "ייצוא PNG אינו נתמך בדפדפן זה."
  },
  "ms": {
    "exportTitle": "Eksport",
    "exportSubtitle": "Hasilkan snapshot PNG/SVG.",
    "exportWidth": "Lebar",
    "exportHeight": "Tinggi",
    "downloadPng": "Muat turun PNG",
    "downloadSvg": "Muat turun SVG",
    "pngUnsupported": "Eksport PNG tidak disokong dalam pelayar ini."
  },
  "no": {
    "exportTitle": "Eksporter",
    "exportSubtitle": "Generer et PNG/SVG-øyeblikksbilde.",
    "exportWidth": "Bredde",
    "exportHeight": "Høyde",
    "downloadPng": "Last ned PNG",
    "downloadSvg": "Last ned SVG",
    "pngUnsupported": "PNG-eksport støttes ikke i denne nettleseren."
  }
}
</i18n>
