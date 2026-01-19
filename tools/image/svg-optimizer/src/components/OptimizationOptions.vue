<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('title') }}</ToolSectionHeader>
    <n-grid cols="1 s:2 m:3" responsive="screen" :x-gap="16" :y-gap="12">
      <n-gi>
        <n-checkbox v-model:checked="options.multipass">
          {{ t('multipass') }}
        </n-checkbox>
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="options.removeComments">
          {{ t('removeComments') }}
        </n-checkbox>
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="options.removeMetadata">
          {{ t('removeMetadata') }}
        </n-checkbox>
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="options.cleanupIds">
          {{ t('cleanupIds') }}
        </n-checkbox>
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="options.convertColors">
          {{ t('convertColors') }}
        </n-checkbox>
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="options.removeDimensions">
          {{ t('removeDimensions') }}
        </n-checkbox>
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="options.inlineStyles">
          {{ t('inlineStyles') }}
        </n-checkbox>
      </n-gi>
    </n-grid>
    <n-spin v-if="isOptimizing" size="small" style="margin-top: 16px" />
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NGrid, NGi, NCheckbox, NSpin } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'

export interface OptimizationOptionsType {
  multipass: boolean
  removeComments: boolean
  removeMetadata: boolean
  cleanupIds: boolean
  convertColors: boolean
  removeDimensions: boolean
  inlineStyles: boolean
}

const { t } = useI18n()

const options = defineModel<OptimizationOptionsType>('options', {
  default: () => ({
    multipass: true,
    removeComments: true,
    removeMetadata: true,
    cleanupIds: true,
    convertColors: true,
    removeDimensions: false,
    inlineStyles: false,
  }),
})

defineProps<{
  isOptimizing: boolean
}>()
</script>

