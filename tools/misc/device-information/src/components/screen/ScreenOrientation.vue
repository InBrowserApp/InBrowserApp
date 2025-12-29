<template>
  <InfoStatistic
    v-if="screenOrientation.isSupported && screenOrientation.orientation.value"
    :label="t('orientation')"
    :value="orientationValue"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useScreenOrientation } from '@vueuse/core'
import InfoStatistic from '../common/InfoStatistic.vue'

const { t } = useI18n()

const screenOrientation = useScreenOrientation()

const orientationValue = computed(() => {
  if (!screenOrientation.orientation.value) return undefined
  return (
    t('orientation-' + screenOrientation.orientation.value) + ` (${screenOrientation.angle.value}°)`
  )
})
</script>

<i18n lang="json">
{
  "en": {
    "orientation": "Orientation",
    "orientation-portrait-primary": "Portrait Primary",
    "orientation-portrait-secondary": "Portrait Secondary",
    "orientation-landscape-primary": "Landscape Primary",
    "orientation-landscape-secondary": "Landscape Secondary"
  },
  "zh": {
    "orientation": "屏幕方向",
    "orientation-portrait-primary": "竖屏主要",
    "orientation-portrait-secondary": "竖屏次要",
    "orientation-landscape-primary": "横屏主要",
    "orientation-landscape-secondary": "横屏次要"
  },
  "zh-CN": {
    "orientation": "屏幕方向",
    "orientation-portrait-primary": "竖屏主要",
    "orientation-portrait-secondary": "竖屏次要",
    "orientation-landscape-primary": "横屏主要",
    "orientation-landscape-secondary": "横屏次要"
  },
  "zh-TW": {
    "orientation": "螢幕方向",
    "orientation-portrait-primary": "直向主要",
    "orientation-portrait-secondary": "直向次要",
    "orientation-landscape-primary": "橫向主要",
    "orientation-landscape-secondary": "橫向次要"
  },
  "zh-HK": {
    "orientation": "螢幕方向",
    "orientation-portrait-primary": "直向主要",
    "orientation-portrait-secondary": "直向次要",
    "orientation-landscape-primary": "橫向主要",
    "orientation-landscape-secondary": "橫向次要"
  },
  "es": {
    "orientation": "Orientación",
    "orientation-portrait-primary": "Retrato principal",
    "orientation-portrait-secondary": "Retrato secundario",
    "orientation-landscape-primary": "Paisaje principal",
    "orientation-landscape-secondary": "Paisaje secundario"
  },
  "fr": {
    "orientation": "Orientation",
    "orientation-portrait-primary": "Portrait principal",
    "orientation-portrait-secondary": "Portrait secondaire",
    "orientation-landscape-primary": "Paysage principal",
    "orientation-landscape-secondary": "Paysage secondaire"
  },
  "de": {
    "orientation": "Ausrichtung",
    "orientation-portrait-primary": "Hochformat primär",
    "orientation-portrait-secondary": "Hochformat sekundär",
    "orientation-landscape-primary": "Querformat primär",
    "orientation-landscape-secondary": "Querformat sekundär"
  },
  "it": {
    "orientation": "Orientamento",
    "orientation-portrait-primary": "Ritratto principale",
    "orientation-portrait-secondary": "Ritratto secondario",
    "orientation-landscape-primary": "Paesaggio principale",
    "orientation-landscape-secondary": "Paesaggio secondario"
  },
  "ja": {
    "orientation": "画面の向き",
    "orientation-portrait-primary": "縦向き（メイン）",
    "orientation-portrait-secondary": "縦向き（サブ）",
    "orientation-landscape-primary": "横向き（メイン）",
    "orientation-landscape-secondary": "横向き（サブ）"
  },
  "ko": {
    "orientation": "화면 방향",
    "orientation-portrait-primary": "세로 기본",
    "orientation-portrait-secondary": "세로 보조",
    "orientation-landscape-primary": "가로 기본",
    "orientation-landscape-secondary": "가로 보조"
  },
  "ru": {
    "orientation": "Ориентация",
    "orientation-portrait-primary": "Портретная основная",
    "orientation-portrait-secondary": "Портретная вторичная",
    "orientation-landscape-primary": "Альбомная основная",
    "orientation-landscape-secondary": "Альбомная вторичная"
  },
  "pt": {
    "orientation": "Orientação",
    "orientation-portrait-primary": "Retrato principal",
    "orientation-portrait-secondary": "Retrato secundário",
    "orientation-landscape-primary": "Paisagem principal",
    "orientation-landscape-secondary": "Paisagem secundário"
  },
  "ar": {
    "orientation": "الاتجاه",
    "orientation-portrait-primary": "عمودي أساسي",
    "orientation-portrait-secondary": "عمودي ثانوي",
    "orientation-landscape-primary": "أفقي أساسي",
    "orientation-landscape-secondary": "أفقي ثانوي"
  },
  "hi": {
    "orientation": "ओरिएंटेशन",
    "orientation-portrait-primary": "पोर्ट्रेट प्राथमिक",
    "orientation-portrait-secondary": "पोर्ट्रेट द्वितीयक",
    "orientation-landscape-primary": "लैंडस्केप प्राथमिक",
    "orientation-landscape-secondary": "लैंडस्केप द्वितीयक"
  },
  "tr": {
    "orientation": "Yönlendirme",
    "orientation-portrait-primary": "Dikey Birincil",
    "orientation-portrait-secondary": "Dikey İkincil",
    "orientation-landscape-primary": "Yatay Birincil",
    "orientation-landscape-secondary": "Yatay İkincil"
  },
  "nl": {
    "orientation": "Oriëntatie",
    "orientation-portrait-primary": "Portret primair",
    "orientation-portrait-secondary": "Portret secundair",
    "orientation-landscape-primary": "Landschap primair",
    "orientation-landscape-secondary": "Landschap secundair"
  },
  "sv": {
    "orientation": "Orientering",
    "orientation-portrait-primary": "Stående primär",
    "orientation-portrait-secondary": "Stående sekundär",
    "orientation-landscape-primary": "Liggande primär",
    "orientation-landscape-secondary": "Liggande sekundär"
  },
  "pl": {
    "orientation": "Orientacja",
    "orientation-portrait-primary": "Pionowa główna",
    "orientation-portrait-secondary": "Pionowa drugorzędna",
    "orientation-landscape-primary": "Pozioma główna",
    "orientation-landscape-secondary": "Pozioma drugorzędna"
  },
  "vi": {
    "orientation": "Hướng màn hình",
    "orientation-portrait-primary": "Dọc chính",
    "orientation-portrait-secondary": "Dọc phụ",
    "orientation-landscape-primary": "Ngang chính",
    "orientation-landscape-secondary": "Ngang phụ"
  },
  "th": {
    "orientation": "การวางแนว",
    "orientation-portrait-primary": "แนวตั้งหลัก",
    "orientation-portrait-secondary": "แนวตั้งรอง",
    "orientation-landscape-primary": "แนวนอนหลัก",
    "orientation-landscape-secondary": "แนวนอนรอง"
  },
  "id": {
    "orientation": "Orientasi",
    "orientation-portrait-primary": "Potret Utama",
    "orientation-portrait-secondary": "Potret Sekunder",
    "orientation-landscape-primary": "Lanskap Utama",
    "orientation-landscape-secondary": "Lanskap Sekunder"
  },
  "he": {
    "orientation": "כיוון",
    "orientation-portrait-primary": "לאורך ראשי",
    "orientation-portrait-secondary": "לאורך משני",
    "orientation-landscape-primary": "לרוחב ראשי",
    "orientation-landscape-secondary": "לרוחב משני"
  },
  "ms": {
    "orientation": "Orientasi",
    "orientation-portrait-primary": "Potret Utama",
    "orientation-portrait-secondary": "Potret Sekunder",
    "orientation-landscape-primary": "Landskap Utama",
    "orientation-landscape-secondary": "Landskap Sekunder"
  },
  "no": {
    "orientation": "Orientering",
    "orientation-portrait-primary": "Stående primær",
    "orientation-portrait-secondary": "Stående sekundær",
    "orientation-landscape-primary": "Liggende primær",
    "orientation-landscape-secondary": "Liggende sekundær"
  }
}
</i18n>
