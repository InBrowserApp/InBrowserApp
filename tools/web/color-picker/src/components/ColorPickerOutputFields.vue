<template>
  <n-grid cols="1 s:2 l:3" :x-gap="16" :y-gap="16" responsive="screen">
    <n-gi v-for="field in outputFields" :key="field.key">
      <div class="output-card">
        <div class="output-header">
          <span class="output-label">{{ field.label }}</span>
          <CopyToClipboardButton :content="field.value" size="small" />
        </div>
        <div class="output-value">{{ field.value }}</div>
      </div>
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NGrid, NGi } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'

const props = defineProps<{
  showAlpha: boolean
  hexValue: string
  rgbValue: string
  hslValue: string
  hsvValue: string
  cmykValue: string
  alphaValue: string
}>()

const { t } = useI18n()

const outputFields = computed(() => {
  const fields = [
    { key: 'hex', label: t('hex'), value: props.hexValue },
    {
      key: 'rgb',
      label: props.showAlpha ? t('rgba') : t('rgb'),
      value: props.rgbValue,
    },
    {
      key: 'hsl',
      label: props.showAlpha ? t('hsla') : t('hsl'),
      value: props.hslValue,
    },
    {
      key: 'hsv',
      label: props.showAlpha ? t('hsva') : t('hsv'),
      value: props.hsvValue,
    },
    { key: 'cmyk', label: t('cmyk'), value: props.cmykValue },
  ]

  if (props.showAlpha) {
    fields.push({ key: 'alpha', label: t('alpha'), value: props.alphaValue })
  }

  return fields
})
</script>

<style scoped>
.output-card {
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  padding: 12px;
  background: var(--n-color);
}

.output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.output-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.output-value {
  font-family:
    ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 13px;
}
</style>

<i18n lang="json">
{
  "en": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "zh": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "透明度"
  },
  "zh-CN": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "透明度"
  },
  "zh-TW": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "透明度"
  },
  "zh-HK": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "透明度"
  },
  "es": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "fr": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "de": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "it": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "ja": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "アルファ"
  },
  "ko": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "알파"
  },
  "ru": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Альфа"
  },
  "pt": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "ar": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "ألفا"
  },
  "hi": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "अल्फा"
  },
  "tr": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "nl": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "sv": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "pl": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alfa"
  },
  "vi": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "th": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "อัลฟา"
  },
  "id": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "he": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "אלפא"
  },
  "ms": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  },
  "no": {
    "hex": "HEX",
    "rgb": "RGB",
    "rgba": "RGBA",
    "hsl": "HSL",
    "hsla": "HSLA",
    "hsv": "HSV",
    "hsva": "HSVA",
    "cmyk": "CMYK",
    "alpha": "Alpha"
  }
}
</i18n>
