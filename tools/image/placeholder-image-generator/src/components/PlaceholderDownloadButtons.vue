<template>
  <n-flex vertical :size="16">
    <!-- Scale Selector -->
    <n-flex align="center" :size="12">
      <span>{{ t('scale') }}:</span>
      <n-radio-group v-model:value="scale" size="small">
        <n-radio-button :value="1">1x</n-radio-button>
        <n-radio-button :value="2">2x</n-radio-button>
        <n-radio-button :value="3">3x</n-radio-button>
      </n-radio-group>
    </n-flex>

    <!-- Quality Slider (for JPG/WebP) -->
    <n-flex align="center" :size="12">
      <span>{{ t('quality') }}:</span>
      <n-slider
        v-model:value="quality"
        :min="0.1"
        :max="1"
        :step="0.1"
        :format-tooltip="(v) => `${Math.round(v * 100)}%`"
        style="width: 150px"
      />
    </n-flex>

    <!-- Download Buttons -->
    <n-flex :size="8" wrap>
      <n-button
        tag="a"
        tertiary
        :href="pngUrl ?? undefined"
        :download="pngFilename"
        :disabled="!pngUrl"
      >
        <template #icon>
          <n-icon><ImageIcon /></n-icon>
        </template>
        PNG
      </n-button>
      <n-button
        tag="a"
        tertiary
        :href="jpgUrl ?? undefined"
        :download="jpgFilename"
        :disabled="!jpgUrl"
      >
        <template #icon>
          <n-icon><ImageIcon /></n-icon>
        </template>
        JPG
      </n-button>
      <n-button
        tag="a"
        tertiary
        :href="webpUrl ?? undefined"
        :download="webpFilename"
        :disabled="!webpUrl"
      >
        <template #icon>
          <n-icon><ImageIcon /></n-icon>
        </template>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <span>WebP</span>
      </n-button>
      <n-button tag="a" tertiary :href="svgUrl ?? undefined" :download="svgFilename">
        <template #icon>
          <n-icon><CodeIcon /></n-icon>
        </template>
        SVG
      </n-button>
    </n-flex>

    <!-- Copy to Clipboard -->
    <n-button @click="copyToClipboard">
      <template #icon>
        <n-icon><CopyIcon /></n-icon>
      </template>
      {{ t('copy-to-clipboard') }}
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NFlex, NButton, NIcon, NRadioGroup, NRadioButton, NSlider, useMessage } from 'naive-ui'
import {
  Image24Regular as ImageIcon,
  Code24Regular as CodeIcon,
  Copy24Regular as CopyIcon,
} from '@shared/icons/fluent'
import type { PlaceholderOptions } from './PlaceholderPreview.vue'

const { t } = useI18n()
const message = useMessage()

const props = defineProps<{
  options: PlaceholderOptions
}>()

const scale = ref(1)
const quality = ref(0.9)
const pngBlob = ref<Blob | null>(null)
const jpgBlob = ref<Blob | null>(null)
const webpBlob = ref<Blob | null>(null)

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function generateSVG(options: PlaceholderOptions, svgScale = 1): string {
  const w = options.width * svgScale
  const h = options.height * svgScale
  const text = options.customText || `${options.width} × ${options.height}`
  const baseFontSize = options.fontSize || Math.min(options.width, options.height) / 8
  const fontSize = baseFontSize * svgScale

  let defs = ''
  let fill = options.bgColor

  if (options.bgType === 'linear-gradient') {
    const angle = options.gradientAngle
    defs = `<defs>
      <linearGradient id="grad" gradientTransform="rotate(${angle}, 0.5, 0.5)">
        <stop offset="0%" stop-color="${options.gradientColor1}"/>
        <stop offset="100%" stop-color="${options.gradientColor2}"/>
      </linearGradient>
    </defs>`
    fill = 'url(#grad)'
  } else if (options.bgType === 'radial-gradient') {
    defs = `<defs>
      <radialGradient id="grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${options.gradientColor1}"/>
        <stop offset="100%" stop-color="${options.gradientColor2}"/>
      </radialGradient>
    </defs>`
    fill = 'url(#grad)'
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  ${defs}
  <rect width="100%" height="100%" fill="${fill}"/>
  <text x="50%" y="50%" fill="${options.textColor}" font-size="${fontSize}"
        font-family="sans-serif" text-anchor="middle" dominant-baseline="middle">
    ${escapeXml(text)}
  </text>
</svg>`
}

const svgBlob = computed(
  () => new Blob([generateSVG(props.options, scale.value)], { type: 'image/svg+xml' }),
)

const pngUrl = useObjectUrl(pngBlob)
const jpgUrl = useObjectUrl(jpgBlob)
const webpUrl = useObjectUrl(webpBlob)
const svgUrl = useObjectUrl(svgBlob)

const pngFilename = computed(() => getFilename('png'))
const jpgFilename = computed(() => getFilename('jpg'))
const webpFilename = computed(() => getFilename('webp'))
const svgFilename = computed(() => getFilename('svg'))

function drawToCanvas(canvas: HTMLCanvasElement, options: PlaceholderOptions, canvasScale = 1) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const w = options.width * canvasScale
  const h = options.height * canvasScale
  canvas.width = w
  canvas.height = h

  // Background
  if (options.bgType === 'solid') {
    ctx.fillStyle = options.bgColor
  } else if (options.bgType === 'linear-gradient') {
    const angle = (options.gradientAngle * Math.PI) / 180
    const x1 = w / 2 - Math.cos(angle) * (w / 2)
    const y1 = h / 2 - Math.sin(angle) * (h / 2)
    const x2 = w / 2 + Math.cos(angle) * (w / 2)
    const y2 = h / 2 + Math.sin(angle) * (h / 2)
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
    gradient.addColorStop(0, options.gradientColor1)
    gradient.addColorStop(1, options.gradientColor2)
    ctx.fillStyle = gradient
  } else if (options.bgType === 'radial-gradient') {
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2)
    gradient.addColorStop(0, options.gradientColor1)
    gradient.addColorStop(1, options.gradientColor2)
    ctx.fillStyle = gradient
  }
  ctx.fillRect(0, 0, w, h)

  // Text
  const text = options.customText || `${options.width} × ${options.height}`
  const baseFontSize = options.fontSize || Math.min(options.width, options.height) / 8
  const fontSize = baseFontSize * canvasScale
  ctx.fillStyle = options.textColor
  ctx.font = `${fontSize}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2)
}

