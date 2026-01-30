<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('optimizationOptions') }}</ToolSectionHeader>

    <n-flex vertical :size="16">
      <n-flex vertical :size="8">
        <n-text>{{ t('compressionLevel') }}: {{ options.level }}</n-text>
        <n-slider v-model:value="options.level" :min="0" :max="6" :step="1" :marks="sliderMarks" />
        <n-flex justify="space-between">
          <n-text depth="3" style="font-size: 12px">{{ t('faster') }}</n-text>
          <n-text depth="3" style="font-size: 12px">{{ t('smaller') }}</n-text>
        </n-flex>
      </n-flex>

      <n-flex :size="24">
        <n-checkbox v-model:checked="options.interlace">
          {{ t('interlacing') }}
        </n-checkbox>
        <n-checkbox v-model:checked="options.optimiseAlpha">
          {{ t('optimizeAlpha') }}
        </n-checkbox>
      </n-flex>

      <n-button :loading="isOptimizing" :disabled="isOptimizing" @click="handleOptimize">
        <template #icon>
          <n-icon><ResizeSmall20Regular /></n-icon>
        </template>
        {{ isOptimizing ? t('optimizing') : t('optimizeImage') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { NFlex, NText, NSlider, NCheckbox, NButton, NIcon } from 'naive-ui'
import type { OptimiseOptions } from '@jsquash/oxipng/meta'
import ResizeSmall20Regular from '@vicons/fluent/ResizeSmall20Regular'
// Props
defineProps<{
  isOptimizing: boolean
}>()

// Emits
const emit = defineEmits<{
  optimize: []
}>()

const options = defineModel<OptimiseOptions>('options', { required: true })

const { t } = useI18n()

// Slider marks
const sliderMarks = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
}

function handleOptimize() {
  emit('optimize')
}
</script>

<i18n lang="json">
{
  "en": {
    "optimizationOptions": "Optimization Options",
    "compressionLevel": "Compression Level",
    "faster": "Faster",
    "smaller": "Smaller",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "Optimize Alpha Channel",
    "optimizeImage": "Optimize Image",
    "optimizing": "Optimizing..."
  },
  "zh": {
    "optimizationOptions": "优化选项",
    "compressionLevel": "压缩级别",
    "faster": "更快",
    "smaller": "更小",
    "interlacing": "PNG 交错",
    "optimizeAlpha": "优化 Alpha 通道",
    "optimizeImage": "优化图片",
    "optimizing": "优化中..."
  },
  "zh-CN": {
    "optimizationOptions": "优化选项",
    "compressionLevel": "压缩级别",
    "faster": "更快",
    "smaller": "更小",
    "interlacing": "PNG 交错",
    "optimizeAlpha": "优化 Alpha 通道",
    "optimizeImage": "优化图片",
    "optimizing": "优化中..."
  },
  "zh-TW": {
    "optimizationOptions": "最佳化選項",
    "compressionLevel": "壓縮等級",
    "faster": "更快",
    "smaller": "更小",
    "interlacing": "PNG 交錯",
    "optimizeAlpha": "最佳化 Alpha 通道",
    "optimizeImage": "最佳化圖片",
    "optimizing": "最佳化中..."
  },
  "zh-HK": {
    "optimizationOptions": "最佳化選項",
    "compressionLevel": "壓縮等級",
    "faster": "更快",
    "smaller": "更小",
    "interlacing": "PNG 交錯",
    "optimizeAlpha": "最佳化 Alpha 通道",
    "optimizeImage": "最佳化圖片",
    "optimizing": "最佳化中..."
  },
  "es": {
    "optimizationOptions": "Opciones de Optimización",
    "compressionLevel": "Nivel de Compresión",
    "faster": "Más Rápido",
    "smaller": "Más Pequeño",
    "interlacing": "Entrelazado PNG",
    "optimizeAlpha": "Optimizar Canal Alpha",
    "optimizeImage": "Optimizar Imagen",
    "optimizing": "Optimizando..."
  },
  "fr": {
    "optimizationOptions": "Options d'Optimisation",
    "compressionLevel": "Niveau de Compression",
    "faster": "Plus Rapide",
    "smaller": "Plus Petit",
    "interlacing": "Entrelacement PNG",
    "optimizeAlpha": "Optimiser Canal Alpha",
    "optimizeImage": "Optimiser Image",
    "optimizing": "Optimisation..."
  },
  "de": {
    "optimizationOptions": "Optimierungsoptionen",
    "compressionLevel": "Komprimierungsgrad",
    "faster": "Schneller",
    "smaller": "Kleiner",
    "interlacing": "PNG-Interlacing",
    "optimizeAlpha": "Alpha-Kanal Optimieren",
    "optimizeImage": "Bild Optimieren",
    "optimizing": "Optimierung..."
  },
  "it": {
    "optimizationOptions": "Opzioni di Ottimizzazione",
    "compressionLevel": "Livello di Compressione",
    "faster": "Più Veloce",
    "smaller": "Più Piccolo",
    "interlacing": "Interlacciamento PNG",
    "optimizeAlpha": "Ottimizza Canale Alpha",
    "optimizeImage": "Ottimizza Immagine",
    "optimizing": "Ottimizzazione..."
  },
  "ja": {
    "optimizationOptions": "最適化オプション",
    "compressionLevel": "圧縮レベル",
    "faster": "高速",
    "smaller": "小サイズ",
    "interlacing": "PNG インターレース",
    "optimizeAlpha": "Alpha チャンネルを最適化",
    "optimizeImage": "画像を最適化",
    "optimizing": "最適化中..."
  },
  "ko": {
    "optimizationOptions": "최적화 옵션",
    "compressionLevel": "압축 레벨",
    "faster": "빠르게",
    "smaller": "작게",
    "interlacing": "PNG 인터레이싱",
    "optimizeAlpha": "Alpha 채널 최적화",
    "optimizeImage": "이미지 최적화",
    "optimizing": "최적화 중..."
  },
  "ru": {
    "optimizationOptions": "Параметры Оптимизации",
    "compressionLevel": "Уровень Сжатия",
    "faster": "Быстрее",
    "smaller": "Меньше",
    "interlacing": "PNG Интерлейсинг",
    "optimizeAlpha": "Оптимизировать Альфа-канал",
    "optimizeImage": "Оптимизировать Изображение",
    "optimizing": "Оптимизация..."
  },
  "pt": {
    "optimizationOptions": "Opções de Otimização",
    "compressionLevel": "Nível de Compressão",
    "faster": "Mais Rápido",
    "smaller": "Menor",
    "interlacing": "Entrelaçamento PNG",
    "optimizeAlpha": "Otimizar Canal Alpha",
    "optimizeImage": "Otimizar Imagem",
    "optimizing": "Otimizando..."
  },
  "ar": {
    "optimizationOptions": "خيارات التحسين",
    "compressionLevel": "مستوى الضغط",
    "faster": "أسرع",
    "smaller": "أصغر",
    "interlacing": "تشابك PNG",
    "optimizeAlpha": "تحسين قناة الألفا",
    "optimizeImage": "تحسين الصورة",
    "optimizing": "جاري التحسين..."
  },
  "hi": {
    "optimizationOptions": "अनुकूलन विकल्प",
    "compressionLevel": "संपीड़न स्तर",
    "faster": "तेज़",
    "smaller": "छोटा",
    "interlacing": "PNG इंटरलेसिंग",
    "optimizeAlpha": "Alpha चैनल अनुकूलित करें",
    "optimizeImage": "छवि अनुकूलित करें",
    "optimizing": "अनुकूलन चल रहा है..."
  },
  "tr": {
    "optimizationOptions": "Optimizasyon Seçenekleri",
    "compressionLevel": "Sıkıştırma Seviyesi",
    "faster": "Daha Hızlı",
    "smaller": "Daha Küçük",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "Alfa Kanalını Optimize Et",
    "optimizeImage": "Resmi Optimize Et",
    "optimizing": "Optimize Ediliyor..."
  },
  "nl": {
    "optimizationOptions": "Optimalisatie Opties",
    "compressionLevel": "Compressie Niveau",
    "faster": "Sneller",
    "smaller": "Kleiner",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "Alfa Kanaal Optimaliseren",
    "optimizeImage": "Afbeelding Optimaliseren",
    "optimizing": "Optimaliseren..."
  },
  "sv": {
    "optimizationOptions": "Optimeringsalternativ",
    "compressionLevel": "Komprimeringsnivå",
    "faster": "Snabbare",
    "smaller": "Mindre",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "Optimera Alfakanal",
    "optimizeImage": "Optimera Bild",
    "optimizing": "Optimerar..."
  },
  "pl": {
    "optimizationOptions": "Opcje Optymalizacji",
    "compressionLevel": "Poziom Kompresji",
    "faster": "Szybciej",
    "smaller": "Mniej",
    "interlacing": "Przeplot PNG",
    "optimizeAlpha": "Optymalizuj Kanał Alfa",
    "optimizeImage": "Optymalizuj Obraz",
    "optimizing": "Optymalizowanie..."
  },
  "vi": {
    "optimizationOptions": "Tùy chọn Tối ưu hóa",
    "compressionLevel": "Mức Nén",
    "faster": "Nhanh hơn",
    "smaller": "Nhỏ hơn",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "Tối ưu Kênh Alpha",
    "optimizeImage": "Tối ưu Hình ảnh",
    "optimizing": "Đang tối ưu..."
  },
  "th": {
    "optimizationOptions": "ตัวเลือกการปรับปรุง",
    "compressionLevel": "ระดับการบีบอัด",
    "faster": "เร็วขึ้น",
    "smaller": "เล็กลง",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "ปรับปรุงช่อง Alpha",
    "optimizeImage": "ปรับปรุงภาพ",
    "optimizing": "กำลังปรับปรุง..."
  },
  "id": {
    "optimizationOptions": "Opsi Optimasi",
    "compressionLevel": "Level Kompresi",
    "faster": "Lebih Cepat",
    "smaller": "Lebih Kecil",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "Optimalkan Saluran Alpha",
    "optimizeImage": "Optimalkan Gambar",
    "optimizing": "Mengoptimalkan..."
  },
  "he": {
    "optimizationOptions": "אפשרויות אופטימיזציה",
    "compressionLevel": "רמת דחיסה",
    "faster": "מהיר יותר",
    "smaller": "קטן יותר",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "אופטימיזצית ערוץ אלפא",
    "optimizeImage": "אופטימיזצית תמונה",
    "optimizing": "מבצע אופטימיזציה..."
  },
  "ms": {
    "optimizationOptions": "Pilihan Pengoptimuman",
    "compressionLevel": "Tahap Mampatan",
    "faster": "Lebih Pantas",
    "smaller": "Lebih Kecil",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "Optimumkan Saluran Alpha",
    "optimizeImage": "Optimumkan Imej",
    "optimizing": "Mengoptimumkan..."
  },
  "no": {
    "optimizationOptions": "Optimaliseringsalternativer",
    "compressionLevel": "Komprimeringsnivå",
    "faster": "Raskere",
    "smaller": "Mindre",
    "interlacing": "PNG Interlacing",
    "optimizeAlpha": "Optimaliser Alfa-kanal",
    "optimizeImage": "Optimaliser Bilde",
    "optimizing": "Optimaliserer..."
  }
}
</i18n>
