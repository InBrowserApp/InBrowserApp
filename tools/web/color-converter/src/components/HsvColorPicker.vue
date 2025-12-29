<template>
  <ColorSection label="HSV">
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
      :modes="['hsv']"
      :show-alpha="showAlpha"
      :show-preview="false"
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

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

const displayValue = computed(() => {
  const { r, g, b, a } = props.rgba
  const [h, s, v] = convert.rgb.hsv(r, g, b)
  if (props.showAlpha) {
    return `hsva(${h}, ${s}%, ${v}%, ${round2(a)})`
  }
  return `hsv(${h}, ${s}%, ${v}%)`
})

function handleUpdate(val: string) {
  const match = val.match(/hsva?\((\d+),\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/)
  if (match && match[1] && match[2] && match[3]) {
    const h = parseInt(match[1])
    const s = parseInt(match[2])
    const v = parseInt(match[3])
    const a = match[4] ? parseFloat(match[4]) : 1
    const [r, g, b] = convert.hsv.rgb(h, s, v)
    emit('update:rgba', { r, g, b, a })
  }
}
</script>

<i18n lang="json">
{
  "en": { "info": "Hue, Saturation, Value (Brightness) - also known as HSB, common in color pickers" },
  "zh": { "info": "色相、饱和度、明度 - 也称 HSB，常用于取色器" },
  "zh-CN": { "info": "色相、饱和度、明度 - 也称 HSB，常用于取色器" },
  "zh-TW": { "info": "色相、飽和度、明度 - 也稱 HSB，常用於取色器" },
  "zh-HK": { "info": "色相、飽和度、明度 - 也稱 HSB，常用於取色器" },
  "es": { "info": "Tono, Saturación, Valor - también conocido como HSB, común en selectores de color" },
  "fr": { "info": "Teinte, Saturation, Valeur - aussi appelé HSB, courant dans les sélecteurs de couleur" },
  "de": { "info": "Farbton, Sättigung, Hellwert - auch HSB genannt, üblich in Farbwählern" },
  "it": { "info": "Tonalità, Saturazione, Valore - noto anche come HSB, comune nei selettori colore" },
  "ja": { "info": "色相、彩度、明度 - HSBとも呼ばれ、カラーピッカーで一般的" },
  "ko": { "info": "색상, 채도, 명도 - HSB라고도 하며, 색상 선택기에서 일반적" },
  "ru": { "info": "Оттенок, Насыщенность, Значение - также известен как HSB, распространён в палитрах" },
  "pt": { "info": "Matiz, Saturação, Valor - também conhecido como HSB, comum em seletores de cor" },
  "ar": { "info": "درجة اللون، التشبع، القيمة - يُعرف أيضاً بـ HSB، شائع في منتقي الألوان" },
  "hi": { "info": "ह्यू, सैचुरेशन, वैल्यू - HSB भी कहा जाता है, कलर पिकर में आम" },
  "tr": { "info": "Ton, Doygunluk, Değer - HSB olarak da bilinir, renk seçicilerde yaygın" },
  "nl": { "info": "Tint, Verzadiging, Waarde - ook bekend als HSB, gebruikelijk in kleurkiezers" },
  "sv": { "info": "Nyans, Mättnad, Värde - även känd som HSB, vanlig i färgväljare" },
  "pl": { "info": "Barwa, Nasycenie, Wartość - znany też jako HSB, popularny w próbnikach kolorów" },
  "vi": { "info": "Sắc độ, Độ bão hòa, Giá trị - còn gọi là HSB, phổ biến trong bộ chọn màu" },
  "th": { "info": "เฉดสี ความอิ่มตัว ค่า - เรียกอีกอย่างว่า HSB ใช้ทั่วไปในตัวเลือกสี" },
  "id": { "info": "Hue, Saturasi, Value - juga dikenal sebagai HSB, umum di pemilih warna" },
  "he": { "info": "גוון, רוויה, ערך - ידוע גם כ-HSB, נפוץ בבוחרי צבעים" },
  "ms": { "info": "Hue, Ketepuan, Nilai - juga dikenali sebagai HSB, biasa dalam pemilih warna" },
  "no": { "info": "Fargetone, Metning, Verdi - også kjent som HSB, vanlig i fargevelgere" }
}
</i18n>
