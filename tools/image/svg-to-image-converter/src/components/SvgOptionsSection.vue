<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('settingsTitle') }}</ToolSectionHeader>
    <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('format')" :show-feedback="false">
        <n-select :value="format" :options="formatOptions" @update:value="onFormatUpdate" />
      </n-form-item-gi>
      <n-form-item-gi :label="t('width')" :show-feedback="false">
        <n-input-number
          :value="width"
          :min="1"
          :max="8192"
          style="width: 100%"
          @update:value="onWidthUpdate"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('height')" :show-feedback="false">
        <n-input-number
          :value="height"
          :min="1"
          :max="8192"
          style="width: 100%"
          @update:value="onHeightUpdate"
        />
      </n-form-item-gi>
      <n-form-item-gi :label="t('lockAspect')" :show-feedback="false">
        <n-checkbox :checked="keepAspect" @update:checked="onKeepAspectToggle">
          {{ t('lockAspect') }}
        </n-checkbox>
      </n-form-item-gi>
      <n-form-item-gi :label="t('backgroundColor')" :show-feedback="false">
        <n-flex vertical :size="8" style="width: 100%">
          <n-color-picker
            :value="backgroundColor"
            :modes="['hex']"
            :show-alpha="format !== 'jpeg'"
            size="small"
            style="width: 100%"
            @update:value="onBackgroundChange"
          />
          <n-checkbox
            v-show="format !== 'jpeg'"
            :checked="useBackground"
            @update:checked="onBackgroundToggle"
          >
            {{ t('applyBackground') }}
          </n-checkbox>
        </n-flex>
      </n-form-item-gi>
      <n-form-item-gi v-show="showQuality" :label="t('quality')" :show-feedback="false">
        <n-flex vertical :size="8">
          <n-slider
            :value="quality"
            :min="1"
            :max="100"
            :step="1"
            @update:value="onQualityUpdate"
          />
          <n-text depth="3">{{ quality }}%</n-text>
        </n-flex>
      </n-form-item-gi>
    </n-grid>
    <SvgOptionsActions :is-converting="isConverting" :on-reset="onReset" :on-convert="onConvert" />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NCheckbox,
  NColorPicker,
  NFlex,
  NFormItemGi,
  NGrid,
  NInputNumber,
  NSelect,
  NSlider,
  NText,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import SvgOptionsActions from './SvgOptionsActions.vue'

type OutputFormat = 'png' | 'jpeg' | 'webp'

defineProps<{
  format: OutputFormat
  width: number
  height: number
  keepAspect: boolean
  useBackground: boolean
  backgroundColor: string
  showQuality: boolean
  quality: number
  isConverting: boolean
  onFormatUpdate: (value: OutputFormat) => void
  onWidthUpdate: (value: number | null) => void
  onHeightUpdate: (value: number | null) => void
  onKeepAspectToggle: (value: boolean) => void
  onBackgroundChange: (value: string) => void
  onBackgroundToggle: (value: boolean) => void
  onQualityUpdate: (value: number) => void
  onReset: () => void
  onConvert: () => void
}>()

const { t } = useI18n({ useScope: 'local' })
const formatOptions = computed(() => [
  { label: t('formatPng'), value: 'png' },
  { label: t('formatJpeg'), value: 'jpeg' },
  { label: t('formatWebp'), value: 'webp' },
])
</script>

