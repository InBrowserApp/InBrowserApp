<template>
  <section data-test="preview-section">
    <n-flex vertical :size="8">
      <n-text strong>{{ t('previewTitle') }}</n-text>
      <n-text depth="3" class="preview-hint">{{ t('previewHint') }}</n-text>

      <div class="preview-canvas" data-test="preview-canvas">
        <span class="preview-number" :style="previewNumberStyle" data-test="preview-number">
          {{ previewText }}
        </span>
      </div>
    </n-flex>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import type { PageNumberFormat, PageNumberPosition } from '../types'

const props = defineProps<{
  startNumber: number
  format: PageNumberFormat
  position: PageNumberPosition
  fontSize: number
  marginX: number
  marginY: number
  pageCount: number
}>()

const PREVIEW_WIDTH = 320
const PREVIEW_HEIGHT = 220
const MIN_PADDING = 12

const { t } = useI18n({ useScope: 'local' })

const previewTotal = computed(() => Math.max(1, props.pageCount))

const previewText = computed(() => {
  if (props.format === 'n-total') {
    return `${props.startNumber}/${previewTotal.value}`
  }

  return `${props.startNumber}`
})

const previewFontSize = computed(() => Math.min(Math.max(props.fontSize, 10), 28))

const previewMarginX = computed(() =>
  Math.min(Math.max(props.marginX, MIN_PADDING), PREVIEW_WIDTH / 2 - MIN_PADDING),
)

const previewMarginY = computed(() =>
  Math.min(Math.max(props.marginY, MIN_PADDING), PREVIEW_HEIGHT / 2 - MIN_PADDING),
)

const previewNumberStyle = computed<Record<string, string>>(() => {
  const style: Record<string, string> = {
    fontSize: `${previewFontSize.value}px`,
  }

  switch (props.position) {
    case 'top-left':
      style.left = `${previewMarginX.value}px`
      style.top = `${previewMarginY.value}px`
      return style
    case 'top-center':
      style.left = '50%'
      style.top = `${previewMarginY.value}px`
      style.transform = 'translateX(-50%)'
      return style
    case 'top-right':
      style.right = `${previewMarginX.value}px`
      style.top = `${previewMarginY.value}px`
      return style
    case 'bottom-left':
      style.left = `${previewMarginX.value}px`
      style.bottom = `${previewMarginY.value}px`
      return style
    case 'bottom-center':
      style.left = '50%'
      style.bottom = `${previewMarginY.value}px`
      style.transform = 'translateX(-50%)'
      return style
    case 'bottom-right':
      style.right = `${previewMarginX.value}px`
      style.bottom = `${previewMarginY.value}px`
      return style
    default:
      return style
  }
})
</script>

<style scoped>
.preview-hint {
  line-height: 1.4;
}

.preview-canvas {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 220px;
  border-radius: 12px;
  border: 1px dashed var(--n-border-color);
  background: linear-gradient(145deg, rgba(17, 113, 194, 0.12), rgba(17, 113, 194, 0.04));
  overflow: hidden;
}

.preview-canvas::after {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  pointer-events: none;
}

