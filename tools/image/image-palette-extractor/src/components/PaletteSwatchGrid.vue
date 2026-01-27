<template>
  <n-grid
    cols="2 s:4 m:5 l:6 xl:7 2xl:8"
    :x-gap="12"
    :y-gap="12"
    responsive="screen"
    class="swatch-grid"
  >
    <n-grid-item v-for="color in colors" :key="color.hex" class="swatch-grid-item">
      <CopyToClipboardTooltip :content="color.hex" #="{ copy }">
        <button
          type="button"
          class="swatch-card"
          :style="{ backgroundColor: color.hex, color: color.textColor }"
          :aria-label="t('copy')"
          @click="copy"
        >
          <span class="swatch-hex">{{ color.hex }}</span>
          <span class="swatch-percent">{{ formatPercent(color.ratio) }}</span>
        </button>
      </CopyToClipboardTooltip>
    </n-grid-item>
  </n-grid>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NGrid, NGridItem } from 'naive-ui'
import { CopyToClipboardTooltip } from '@shared/ui/base'
import type { PaletteSwatch } from '../types'

defineProps<{ colors: PaletteSwatch[] }>()

const { t } = useI18n({ useScope: 'local' })

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}
</script>

<style scoped>
.swatch-grid {
  margin-top: 20px;
}

.swatch-grid-item {
  display: flex;
  justify-content: center;
}

.swatch-card {
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  width: 100%;
  aspect-ratio: 1 / 1;
  padding: 6px;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
}

.swatch-hex {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.swatch-card:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 4px;
  border-radius: 12px;
}

.swatch-percent {
  font-weight: 600;
  font-size: 10px;
  opacity: 0.9;
}
</style>

<i18n lang="json">
{
  "en": {
    "copy": "Copy"
  },
  "zh": {
    "copy": "复制"
  },
  "zh-CN": {
    "copy": "复制"
  },
  "zh-TW": {
    "copy": "複製"
  },
  "zh-HK": {
    "copy": "複製"
  },
  "es": {
    "copy": "Copiar"
  },
  "fr": {
    "copy": "Copier"
  },
  "de": {
    "copy": "Kopieren"
  },
  "it": {
    "copy": "Copia"
  },
  "ja": {
    "copy": "コピー"
  },
  "ko": {
    "copy": "복사"
  },
  "ru": {
    "copy": "Копировать"
  },
  "pt": {
    "copy": "Copiar"
  },
  "ar": {
    "copy": "نسخ"
  },
  "hi": {
    "copy": "कॉपी"
  },
  "tr": {
    "copy": "Kopyala"
  },
  "nl": {
    "copy": "Kopiëren"
  },
  "sv": {
    "copy": "Kopiera"
  },
  "pl": {
    "copy": "Kopiuj"
  },
  "vi": {
    "copy": "Sao chép"
  },
  "th": {
    "copy": "คัดลอก"
  },
  "id": {
    "copy": "Salin"
  },
  "he": {
    "copy": "העתק"
  },
  "ms": {
    "copy": "Salin"
  },
  "no": {
    "copy": "Kopier"
  }
}
</i18n>