<i18n lang="json">
{
  "en": {
    "settingsTitle": "Conversion Options",
    "format": "Output format",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Width (px)",
    "height": "Height (px)",
    "lockAspect": "Lock aspect ratio",
    "backgroundColor": "Background color",
    "applyBackground": "Fill background (PNG/WebP)",
    "quality": "Quality"
  },
  "zh": {
    "settingsTitle": "转换选项",
    "format": "输出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "宽度 (px)",
    "height": "高度 (px)",
    "lockAspect": "锁定纵横比",
    "backgroundColor": "背景颜色",
    "applyBackground": "填充背景（PNG/WebP）",
    "quality": "质量"
  },
  "zh-CN": {
    "settingsTitle": "转换选项",
    "format": "输出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "宽度 (px)",
    "height": "高度 (px)",
    "lockAspect": "锁定纵横比",
    "backgroundColor": "背景颜色",
    "applyBackground": "填充背景（PNG/WebP）",
    "quality": "质量"
  },
  "zh-TW": {
    "settingsTitle": "轉換選項",
    "format": "輸出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "寬度 (px)",
    "height": "高度 (px)",
    "lockAspect": "鎖定長寬比",
    "backgroundColor": "背景顏色",
    "applyBackground": "填充背景（PNG/WebP）",
    "quality": "品質"
  },
  "zh-HK": {
    "settingsTitle": "轉換選項",
    "format": "輸出格式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "寬度 (px)",
    "height": "高度 (px)",
    "lockAspect": "鎖定長寬比",
    "backgroundColor": "背景顏色",
    "applyBackground": "填充背景（PNG/WebP）",
    "quality": "品質"
  },
  "es": {
    "settingsTitle": "Opciones de conversión",
    "format": "Formato de salida",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Ancho (px)",
    "height": "Alto (px)",
    "lockAspect": "Bloquear relación de aspecto",
    "backgroundColor": "Color de fondo",
    "applyBackground": "Rellenar fondo (PNG/WebP)",
    "quality": "Calidad"
  },
  "fr": {
    "settingsTitle": "Options de conversion",
    "format": "Format de sortie",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Largeur (px)",
    "height": "Hauteur (px)",
    "lockAspect": "Verrouiller le ratio",
    "backgroundColor": "Couleur de fond",
    "applyBackground": "Remplir l'arrière-plan (PNG/WebP)",
    "quality": "Qualité"
  },
  "de": {
    "settingsTitle": "Konvertierungsoptionen",
    "format": "Ausgabeformat",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Breite (px)",
    "height": "Höhe (px)",
    "lockAspect": "Seitenverhältnis sperren",
    "backgroundColor": "Hintergrundfarbe",
    "applyBackground": "Hintergrund füllen (PNG/WebP)",
    "quality": "Qualität"
  },
  "it": {
    "settingsTitle": "Opzioni di conversione",
    "format": "Formato di output",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Larghezza (px)",
    "height": "Altezza (px)",
    "lockAspect": "Blocca proporzioni",
    "backgroundColor": "Colore di sfondo",
    "applyBackground": "Riempi sfondo (PNG/WebP)",
    "quality": "Qualità"
  },
  "ja": {
    "settingsTitle": "変換オプション",
    "format": "出力形式",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "幅 (px)",
    "height": "高さ (px)",
    "lockAspect": "縦横比を固定",
    "backgroundColor": "背景色",
    "applyBackground": "背景を塗りつぶす（PNG/WebP）",
    "quality": "品質"
  },
  "ko": {
    "settingsTitle": "변환 옵션",
    "format": "출력 형식",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "너비 (px)",
    "height": "높이 (px)",
    "lockAspect": "종횡비 고정",
    "backgroundColor": "배경색",
    "applyBackground": "배경 채우기 (PNG/WebP)",
    "quality": "품질"
  },
  "ru": {
    "settingsTitle": "Параметры конвертации",
    "format": "Формат вывода",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Ширина (px)",
    "height": "Высота (px)",
    "lockAspect": "Сохранить пропорции",
    "backgroundColor": "Цвет фона",
    "applyBackground": "Заполнить фон (PNG/WebP)",
    "quality": "Качество"
  },
  "pt": {
    "settingsTitle": "Opções de conversão",
    "format": "Formato de saída",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Largura (px)",
    "height": "Altura (px)",
    "lockAspect": "Bloquear proporção",
    "backgroundColor": "Cor de fundo",
    "applyBackground": "Preencher fundo (PNG/WebP)",
    "quality": "Qualidade"
  },
  "ar": {
    "settingsTitle": "خيارات التحويل",
    "format": "تنسيق الإخراج",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "العرض (px)",
    "height": "الارتفاع (px)",
    "lockAspect": "قفل نسبة الأبعاد",
    "backgroundColor": "لون الخلفية",
    "applyBackground": "تعبئة الخلفية (PNG/WebP)",
    "quality": "الجودة"
  },
  "hi": {
    "settingsTitle": "रूपांतरण विकल्प",
    "format": "आउटपुट प्रारूप",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "चौड़ाई (px)",
    "height": "ऊंचाई (px)",
    "lockAspect": "आस्पेक्ट अनुपात लॉक करें",
    "backgroundColor": "पृष्ठभूमि रंग",
    "applyBackground": "पृष्ठभूमि भरें (PNG/WebP)",
    "quality": "गुणवत्ता"
  },
  "tr": {
    "settingsTitle": "Dönüştürme seçenekleri",
    "format": "Çıkış formatı",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Genişlik (px)",
    "height": "Yükseklik (px)",
    "lockAspect": "En-boy oranını kilitle",
    "backgroundColor": "Arka plan rengi",
    "applyBackground": "Arka planı doldur (PNG/WebP)",
    "quality": "Kalite"
  },
  "nl": {
    "settingsTitle": "Conversieopties",
    "format": "Uitvoerformaat",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Breedte (px)",
    "height": "Hoogte (px)",
    "lockAspect": "Beeldverhouding vergrendelen",
    "backgroundColor": "Achtergrondkleur",
    "applyBackground": "Achtergrond vullen (PNG/WebP)",
    "quality": "Kwaliteit"
  },
  "sv": {
    "settingsTitle": "Konverteringsalternativ",
    "format": "Utdataformat",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Bredd (px)",
    "height": "Höjd (px)",
    "lockAspect": "Lås bildförhållande",
    "backgroundColor": "Bakgrundsfärg",
    "applyBackground": "Fyll bakgrund (PNG/WebP)",
    "quality": "Kvalitet"
  },
  "pl": {
    "settingsTitle": "Opcje konwersji",
    "format": "Format wyjściowy",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Szerokość (px)",
    "height": "Wysokość (px)",
    "lockAspect": "Zablokuj proporcje",
    "backgroundColor": "Kolor tła",
    "applyBackground": "Wypełnij tło (PNG/WebP)",
    "quality": "Jakość"
  },
  "vi": {
    "settingsTitle": "Tùy chọn chuyển đổi",
    "format": "Định dạng đầu ra",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Chiều rộng (px)",
    "height": "Chiều cao (px)",
    "lockAspect": "Khóa tỷ lệ",
    "backgroundColor": "Màu nền",
    "applyBackground": "Tô nền (PNG/WebP)",
    "quality": "Chất lượng"
  },
  "th": {
    "settingsTitle": "ตัวเลือกการแปลง",
    "format": "รูปแบบผลลัพธ์",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "ความกว้าง (px)",
    "height": "ความสูง (px)",
    "lockAspect": "ล็อกอัตราส่วนภาพ",
    "backgroundColor": "สีพื้นหลัง",
    "applyBackground": "เติมพื้นหลัง (PNG/WebP)",
    "quality": "คุณภาพ"
  },
  "id": {
    "settingsTitle": "Opsi konversi",
    "format": "Format output",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Lebar (px)",
    "height": "Tinggi (px)",
    "lockAspect": "Kunci rasio aspek",
    "backgroundColor": "Warna latar belakang",
    "applyBackground": "Isi latar belakang (PNG/WebP)",
    "quality": "Kualitas"
  },
  "he": {
    "settingsTitle": "אפשרויות המרה",
    "format": "פורמט פלט",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "רוחב (px)",
    "height": "גובה (px)",
    "lockAspect": "נעל יחס ממדים",
    "backgroundColor": "צבע רקע",
    "applyBackground": "מילוי רקע (PNG/WebP)",
    "quality": "איכות"
  },
  "ms": {
    "settingsTitle": "Pilihan penukaran",
    "format": "Format output",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Lebar (px)",
    "height": "Tinggi (px)",
    "lockAspect": "Kunci nisbah aspek",
    "backgroundColor": "Warna latar belakang",
    "applyBackground": "Isi latar belakang (PNG/WebP)",
    "quality": "Kualiti"
  },
  "no": {
    "settingsTitle": "Konverteringsalternativer",
    "format": "Utdataformat",
    "formatPng": "PNG",
    "formatJpeg": "JPEG",
    "formatWebp": "WebP",
    "width": "Bredde (px)",
    "height": "Høyde (px)",
    "lockAspect": "Lås sideforhold",
    "backgroundColor": "Bakgrunnsfarge",
    "applyBackground": "Fyll bakgrunn (PNG/WebP)",
    "quality": "Kvalitet"
  }
}
</i18n>
