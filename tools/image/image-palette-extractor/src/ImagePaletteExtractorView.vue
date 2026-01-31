<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <ImageInput v-model:file="imageFile" :dimensions="imageDimensions" />

    <template v-if="imageFile">
      <PaletteControls v-model:options="options" :is-loading="isExtracting" />
      <PaletteResults
        :colors="sortedSwatches"
        :dominant="dominantSwatch"
        :total-pixels="paletteTotal"
        :file-name="imageFile.name"
        :is-loading="isExtracting"
      />
    </template>

    <ToolSection v-if="error">
      <n-alert type="warning" :title="t('errorTitle')" :show-icon="false">
        {{ error }}
      </n-alert>
    </ToolSection>
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounceFn, useStorage } from '@vueuse/core'
import { NAlert } from 'naive-ui'
import { ToolDefaultPageLayout, ToolSection } from '@shared/ui/tool'
import { extractPalette } from '@utils/image'
import * as toolInfo from './info'
import ImageInput from './components/ImageInput.vue'
import PaletteControls from './components/PaletteControls.vue'
import PaletteResults from './components/PaletteResults.vue'
import type { PaletteOptions, PaletteSwatch } from './types'
import { formatHsl, formatRgb, getContrastColor, rgbToHex } from './utils/color'
import { QUALITY_PRESETS, loadImageData } from './utils/palette-extractor'

const { t } = useI18n()

const options = useStorage<PaletteOptions>('tools:image-palette-extractor:options', {
  colorCount: 8,
  quality: 'balanced',
  sortBy: 'dominance',
  ignoreTransparent: true,
})

const imageFile = ref<File | null>(null)
const imageDimensions = ref<{ width: number; height: number } | null>(null)
const palette = ref<{ r: number; g: number; b: number; count: number }[]>([])
const paletteTotal = ref(0)
const isExtracting = ref(false)
const error = ref('')

const swatches = computed<PaletteSwatch[]>(() => {
  if (!palette.value.length || paletteTotal.value === 0) return []
  return palette.value.map((color) => {
    const hex = rgbToHex(color.r, color.g, color.b)
    const rgb = formatRgb(color.r, color.g, color.b)
    const hslValues = formatHsl(color.r, color.g, color.b)
    const hsl = `hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`
    const { h, l } = hslValues
    return {
      hex,
      rgb,
      hsl,
      count: color.count,
      ratio: color.count / paletteTotal.value,
      hue: h,
      lightness: l,
      textColor: getContrastColor(color.r, color.g, color.b),
    }
  })
})

const dominantSwatch = computed(() => swatches.value[0] ?? null)

const sortedSwatches = computed(() => {
  const list = [...swatches.value]
  if (options.value.sortBy === 'hue') {
    return list.sort((a, b) => a.hue - b.hue)
  }
  if (options.value.sortBy === 'lightness') {
    return list.sort((a, b) => a.lightness - b.lightness)
  }
  return list.sort((a, b) => b.count - a.count)
})

let runId = 0

const debouncedExtract = useDebounceFn(() => {
  if (!imageFile.value) return
  void extractFromFile(imageFile.value)
}, 200)

watch(
  [imageFile, options],
  () => {
    if (!imageFile.value) {
      resetState()
      return
    }
    error.value = ''
    debouncedExtract()
  },
  { deep: true },
)

function resetState() {
  runId += 1
  palette.value = []
  paletteTotal.value = 0
  imageDimensions.value = null
  error.value = ''
}

async function extractFromFile(file: File) {
  const currentRun = (runId += 1)
  isExtracting.value = true
  error.value = ''

  try {
    const preset = QUALITY_PRESETS[options.value.quality]
    const { imageData, width, height } = await loadImageData(file, preset.maxDimension)
    if (currentRun !== runId) return

    imageDimensions.value = { width, height }

    const totalPixels = imageData.width * imageData.height
    const sampleStride = Math.max(1, Math.floor(totalPixels / preset.targetSamples))

    const result = extractPalette(imageData, {
      colorCount: options.value.colorCount,
      sampleStride,
      ignoreTransparent: options.value.ignoreTransparent,
    })

    if (currentRun !== runId) return

    palette.value = result.colors
    paletteTotal.value = result.totalPixels

    if (!result.colors.length || result.totalPixels === 0) {
      error.value = t('noPixels')
    }
  } catch {
    if (currentRun !== runId) return
    palette.value = []
    paletteTotal.value = 0
    error.value = t('loadFailed')
  } finally {
    if (currentRun === runId) {
      isExtracting.value = false
    }
  }
}
</script>

