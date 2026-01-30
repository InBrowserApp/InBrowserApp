<template>
  <ToolSectionHeader>{{ t('colors-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 s:2" responsive="screen" :x-gap="16" :y-gap="16">
      <n-gi>
        <n-form-item
          :label="t('foreground-label')"
          :feedback="foregroundFeedback"
          :validation-status="foregroundStatus"
        >
          <n-color-picker
            :value="foregroundHex"
            :modes="['hex']"
            :show-alpha="true"
            :swatches="swatches"
            data-testid="foreground-picker"
            @update:value="onUpdateForeground"
          />
        </n-form-item>
      </n-gi>
      <n-gi>
        <n-form-item
          :label="t('background-label')"
          :feedback="backgroundFeedback"
          :validation-status="backgroundStatus"
        >
          <n-color-picker
            :value="backgroundHex"
            :modes="['hex']"
            :show-alpha="true"
            :swatches="swatches"
            data-testid="background-picker"
            @update:value="onUpdateBackground"
          />
        </n-form-item>
      </n-gi>
    </n-grid>
    <n-flex class="controls" align="center" justify="end" :size="12" wrap>
      <n-button secondary @click="onSwap" data-testid="swap-button">
        <template #icon>
          <n-icon :component="ArrowSwap20Regular" />
        </template>
        {{ t('swap') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { NButton, NColorPicker, NFlex, NFormItem, NGi, NGrid, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import ArrowSwap20Regular from '@vicons/fluent/ArrowSwap20Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

const { t } = useI18n()

defineProps<{
  foregroundHex: string
  backgroundHex: string
  swatches: string[]
  foregroundFeedback?: string
  backgroundFeedback?: string
  foregroundStatus?: 'success' | 'error'
  backgroundStatus?: 'success' | 'error'
}>()

const emit = defineEmits<{
  (event: 'update:foreground', value: string): void
  (event: 'update:background', value: string): void
  (event: 'swap'): void
}>()

function onUpdateForeground(value: string) {
  emit('update:foreground', value)
}

function onUpdateBackground(value: string) {
  emit('update:background', value)
}

function onSwap() {
  emit('swap')
}
</script>

<style scoped>
.controls {
  margin-top: 12px;
}
</style>

<i18n lang="json">
{
  "en": {
    "colors-title": "Colors",
    "foreground-label": "Foreground",
    "background-label": "Background",
    "swap": "Swap"
  },
  "zh": {
    "colors-title": "颜色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "swap": "交换"
  },
  "zh-CN": {
    "colors-title": "颜色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "swap": "交换"
  },
  "zh-TW": {
    "colors-title": "顏色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "swap": "交換"
  },
  "zh-HK": {
    "colors-title": "顏色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "swap": "交換"
  },
  "es": {
    "colors-title": "Colores",
    "foreground-label": "Primer plano",
    "background-label": "Fondo",
    "swap": "Intercambiar"
  },
  "fr": {
    "colors-title": "Couleurs",
    "foreground-label": "Premier plan",
    "background-label": "Arrière-plan",
    "swap": "Inverser"
  },
  "de": {
    "colors-title": "Farben",
    "foreground-label": "Vordergrund",
    "background-label": "Hintergrund",
    "swap": "Tauschen"
  },
  "it": {
    "colors-title": "Colori",
    "foreground-label": "Primo piano",
    "background-label": "Sfondo",
    "swap": "Scambia"
  },
  "ja": {
    "colors-title": "色",
    "foreground-label": "前景色",
    "background-label": "背景色",
    "swap": "入れ替え"
  },
  "ko": {
    "colors-title": "색상",
    "foreground-label": "전경",
    "background-label": "배경",
    "swap": "교체"
  },
  "ru": {
    "colors-title": "Цвета",
    "foreground-label": "Передний план",
    "background-label": "Фон",
    "swap": "Поменять"
  },
  "pt": {
    "colors-title": "Cores",
    "foreground-label": "Primeiro plano",
    "background-label": "Fundo",
    "swap": "Trocar"
  },
  "ar": {
    "colors-title": "الألوان",
    "foreground-label": "المقدمة",
    "background-label": "الخلفية",
    "swap": "تبديل"
  },
  "hi": {
    "colors-title": "रंग",
    "foreground-label": "फोरग्राउंड",
    "background-label": "बैकग्राउंड",
    "swap": "बदलें"
  },
  "tr": {
    "colors-title": "Renkler",
    "foreground-label": "Ön plan",
    "background-label": "Arka plan",
    "swap": "Değiştir"
  },
  "nl": {
    "colors-title": "Kleuren",
    "foreground-label": "Voorgrond",
    "background-label": "Achtergrond",
    "swap": "Wisselen"
  },
  "sv": {
    "colors-title": "Färger",
    "foreground-label": "Förgrund",
    "background-label": "Bakgrund",
    "swap": "Byt"
  },
  "pl": {
    "colors-title": "Kolory",
    "foreground-label": "Pierwszy plan",
    "background-label": "Tło",
    "swap": "Zamień"
  },
  "vi": {
    "colors-title": "Màu sắc",
    "foreground-label": "Tiền cảnh",
    "background-label": "Nền",
    "swap": "Hoán đổi"
  },
  "th": {
    "colors-title": "สี",
    "foreground-label": "ด้านหน้า",
    "background-label": "พื้นหลัง",
    "swap": "สลับ"
  },
  "id": {
    "colors-title": "Warna",
    "foreground-label": "Latar depan",
    "background-label": "Latar belakang",
    "swap": "Tukar"
  },
  "he": {
    "colors-title": "צבעים",
    "foreground-label": "קדמי",
    "background-label": "רקע",
    "swap": "החלפה"
  },
  "ms": {
    "colors-title": "Warna",
    "foreground-label": "Hadapan",
    "background-label": "Latar",
    "swap": "Tukar"
  },
  "no": {
    "colors-title": "Farger",
    "foreground-label": "Forgrunn",
    "background-label": "Bakgrunn",
    "swap": "Bytt"
  }
}
</i18n>
