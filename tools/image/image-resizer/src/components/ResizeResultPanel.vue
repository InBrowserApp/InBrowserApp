<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>

    <n-grid cols="1 700:3" :x-gap="16" :y-gap="16">
      <n-grid-item>
        <n-statistic :label="t('originalSize')">
          {{ formattedOriginalSize }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="t('resizedSize')">
          {{ formattedResizedSize }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="t('sizeChange')"> {{ sizeChangePercent }}% </n-statistic>
      </n-grid-item>
    </n-grid>

    <n-grid cols="1 700:2" :x-gap="16" :y-gap="16" style="margin-top: 12px">
      <n-grid-item>
        <n-statistic :label="t('originalDimensions')">
          {{ originalDimensionLabel }}
        </n-statistic>
      </n-grid-item>
      <n-grid-item>
        <n-statistic :label="t('resizedDimensions')">
          {{ resizedDimensionLabel }}
        </n-statistic>
      </n-grid-item>
    </n-grid>

    <n-flex style="margin-top: 16px">
      <n-button
        tag="a"
        type="primary"
        :href="downloadUrl"
        :download="result.outputName"
        style="width: 100%"
      >
        <template #icon>
          <n-icon><ArrowDownload16Regular /></n-icon>
        </template>
        {{ t('downloadImage') }}
      </n-button>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { filesize } from 'filesize'
import { useI18n } from 'vue-i18n'
import { NButton, NFlex, NGrid, NGridItem, NIcon, NStatistic } from 'naive-ui'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { ResizeResult } from '../types'

interface Props {
  originalFile: File
  result: ResizeResult
  downloadUrl: string
}

const props = defineProps<Props>()
const { t } = useI18n({ useScope: 'local' })

const formattedOriginalSize = computed(() => filesize(props.originalFile.size) as string)
const formattedResizedSize = computed(() => filesize(props.result.blob.size) as string)

const sizeChangePercent = computed(() => {
  if (props.originalFile.size <= 0) return '0'
  const change =
    ((props.result.blob.size - props.originalFile.size) / props.originalFile.size) * 100
  return change.toFixed(1)
})

const originalDimensionLabel = computed(
  () => props.result.originalWidth + ' × ' + props.result.originalHeight,
)
const resizedDimensionLabel = computed(
  () => props.result.outputWidth + ' × ' + props.result.outputHeight,
)
</script>

<i18n lang="json">
{
  "en": {
    "title": "Resize Result",
    "originalSize": "Original size",
    "resizedSize": "Resized size",
    "sizeChange": "Size change",
    "originalDimensions": "Original dimensions",
    "resizedDimensions": "Resized dimensions",
    "downloadImage": "Download resized image"
  },
  "zh": {
    "title": "缩放结果",
    "originalSize": "原始大小",
    "resizedSize": "缩放后大小",
    "sizeChange": "体积变化",
    "originalDimensions": "原始尺寸",
    "resizedDimensions": "缩放后尺寸",
    "downloadImage": "下载缩放后的图片"
  },
  "zh-CN": {
    "title": "缩放结果",
    "originalSize": "原始大小",
    "resizedSize": "缩放后大小",
    "sizeChange": "体积变化",
    "originalDimensions": "原始尺寸",
    "resizedDimensions": "缩放后尺寸",
    "downloadImage": "下载缩放后的图片"
  },
  "zh-TW": {
    "title": "縮放結果",
    "originalSize": "原始大小",
    "resizedSize": "縮放後大小",
    "sizeChange": "體積變化",
    "originalDimensions": "原始尺寸",
    "resizedDimensions": "縮放後尺寸",
    "downloadImage": "下載縮放後圖片"
  },
  "zh-HK": {
    "title": "縮放結果",
    "originalSize": "原始大小",
    "resizedSize": "縮放後大小",
    "sizeChange": "體積變化",
    "originalDimensions": "原始尺寸",
    "resizedDimensions": "縮放後尺寸",
    "downloadImage": "下載縮放後圖片"
  },
  "es": {
    "title": "Resultado del escalado",
    "originalSize": "Tamaño original",
    "resizedSize": "Tamaño escalado",
    "sizeChange": "Cambio de tamaño",
    "originalDimensions": "Dimensiones originales",
    "resizedDimensions": "Dimensiones escaladas",
    "downloadImage": "Descargar imagen escalada"
  },
  "fr": {
    "title": "Résultat du redimensionnement",
    "originalSize": "Taille d’origine",
    "resizedSize": "Taille redimensionnée",
    "sizeChange": "Variation de taille",
    "originalDimensions": "Dimensions d’origine",
    "resizedDimensions": "Dimensions redimensionnées",
    "downloadImage": "Télécharger l’image redimensionnée"
  },
  "de": {
    "title": "Skalierungsergebnis",
    "originalSize": "Originalgröße",
    "resizedSize": "Skalierte Größe",
    "sizeChange": "Größenänderung",
    "originalDimensions": "Originalabmessungen",
    "resizedDimensions": "Skalierte Abmessungen",
    "downloadImage": "Skaliertes Bild herunterladen"
  },
  "it": {
    "title": "Risultato ridimensionamento",
    "originalSize": "Dimensione originale",
    "resizedSize": "Dimensione ridimensionata",
    "sizeChange": "Variazione dimensione",
    "originalDimensions": "Dimensioni originali",
    "resizedDimensions": "Dimensioni ridimensionate",
    "downloadImage": "Scarica immagine ridimensionata"
  },
  "ja": {
    "title": "リサイズ結果",
    "originalSize": "元のサイズ",
    "resizedSize": "リサイズ後のサイズ",
    "sizeChange": "サイズ変化",
    "originalDimensions": "元の解像度",
    "resizedDimensions": "リサイズ後の解像度",
    "downloadImage": "リサイズ画像をダウンロード"
  },
  "ko": {
    "title": "크기 조절 결과",
    "originalSize": "원본 크기",
    "resizedSize": "조절 후 크기",
    "sizeChange": "크기 변화",
    "originalDimensions": "원본 해상도",
    "resizedDimensions": "조절 후 해상도",
    "downloadImage": "조절된 이미지 다운로드"
  },
  "ru": {
    "title": "Результат масштабирования",
    "originalSize": "Исходный размер",
    "resizedSize": "Размер после масштабирования",
    "sizeChange": "Изменение размера",
    "originalDimensions": "Исходные размеры",
    "resizedDimensions": "Размеры после масштабирования",
    "downloadImage": "Скачать масштабированное изображение"
  },
  "pt": {
    "title": "Resultado do redimensionamento",
    "originalSize": "Tamanho original",
    "resizedSize": "Tamanho redimensionado",
    "sizeChange": "Variação de tamanho",
    "originalDimensions": "Dimensões originais",
    "resizedDimensions": "Dimensões redimensionadas",
    "downloadImage": "Baixar imagem redimensionada"
  },
  "ar": {
    "title": "نتيجة التحجيم",
    "originalSize": "الحجم الأصلي",
    "resizedSize": "الحجم بعد التحجيم",
    "sizeChange": "تغيّر الحجم",
    "originalDimensions": "الأبعاد الأصلية",
    "resizedDimensions": "الأبعاد بعد التحجيم",
    "downloadImage": "تنزيل الصورة بعد التحجيم"
  },
  "hi": {
    "title": "स्केलिंग परिणाम",
    "originalSize": "मूल आकार",
    "resizedSize": "स्केल किया हुआ आकार",
    "sizeChange": "आकार परिवर्तन",
    "originalDimensions": "मूल आयाम",
    "resizedDimensions": "स्केल किए हुए आयाम",
    "downloadImage": "स्केल की गई इमेज डाउनलोड करें"
  },
  "tr": {
    "title": "Ölçekleme sonucu",
    "originalSize": "Orijinal boyut",
    "resizedSize": "Ölçeklenmiş boyut",
    "sizeChange": "Boyut değişimi",
    "originalDimensions": "Orijinal çözünürlük",
    "resizedDimensions": "Ölçeklenmiş çözünürlük",
    "downloadImage": "Ölçeklenmiş görseli indir"
  },
  "nl": {
    "title": "Schaalresultaat",
    "originalSize": "Originele grootte",
    "resizedSize": "Geschaalde grootte",
    "sizeChange": "Grootteverandering",
    "originalDimensions": "Originele afmetingen",
    "resizedDimensions": "Geschaalde afmetingen",
    "downloadImage": "Geschaalde afbeelding downloaden"
  },
  "sv": {
    "title": "Skalningsresultat",
    "originalSize": "Originalstorlek",
    "resizedSize": "Skalad storlek",
    "sizeChange": "Storleksändring",
    "originalDimensions": "Originaldimensioner",
    "resizedDimensions": "Skalade dimensioner",
    "downloadImage": "Ladda ner skalad bild"
  },
  "pl": {
    "title": "Wynik skalowania",
    "originalSize": "Rozmiar oryginalny",
    "resizedSize": "Rozmiar po skalowaniu",
    "sizeChange": "Zmiana rozmiaru",
    "originalDimensions": "Wymiary oryginalne",
    "resizedDimensions": "Wymiary po skalowaniu",
    "downloadImage": "Pobierz przeskalowany obraz"
  },
  "vi": {
    "title": "Kết quả thu phóng",
    "originalSize": "Kích thước gốc",
    "resizedSize": "Kích thước sau thu phóng",
    "sizeChange": "Thay đổi kích thước",
    "originalDimensions": "Kích thước gốc",
    "resizedDimensions": "Kích thước sau thu phóng",
    "downloadImage": "Tải ảnh sau thu phóng"
  },
  "th": {
    "title": "ผลลัพธ์การปรับขนาด",
    "originalSize": "ขนาดเดิม",
    "resizedSize": "ขนาดหลังปรับ",
    "sizeChange": "การเปลี่ยนแปลงขนาด",
    "originalDimensions": "มิติเดิม",
    "resizedDimensions": "มิติหลังปรับ",
    "downloadImage": "ดาวน์โหลดรูปภาพที่ปรับแล้ว"
  },
  "id": {
    "title": "Hasil penskalaan",
    "originalSize": "Ukuran asli",
    "resizedSize": "Ukuran setelah skala",
    "sizeChange": "Perubahan ukuran",
    "originalDimensions": "Dimensi asli",
    "resizedDimensions": "Dimensi setelah skala",
    "downloadImage": "Unduh gambar yang sudah diskalakan"
  },
  "he": {
    "title": "תוצאת שינוי הגודל",
    "originalSize": "גודל מקורי",
    "resizedSize": "גודל לאחר שינוי",
    "sizeChange": "שינוי בנפח",
    "originalDimensions": "ממדים מקוריים",
    "resizedDimensions": "ממדים לאחר שינוי",
    "downloadImage": "הורדת התמונה לאחר שינוי גודל"
  },
  "ms": {
    "title": "Hasil penskalaan",
    "originalSize": "Saiz asal",
    "resizedSize": "Saiz selepas skala",
    "sizeChange": "Perubahan saiz",
    "originalDimensions": "Dimensi asal",
    "resizedDimensions": "Dimensi selepas skala",
    "downloadImage": "Muat turun imej yang diskalakan"
  },
  "no": {
    "title": "Skaleringsresultat",
    "originalSize": "Original størrelse",
    "resizedSize": "Skalert størrelse",
    "sizeChange": "Størrelsesendring",
    "originalDimensions": "Originale dimensjoner",
    "resizedDimensions": "Skalerte dimensjoner",
    "downloadImage": "Last ned skalert bilde"
  }
}
</i18n>
