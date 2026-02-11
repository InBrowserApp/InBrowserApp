<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

    <n-grid cols="1 s:2" responsive="screen" :x-gap="12" :y-gap="12">
      <n-form-item-gi :label="t('width')" :show-feedback="false">
        <n-input-number
          :value="options.width"
          :min="1"
          :max="100000"
          :disabled="isProcessing"
          style="width: 100%"
          @update:value="updateWidth"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('height')" :show-feedback="false">
        <n-input-number
          :value="options.height"
          :min="1"
          :max="100000"
          :disabled="isProcessing"
          style="width: 100%"
          @update:value="updateHeight"
        />
      </n-form-item-gi>

      <n-form-item-gi :show-feedback="false">
        <template #label>
          <n-flex align="center" :size="6">
            <span>{{ t('algorithm') }}</span>
            <AlgorithmInfoPopover />
          </n-flex>
        </template>

        <n-select
          :value="options.algorithm"
          :options="algorithms"
          :disabled="isProcessing"
          @update:value="updateAlgorithm"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('outputFormat')" :show-feedback="false">
        <n-select
          :value="options.outputFormat"
          :options="formats"
          :disabled="isProcessing"
          @update:value="updateFormat"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('keepAspectRatio')" :show-feedback="false" :span="2">
        <n-switch
          :value="options.keepAspectRatio"
          :disabled="isProcessing"
          @update:value="updateKeepAspectRatio"
        />
      </n-form-item-gi>

      <n-form-item-gi :label="t('quality')" :show-feedback="false" :span="2">
        <n-slider
          :value="options.quality"
          :min="1"
          :max="100"
          :step="1"
          :disabled="isProcessing || qualityDisabled"
          @update:value="updateQuality"
        />
      </n-form-item-gi>
    </n-grid>

    <div style="margin-top: 12px">
      <n-button
        type="primary"
        :loading="isProcessing"
        :disabled="isProcessing || !hasImage"
        style="width: 100%"
        @click="$emit('resize')"
      >
        <template #icon>
          <n-icon><ResizeSmall20Regular /></n-icon>
        </template>
        {{ isProcessing ? t('resizing') : t('resize') }}
      </n-button>
    </div>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  NButton,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInputNumber,
  NSelect,
  NSlider,
  NSwitch,
} from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import ResizeSmall20Regular from '@vicons/fluent/ResizeSmall20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ImageDimensions, ResizeOptions } from '../types'
import {
  isResizeAlgorithm,
  isResizeOutputFormat,
  normalizeDimension,
} from '../utils/resize-options'
import AlgorithmInfoPopover from './AlgorithmInfoPopover.vue'

interface Props {
  sourceDimensions: ImageDimensions | null
  algorithms: SelectOption[]
  formats: SelectOption[]
  isProcessing: boolean
  hasImage: boolean
}

const props = defineProps<Props>()
defineEmits<{
  resize: []
}>()

const { t } = useI18n({ useScope: 'local' })
const options = defineModel<ResizeOptions>('options', { required: true })

const qualityDisabled = computed(() => options.value.outputFormat === 'png')

function updateWidth(value: number | null) {
  const nextWidth = normalizeDimension(value, options.value.width)
  if (!options.value.keepAspectRatio || !props.sourceDimensions) {
    options.value = { ...options.value, width: nextWidth }
    return
  }

  const ratio = props.sourceDimensions.height / props.sourceDimensions.width
  const nextHeight = Math.max(1, Math.round(nextWidth * ratio))

  options.value = {
    ...options.value,
    width: nextWidth,
    height: nextHeight,
  }
}

function updateHeight(value: number | null) {
  const nextHeight = normalizeDimension(value, options.value.height)
  if (!options.value.keepAspectRatio || !props.sourceDimensions) {
    options.value = { ...options.value, height: nextHeight }
    return
  }

  const ratio = props.sourceDimensions.width / props.sourceDimensions.height
  const nextWidth = Math.max(1, Math.round(nextHeight * ratio))

  options.value = {
    ...options.value,
    width: nextWidth,
    height: nextHeight,
  }
}

function updateKeepAspectRatio(value: boolean) {
  if (!value || !props.sourceDimensions) {
    options.value = {
      ...options.value,
      keepAspectRatio: value,
    }
    return
  }

  const ratio = props.sourceDimensions.height / props.sourceDimensions.width
  const nextHeight = Math.max(1, Math.round(options.value.width * ratio))

  options.value = {
    ...options.value,
    keepAspectRatio: true,
    height: nextHeight,
  }
}

function updateAlgorithm(value: string | number | null) {
  if (typeof value !== 'string') return
  if (!isResizeAlgorithm(value)) return

  options.value = {
    ...options.value,
    algorithm: value,
  }
}

function updateFormat(value: string | number | null) {
  if (typeof value !== 'string') return
  if (!isResizeOutputFormat(value)) return

  options.value = {
    ...options.value,
    outputFormat: value,
  }
}

