<template>
  <n-card class="panel">
    <div class="panel__header">
      <div>
        <div class="panel__title">{{ t('previewTitle') }}</div>
        <div class="panel__subtitle">{{ t('previewHint') }}</div>
      </div>
      <n-flex :size="8" :wrap="true">
        <n-button size="small" data-testid="randomize-layer" @click="handleRandomizeLayer">
          <template #icon>
            <n-icon :component="ShuffleOutline" />
          </template>
          {{ t('randomizeLayer') }}
        </n-button>
        <n-button size="small" data-testid="randomize-all" @click="handleRandomizeAll">
          <template #icon>
            <n-icon :component="ShuffleOutline" />
          </template>
          {{ t('randomizeAll') }}
        </n-button>
      </n-flex>
    </div>
    <GradientPreview :background-image="backgroundImage" :blend-mode="blendMode" />
  </n-card>
</template>

<script setup lang="ts">
import { NButton, NCard, NFlex, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import ShuffleOutline from '@vicons/ionicons5/ShuffleOutline'
import GradientPreview from './GradientPreview.vue'

const { t } = useI18n()

defineProps<{
  backgroundImage: string
  blendMode?: string
}>()

const emit = defineEmits<{
  (event: 'randomize-layer'): void
  (event: 'randomize-all'): void
}>()

function handleRandomizeLayer() {
  emit('randomize-layer')
}

function handleRandomizeAll() {
  emit('randomize-all')
}
</script>

<i18n lang="json">
{
  "en": {
    "previewTitle": "Preview",
    "previewHint": "Live preview of the current gradient stack.",
    "randomizeLayer": "Randomize layer",
    "randomizeAll": "Randomize all layers"
  },
  "zh": {
    "previewTitle": "预览",
    "previewHint": "实时预览当前渐变叠层。",
    "randomizeLayer": "随机图层",
    "randomizeAll": "随机所有图层"
  },
  "zh-CN": {
    "previewTitle": "预览",
    "previewHint": "实时预览当前渐变叠层。",
    "randomizeLayer": "随机图层",
    "randomizeAll": "随机所有图层"
  },
  "zh-TW": {
    "previewTitle": "預覽",
    "previewHint": "即時預覽目前的漸層疊層。",
    "randomizeLayer": "隨機圖層",
    "randomizeAll": "隨機所有圖層"
  },
  "zh-HK": {
    "previewTitle": "預覽",
    "previewHint": "即時預覽目前的漸層疊層。",
    "randomizeLayer": "隨機圖層",
    "randomizeAll": "隨機所有圖層"
  },
  "es": {
    "previewTitle": "Vista previa",
    "previewHint": "Vista previa en tiempo real del conjunto de gradientes.",
    "randomizeLayer": "Aleatorizar capa",
    "randomizeAll": "Aleatorizar todas"
  },
  "fr": {
    "previewTitle": "Aperçu",
    "previewHint": "Aperçu en direct de l’empilement de dégradés.",
    "randomizeLayer": "Aléatoire (calque)",
    "randomizeAll": "Tout aléatoire"
  },
  "de": {
    "previewTitle": "Vorschau",
    "previewHint": "Live-Vorschau des aktuellen Verlaufsstapels.",
    "randomizeLayer": "Ebene zufällig",
    "randomizeAll": "Alle zufällig"
  },
  "it": {
    "previewTitle": "Anteprima",
    "previewHint": "Anteprima live dello stack di gradienti.",
    "randomizeLayer": "Casualizza livello",
    "randomizeAll": "Casualizza tutto"
  },
  "ja": {
    "previewTitle": "プレビュー",
    "previewHint": "現在のグラデーションスタックをリアルタイム表示します。",
    "randomizeLayer": "レイヤーをランダム化",
    "randomizeAll": "すべてをランダム化"
  },
  "ko": {
    "previewTitle": "미리보기",
    "previewHint": "현재 그라디언트 스택을 실시간으로 표시합니다.",
    "randomizeLayer": "레이어 랜덤",
    "randomizeAll": "전체 랜덤"
  },
  "ru": {
    "previewTitle": "Предпросмотр",
    "previewHint": "Живой предпросмотр текущего набора градиентов.",
    "randomizeLayer": "Случайный слой",
    "randomizeAll": "Случайно все"
  },
  "pt": {
    "previewTitle": "Prévia",
    "previewHint": "Prévia ao vivo da pilha de gradientes.",
    "randomizeLayer": "Aleatorizar camada",
    "randomizeAll": "Aleatorizar todas"
  },
  "ar": {
    "previewTitle": "المعاينة",
    "previewHint": "معاينة مباشرة لتكديس التدرجات الحالية.",
    "randomizeLayer": "عشوائي للطبقة",
    "randomizeAll": "عشوائي للجميع"
  },
  "hi": {
    "previewTitle": "पूर्वावलोकन",
    "previewHint": "वर्तमान ग्रेडिएंट स्टैक का लाइव पूर्वावलोकन।",
    "randomizeLayer": "परत यादृच्छिक",
    "randomizeAll": "सभी यादृच्छिक"
  },
  "tr": {
    "previewTitle": "Önizleme",
    "previewHint": "Geçerli gradyan yığınının canlı önizlemesi.",
    "randomizeLayer": "Katmanı rastgele",
    "randomizeAll": "Hepsini rastgele"
  },
  "nl": {
    "previewTitle": "Voorbeeld",
    "previewHint": "Live voorbeeld van de huidige gradient-stack.",
    "randomizeLayer": "Laag willekeurig",
    "randomizeAll": "Alles willekeurig"
  },
  "sv": {
    "previewTitle": "Förhandsvisning",
    "previewHint": "Liveförhandsvisning av gradientstapeln.",
    "randomizeLayer": "Slumpa lager",
    "randomizeAll": "Slumpa alla"
  },
  "pl": {
    "previewTitle": "Podgląd",
    "previewHint": "Podgląd na żywo aktualnego zestawu gradientów.",
    "randomizeLayer": "Losuj warstwę",
    "randomizeAll": "Losuj wszystko"
  },
  "vi": {
    "previewTitle": "Xem trước",
    "previewHint": "Xem trước trực tiếp lớp gradient hiện tại.",
    "randomizeLayer": "Ngẫu nhiên lớp",
    "randomizeAll": "Ngẫu nhiên tất cả"
  },
  "th": {
    "previewTitle": "ตัวอย่าง",
    "previewHint": "พรีวิวแบบเรียลไทม์ของสแตกไล่สีปัจจุบัน",
    "randomizeLayer": "สุ่มเลเยอร์",
    "randomizeAll": "สุ่มทั้งหมด"
  },
  "id": {
    "previewTitle": "Pratinjau",
    "previewHint": "Pratinjau langsung tumpukan gradien saat ini.",
    "randomizeLayer": "Acak lapisan",
    "randomizeAll": "Acak semua"
  },
  "he": {
    "previewTitle": "תצוגה מקדימה",
    "previewHint": "תצוגה מקדימה חיה של ערימת הגרדיאנטים הנוכחית.",
    "randomizeLayer": "אקראי לשכבה",
    "randomizeAll": "אקראי לכולן"
  },
  "ms": {
    "previewTitle": "Pratonton",
    "previewHint": "Pratonton langsung susunan gradien semasa.",
    "randomizeLayer": "Rawak lapisan",
    "randomizeAll": "Rawak semua"
  },
  "no": {
    "previewTitle": "Forhåndsvisning",
    "previewHint": "Live forhåndsvisning av gjeldende gradientstabel.",
    "randomizeLayer": "Tilfeldig lag",
    "randomizeAll": "Tilfeldig alle"
  }
}
</i18n>
