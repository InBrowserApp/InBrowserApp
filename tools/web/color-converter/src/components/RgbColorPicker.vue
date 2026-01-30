<template>
  <ColorSection label="RGB">
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
      :modes="['rgb']"
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
import Info16Regular from '@vicons/fluent/Info16Regular'
import type { RGBA } from '../types'
import ColorSection from './ColorSection.vue'

const props = defineProps<{
  showAlpha: boolean
}>()

const rgba = defineModel<RGBA>('rgba', { required: true })

const { t } = useI18n()

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

const displayValue = computed(() => {
  const { r, g, b, a } = rgba.value
  if (props.showAlpha) {
    return `rgba(${r}, ${g}, ${b}, ${round2(a)})`
  }
  return `rgb(${r}, ${g}, ${b})`
})

function handleUpdate(val: string) {
  const match = val.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (match && match[1] && match[2] && match[3]) {
    rgba.value = {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1,
    }
  }
}
</script>

<i18n lang="json">
{
  "en": { "info": "Red, Green, Blue - additive color model for screens" },
  "zh": { "info": "红、绿、蓝三原色模型，屏幕显示标准" },
  "zh-CN": { "info": "红、绿、蓝三原色模型，屏幕显示标准" },
  "zh-TW": { "info": "紅、綠、藍三原色模型，螢幕顯示標準" },
  "zh-HK": { "info": "紅、綠、藍三原色模型，螢幕顯示標準" },
  "es": { "info": "Rojo, Verde, Azul - modelo de color aditivo para pantallas" },
  "fr": { "info": "Rouge, Vert, Bleu - modèle de couleur additif pour écrans" },
  "de": { "info": "Rot, Grün, Blau - additives Farbmodell für Bildschirme" },
  "it": { "info": "Rosso, Verde, Blu - modello di colore additivo per schermi" },
  "ja": { "info": "赤、緑、青 - 画面表示用の加法混色モデル" },
  "ko": { "info": "빨강, 초록, 파랑 - 화면용 가산 색상 모델" },
  "ru": { "info": "Красный, Зелёный, Синий - аддитивная цветовая модель для экранов" },
  "pt": { "info": "Vermelho, Verde, Azul - modelo de cor aditivo para telas" },
  "ar": { "info": "أحمر، أخضر، أزرق - نموذج لوني إضافي للشاشات" },
  "hi": { "info": "लाल, हरा, नीला - स्क्रीन के लिए योगात्मक रंग मॉडल" },
  "tr": { "info": "Kırmızı, Yeşil, Mavi - ekranlar için toplamsal renk modeli" },
  "nl": { "info": "Rood, Groen, Blauw - additief kleurmodel voor schermen" },
  "sv": { "info": "Röd, Grön, Blå - additiv färgmodell för skärmar" },
  "pl": { "info": "Czerwony, Zielony, Niebieski - addytywny model kolorów dla ekranów" },
  "vi": { "info": "Đỏ, Xanh lục, Xanh lam - mô hình màu cộng cho màn hình" },
  "th": { "info": "แดง เขียว น้ำเงิน - โมเดลสีบวกสำหรับหน้าจอ" },
  "id": { "info": "Merah, Hijau, Biru - model warna aditif untuk layar" },
  "he": { "info": "אדום, ירוק, כחול - מודל צבע תוספתי למסכים" },
  "ms": { "info": "Merah, Hijau, Biru - model warna aditif untuk skrin" },
  "no": { "info": "Rød, Grønn, Blå - additiv fargemodell for skjermer" }
}
</i18n>
