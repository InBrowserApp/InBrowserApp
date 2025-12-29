<template>
  <ColorSection label="HEX">
    <template #label-suffix>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon :component="Info16Regular" style="cursor: help" />
        </template>
        {{ t('info') }}
      </n-tooltip>
    </template>
    <template #action>
      <CopyToClipboardButton :content="displayValue" size="small" />
    </template>
    <n-color-picker
      :value="displayValue"
      :modes="['hex']"
      :show-alpha="showAlpha"
      :swatches="presetColors"
      @update:value="handleUpdate"
    />
  </ColorSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NColorPicker, NTooltip, NIcon } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { Info16Regular } from '@shared/icons/fluent'
import convert from 'color-convert'
import type { RGBA } from '../types'
import ColorSection from './ColorSection.vue'

const props = defineProps<{
  rgba: RGBA
  showAlpha: boolean
}>()

const emit = defineEmits<{
  'update:rgba': [value: RGBA]
}>()

const { t } = useI18n()

const presetColors = [
  '#FF0000FF',
  '#FF7F00FF',
  '#FFFF00FF',
  '#00FF00FF',
  '#00FFFFFF',
  '#0000FFFF',
  '#8B00FFFF',
  '#FF00FFFF',
  '#000000FF',
  '#808080FF',
  '#FFFFFFFF',
]

const displayValue = computed(() => {
  const { r, g, b, a } = props.rgba
  const hex = convert.rgb.hex(r, g, b)
  if (props.showAlpha) {
    const alpha = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
    return `#${hex}${alpha}`
  }
  return `#${hex}`
})

function handleUpdate(val: string) {
  let hex = val.replace(/^#/, '')
  if (hex.length === 3) {
    const chars = hex.split('')
    hex =
      (chars[0] ?? '') +
      (chars[0] ?? '') +
      (chars[1] ?? '') +
      (chars[1] ?? '') +
      (chars[2] ?? '') +
      (chars[2] ?? '') +
      'ff'
  }
  if (hex.length === 4) {
    const chars = hex.split('')
    hex =
      (chars[0] ?? '') +
      (chars[0] ?? '') +
      (chars[1] ?? '') +
      (chars[1] ?? '') +
      (chars[2] ?? '') +
      (chars[2] ?? '') +
      (chars[3] ?? '') +
      (chars[3] ?? '')
  }
  if (hex.length === 6) hex += 'ff'

  const rgb = convert.hex.rgb(hex.slice(0, 6))
  const a = parseInt(hex.slice(6, 8), 16) / 255

  emit('update:rgba', { r: rgb[0], g: rgb[1], b: rgb[2], a: isNaN(a) ? 1 : a })
}
</script>

<i18n lang="json">
{
  "en": { "info": "Hexadecimal color notation, most common in web development" },
  "zh": { "info": "十六进制颜色表示法，网页开发最常用" },
  "zh-CN": { "info": "十六进制颜色表示法，网页开发最常用" },
  "zh-TW": { "info": "十六進制顏色表示法，網頁開發最常用" },
  "zh-HK": { "info": "十六進制顏色表示法，網頁開發最常用" },
  "es": { "info": "Notación hexadecimal, la más común en desarrollo web" },
  "fr": { "info": "Notation hexadécimale, la plus courante en développement web" },
  "de": { "info": "Hexadezimale Farbnotation, am häufigsten in der Webentwicklung" },
  "it": { "info": "Notazione esadecimale, la più comune nello sviluppo web" },
  "ja": { "info": "16進数カラー表記、Web開発で最も一般的" },
  "ko": { "info": "16진수 색상 표기법, 웹 개발에서 가장 일반적" },
  "ru": { "info": "Шестнадцатеричная запись цвета, наиболее распространена в веб-разработке" },
  "pt": { "info": "Notação hexadecimal, a mais comum no desenvolvimento web" },
  "ar": { "info": "تدوين اللون السداسي عشري، الأكثر شيوعاً في تطوير الويب" },
  "hi": { "info": "हेक्साडेसिमल रंग संकेतन, वेब विकास में सबसे आम" },
  "tr": { "info": "Onaltılık renk gösterimi, web geliştirmede en yaygın" },
  "nl": { "info": "Hexadecimale kleurnotatie, meest gebruikt in webontwikkeling" },
  "sv": { "info": "Hexadecimal färgnotation, vanligast inom webbutveckling" },
  "pl": { "info": "Zapis szesnastkowy koloru, najczęściej używany w web developmencie" },
  "vi": { "info": "Ký hiệu màu thập lục phân, phổ biến nhất trong phát triển web" },
  "th": { "info": "สัญกรณ์สีฐานสิบหก ใช้มากที่สุดในการพัฒนาเว็บ" },
  "id": { "info": "Notasi warna heksadesimal, paling umum dalam pengembangan web" },
  "he": { "info": "סימון צבע הקסדצימלי, הנפוץ ביותר בפיתוח אתרים" },
  "ms": { "info": "Notasi warna heksadesimal, paling biasa dalam pembangunan web" },
  "no": { "info": "Heksadesimal fargenotasjon, mest brukt i webutvikling" }
}
</i18n>
