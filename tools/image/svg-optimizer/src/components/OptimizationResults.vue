<template>
  <ToolSection v-if="optimizedSvg">
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-grid :cols="3" :x-gap="16" :y-gap="16">
      <n-gi>
        <n-statistic :label="t('originalSize')" :value="formattedOriginalSize" />
      </n-gi>
      <n-gi>
        <n-statistic :label="t('optimizedSize')" :value="formattedOptimizedSize" />
      </n-gi>
      <n-gi>
        <n-statistic :label="t('saved')">
          <template #default>
            <n-text :type="savedPercent > 0 ? 'success' : 'default'">
              {{ savedPercent.toFixed(1) }}%
            </n-text>
          </template>
        </n-statistic>
      </n-gi>
    </n-grid>
    <n-space style="margin-top: 16px">
      <CopyToClipboardButton :value="optimizedSvg" :feedback="t('copied')" type="primary">
        {{ t('copy') }}
      </CopyToClipboardButton>
      <n-button
        tag="a"
        text
        :href="downloadUrl ?? undefined"
        :download="downloadName"
        :disabled="!downloadUrl"
      >
        <template #icon>
          <n-icon><ArrowDownload24Regular /></n-icon>
        </template>
        {{ t('download') }}
      </n-button>
    </n-space>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { NGrid, NGi, NStatistic, NSpace, NButton, NText, NIcon } from 'naive-ui'
import { ArrowDownload24Regular } from '@shared/icons/fluent'
import { filesize } from 'filesize'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'

const { t } = useI18n()

const props = defineProps<{
  originalSvg: string
  optimizedSvg: string
  fileName: string
}>()

const originalSize = computed(() => new Blob([props.originalSvg]).size)
const optimizedSize = computed(() => new Blob([props.optimizedSvg]).size)

const formattedOriginalSize = computed(() => filesize(originalSize.value) as string)
const formattedOptimizedSize = computed(() => filesize(optimizedSize.value) as string)

const savedPercent = computed(() => {
  if (originalSize.value === 0) return 0
  return ((originalSize.value - optimizedSize.value) / originalSize.value) * 100
})

const downloadBlob = computed(() => new Blob([props.optimizedSvg], { type: 'image/svg+xml' }))
const downloadUrl = useObjectUrl(downloadBlob)
const downloadName = computed(() => props.fileName.replace(/\.svg$/i, '') + '.optimized.svg')
</script>