<i18n lang="json">
{
  "en": {
    "errorTitle": "Extraction issue",
    "loadFailed": "Failed to load the image. Please try another file.",
    "noPixels": "No visible pixels found. Try disabling transparency filtering."
  },
  "zh": {
    "errorTitle": "提取问题",
    "loadFailed": "图片加载失败，请尝试其他文件。",
    "noPixels": "未找到可见像素，请尝试关闭透明过滤。"
  },
  "zh-CN": {
    "errorTitle": "提取问题",
    "loadFailed": "图片加载失败，请尝试其他文件。",
    "noPixels": "未找到可见像素，请尝试关闭透明过滤。"
  },
  "zh-TW": {
    "errorTitle": "擷取問題",
    "loadFailed": "圖片載入失敗，請嘗試其他檔案。",
    "noPixels": "找不到可見像素，請嘗試關閉透明過濾。"
  },
  "zh-HK": {
    "errorTitle": "擷取問題",
    "loadFailed": "圖片載入失敗，請嘗試其他檔案。",
    "noPixels": "找不到可見像素，請嘗試關閉透明過濾。"
  },
  "es": {
    "errorTitle": "Problema de extracción",
    "loadFailed": "No se pudo cargar la imagen. Prueba con otro archivo.",
    "noPixels": "No se encontraron píxeles visibles. Prueba a desactivar el filtro de transparencia."
  },
  "fr": {
    "errorTitle": "Problème d'extraction",
    "loadFailed": "Impossible de charger l'image. Essayez un autre fichier.",
    "noPixels": "Aucun pixel visible trouvé. Essayez de désactiver le filtre de transparence."
  },
  "de": {
    "errorTitle": "Extraktionsproblem",
    "loadFailed": "Bild konnte nicht geladen werden. Bitte andere Datei versuchen.",
    "noPixels": "Keine sichtbaren Pixel gefunden. Versuchen Sie, die Transparenzfilterung zu deaktivieren."
  },
  "it": {
    "errorTitle": "Problema di estrazione",
    "loadFailed": "Impossibile caricare l'immagine. Prova un altro file.",
    "noPixels": "Nessun pixel visibile trovato. Prova a disattivare il filtro trasparenza."
  },
  "ja": {
    "errorTitle": "抽出の問題",
    "loadFailed": "画像の読み込みに失敗しました。別のファイルをお試しください。",
    "noPixels": "可視ピクセルが見つかりません。透明フィルターを無効にしてみてください。"
  },
  "ko": {
    "errorTitle": "추출 문제",
    "loadFailed": "이미지를 불러오지 못했습니다. 다른 파일을 시도하세요.",
    "noPixels": "표시 가능한 픽셀이 없습니다. 투명 필터를 끄고 다시 시도하세요."
  },
  "ru": {
    "errorTitle": "Проблема извлечения",
    "loadFailed": "Не удалось загрузить изображение. Попробуйте другой файл.",
    "noPixels": "Не найдено видимых пикселей. Попробуйте отключить фильтр прозрачности."
  },
  "pt": {
    "errorTitle": "Problema de extração",
    "loadFailed": "Não foi possível carregar a imagem. Tente outro arquivo.",
    "noPixels": "Nenhum pixel visível encontrado. Tente desativar o filtro de transparência."
  },
  "ar": {
    "errorTitle": "مشكلة في الاستخراج",
    "loadFailed": "تعذر تحميل الصورة. جرّب ملفاً آخر.",
    "noPixels": "لم يتم العثور على بكسلات مرئية. حاول تعطيل مرشح الشفافية."
  },
  "hi": {
    "errorTitle": "निकालने की समस्या",
    "loadFailed": "छवि लोड नहीं हो सकी। किसी अन्य फ़ाइल को आज़माएं।",
    "noPixels": "कोई दिखाई देने वाला पिक्सेल नहीं मिला। पारदर्शिता फ़िल्टर बंद करके देखें।"
  },
  "tr": {
    "errorTitle": "Cikarma sorunu",
    "loadFailed": "Gorsel yuklenemedi. Lutfen baska bir dosya deneyin.",
    "noPixels": "Gorunur piksel bulunamadi. Seffaflik filtresini kapatmayi deneyin."
  },
  "nl": {
    "errorTitle": "Extractieprobleem",
    "loadFailed": "Afbeelding kon niet worden geladen. Probeer een ander bestand.",
    "noPixels": "Geen zichtbare pixels gevonden. Schakel transparantiefiltering uit."
  },
  "sv": {
    "errorTitle": "Extraktionsproblem",
    "loadFailed": "Det gick inte att ladda bilden. Prova en annan fil.",
    "noPixels": "Inga synliga pixlar hittades. Försök att stänga av transparensfiltrering."
  },
  "pl": {
    "errorTitle": "Problem z ekstrakcją",
    "loadFailed": "Nie udało się wczytać obrazu. Spróbuj innego pliku.",
    "noPixels": "Nie znaleziono widocznych pikseli. Spróbuj wyłączyć filtr przezroczystości."
  },
  "vi": {
    "errorTitle": "Sự cố trích xuất",
    "loadFailed": "Không thể tải ảnh. Vui lòng thử tệp khác.",
    "noPixels": "Không tìm thấy pixel hiển thị. Hãy tắt lọc trong suốt."
  },
  "th": {
    "errorTitle": "ปัญหาการดึงสี",
    "loadFailed": "ไม่สามารถโหลดรูปภาพได้ กรุณาลองไฟล์อื่น",
    "noPixels": "ไม่พบพิกเซลที่มองเห็นได้ ลองปิดการกรองความโปร่งใส"
  },
  "id": {
    "errorTitle": "Masalah ekstraksi",
    "loadFailed": "Gagal memuat gambar. Silakan coba file lain.",
    "noPixels": "Tidak ada piksel terlihat. Coba nonaktifkan filter transparansi."
  },
  "he": {
    "errorTitle": "בעיית חילוץ",
    "loadFailed": "לא ניתן לטעון את התמונה. נסה קובץ אחר.",
    "noPixels": "לא נמצאו פיקסלים גלויים. נסה לבטל סינון שקיפות."
  },
  "ms": {
    "errorTitle": "Masalah ekstrak",
    "loadFailed": "Gagal memuat imej. Sila cuba fail lain.",
    "noPixels": "Tiada piksel kelihatan. Cuba matikan penapis ketelusan."
  },
  "no": {
    "errorTitle": "Uttaksproblem",
    "loadFailed": "Kunne ikke laste bildet. Prøv en annen fil.",
    "noPixels": "Fant ingen synlige piksler. Prøv å slå av transparensfiltrering."
  }
}
</i18n>
