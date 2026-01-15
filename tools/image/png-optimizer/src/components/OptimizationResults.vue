<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>

    <n-flex vertical :size="24">
      <n-grid cols="1 700:3" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <n-statistic :value="compressionRatio" :label="t('reduction')">
            <template #suffix>%</template>
          </n-statistic>
        </n-grid-item>
        <n-grid-item>
          <n-statistic
            :value="filesize(originalFile.size - optimizedFile.size)"
            :label="t('spaceSaved')"
          >
          </n-statistic>
        </n-grid-item>
        <n-grid-item>
          <n-statistic :label="t('sizeCompare')">
            {{ filesize(optimizedFile.size) }} / {{ filesize(originalFile.size) }}
          </n-statistic>
        </n-grid-item>
      </n-grid>

      <!-- Download Button -->
      <n-flex justify="center" style="width: 100%">
        <n-button
          tag="a"
          type="primary"
          style="width: 100%"
          :href="downloadUrl ?? undefined"
          :download="props.originalFile.name"
          :disabled="!downloadUrl"
        >
          <template #icon>
            <n-icon :component="Download24Regular" />
          </template>
          {{ t('downloadOptimized') }}
        </n-button>
      </n-flex>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { NFlex, NGrid, NGridItem, NStatistic, NButton, NIcon } from 'naive-ui'
import { ArrowDownload24Regular as Download24Regular } from '@shared/icons/fluent'
import { filesize } from 'filesize'

const { t } = useI18n()

// Props
const props = defineProps<{
  originalFile: File
  optimizedFile: Blob
}>()

// Computed
const compressionRatio = computed(() => {
  const reduction =
    ((props.originalFile.size - props.optimizedFile.size) / props.originalFile.size) * 100
  return Math.max(0, Math.round(reduction))
})

const downloadUrl = useObjectUrl(computed(() => props.optimizedFile))
</script>

