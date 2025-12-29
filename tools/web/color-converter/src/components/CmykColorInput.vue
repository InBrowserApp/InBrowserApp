<template>
  <ColorSection label="CMYK">
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
    <n-input
      v-model:value="localValue"
      :status="isValid ? undefined : 'error'"
      @blur="handleBlur"
      @keydown.enter="handleEnter"
    />
  </ColorSection>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NInput, NTooltip, NIcon } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import { Info16Regular } from '@shared/icons/fluent'
import convert from 'color-convert'
import type { RGBA } from '../types'
import ColorSection from './ColorSection.vue'

const props = defineProps<{
  rgba: RGBA
}>()

const emit = defineEmits<{
  'update:rgba': [value: RGBA]
}>()

const { t } = useI18n()

const displayValue = computed(() => {
  const { r, g, b } = props.rgba
  const [c, m, y, k] = convert.rgb.cmyk(r, g, b)
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`
})

const localValue = ref(displayValue.value)
const isValid = ref(true)

watch(displayValue, (newVal) => {
  localValue.value = newVal
  isValid.value = true
})

watch(localValue, (newVal) => {
  isValid.value = validate(newVal)
})

function validate(str: string): boolean {
  return parse(str) !== null
}

function parse(str: string): { c: number; m: number; y: number; k: number } | null {
  const match = str.match(/cmyk\((\d+)%?,?\s*(\d+)%?,?\s*(\d+)%?,?\s*(\d+)%?\)/)
  if (match && match[1] && match[2] && match[3] && match[4]) {
    const c = parseInt(match[1])
    const m = parseInt(match[2])
    const y = parseInt(match[3])
    const k = parseInt(match[4])
    if (c >= 0 && c <= 100 && m >= 0 && m <= 100 && y >= 0 && y <= 100 && k >= 0 && k <= 100) {
      return { c, m, y, k }
    }
  }
  return null
}

function handleBlur() {
  const parsed = parse(localValue.value)
  if (parsed) {
    const [r, g, b] = convert.cmyk.rgb(parsed.c, parsed.m, parsed.y, parsed.k)
    emit('update:rgba', { r, g, b, a: props.rgba.a })
  } else {
    localValue.value = displayValue.value
    isValid.value = true
  }
}

function handleEnter(e: KeyboardEvent) {
  ;(e.target as HTMLInputElement).blur()
}
</script>

<i18n lang="json">
{
  "en": { "info": "Cyan, Magenta, Yellow, Key (Black) - print standard, no alpha support" },
  "zh": { "info": "青、品红、黄、黑 - 印刷标准，不支持透明度" },
  "zh-CN": { "info": "青、品红、黄、黑 - 印刷标准，不支持透明度" },
  "zh-TW": { "info": "青、洋紅、黃、黑 - 印刷標準，不支援透明度" },
  "zh-HK": { "info": "青、洋紅、黃、黑 - 印刷標準，不支援透明度" },
  "es": { "info": "Cian, Magenta, Amarillo, Negro - estándar de impresión, sin alfa" },
  "fr": { "info": "Cyan, Magenta, Jaune, Noir - standard d'impression, sans alpha" },
  "de": { "info": "Cyan, Magenta, Gelb, Schwarz - Druckstandard, ohne Alpha" },
  "it": { "info": "Ciano, Magenta, Giallo, Nero - standard di stampa, senza alfa" },
  "ja": { "info": "シアン、マゼンタ、イエロー、ブラック - 印刷標準、アルファ非対応" },
  "ko": { "info": "시안, 마젠타, 옐로우, 블랙 - 인쇄 표준, 알파 미지원" },
  "ru": { "info": "Голубой, Пурпурный, Жёлтый, Чёрный - стандарт печати, без альфа" },
  "pt": { "info": "Ciano, Magenta, Amarelo, Preto - padrão de impressão, sem alfa" },
  "ar": { "info": "سماوي، أرجواني، أصفر، أسود - معيار الطباعة، بدون ألفا" },
  "hi": { "info": "सियान, मैजेंटा, पीला, काला - प्रिंट मानक, अल्फा नहीं" },
  "tr": { "info": "Camgöbeği, Macenta, Sarı, Siyah - baskı standardı, alfa yok" },
  "nl": { "info": "Cyaan, Magenta, Geel, Zwart - printstandaard, geen alfa" },
  "sv": { "info": "Cyan, Magenta, Gul, Svart - tryckstandard, ingen alfa" },
  "pl": { "info": "Cyjan, Magenta, Żółty, Czarny - standard druku, bez alfa" },
  "vi": { "info": "Lục lam, Đỏ tươi, Vàng, Đen - tiêu chuẩn in ấn, không alpha" },
  "th": { "info": "ฟ้า แดงม่วง เหลือง ดำ - มาตรฐานการพิมพ์ ไม่มีอัลฟา" },
  "id": { "info": "Sian, Magenta, Kuning, Hitam - standar cetak, tanpa alfa" },
  "he": { "info": "ציאן, מגנטה, צהוב, שחור - תקן הדפסה, ללא אלפא" },
  "ms": { "info": "Sian, Magenta, Kuning, Hitam - standard cetakan, tiada alfa" },
  "no": { "info": "Cyan, Magenta, Gul, Svart - trykkestandard, ingen alfa" }
}
</i18n>
