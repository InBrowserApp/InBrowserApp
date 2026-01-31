<template>
  <ColorContrastInputSection
    v-model:foreground-hex="foregroundHexModel"
    v-model:background-hex="backgroundHexModel"
    :swatches="swatches"
    :foreground-feedback="foregroundFeedback"
    :background-feedback="backgroundFeedback"
    :foreground-status="foregroundStatus"
    :background-status="backgroundStatus"
    @swap="swapColors"
  />
  <ColorContrastResultsSection :ratio="ratio" :checks="checks" :has-valid-inputs="hasValidInputs" />
  <ColorContrastPreviewSection :preview-style="previewStyle" />
  <ColorContrastWhatIsSection />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { contrastRatio, parseColor, rgbaToHex, toCssRgba, type RGBA } from '../utils/color'
import ColorContrastInputSection from './ColorContrastInputSection.vue'
import ColorContrastResultsSection from './ColorContrastResultsSection.vue'
import ColorContrastPreviewSection from './ColorContrastPreviewSection.vue'
import ColorContrastWhatIsSection from './ColorContrastWhatIsSection.vue'

type ContrastCheck = {
  key: 'aa-normal' | 'aa-large' | 'aaa-normal' | 'aaa-large'
  pass: boolean
}

const { t } = useI18n()

const swatches = [
  '#0F172AFF',
  '#111827FF',
  '#64748BFF',
  '#FFFFFFFF',
  '#EF4444FF',
  '#F97316FF',
  '#FACC15FF',
  '#22C55EFF',
  '#3B82F6FF',
  '#A855F7FF',
]

const defaultForeground: RGBA = { r: 17, g: 17, b: 17, a: 1 }
const defaultBackground: RGBA = { r: 255, g: 255, b: 255, a: 1 }

const foregroundInput = useStorage('tools:color-contrast-checker:foreground', '#111111')
const backgroundInput = useStorage('tools:color-contrast-checker:background', '#ffffff')

const foregroundParsed = computed(() => parseColor(foregroundInput.value))
const backgroundParsed = computed(() => parseColor(backgroundInput.value))

const lastForeground = ref<RGBA>(defaultForeground)
const lastBackground = ref<RGBA>(defaultBackground)

watch(
  foregroundParsed,
  (value) => {
    if (value) lastForeground.value = value
  },
  { immediate: true },
)

watch(
  backgroundParsed,
  (value) => {
    if (value) lastBackground.value = value
  },
  { immediate: true },
)

const foregroundHex = computed(() => rgbaToHex(lastForeground.value, lastForeground.value.a < 1))
const backgroundHex = computed(() => rgbaToHex(lastBackground.value, lastBackground.value.a < 1))

const foregroundHexModel = computed({
  get: () => foregroundHex.value,
  set: (value: string) => {
    updateForegroundFromPicker(value)
  },
})

const backgroundHexModel = computed({
  get: () => backgroundHex.value,
  set: (value: string) => {
    updateBackgroundFromPicker(value)
  },
})

const foregroundFeedback = computed(() => {
  if (!foregroundInput.value.trim()) return undefined
  return foregroundParsed.value ? undefined : t('invalid-color')
})

const backgroundFeedback = computed(() => {
  if (!backgroundInput.value.trim()) return undefined
  return backgroundParsed.value ? undefined : t('invalid-color')
})

const foregroundStatus = computed(() => {
  if (!foregroundInput.value.trim()) return undefined
  return foregroundParsed.value ? 'success' : 'error'
})

const backgroundStatus = computed(() => {
  if (!backgroundInput.value.trim()) return undefined
  return backgroundParsed.value ? 'success' : 'error'
})

const hasValidInputs = computed(() => Boolean(foregroundParsed.value && backgroundParsed.value))

const ratio = computed(() => {
  if (!foregroundParsed.value || !backgroundParsed.value) return null
  return contrastRatio(foregroundParsed.value, backgroundParsed.value)
})

const checks = computed<ContrastCheck[]>(() => {
  if (ratio.value === null) return []
  return [
    { key: 'aa-normal', pass: ratio.value >= 4.5 },
    { key: 'aa-large', pass: ratio.value >= 3 },
    { key: 'aaa-normal', pass: ratio.value >= 7 },
    { key: 'aaa-large', pass: ratio.value >= 4.5 },
  ]
})

const previewStyle = computed(() => ({
  backgroundColor: toCssRgba(lastBackground.value),
  color: toCssRgba(lastForeground.value),
}))

function updateForegroundFromPicker(value: string) {
  foregroundInput.value = value
}

function updateBackgroundFromPicker(value: string) {
  backgroundInput.value = value
}

function swapColors() {
  const nextForeground = backgroundInput.value
  backgroundInput.value = foregroundInput.value
  foregroundInput.value = nextForeground
}
</script>

<i18n lang="json">
{
  "en": {
    "invalid-color": "Invalid color format"
  },
  "zh": {
    "invalid-color": "颜色格式无效"
  },
  "zh-CN": {
    "invalid-color": "颜色格式无效"
  },
  "zh-TW": {
    "invalid-color": "顏色格式無效"
  },
  "zh-HK": {
    "invalid-color": "顏色格式無效"
  },
  "es": {
    "invalid-color": "Formato de color no válido"
  },
  "fr": {
    "invalid-color": "Format de couleur invalide"
  },
  "de": {
    "invalid-color": "Ungültiges Farbformat"
  },
  "it": {
    "invalid-color": "Formato colore non valido"
  },
  "ja": {
    "invalid-color": "無効な色形式"
  },
  "ko": {
    "invalid-color": "유효하지 않은 색상 형식"
  },
  "ru": {
    "invalid-color": "Неверный формат цвета"
  },
  "pt": {
    "invalid-color": "Formato de cor inválido"
  },
  "ar": {
    "invalid-color": "تنسيق لون غير صالح"
  },
  "hi": {
    "invalid-color": "अमान्य रंग प्रारूप"
  },
  "tr": {
    "invalid-color": "Geçersiz renk biçimi"
  },
  "nl": {
    "invalid-color": "Ongeldig kleurformaat"
  },
  "sv": {
    "invalid-color": "Ogiltigt färgformat"
  },
  "pl": {
    "invalid-color": "Nieprawidłowy format koloru"
  },
  "vi": {
    "invalid-color": "Định dạng màu không hợp lệ"
  },
  "th": {
    "invalid-color": "รูปแบบสีไม่ถูกต้อง"
  },
  "id": {
    "invalid-color": "Format warna tidak valid"
  },
  "he": {
    "invalid-color": "פורמט צבע לא תקין"
  },
  "ms": {
    "invalid-color": "Format warna tidak sah"
  },
  "no": {
    "invalid-color": "Ugyldig fargeformat"
  }
}
</i18n>