<i18n lang="json">
{
  "en": {
    "title": "Optimization Results",
    "originalSize": "Original Size",
    "optimizedSize": "Optimized Size",
    "saved": "Space Saved",
    "copy": "Copy SVG",
    "copied": "SVG copied!",
    "download": "Download"
  },
  "zh": {
    "title": "优化结果",
    "originalSize": "原始大小",
    "optimizedSize": "优化后大小",
    "saved": "节省空间",
    "copy": "复制 SVG",
    "copied": "SVG 已复制！",
    "download": "下载"
  },
  "zh-CN": {
    "title": "优化结果",
    "originalSize": "原始大小",
    "optimizedSize": "优化后大小",
    "saved": "节省空间",
    "copy": "复制 SVG",
    "copied": "SVG 已复制！",
    "download": "下载"
  },
  "zh-TW": {
    "title": "優化結果",
    "originalSize": "原始大小",
    "optimizedSize": "優化後大小",
    "saved": "節省空間",
    "copy": "複製 SVG",
    "copied": "SVG 已複製！",
    "download": "下載"
  },
  "zh-HK": {
    "title": "優化結果",
    "originalSize": "原始大小",
    "optimizedSize": "優化後大小",
    "saved": "節省空間",
    "copy": "複製 SVG",
    "copied": "SVG 已複製！",
    "download": "下載"
  },
  "es": {
    "title": "Resultados de optimización",
    "originalSize": "Tamaño original",
    "optimizedSize": "Tamaño optimizado",
    "saved": "Espacio ahorrado",
    "copy": "Copiar SVG",
    "copied": "¡SVG copiado!",
    "download": "Descargar"
  },
  "fr": {
    "title": "Résultats d'optimisation",
    "originalSize": "Taille originale",
    "optimizedSize": "Taille optimisée",
    "saved": "Espace économisé",
    "copy": "Copier SVG",
    "copied": "SVG copié !",
    "download": "Télécharger"
  },
  "de": {
    "title": "Optimierungsergebnisse",
    "originalSize": "Originalgröße",
    "optimizedSize": "Optimierte Größe",
    "saved": "Eingesparter Platz",
    "copy": "SVG kopieren",
    "copied": "SVG kopiert!",
    "download": "Herunterladen"
  },
  "it": {
    "title": "Risultati dell'ottimizzazione",
    "originalSize": "Dimensione originale",
    "optimizedSize": "Dimensione ottimizzata",
    "saved": "Spazio risparmiato",
    "copy": "Copia SVG",
    "copied": "SVG copiato!",
    "download": "Scarica"
  },
  "ja": {
    "title": "最適化結果",
    "originalSize": "元のサイズ",
    "optimizedSize": "最適化後のサイズ",
    "saved": "節約されたスペース",
    "copy": "SVG をコピー",
    "copied": "SVG をコピーしました！",
    "download": "ダウンロード"
  },
  "ko": {
    "title": "최적화 결과",
    "originalSize": "원본 크기",
    "optimizedSize": "최적화된 크기",
    "saved": "절약된 공간",
    "copy": "SVG 복사",
    "copied": "SVG가 복사되었습니다!",
    "download": "다운로드"
  },
  "ru": {
    "title": "Результаты оптимизации",
    "originalSize": "Исходный размер",
    "optimizedSize": "Оптимизированный размер",
    "saved": "Сэкономлено места",
    "copy": "Скопировать SVG",
    "copied": "SVG скопирован!",
    "download": "Скачать"
  },
  "pt": {
    "title": "Resultados da otimização",
    "originalSize": "Tamanho original",
    "optimizedSize": "Tamanho otimizado",
    "saved": "Espaço economizado",
    "copy": "Copiar SVG",
    "copied": "SVG copiado!",
    "download": "Baixar"
  },
  "ar": {
    "title": "نتائج التحسين",
    "originalSize": "الحجم الأصلي",
    "optimizedSize": "الحجم المحسن",
    "saved": "المساحة الموفرة",
    "copy": "نسخ SVG",
    "copied": "تم نسخ SVG!",
    "download": "تحميل"
  },
  "hi": {
    "title": "अनुकूलन परिणाम",
    "originalSize": "मूल आकार",
    "optimizedSize": "अनुकूलित आकार",
    "saved": "बचाई गई जगह",
    "copy": "SVG कॉपी करें",
    "copied": "SVG कॉपी किया गया!",
    "download": "डाउनलोड"
  },
  "tr": {
    "title": "Optimizasyon Sonuçları",
    "originalSize": "Orijinal Boyut",
    "optimizedSize": "Optimize Edilmiş Boyut",
    "saved": "Kazanılan Alan",
    "copy": "SVG'yi Kopyala",
    "copied": "SVG kopyalandı!",
    "download": "İndir"
  },
  "nl": {
    "title": "Optimalisatieresultaten",
    "originalSize": "Originele grootte",
    "optimizedSize": "Geoptimaliseerde grootte",
    "saved": "Bespaarde ruimte",
    "copy": "SVG kopiëren",
    "copied": "SVG gekopieerd!",
    "download": "Downloaden"
  },
  "sv": {
    "title": "Optimeringsresultat",
    "originalSize": "Originalstorlek",
    "optimizedSize": "Optimerad storlek",
    "saved": "Sparat utrymme",
    "copy": "Kopiera SVG",
    "copied": "SVG kopierat!",
    "download": "Ladda ner"
  },
  "pl": {
    "title": "Wyniki optymalizacji",
    "originalSize": "Rozmiar oryginalny",
    "optimizedSize": "Rozmiar zoptymalizowany",
    "saved": "Zaoszczędzone miejsce",
    "copy": "Kopiuj SVG",
    "copied": "SVG skopiowano!",
    "download": "Pobierz"
  },
  "vi": {
    "title": "Kết quả tối ưu hóa",
    "originalSize": "Kích thước gốc",
    "optimizedSize": "Kích thước tối ưu",
    "saved": "Dung lượng tiết kiệm",
    "copy": "Sao chép SVG",
    "copied": "Đã sao chép SVG!",
    "download": "Tải xuống"
  },
  "th": {
    "title": "ผลลัพธ์การเพิ่มประสิทธิภาพ",
    "originalSize": "ขนาดต้นฉบับ",
    "optimizedSize": "ขนาดที่ปรับให้เหมาะสม",
    "saved": "พื้นที่ที่ประหยัด",
    "copy": "คัดลอก SVG",
    "copied": "คัดลอก SVG แล้ว!",
    "download": "ดาวน์โหลด"
  },
  "id": {
    "title": "Hasil Optimasi",
    "originalSize": "Ukuran Asli",
    "optimizedSize": "Ukuran Teroptimasi",
    "saved": "Ruang Tersimpan",
    "copy": "Salin SVG",
    "copied": "SVG disalin!",
    "download": "Unduh"
  },
  "he": {
    "title": "תוצאות אופטימיזציה",
    "originalSize": "גודל מקורי",
    "optimizedSize": "גודל מאופטם",
    "saved": "מקום שנחסך",
    "copy": "העתק SVG",
    "copied": "SVG הועתק!",
    "download": "הורד"
  },
  "ms": {
    "title": "Hasil Pengoptimuman",
    "originalSize": "Saiz Asal",
    "optimizedSize": "Saiz Dioptimumkan",
    "saved": "Ruang Disimpan",
    "copy": "Salin SVG",
    "copied": "SVG disalin!",
    "download": "Muat turun"
  },
  "no": {
    "title": "Optimeringsresultater",
    "originalSize": "Original størrelse",
    "optimizedSize": "Optimalisert størrelse",
    "saved": "Spart plass",
    "copy": "Kopier SVG",
    "copied": "SVG kopiert!",
    "download": "Last ned"
  }
}
</i18n>