function updateQuality(value: number) {
  options.value = {
    ...options.value,
    quality: normalizeDimension(value, options.value.quality),
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "title": "Image Resize Settings",
    "width": "Width",
    "height": "Height",
    "keepAspectRatio": "Keep aspect ratio",
    "algorithm": "Algorithm",
    "outputFormat": "Output format",
    "quality": "Quality",
    "resize": "Resize image",
    "resizing": "Resizing image..."
  },
  "zh": {
    "title": "图片尺寸缩放设置",
    "width": "宽度",
    "height": "高度",
    "keepAspectRatio": "保持宽高比",
    "algorithm": "缩放算法",
    "outputFormat": "输出格式",
    "quality": "质量",
    "resize": "开始缩放",
    "resizing": "正在缩放..."
  },
  "zh-CN": {
    "title": "图片尺寸缩放设置",
    "width": "宽度",
    "height": "高度",
    "keepAspectRatio": "保持宽高比",
    "algorithm": "缩放算法",
    "outputFormat": "输出格式",
    "quality": "质量",
    "resize": "开始缩放",
    "resizing": "正在缩放..."
  },
  "zh-TW": {
    "title": "圖片尺寸縮放設定",
    "width": "寬度",
    "height": "高度",
    "keepAspectRatio": "保持長寬比",
    "algorithm": "縮放演算法",
    "outputFormat": "輸出格式",
    "quality": "品質",
    "resize": "開始縮放",
    "resizing": "正在縮放..."
  },
  "zh-HK": {
    "title": "圖片尺寸縮放設定",
    "width": "寬度",
    "height": "高度",
    "keepAspectRatio": "保持長寬比",
    "algorithm": "縮放演算法",
    "outputFormat": "輸出格式",
    "quality": "品質",
    "resize": "開始縮放",
    "resizing": "正在縮放..."
  },
  "es": {
    "title": "Ajustes de escalado",
    "width": "Ancho",
    "height": "Alto",
    "keepAspectRatio": "Mantener proporción",
    "algorithm": "Algoritmo",
    "outputFormat": "Formato de salida",
    "quality": "Calidad",
    "resize": "Escalar imagen",
    "resizing": "Escalando imagen..."
  },
  "fr": {
    "title": "Paramètres de redimensionnement",
    "width": "Largeur",
    "height": "Hauteur",
    "keepAspectRatio": "Conserver les proportions",
    "algorithm": "Algorithme",
    "outputFormat": "Format de sortie",
    "quality": "Qualité",
    "resize": "Redimensionner l’image",
    "resizing": "Redimensionnement..."
  },
  "de": {
    "title": "Skalierungseinstellungen",
    "width": "Breite",
    "height": "Höhe",
    "keepAspectRatio": "Seitenverhältnis beibehalten",
    "algorithm": "Algorithmus",
    "outputFormat": "Ausgabeformat",
    "quality": "Qualität",
    "resize": "Bild skalieren",
    "resizing": "Bild wird skaliert..."
  },
  "it": {
    "title": "Impostazioni ridimensionamento",
    "width": "Larghezza",
    "height": "Altezza",
    "keepAspectRatio": "Mantieni proporzioni",
    "algorithm": "Algoritmo",
    "outputFormat": "Formato di output",
    "quality": "Qualità",
    "resize": "Ridimensiona immagine",
    "resizing": "Ridimensionamento in corso..."
  },
  "ja": {
    "title": "画像サイズ設定",
    "width": "幅",
    "height": "高さ",
    "keepAspectRatio": "縦横比を維持",
    "algorithm": "アルゴリズム",
    "outputFormat": "出力形式",
    "quality": "品質",
    "resize": "画像をリサイズ",
    "resizing": "リサイズ中..."
  },
  "ko": {
    "title": "이미지 크기 설정",
    "width": "너비",
    "height": "높이",
    "keepAspectRatio": "가로세로 비율 유지",
    "algorithm": "알고리즘",
    "outputFormat": "출력 형식",
    "quality": "품질",
    "resize": "이미지 크기 조절",
    "resizing": "크기 조절 중..."
  },
  "ru": {
    "title": "Параметры масштабирования",
    "width": "Ширина",
    "height": "Высота",
    "keepAspectRatio": "Сохранять пропорции",
    "algorithm": "Алгоритм",
    "outputFormat": "Формат вывода",
    "quality": "Качество",
    "resize": "Масштабировать изображение",
    "resizing": "Масштабирование..."
  },
  "pt": {
    "title": "Configurações de redimensionamento",
    "width": "Largura",
    "height": "Altura",
    "keepAspectRatio": "Manter proporção",
    "algorithm": "Algoritmo",
    "outputFormat": "Formato de saída",
    "quality": "Qualidade",
    "resize": "Redimensionar imagem",
    "resizing": "Redimensionando imagem..."
  },
  "ar": {
    "title": "إعدادات تحجيم الصورة",
    "width": "العرض",
    "height": "الارتفاع",
    "keepAspectRatio": "الحفاظ على النسبة",
    "algorithm": "الخوارزمية",
    "outputFormat": "تنسيق الإخراج",
    "quality": "الجودة",
    "resize": "تحجيم الصورة",
    "resizing": "جارٍ التحجيم..."
  },
  "hi": {
    "title": "इमेज स्केल सेटिंग्स",
    "width": "चौड़ाई",
    "height": "ऊंचाई",
    "keepAspectRatio": "आस्पेक्ट रेशियो बनाए रखें",
    "algorithm": "एल्गोरिदम",
    "outputFormat": "आउटपुट फ़ॉर्मेट",
    "quality": "गुणवत्ता",
    "resize": "इमेज स्केल करें",
    "resizing": "इमेज स्केल की जा रही है..."
  },
  "tr": {
    "title": "Görsel ölçekleme ayarları",
    "width": "Genişlik",
    "height": "Yükseklik",
    "keepAspectRatio": "En-boy oranını koru",
    "algorithm": "Algoritma",
    "outputFormat": "Çıkış formatı",
    "quality": "Kalite",
    "resize": "Görseli ölçekle",
    "resizing": "Görsel ölçekleniyor..."
  },
  "nl": {
    "title": "Schaalinstellingen",
    "width": "Breedte",
    "height": "Hoogte",
    "keepAspectRatio": "Beeldverhouding behouden",
    "algorithm": "Algoritme",
    "outputFormat": "Uitvoerformaat",
    "quality": "Kwaliteit",
    "resize": "Afbeelding schalen",
    "resizing": "Afbeelding wordt geschaald..."
  },
  "sv": {
    "title": "Skalningsinställningar",
    "width": "Bredd",
    "height": "Höjd",
    "keepAspectRatio": "Behåll proportioner",
    "algorithm": "Algoritm",
    "outputFormat": "Utdataformat",
    "quality": "Kvalitet",
    "resize": "Skala bild",
    "resizing": "Skalar bild..."
  },
  "pl": {
    "title": "Ustawienia skalowania",
    "width": "Szerokość",
    "height": "Wysokość",
    "keepAspectRatio": "Zachowaj proporcje",
    "algorithm": "Algorytm",
    "outputFormat": "Format wyjściowy",
    "quality": "Jakość",
    "resize": "Skaluj obraz",
    "resizing": "Skalowanie obrazu..."
  },
  "vi": {
    "title": "Cài đặt thu phóng ảnh",
    "width": "Chiều rộng",
    "height": "Chiều cao",
    "keepAspectRatio": "Giữ tỉ lệ",
    "algorithm": "Thuật toán",
    "outputFormat": "Định dạng đầu ra",
    "quality": "Chất lượng",
    "resize": "Thu phóng ảnh",
    "resizing": "Đang thu phóng ảnh..."
  },
  "th": {
    "title": "การตั้งค่าการปรับขนาด",
    "width": "ความกว้าง",
    "height": "ความสูง",
    "keepAspectRatio": "รักษาสัดส่วนภาพ",
    "algorithm": "อัลกอริทึม",
    "outputFormat": "รูปแบบเอาต์พุต",
    "quality": "คุณภาพ",
    "resize": "ปรับขนาดรูปภาพ",
    "resizing": "กำลังปรับขนาดรูปภาพ..."
  },
  "id": {
    "title": "Pengaturan penskalaan",
    "width": "Lebar",
    "height": "Tinggi",
    "keepAspectRatio": "Pertahankan rasio",
    "algorithm": "Algoritme",
    "outputFormat": "Format keluaran",
    "quality": "Kualitas",
    "resize": "Skalakan gambar",
    "resizing": "Sedang menskalakan gambar..."
  },
  "he": {
    "title": "הגדרות שינוי קנה מידה",
    "width": "רוחב",
    "height": "גובה",
    "keepAspectRatio": "שמירה על יחס ממדים",
    "algorithm": "אלגוריתם",
    "outputFormat": "פורמט פלט",
    "quality": "איכות",
    "resize": "שנה גודל תמונה",
    "resizing": "משנה גודל תמונה..."
  },
  "ms": {
    "title": "Tetapan penskalaan imej",
    "width": "Lebar",
    "height": "Tinggi",
    "keepAspectRatio": "Kekalkan nisbah aspek",
    "algorithm": "Algoritma",
    "outputFormat": "Format output",
    "quality": "Kualiti",
    "resize": "Skalakan imej",
    "resizing": "Sedang menskalakan imej..."
  },
  "no": {
    "title": "Skaleringsinnstillinger",
    "width": "Bredde",
    "height": "Høyde",
    "keepAspectRatio": "Behold sideforhold",
    "algorithm": "Algoritme",
    "outputFormat": "Utdataformat",
    "quality": "Kvalitet",
    "resize": "Skaler bilde",
    "resizing": "Skalerer bilde..."
  }
}
</i18n>