<i18n lang="json">
{
  "en": {
    "results": "Optimization Results",
    "reduction": "Size Reduction",
    "spaceSaved": "Space Saved",
    "sizeCompare": "File Size",
    "downloadOptimized": "Download Optimized Image"
  },
  "zh": {
    "results": "优化结果",
    "reduction": "大小减少",
    "spaceSaved": "节省空间",
    "sizeCompare": "文件大小",
    "downloadOptimized": "下载优化后的图片"
  },
  "zh-CN": {
    "results": "优化结果",
    "reduction": "大小减少",
    "spaceSaved": "节省空间",
    "sizeCompare": "文件大小",
    "downloadOptimized": "下载优化后的图片"
  },
  "zh-TW": {
    "results": "最佳化結果",
    "reduction": "大小減少",
    "spaceSaved": "節省空間",
    "sizeCompare": "檔案大小",
    "downloadOptimized": "下載最佳化後的圖片"
  },
  "zh-HK": {
    "results": "最佳化結果",
    "reduction": "大小減少",
    "spaceSaved": "節省空間",
    "sizeCompare": "檔案大小",
    "downloadOptimized": "下載最佳化後的圖片"
  },
  "es": {
    "results": "Resultados de Optimización",
    "reduction": "Reducción de Tamaño",
    "spaceSaved": "Espacio Ahorrado",
    "sizeCompare": "Tamaño del Archivo",
    "downloadOptimized": "Descargar Imagen Optimizada"
  },
  "fr": {
    "results": "Résultats d'Optimisation",
    "reduction": "Réduction de Taille",
    "spaceSaved": "Espace Économisé",
    "sizeCompare": "Taille du Fichier",
    "downloadOptimized": "Télécharger l'Image Optimisée"
  },
  "de": {
    "results": "Optimierungsergebnisse",
    "reduction": "Größenreduktion",
    "spaceSaved": "Gesparter Speicher",
    "sizeCompare": "Dateigröße",
    "downloadOptimized": "Optimiertes Bild Herunterladen"
  },
  "it": {
    "results": "Risultati Ottimizzazione",
    "reduction": "Riduzione Dimensione",
    "spaceSaved": "Spazio Risparmiato",
    "sizeCompare": "Dimensione File",
    "downloadOptimized": "Scarica Immagine Ottimizzata"
  },
  "ja": {
    "results": "最適化結果",
    "reduction": "サイズ削減",
    "spaceSaved": "節約容量",
    "sizeCompare": "ファイルサイズ",
    "downloadOptimized": "最適化画像をダウンロード"
  },
  "ko": {
    "results": "최적화 결과",
    "reduction": "크기 감소",
    "spaceSaved": "절약된 공간",
    "sizeCompare": "파일 크기",
    "downloadOptimized": "최적화된 이미지 다운로드"
  },
  "ru": {
    "results": "Результаты Оптимизации",
    "reduction": "Уменьшение Размера",
    "spaceSaved": "Сэкономлено Места",
    "sizeCompare": "Размер Файла",
    "downloadOptimized": "Скачать Оптимизированное Изображение"
  },
  "pt": {
    "results": "Resultados da Otimização",
    "reduction": "Redução de Tamanho",
    "spaceSaved": "Espaço Economizado",
    "sizeCompare": "Tamanho do Arquivo",
    "downloadOptimized": "Baixar Imagem Otimizada"
  },
  "ar": {
    "results": "نتائج التحسين",
    "reduction": "تقليل الحجم",
    "spaceSaved": "المساحة المحفوظة",
    "sizeCompare": "حجم الملف",
    "downloadOptimized": "تحميل الصورة المحسنة"
  },
  "hi": {
    "results": "अनुकूलन परिणाम",
    "reduction": "आकार कमी",
    "spaceSaved": "स्थान बचाया गया",
    "sizeCompare": "फ़ाइल का आकार",
    "downloadOptimized": "अनुकूलित छवि डाउनलोड करें"
  },
  "tr": {
    "results": "Optimizasyon Sonuçları",
    "reduction": "Boyut Azaltma",
    "spaceSaved": "Tasarruf Edilen Alan",
    "sizeCompare": "Dosya Boyutu",
    "downloadOptimized": "Optimize Edilmiş Resmi İndir"
  },
  "nl": {
    "results": "Optimalisatie Resultaten",
    "reduction": "Grootte Reductie",
    "spaceSaved": "Bespaard",
    "sizeCompare": "Bestandsgrootte",
    "downloadOptimized": "Download Geoptimaliseerde Afbeelding"
  },
  "sv": {
    "results": "Optimeringsresultat",
    "reduction": "Storleksminskning",
    "spaceSaved": "Sparat Utrymme",
    "sizeCompare": "Filstorlek",
    "downloadOptimized": "Ladda Ner Optimerad Bild"
  },
  "pl": {
    "results": "Wyniki Optymalizacji",
    "reduction": "Redukcja Rozmiaru",
    "spaceSaved": "Oszczędzona Przestrzeń",
    "sizeCompare": "Rozmiar Pliku",
    "downloadOptimized": "Pobierz Zoptymalizowany Obraz"
  },
  "vi": {
    "results": "Kết quả Tối ưu hóa",
    "reduction": "Giảm Kích thước",
    "spaceSaved": "Tiết kiệm Dung lượng",
    "sizeCompare": "Kích thước Tệp",
    "downloadOptimized": "Tải về Hình ảnh Đã tối ưu"
  },
  "th": {
    "results": "ผลลัพธ์การปรับปรุง",
    "reduction": "การลดขนาด",
    "spaceSaved": "พื้นที่ที่ประหยัด",
    "sizeCompare": "ขนาดไฟล์",
    "downloadOptimized": "ดาวน์โหลดภาพที่ปรับปรุงแล้ว"
  },
  "id": {
    "results": "Hasil Optimisasi",
    "reduction": "Pengurangan Ukuran",
    "spaceSaved": "Ruang Tersimpan",
    "sizeCompare": "Ukuran File",
    "downloadOptimized": "Unduh Gambar yang Dioptimalkan"
  },
  "he": {
    "results": "תוצאות אופטימיזציה",
    "reduction": "הקטנת גודל",
    "spaceSaved": "מקום שנחסך",
    "sizeCompare": "גודל קובץ",
    "downloadOptimized": "הורד תמונה מואצת"
  },
  "ms": {
    "results": "Hasil Pengoptimuman",
    "reduction": "Pengurangan Saiz",
    "spaceSaved": "Ruang Disimpan",
    "sizeCompare": "Saiz Fail",
    "downloadOptimized": "Muat Turun Imej yang Dioptimumkan"
  },
  "no": {
    "results": "Optimaliseringsresultater",
    "reduction": "Størrelsesreduksjon",
    "spaceSaved": "Plass Spart",
    "sizeCompare": "Filstørrelse",
    "downloadOptimized": "Last ned Optimalisert Bilde"
  }
}
</i18n>