.preview-number {
  position: absolute;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--n-text-color);
  background-color: rgba(255, 255, 255, 0.76);
  padding: 2px 6px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
}
</style>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Live Preview",
    "previewHint": "Placement updates as you adjust format, position, size, and margins."
  },
  "zh": {
    "previewTitle": "实时预览",
    "previewHint": "调整格式、位置、字号和边距时，预览会同步更新。"
  },
  "zh-CN": {
    "previewTitle": "实时预览",
    "previewHint": "调整格式、位置、字号和边距时，预览会同步更新。"
  },
  "zh-TW": {
    "previewTitle": "即時預覽",
    "previewHint": "調整格式、位置、字級與邊距時，預覽會同步更新。"
  },
  "zh-HK": {
    "previewTitle": "即時預覽",
    "previewHint": "調整格式、位置、字級與邊距時，預覽會同步更新。"
  },
  "es": {
    "previewTitle": "Vista previa en tiempo real",
    "previewHint": "La posición se actualiza al ajustar formato, posición, tamaño y márgenes."
  },
  "fr": {
    "previewTitle": "Aperçu en direct",
    "previewHint": "La position se met à jour quand vous changez format, position, taille et marges."
  },
  "de": {
    "previewTitle": "Live-Vorschau",
    "previewHint": "Die Position wird beim Ändern von Format, Position, Größe und Rändern aktualisiert."
  },
  "it": {
    "previewTitle": "Anteprima live",
    "previewHint": "La posizione si aggiorna mentre modifichi formato, posizione, dimensione e margini."
  },
  "ja": {
    "previewTitle": "ライブプレビュー",
    "previewHint": "形式・位置・文字サイズ・余白の変更に合わせて配置が更新されます。"
  },
  "ko": {
    "previewTitle": "실시간 미리보기",
    "previewHint": "형식, 위치, 글자 크기, 여백을 조정하면 배치가 즉시 업데이트됩니다."
  },
  "ru": {
    "previewTitle": "Предпросмотр в реальном времени",
    "previewHint": "Положение обновляется при изменении формата, позиции, размера и отступов."
  },
  "pt": {
    "previewTitle": "Pré-visualização ao vivo",
    "previewHint": "A posição é atualizada ao ajustar formato, posição, tamanho e margens."
  },
  "ar": {
    "previewTitle": "معاينة فورية",
    "previewHint": "يتم تحديث الموضع أثناء ضبط التنسيق والموقع والحجم والهوامش."
  },
  "hi": {
    "previewTitle": "लाइव प्रीव्यू",
    "previewHint": "फॉर्मेट, पोज़िशन, आकार और मार्जिन बदलते ही स्थान अपडेट होता है।"
  },
  "tr": {
    "previewTitle": "Canlı önizleme",
    "previewHint": "Biçim, konum, boyut ve kenar boşluklarını ayarladıkça yerleşim güncellenir."
  },
  "nl": {
    "previewTitle": "Livevoorbeeld",
    "previewHint": "De plaatsing wordt bijgewerkt wanneer je formaat, positie, grootte en marges wijzigt."
  },
  "sv": {
    "previewTitle": "Liveförhandsvisning",
    "previewHint": "Placeringen uppdateras när du ändrar format, position, storlek och marginaler."
  },
  "pl": {
    "previewTitle": "Podgląd na żywo",
    "previewHint": "Pozycja aktualizuje się podczas zmiany formatu, położenia, rozmiaru i marginesów."
  },
  "vi": {
    "previewTitle": "Xem trước trực tiếp",
    "previewHint": "Vị trí sẽ cập nhật khi bạn thay đổi định dạng, vị trí, cỡ chữ và lề."
  },
  "th": {
    "previewTitle": "ตัวอย่างแบบเรียลไทม์",
    "previewHint": "ตำแหน่งจะอัปเดตทันทีเมื่อปรับรูปแบบ ตำแหน่ง ขนาด และระยะขอบ"
  },
  "id": {
    "previewTitle": "Pratinjau langsung",
    "previewHint": "Posisi diperbarui saat Anda menyesuaikan format, posisi, ukuran, dan margin."
  },
  "he": {
    "previewTitle": "תצוגה מקדימה חיה",
    "previewHint": "המיקום מתעדכן כשמשנים פורמט, מיקום, גודל ושוליים."
  },
  "ms": {
    "previewTitle": "Pratonton langsung",
    "previewHint": "Kedudukan dikemas kini apabila anda melaras format, posisi, saiz dan jidar."
  },
  "no": {
    "previewTitle": "Direkte forhåndsvisning",
    "previewHint": "Plasseringen oppdateres når du justerer format, posisjon, størrelse og marger."
  }
}
</i18n>
