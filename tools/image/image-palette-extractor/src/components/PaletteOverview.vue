<template>
  <n-flex vertical :size="16" class="overview-stack">
    <div class="palette-bar">
      <div
        v-for="color in colors"
        :key="color.hex"
        class="palette-slice"
        :style="{ backgroundColor: color.hex, flex: color.count }"
        :title="`${color.hex} · ${formatPercent(color.ratio)}`"
      />
    </div>

    <n-grid cols="1 700:3" :x-gap="16" :y-gap="16" class="stats-grid">
      <n-grid-item>
        <n-statistic :label="t('colorCount')">
          {{ colors.length }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="t('pixels')">
          {{ formattedPixels }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="t('dominant')">
          <n-flex align="center" :size="8">
            <span class="dominant-dot" :style="{ backgroundColor: dominantColor?.hex }" />
            <span>{{ dominantColor?.hex }}</span>
          </n-flex>
        </n-statistic>
      </n-grid-item>
    </n-grid>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NGrid, NGridItem, NStatistic } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { PaletteSwatch } from '../types'

const props = defineProps<{
  colors: PaletteSwatch[]
  dominant: PaletteSwatch | null
  totalPixels: number
}>()

const { t } = useI18n({ useScope: 'local' })

const dominantColor = computed(() => props.dominant)
const formattedPixels = computed(() => props.totalPixels.toLocaleString())

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}
</script>

<style scoped>
.palette-bar {
  display: flex;
  height: 18px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--n-border-color);
}

.palette-slice {
  min-width: 6px;
}

.dominant-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid var(--n-border-color);
  display: inline-block;
}
</style>

<i18n lang="json">
{
  "en": {
    "colorCount": "Colors",
    "pixels": "Sampled pixels",
    "dominant": "Dominant"
  },
  "zh": {
    "colorCount": "颜色数量",
    "pixels": "采样像素",
    "dominant": "主色"
  },
  "zh-CN": {
    "colorCount": "颜色数量",
    "pixels": "采样像素",
    "dominant": "主色"
  },
  "zh-TW": {
    "colorCount": "顏色數量",
    "pixels": "取樣像素",
    "dominant": "主色"
  },
  "zh-HK": {
    "colorCount": "顏色數量",
    "pixels": "取樣像素",
    "dominant": "主色"
  },
  "es": {
    "colorCount": "Colores",
    "pixels": "Píxeles muestreados",
    "dominant": "Dominante"
  },
  "fr": {
    "colorCount": "Couleurs",
    "pixels": "Pixels échantillonnés",
    "dominant": "Dominante"
  },
  "de": {
    "colorCount": "Farben",
    "pixels": "Abgetastete Pixel",
    "dominant": "Dominant"
  },
  "it": {
    "colorCount": "Colori",
    "pixels": "Pixel campionati",
    "dominant": "Dominante"
  },
  "ja": {
    "colorCount": "色数",
    "pixels": "サンプルピクセル",
    "dominant": "主色"
  },
  "ko": {
    "colorCount": "색상 수",
    "pixels": "샘플 픽셀",
    "dominant": "대표 색상"
  },
  "ru": {
    "colorCount": "Цвета",
    "pixels": "Выбранные пиксели",
    "dominant": "Доминирующий"
  },
  "pt": {
    "colorCount": "Cores",
    "pixels": "Pixels amostrados",
    "dominant": "Dominante"
  },
  "ar": {
    "colorCount": "الألوان",
    "pixels": "بكسلات تم أخذها",
    "dominant": "الأكثر شيوعًا"
  },
  "hi": {
    "colorCount": "रंग",
    "pixels": "सैंपल पिक्सेल",
    "dominant": "प्रमुख"
  },
  "tr": {
    "colorCount": "Renkler",
    "pixels": "Orneklenen pikseller",
    "dominant": "Baskin"
  },
  "nl": {
    "colorCount": "Kleuren",
    "pixels": "Bemonsterde pixels",
    "dominant": "Dominant"
  },
  "sv": {
    "colorCount": "Färger",
    "pixels": "Provtagna pixlar",
    "dominant": "Dominerande"
  },
  "pl": {
    "colorCount": "Kolory",
    "pixels": "Próbkowane piksele",
    "dominant": "Dominujący"
  },
  "vi": {
    "colorCount": "Màu sắc",
    "pixels": "Pixel đã lấy mẫu",
    "dominant": "Chủ đạo"
  },
  "th": {
    "colorCount": "สี",
    "pixels": "พิกเซลที่สุ่ม",
    "dominant": "สีหลัก"
  },
  "id": {
    "colorCount": "Warna",
    "pixels": "Piksel sampel",
    "dominant": "Dominan"
  },
  "he": {
    "colorCount": "צבעים",
    "pixels": "פיקסלים שנדגמו",
    "dominant": "דומיננטי"
  },
  "ms": {
    "colorCount": "Warna",
    "pixels": "Piksel sampel",
    "dominant": "Dominan"
  },
  "no": {
    "colorCount": "Farger",
    "pixels": "Samplede piksler",
    "dominant": "Dominerende"
  }
}
</i18n>