<i18n lang="json">
{
  "en": {
    "title": "Optimization Options",
    "multipass": "Multipass",
    "removeComments": "Remove comments",
    "removeMetadata": "Remove metadata",
    "cleanupIds": "Cleanup IDs",
    "convertColors": "Convert colors",
    "removeDimensions": "Remove dimensions",
    "inlineStyles": "Inline styles"
  },
  "zh": {
    "title": "优化选项",
    "multipass": "多轮优化",
    "removeComments": "移除注释",
    "removeMetadata": "移除元数据",
    "cleanupIds": "清理 ID",
    "convertColors": "转换颜色",
    "removeDimensions": "移除尺寸",
    "inlineStyles": "内联样式"
  },
  "zh-CN": {
    "title": "优化选项",
    "multipass": "多轮优化",
    "removeComments": "移除注释",
    "removeMetadata": "移除元数据",
    "cleanupIds": "清理 ID",
    "convertColors": "转换颜色",
    "removeDimensions": "移除尺寸",
    "inlineStyles": "内联样式"
  },
  "zh-TW": {
    "title": "優化選項",
    "multipass": "多輪優化",
    "removeComments": "移除註解",
    "removeMetadata": "移除元資料",
    "cleanupIds": "清理 ID",
    "convertColors": "轉換顏色",
    "removeDimensions": "移除尺寸",
    "inlineStyles": "內聯樣式"
  },
  "zh-HK": {
    "title": "優化選項",
    "multipass": "多輪優化",
    "removeComments": "移除註解",
    "removeMetadata": "移除元資料",
    "cleanupIds": "清理 ID",
    "convertColors": "轉換顏色",
    "removeDimensions": "移除尺寸",
    "inlineStyles": "內聯樣式"
  },
  "es": {
    "title": "Opciones de optimización",
    "multipass": "Múltiples pasadas",
    "removeComments": "Eliminar comentarios",
    "removeMetadata": "Eliminar metadatos",
    "cleanupIds": "Limpiar IDs",
    "convertColors": "Convertir colores",
    "removeDimensions": "Eliminar dimensiones",
    "inlineStyles": "Estilos en línea"
  },
  "fr": {
    "title": "Options d'optimisation",
    "multipass": "Multipass",
    "removeComments": "Supprimer les commentaires",
    "removeMetadata": "Supprimer les métadonnées",
    "cleanupIds": "Nettoyer les IDs",
    "convertColors": "Convertir les couleurs",
    "removeDimensions": "Supprimer les dimensions",
    "inlineStyles": "Styles en ligne"
  },
  "de": {
    "title": "Optimierungsoptionen",
    "multipass": "Multipass",
    "removeComments": "Kommentare entfernen",
    "removeMetadata": "Metadaten entfernen",
    "cleanupIds": "IDs bereinigen",
    "convertColors": "Farben konvertieren",
    "removeDimensions": "Dimensionen entfernen",
    "inlineStyles": "Inline-Stile"
  },
  "it": {
    "title": "Opzioni di ottimizzazione",
    "multipass": "Multipass",
    "removeComments": "Rimuovi commenti",
    "removeMetadata": "Rimuovi metadati",
    "cleanupIds": "Pulisci ID",
    "convertColors": "Converti colori",
    "removeDimensions": "Rimuovi dimensioni",
    "inlineStyles": "Stili inline"
  },
  "ja": {
    "title": "最適化オプション",
    "multipass": "マルチパス",
    "removeComments": "コメントを削除",
    "removeMetadata": "メタデータを削除",
    "cleanupIds": "ID をクリーンアップ",
    "convertColors": "色を変換",
    "removeDimensions": "寸法を削除",
    "inlineStyles": "インラインスタイル"
  },
  "ko": {
    "title": "최적화 옵션",
    "multipass": "멀티패스",
    "removeComments": "주석 제거",
    "removeMetadata": "메타데이터 제거",
    "cleanupIds": "ID 정리",
    "convertColors": "색상 변환",
    "removeDimensions": "치수 제거",
    "inlineStyles": "인라인 스타일"
  },
  "ru": {
    "title": "Параметры оптимизации",
    "multipass": "Мультипасс",
    "removeComments": "Удалить комментарии",
    "removeMetadata": "Удалить метаданные",
    "cleanupIds": "Очистить ID",
    "convertColors": "Преобразовать цвета",
    "removeDimensions": "Удалить размеры",
    "inlineStyles": "Встроенные стили"
  },
  "pt": {
    "title": "Opções de otimização",
    "multipass": "Multipass",
    "removeComments": "Remover comentários",
    "removeMetadata": "Remover metadados",
    "cleanupIds": "Limpar IDs",
    "convertColors": "Converter cores",
    "removeDimensions": "Remover dimensões",
    "inlineStyles": "Estilos inline"
  },
  "ar": {
    "title": "خيارات التحسين",
    "multipass": "تمريرات متعددة",
    "removeComments": "إزالة التعليقات",
    "removeMetadata": "إزالة البيانات الوصفية",
    "cleanupIds": "تنظيف المعرفات",
    "convertColors": "تحويل الألوان",
    "removeDimensions": "إزالة الأبعاد",
    "inlineStyles": "أنماط مضمنة"
  },
  "hi": {
    "title": "अनुकूलन विकल्प",
    "multipass": "मल्टीपास",
    "removeComments": "टिप्पणियां हटाएं",
    "removeMetadata": "मेटाडेटा हटाएं",
    "cleanupIds": "ID साफ करें",
    "convertColors": "रंग बदलें",
    "removeDimensions": "आयाम हटाएं",
    "inlineStyles": "इनलाइन स्टाइल"
  },
  "tr": {
    "title": "Optimizasyon Seçenekleri",
    "multipass": "Çoklu geçiş",
    "removeComments": "Yorumları kaldır",
    "removeMetadata": "Meta verileri kaldır",
    "cleanupIds": "ID'leri temizle",
    "convertColors": "Renkleri dönüştür",
    "removeDimensions": "Boyutları kaldır",
    "inlineStyles": "Satır içi stiller"
  },
  "nl": {
    "title": "Optimalisatie-opties",
    "multipass": "Multipass",
    "removeComments": "Opmerkingen verwijderen",
    "removeMetadata": "Metadata verwijderen",
    "cleanupIds": "ID's opschonen",
    "convertColors": "Kleuren converteren",
    "removeDimensions": "Afmetingen verwijderen",
    "inlineStyles": "Inline stijlen"
  },
  "sv": {
    "title": "Optimeringsalternativ",
    "multipass": "Multipass",
    "removeComments": "Ta bort kommentarer",
    "removeMetadata": "Ta bort metadata",
    "cleanupIds": "Rensa ID:n",
    "convertColors": "Konvertera färger",
    "removeDimensions": "Ta bort dimensioner",
    "inlineStyles": "Inline-stilar"
  },
  "pl": {
    "title": "Opcje optymalizacji",
    "multipass": "Wielokrotne przebiegi",
    "removeComments": "Usuń komentarze",
    "removeMetadata": "Usuń metadane",
    "cleanupIds": "Wyczyść ID",
    "convertColors": "Konwertuj kolory",
    "removeDimensions": "Usuń wymiary",
    "inlineStyles": "Style wbudowane"
  },
  "vi": {
    "title": "Tùy chọn tối ưu hóa",
    "multipass": "Đa lượt",
    "removeComments": "Xóa bình luận",
    "removeMetadata": "Xóa siêu dữ liệu",
    "cleanupIds": "Dọn dẹp ID",
    "convertColors": "Chuyển đổi màu sắc",
    "removeDimensions": "Xóa kích thước",
    "inlineStyles": "Kiểu nội tuyến"
  },
  "th": {
    "title": "ตัวเลือกการเพิ่มประสิทธิภาพ",
    "multipass": "หลายรอบ",
    "removeComments": "ลบความคิดเห็น",
    "removeMetadata": "ลบเมตาดาต้า",
    "cleanupIds": "ล้าง ID",
    "convertColors": "แปลงสี",
    "removeDimensions": "ลบขนาด",
    "inlineStyles": "สไตล์อินไลน์"
  },
  "id": {
    "title": "Opsi Optimasi",
    "multipass": "Multipass",
    "removeComments": "Hapus komentar",
    "removeMetadata": "Hapus metadata",
    "cleanupIds": "Bersihkan ID",
    "convertColors": "Konversi warna",
    "removeDimensions": "Hapus dimensi",
    "inlineStyles": "Gaya inline"
  },
  "he": {
    "title": "אפשרויות אופטימיזציה",
    "multipass": "ריבוי מעברים",
    "removeComments": "הסר הערות",
    "removeMetadata": "הסר מטא-נתונים",
    "cleanupIds": "נקה מזהים",
    "convertColors": "המר צבעים",
    "removeDimensions": "הסר מימדים",
    "inlineStyles": "סגנונות מוטמעים"
  },
  "ms": {
    "title": "Pilihan Pengoptimuman",
    "multipass": "Berbilang laluan",
    "removeComments": "Alih keluar komen",
    "removeMetadata": "Alih keluar metadata",
    "cleanupIds": "Bersihkan ID",
    "convertColors": "Tukar warna",
    "removeDimensions": "Alih keluar dimensi",
    "inlineStyles": "Gaya sebaris"
  },
  "no": {
    "title": "Optimeringsalternativer",
    "multipass": "Multipass",
    "removeComments": "Fjern kommentarer",
    "removeMetadata": "Fjern metadata",
    "cleanupIds": "Rydd opp ID-er",
    "convertColors": "Konverter farger",
    "removeDimensions": "Fjern dimensjoner",
    "inlineStyles": "Innebygde stiler"
  }
}
</i18n>