function getFilename(ext: string): string {
  const { width, height } = props.options
  const scaleStr = scale.value > 1 ? `@${scale.value}x` : ''
  return `placeholder-${width}x${height}${scaleStr}.${ext}`
}

let pngToken = 0
let jpgToken = 0
let webpToken = 0

async function updatePNG() {
  const token = ++pngToken
  const canvas = document.createElement('canvas')
  drawToCanvas(canvas, props.options, scale.value)
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })
  if (token !== pngToken) return
  pngBlob.value = blob
}

async function updateJPG() {
  const token = ++jpgToken
  const canvas = document.createElement('canvas')
  drawToCanvas(canvas, props.options, scale.value)
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality.value)
  })
  if (token !== jpgToken) return
  jpgBlob.value = blob
}

async function updateWebP() {
  const token = ++webpToken
  const canvas = document.createElement('canvas')
  drawToCanvas(canvas, props.options, scale.value)
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality.value)
  })
  if (token !== webpToken) return
  webpBlob.value = blob
}

watch(
  () => [props.options, scale.value, quality.value],
  () => {
    void updatePNG()
    void updateJPG()
    void updateWebP()
  },
  { immediate: true, deep: true },
)

async function copyToClipboard() {
  try {
    const canvas = document.createElement('canvas')
    drawToCanvas(canvas, props.options, scale.value)
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })
    if (!blob) {
      message.error(t('copy-failed'))
      return
    }
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    message.success(t('copy-success'))
  } catch {
    message.error(t('copy-failed'))
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "scale": "Scale",
    "quality": "Quality",
    "copy-to-clipboard": "Copy to Clipboard",
    "copy-success": "Image copied to clipboard",
    "copy-failed": "Failed to copy image"
  },
  "zh": {
    "scale": "倍率",
    "quality": "质量",
    "copy-to-clipboard": "复制到剪贴板",
    "copy-success": "图片已复制到剪贴板",
    "copy-failed": "复制图片失败"
  },
  "zh-CN": {
    "scale": "倍率",
    "quality": "质量",
    "copy-to-clipboard": "复制到剪贴板",
    "copy-success": "图片已复制到剪贴板",
    "copy-failed": "复制图片失败"
  },
  "zh-TW": {
    "scale": "倍率",
    "quality": "品質",
    "copy-to-clipboard": "複製到剪貼簿",
    "copy-success": "圖片已複製到剪貼簿",
    "copy-failed": "複製圖片失敗"
  },
  "zh-HK": {
    "scale": "倍率",
    "quality": "質素",
    "copy-to-clipboard": "複製到剪貼簿",
    "copy-success": "圖片已複製到剪貼簿",
    "copy-failed": "複製圖片失敗"
  },
  "es": {
    "scale": "Escala",
    "quality": "Calidad",
    "copy-to-clipboard": "Copiar al portapapeles",
    "copy-success": "Imagen copiada al portapapeles",
    "copy-failed": "Error al copiar imagen"
  },
  "fr": {
    "scale": "Échelle",
    "quality": "Qualité",
    "copy-to-clipboard": "Copier dans le presse-papiers",
    "copy-success": "Image copiée dans le presse-papiers",
    "copy-failed": "Échec de la copie de l'image"
  },
  "de": {
    "scale": "Skalierung",
    "quality": "Qualität",
    "copy-to-clipboard": "In Zwischenablage kopieren",
    "copy-success": "Bild in Zwischenablage kopiert",
    "copy-failed": "Fehler beim Kopieren des Bildes"
  },
  "it": {
    "scale": "Scala",
    "quality": "Qualità",
    "copy-to-clipboard": "Copia negli appunti",
    "copy-success": "Immagine copiata negli appunti",
    "copy-failed": "Impossibile copiare l'immagine"
  },
  "ja": {
    "scale": "スケール",
    "quality": "品質",
    "copy-to-clipboard": "クリップボードにコピー",
    "copy-success": "画像をクリップボードにコピーしました",
    "copy-failed": "画像のコピーに失敗しました"
  },
  "ko": {
    "scale": "배율",
    "quality": "품질",
    "copy-to-clipboard": "클립보드에 복사",
    "copy-success": "이미지가 클립보드에 복사되었습니다",
    "copy-failed": "이미지 복사 실패"
  },
  "ru": {
    "scale": "Масштаб",
    "quality": "Качество",
    "copy-to-clipboard": "Копировать в буфер обмена",
    "copy-success": "Изображение скопировано в буфер обмена",
    "copy-failed": "Не удалось скопировать изображение"
  },
  "pt": {
    "scale": "Escala",
    "quality": "Qualidade",
    "copy-to-clipboard": "Copiar para a área de transferência",
    "copy-success": "Imagem copiada para a área de transferência",
    "copy-failed": "Falha ao copiar imagem"
  },
  "ar": {
    "scale": "المقياس",
    "quality": "الجودة",
    "copy-to-clipboard": "نسخ إلى الحافظة",
    "copy-success": "تم نسخ الصورة إلى الحافظة",
    "copy-failed": "فشل نسخ الصورة"
  },
  "hi": {
    "scale": "स्केल",
    "quality": "गुणवत्ता",
    "copy-to-clipboard": "क्लिपबोर्ड पर कॉपी करें",
    "copy-success": "छवि क्लिपबोर्ड पर कॉपी की गई",
    "copy-failed": "छवि कॉपी करने में विफल"
  },
  "tr": {
    "scale": "Ölçek",
    "quality": "Kalite",
    "copy-to-clipboard": "Panoya kopyala",
    "copy-success": "Görüntü panoya kopyalandı",
    "copy-failed": "Görüntü kopyalanamadı"
  },
  "nl": {
    "scale": "Schaal",
    "quality": "Kwaliteit",
    "copy-to-clipboard": "Kopiëren naar klembord",
    "copy-success": "Afbeelding gekopieerd naar klembord",
    "copy-failed": "Afbeelding kopiëren mislukt"
  },
  "sv": {
    "scale": "Skala",
    "quality": "Kvalitet",
    "copy-to-clipboard": "Kopiera till urklipp",
    "copy-success": "Bilden kopierades till urklipp",
    "copy-failed": "Kunde inte kopiera bilden"
  },
  "pl": {
    "scale": "Skala",
    "quality": "Jakość",
    "copy-to-clipboard": "Kopiuj do schowka",
    "copy-success": "Obraz skopiowany do schowka",
    "copy-failed": "Nie udało się skopiować obrazu"
  },
  "vi": {
    "scale": "Tỷ lệ",
    "quality": "Chất lượng",
    "copy-to-clipboard": "Sao chép vào clipboard",
    "copy-success": "Đã sao chép hình ảnh vào clipboard",
    "copy-failed": "Không thể sao chép hình ảnh"
  },
  "th": {
    "scale": "มาตราส่วน",
    "quality": "คุณภาพ",
    "copy-to-clipboard": "คัดลอกไปยังคลิปบอร์ด",
    "copy-success": "คัดลอกรูปภาพไปยังคลิปบอร์ดแล้ว",
    "copy-failed": "ไม่สามารถคัดลอกรูปภาพได้"
  },
  "id": {
    "scale": "Skala",
    "quality": "Kualitas",
    "copy-to-clipboard": "Salin ke clipboard",
    "copy-success": "Gambar disalin ke clipboard",
    "copy-failed": "Gagal menyalin gambar"
  },
  "he": {
    "scale": "קנה מידה",
    "quality": "איכות",
    "copy-to-clipboard": "העתק ללוח",
    "copy-success": "התמונה הועתקה ללוח",
    "copy-failed": "העתקת התמונה נכשלה"
  },
  "ms": {
    "scale": "Skala",
    "quality": "Kualiti",
    "copy-to-clipboard": "Salin ke papan keratan",
    "copy-success": "Imej disalin ke papan keratan",
    "copy-failed": "Gagal menyalin imej"
  },
  "no": {
    "scale": "Skala",
    "quality": "Kvalitet",
    "copy-to-clipboard": "Kopier til utklippstavle",
    "copy-success": "Bilde kopiert til utklippstavle",
    "copy-failed": "Kunne ikke kopiere bilde"
  }
}
</i18n>
