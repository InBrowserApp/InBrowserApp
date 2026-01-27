<template>
  <n-flex align="center" :size="12" style="margin-top: 12px">
    <n-button secondary @click="onReset">
      <template #icon>
        <n-icon><ResizeImage20Regular /></n-icon>
      </template>
      {{ t('resetSize') }}
    </n-button>
    <n-button type="primary" :loading="isConverting" :disabled="isConverting" @click="onConvert">
      <template #icon>
        <n-icon><ImageEdit24Regular /></n-icon>
      </template>
      {{ isConverting ? t('converting') : t('convert') }}
    </n-button>
  </n-flex>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NIcon } from 'naive-ui'
import ImageEdit24Regular from '@vicons/fluent/ImageEdit24Regular'
import ResizeImage20Regular from '@vicons/fluent/ResizeImage20Regular'

defineProps<{
  isConverting: boolean
  onReset: () => void
  onConvert: () => void
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "resetSize": "Use original size",
    "convert": "Convert",
    "converting": "Converting..."
  },
  "zh": {
    "resetSize": "使用原始尺寸",
    "convert": "转换",
    "converting": "转换中..."
  },
  "zh-CN": {
    "resetSize": "使用原始尺寸",
    "convert": "转换",
    "converting": "转换中..."
  },
  "zh-TW": {
    "resetSize": "使用原始尺寸",
    "convert": "轉換",
    "converting": "轉換中..."
  },
  "zh-HK": {
    "resetSize": "使用原始尺寸",
    "convert": "轉換",
    "converting": "轉換中..."
  },
  "es": {
    "resetSize": "Usar tamaño original",
    "convert": "Convertir",
    "converting": "Convirtiendo..."
  },
  "fr": {
    "resetSize": "Utiliser la taille d'origine",
    "convert": "Convertir",
    "converting": "Conversion..."
  },
  "de": {
    "resetSize": "Originalgröße verwenden",
    "convert": "Konvertieren",
    "converting": "Konvertieren..."
  },
  "it": {
    "resetSize": "Usa dimensione originale",
    "convert": "Converti",
    "converting": "Conversione..."
  },
  "ja": {
    "resetSize": "元のサイズを使用",
    "convert": "変換",
    "converting": "変換中..."
  },
  "ko": {
    "resetSize": "원본 크기 사용",
    "convert": "변환",
    "converting": "변환 중..."
  },
  "ru": {
    "resetSize": "Использовать исходный размер",
    "convert": "Конвертировать",
    "converting": "Конвертация..."
  },
  "pt": {
    "resetSize": "Usar tamanho original",
    "convert": "Converter",
    "converting": "Convertendo..."
  },
  "ar": {
    "resetSize": "استخدم الحجم الأصلي",
    "convert": "تحويل",
    "converting": "جارٍ التحويل..."
  },
  "hi": {
    "resetSize": "मूल आकार उपयोग करें",
    "convert": "परिवर्तित करें",
    "converting": "परिवर्तित किया जा रहा है..."
  },
  "tr": {
    "resetSize": "Orijinal boyutu kullan",
    "convert": "Dönüştür",
    "converting": "Dönüştürülüyor..."
  },
  "nl": {
    "resetSize": "Originele grootte gebruiken",
    "convert": "Converteren",
    "converting": "Converteren..."
  },
  "sv": {
    "resetSize": "Använd originalstorlek",
    "convert": "Konvertera",
    "converting": "Konverterar..."
  },
  "pl": {
    "resetSize": "Użyj oryginalnego rozmiaru",
    "convert": "Konwertuj",
    "converting": "Konwertowanie..."
  },
  "vi": {
    "resetSize": "Dùng kích thước gốc",
    "convert": "Chuyển đổi",
    "converting": "Đang chuyển đổi..."
  },
  "th": {
    "resetSize": "ใช้ขนาดเดิม",
    "convert": "แปลง",
    "converting": "กำลังแปลง..."
  },
  "id": {
    "resetSize": "Gunakan ukuran asli",
    "convert": "Konversi",
    "converting": "Mengonversi..."
  },
  "he": {
    "resetSize": "השתמש בגודל המקורי",
    "convert": "המר",
    "converting": "ממיר..."
  },
  "ms": {
    "resetSize": "Gunakan saiz asal",
    "convert": "Tukar",
    "converting": "Menukar..."
  },
  "no": {
    "resetSize": "Bruk original størrelse",
    "convert": "Konverter",
    "converting": "Konverterer..."
  }
}
</i18n>
