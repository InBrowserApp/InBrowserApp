<template>
  <slot :labels="labels" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'local' })
const labels = computed(() => ({
  optimizeLabel: t('optimizeLabel'),
  optimizeLevelLabel: t('optimizeLevelLabel'),
  optimizeHint: t('optimizeHint'),
}))
</script>

<i18n lang="json">
{
  "en": {
    "optimizeLabel": "Optimize with Oxipng",
    "optimizeLevelLabel": "Optimization level",
    "optimizeHint": "0 = fastest, 6 = smallest size."
  },
  "zh": {
    "optimizeLabel": "使用 Oxipng 优化",
    "optimizeLevelLabel": "优化级别",
    "optimizeHint": "0 最快，6 体积最小。"
  },
  "zh-CN": {
    "optimizeLabel": "使用 Oxipng 优化",
    "optimizeLevelLabel": "优化级别",
    "optimizeHint": "0 最快，6 体积最小。"
  },
  "zh-TW": {
    "optimizeLabel": "使用 Oxipng 最佳化",
    "optimizeLevelLabel": "最佳化級別",
    "optimizeHint": "0 最快，6 體積最小。"
  },
  "zh-HK": {
    "optimizeLabel": "使用 Oxipng 最佳化",
    "optimizeLevelLabel": "最佳化級別",
    "optimizeHint": "0 最快，6 體積最小。"
  },
  "es": {
    "optimizeLabel": "Optimizar con Oxipng",
    "optimizeLevelLabel": "Nivel de optimización",
    "optimizeHint": "0 = más rápido, 6 = tamaño más pequeño."
  },
  "fr": {
    "optimizeLabel": "Optimiser avec Oxipng",
    "optimizeLevelLabel": "Niveau d’optimisation",
    "optimizeHint": "0 = plus rapide, 6 = taille minimale."
  },
  "de": {
    "optimizeLabel": "Mit Oxipng optimieren",
    "optimizeLevelLabel": "Optimierungsstufe",
    "optimizeHint": "0 = am schnellsten, 6 = kleinste Größe."
  },
  "it": {
    "optimizeLabel": "Ottimizza con Oxipng",
    "optimizeLevelLabel": "Livello di ottimizzazione",
    "optimizeHint": "0 = più veloce, 6 = dimensione minore."
  },
  "ja": {
    "optimizeLabel": "Oxipngで最適化",
    "optimizeLevelLabel": "最適化レベル",
    "optimizeHint": "0 = 最速、6 = 最小サイズ。"
  },
  "ko": {
    "optimizeLabel": "Oxipng로 최적화",
    "optimizeLevelLabel": "최적화 수준",
    "optimizeHint": "0 = 가장 빠름, 6 = 가장 작은 크기."
  },
  "ru": {
    "optimizeLabel": "Оптимизировать с Oxipng",
    "optimizeLevelLabel": "Уровень оптимизации",
    "optimizeHint": "0 = быстрее всего, 6 = минимальный размер."
  },
  "pt": {
    "optimizeLabel": "Otimizar com Oxipng",
    "optimizeLevelLabel": "Nível de otimização",
    "optimizeHint": "0 = mais rápido, 6 = menor tamanho."
  },
  "ar": {
    "optimizeLabel": "تحسين باستخدام Oxipng",
    "optimizeLevelLabel": "مستوى التحسين",
    "optimizeHint": "0 = الأسرع، 6 = أصغر حجم."
  },
  "hi": {
    "optimizeLabel": "Oxipng से ऑप्टिमाइज़ करें",
    "optimizeLevelLabel": "ऑप्टिमाइज़ेशन स्तर",
    "optimizeHint": "0 = सबसे तेज, 6 = सबसे छोटा आकार।"
  },
  "tr": {
    "optimizeLabel": "Oxipng ile optimize et",
    "optimizeLevelLabel": "Optimizasyon seviyesi",
    "optimizeHint": "0 = en hızlı, 6 = en küçük boyut."
  },
  "nl": {
    "optimizeLabel": "Optimaliseer met Oxipng",
    "optimizeLevelLabel": "Optimalisatieniveau",
    "optimizeHint": "0 = snelst, 6 = kleinste grootte."
  },
  "sv": {
    "optimizeLabel": "Optimera med Oxipng",
    "optimizeLevelLabel": "Optimeringsnivå",
    "optimizeHint": "0 = snabbast, 6 = minsta storlek."
  },
  "pl": {
    "optimizeLabel": "Optymalizuj z Oxipng",
    "optimizeLevelLabel": "Poziom optymalizacji",
    "optimizeHint": "0 = najszybciej, 6 = najmniejszy rozmiar."
  },
  "vi": {
    "optimizeLabel": "Tối ưu với Oxipng",
    "optimizeLevelLabel": "Mức tối ưu",
    "optimizeHint": "0 = nhanh nhất, 6 = nhỏ nhất."
  },
  "th": {
    "optimizeLabel": "ปรับให้เหมาะสมด้วย Oxipng",
    "optimizeLevelLabel": "ระดับการปรับแต่ง",
    "optimizeHint": "0 = เร็วที่สุด, 6 = เล็กที่สุด"
  },
  "id": {
    "optimizeLabel": "Optimalkan dengan Oxipng",
    "optimizeLevelLabel": "Level optimasi",
    "optimizeHint": "0 = paling cepat, 6 = ukuran terkecil."
  },
  "he": {
    "optimizeLabel": "אופטימיזציה עם Oxipng",
    "optimizeLevelLabel": "רמת אופטימיזציה",
    "optimizeHint": "0 = הכי מהיר, 6 = הכי קטן."
  },
  "ms": {
    "optimizeLabel": "Optimumkan dengan Oxipng",
    "optimizeLevelLabel": "Tahap pengoptimuman",
    "optimizeHint": "0 = paling pantas, 6 = saiz paling kecil."
  },
  "no": {
    "optimizeLabel": "Optimaliser med Oxipng",
    "optimizeLevelLabel": "Optimaliseringsnivå",
    "optimizeHint": "0 = raskest, 6 = minst størrelse."
  }
}
</i18n>
