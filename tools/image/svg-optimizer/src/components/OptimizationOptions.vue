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
    "multipassHint": "(Multiple optimization passes)",
    "removeComments": "Remove comments",
    "removeMetadata": "Remove metadata",
    "cleanupIds": "Cleanup IDs",
    "convertColors": "Convert colors",
    "removeDimensions": "Remove dimensions",
    "removeDimensionsHint": "(Keep viewBox only)",
    "inlineStyles": "Inline styles",
    "inlineStylesHint": "(May break media queries)",
    "optimize": "Optimize SVG"
  },
  "zh": {
    "title": "优化选项",
    "multipass": "多轮优化",
    "multipassHint": "（多次优化传递）",
    "removeComments": "移除注释",
    "removeMetadata": "移除元数据",
    "cleanupIds": "清理 ID",
    "convertColors": "转换颜色",
    "removeDimensions": "移除尺寸",
    "removeDimensionsHint": "（仅保留 viewBox）",
    "inlineStyles": "内联样式",
    "inlineStylesHint": "（可能破坏媒体查询）",
    "optimize": "优化 SVG"
  },
  "zh-CN": {
    "title": "优化选项",
    "multipass": "多轮优化",
    "multipassHint": "（多次优化传递）",
    "removeComments": "移除注释",
    "removeMetadata": "移除元数据",
    "cleanupIds": "清理 ID",
    "convertColors": "转换颜色",
    "removeDimensions": "移除尺寸",
    "removeDimensionsHint": "（仅保留 viewBox）",
    "inlineStyles": "内联样式",
    "inlineStylesHint": "（可能破坏媒体查询）",
    "optimize": "优化 SVG"
  },
  "zh-TW": {
    "title": "優化選項",
    "multipass": "多輪優化",
    "multipassHint": "（多次優化傳遞）",
    "removeComments": "移除註解",
    "removeMetadata": "移除元資料",
    "cleanupIds": "清理 ID",
    "convertColors": "轉換顏色",
    "removeDimensions": "移除尺寸",
    "removeDimensionsHint": "（僅保留 viewBox）",
    "inlineStyles": "內聯樣式",
    "inlineStylesHint": "（可能破壞媒體查詢）",
    "optimize": "優化 SVG"
  },
  "zh-HK": {
    "title": "優化選項",
    "multipass": "多輪優化",
    "multipassHint": "（多次優化傳遞）",
    "removeComments": "移除註解",
    "removeMetadata": "移除元資料",
    "cleanupIds": "清理 ID",
    "convertColors": "轉換顏色",
    "removeDimensions": "移除尺寸",
    "removeDimensionsHint": "（僅保留 viewBox）",
    "inlineStyles": "內聯樣式",
    "inlineStylesHint": "（可能破壞媒體查詢）",
    "optimize": "優化 SVG"
  },
  "es": {
    "title": "Opciones de optimización",
    "multipass": "Múltiples pasadas",
    "multipassHint": "(Múltiples pasadas de optimización)",
    "removeComments": "Eliminar comentarios",
    "removeMetadata": "Eliminar metadatos",
    "cleanupIds": "Limpiar IDs",
    "convertColors": "Convertir colores",
    "removeDimensions": "Eliminar dimensiones",
    "removeDimensionsHint": "(Mantener solo viewBox)",
    "inlineStyles": "Estilos en línea",
    "inlineStylesHint": "(Puede romper media queries)",
    "optimize": "Optimizar SVG"
  },
  "fr": {
    "title": "Options d'optimisation",
    "multipass": "Multipass",
    "multipassHint": "(Plusieurs passes d'optimisation)",
    "removeComments": "Supprimer les commentaires",
    "removeMetadata": "Supprimer les métadonnées",
    "cleanupIds": "Nettoyer les IDs",
    "convertColors": "Convertir les couleurs",
    "removeDimensions": "Supprimer les dimensions",
    "removeDimensionsHint": "(Garder uniquement viewBox)",
    "inlineStyles": "Styles en ligne",
    "inlineStylesHint": "(Peut casser les media queries)",
    "optimize": "Optimiser SVG"
  },
  "de": {
    "title": "Optimierungsoptionen",
    "multipass": "Multipass",
    "multipassHint": "(Mehrere Optimierungsdurchläufe)",
    "removeComments": "Kommentare entfernen",
    "removeMetadata": "Metadaten entfernen",
    "cleanupIds": "IDs bereinigen",
    "convertColors": "Farben konvertieren",
    "removeDimensions": "Dimensionen entfernen",
    "removeDimensionsHint": "(Nur viewBox behalten)",
    "inlineStyles": "Inline-Stile",
    "inlineStylesHint": "(Kann Media Queries beschädigen)",
    "optimize": "SVG optimieren"
  },
  "it": {
    "title": "Opzioni di ottimizzazione",
    "multipass": "Multipass",
    "multipassHint": "(Passaggi multipli di ottimizzazione)",
    "removeComments": "Rimuovi commenti",
    "removeMetadata": "Rimuovi metadati",
    "cleanupIds": "Pulisci ID",
    "convertColors": "Converti colori",
    "removeDimensions": "Rimuovi dimensioni",
    "removeDimensionsHint": "(Mantieni solo viewBox)",
    "inlineStyles": "Stili inline",
    "inlineStylesHint": "(Potrebbe rompere le media query)",
    "optimize": "Ottimizza SVG"
  },
  "ja": {
    "title": "最適化オプション",
    "multipass": "マルチパス",
    "multipassHint": "（複数回の最適化パス）",
    "removeComments": "コメントを削除",
    "removeMetadata": "メタデータを削除",
    "cleanupIds": "ID をクリーンアップ",
    "convertColors": "色を変換",
    "removeDimensions": "寸法を削除",
    "removeDimensionsHint": "（viewBox のみ保持）",
    "inlineStyles": "インラインスタイル",
    "inlineStylesHint": "（メディアクエリが壊れる可能性があります）",
    "optimize": "SVG を最適化"
  },
  "ko": {
    "title": "최적화 옵션",
    "multipass": "멀티패스",
    "multipassHint": "(여러 번의 최적화 패스)",
    "removeComments": "주석 제거",
    "removeMetadata": "메타데이터 제거",
    "cleanupIds": "ID 정리",
    "convertColors": "색상 변환",
    "removeDimensions": "치수 제거",
    "removeDimensionsHint": "(viewBox만 유지)",
    "inlineStyles": "인라인 스타일",
    "inlineStylesHint": "(미디어 쿼리가 손상될 수 있음)",
    "optimize": "SVG 최적화"
  },
  "ru": {
    "title": "Параметры оптимизации",
    "multipass": "Мультипасс",
    "multipassHint": "(Несколько проходов оптимизации)",
    "removeComments": "Удалить комментарии",
    "removeMetadata": "Удалить метаданные",
    "cleanupIds": "Очистить ID",
    "convertColors": "Преобразовать цвета",
    "removeDimensions": "Удалить размеры",
    "removeDimensionsHint": "(Оставить только viewBox)",
    "inlineStyles": "Встроенные стили",
    "inlineStylesHint": "(Может сломать медиа-запросы)",
    "optimize": "Оптимизировать SVG"
  },
  "pt": {
    "title": "Opções de otimização",
    "multipass": "Multipass",
    "multipassHint": "(Múltiplas passadas de otimização)",
    "removeComments": "Remover comentários",
    "removeMetadata": "Remover metadados",
    "cleanupIds": "Limpar IDs",
    "convertColors": "Converter cores",
    "removeDimensions": "Remover dimensões",
    "removeDimensionsHint": "(Manter apenas viewBox)",
    "inlineStyles": "Estilos inline",
    "inlineStylesHint": "(Pode quebrar media queries)",
    "optimize": "Otimizar SVG"
  },
  "ar": {
    "title": "خيارات التحسين",
    "multipass": "تمريرات متعددة",
    "multipassHint": "(تمريرات تحسين متعددة)",
    "removeComments": "إزالة التعليقات",
    "removeMetadata": "إزالة البيانات الوصفية",
    "cleanupIds": "تنظيف المعرفات",
    "convertColors": "تحويل الألوان",
    "removeDimensions": "إزالة الأبعاد",
    "removeDimensionsHint": "(الاحتفاظ بـ viewBox فقط)",
    "inlineStyles": "أنماط مضمنة",
    "inlineStylesHint": "(قد يكسر استعلامات الوسائط)",
    "optimize": "تحسين SVG"
  },
  "hi": {
    "title": "अनुकूलन विकल्प",
    "multipass": "मल्टीपास",
    "multipassHint": "(एकाधिक अनुकूलन पास)",
    "removeComments": "टिप्पणियां हटाएं",
    "removeMetadata": "मेटाडेटा हटाएं",
    "cleanupIds": "ID साफ करें",
    "convertColors": "रंग बदलें",
    "removeDimensions": "आयाम हटाएं",
    "removeDimensionsHint": "(केवल viewBox रखें)",
    "inlineStyles": "इनलाइन स्टाइल",
    "inlineStylesHint": "(मीडिया क्वेरी तोड़ सकता है)",
    "optimize": "SVG अनुकूलित करें"
  },
  "tr": {
    "title": "Optimizasyon Seçenekleri",
    "multipass": "Çoklu geçiş",
    "multipassHint": "(Birden fazla optimizasyon geçişi)",
    "removeComments": "Yorumları kaldır",
    "removeMetadata": "Meta verileri kaldır",
    "cleanupIds": "ID'leri temizle",
    "convertColors": "Renkleri dönüştür",
    "removeDimensions": "Boyutları kaldır",
    "removeDimensionsHint": "(Yalnızca viewBox'ı koru)",
    "inlineStyles": "Satır içi stiller",
    "inlineStylesHint": "(Medya sorgularını bozabilir)",
    "optimize": "SVG'yi Optimize Et"
  },
  "nl": {
    "title": "Optimalisatie-opties",
    "multipass": "Multipass",
    "multipassHint": "(Meerdere optimalisatiepasses)",
    "removeComments": "Opmerkingen verwijderen",
    "removeMetadata": "Metadata verwijderen",
    "cleanupIds": "ID's opschonen",
    "convertColors": "Kleuren converteren",
    "removeDimensions": "Afmetingen verwijderen",
    "removeDimensionsHint": "(Alleen viewBox behouden)",
    "inlineStyles": "Inline stijlen",
    "inlineStylesHint": "(Kan media queries breken)",
    "optimize": "SVG optimaliseren"
  },
  "sv": {
    "title": "Optimeringsalternativ",
    "multipass": "Multipass",
    "multipassHint": "(Flera optimeringspass)",
    "removeComments": "Ta bort kommentarer",
    "removeMetadata": "Ta bort metadata",
    "cleanupIds": "Rensa ID:n",
    "convertColors": "Konvertera färger",
    "removeDimensions": "Ta bort dimensioner",
    "removeDimensionsHint": "(Behåll endast viewBox)",
    "inlineStyles": "Inline-stilar",
    "inlineStylesHint": "(Kan förstöra mediafrågor)",
    "optimize": "Optimera SVG"
  },
  "pl": {
    "title": "Opcje optymalizacji",
    "multipass": "Wielokrotne przebiegi",
    "multipassHint": "(Wiele przebiegów optymalizacji)",
    "removeComments": "Usuń komentarze",
    "removeMetadata": "Usuń metadane",
    "cleanupIds": "Wyczyść ID",
    "convertColors": "Konwertuj kolory",
    "removeDimensions": "Usuń wymiary",
    "removeDimensionsHint": "(Zachowaj tylko viewBox)",
    "inlineStyles": "Style wbudowane",
    "inlineStylesHint": "(Może uszkodzić zapytania medialne)",
    "optimize": "Optymalizuj SVG"
  },
  "vi": {
    "title": "Tùy chọn tối ưu hóa",
    "multipass": "Đa lượt",
    "multipassHint": "(Nhiều lượt tối ưu hóa)",
    "removeComments": "Xóa bình luận",
    "removeMetadata": "Xóa siêu dữ liệu",
    "cleanupIds": "Dọn dẹp ID",
    "convertColors": "Chuyển đổi màu sắc",
    "removeDimensions": "Xóa kích thước",
    "removeDimensionsHint": "(Chỉ giữ viewBox)",
    "inlineStyles": "Kiểu nội tuyến",
    "inlineStylesHint": "(Có thể phá vỡ truy vấn media)",
    "optimize": "Tối ưu hóa SVG"
  },
  "th": {
    "title": "ตัวเลือกการเพิ่มประสิทธิภาพ",
    "multipass": "หลายรอบ",
    "multipassHint": "(การเพิ่มประสิทธิภาพหลายรอบ)",
    "removeComments": "ลบความคิดเห็น",
    "removeMetadata": "ลบเมตาดาต้า",
    "cleanupIds": "ล้าง ID",
    "convertColors": "แปลงสี",
    "removeDimensions": "ลบขนาด",
    "removeDimensionsHint": "(เก็บเฉพาะ viewBox)",
    "inlineStyles": "สไตล์อินไลน์",
    "inlineStylesHint": "(อาจทำลาย media queries)",
    "optimize": "เพิ่มประสิทธิภาพ SVG"
  },
  "id": {
    "title": "Opsi Optimasi",
    "multipass": "Multipass",
    "multipassHint": "(Beberapa pass optimasi)",
    "removeComments": "Hapus komentar",
    "removeMetadata": "Hapus metadata",
    "cleanupIds": "Bersihkan ID",
    "convertColors": "Konversi warna",
    "removeDimensions": "Hapus dimensi",
    "removeDimensionsHint": "(Hanya simpan viewBox)",
    "inlineStyles": "Gaya inline",
    "inlineStylesHint": "(Dapat merusak media queries)",
    "optimize": "Optimalkan SVG"
  },
  "he": {
    "title": "אפשרויות אופטימיזציה",
    "multipass": "ריבוי מעברים",
    "multipassHint": "(מעברי אופטימיזציה מרובים)",
    "removeComments": "הסר הערות",
    "removeMetadata": "הסר מטא-נתונים",
    "cleanupIds": "נקה מזהים",
    "convertColors": "המר צבעים",
    "removeDimensions": "הסר מימדים",
    "removeDimensionsHint": "(שמור רק viewBox)",
    "inlineStyles": "סגנונות מוטמעים",
    "inlineStylesHint": "(עלול לשבור שאילתות מדיה)",
    "optimize": "אופטימיזציה של SVG"
  },
  "ms": {
    "title": "Pilihan Pengoptimuman",
    "multipass": "Berbilang laluan",
    "multipassHint": "(Berbilang laluan pengoptimuman)",
    "removeComments": "Alih keluar komen",
    "removeMetadata": "Alih keluar metadata",
    "cleanupIds": "Bersihkan ID",
    "convertColors": "Tukar warna",
    "removeDimensions": "Alih keluar dimensi",
    "removeDimensionsHint": "(Simpan viewBox sahaja)",
    "inlineStyles": "Gaya sebaris",
    "inlineStylesHint": "(Mungkin merosakkan pertanyaan media)",
    "optimize": "Optimumkan SVG"
  },
  "no": {
    "title": "Optimeringsalternativer",
    "multipass": "Multipass",
    "multipassHint": "(Flere optimeringskjøringer)",
    "removeComments": "Fjern kommentarer",
    "removeMetadata": "Fjern metadata",
    "cleanupIds": "Rydd opp ID-er",
    "convertColors": "Konverter farger",
    "removeDimensions": "Fjern dimensjoner",
    "removeDimensionsHint": "(Behold kun viewBox)",
    "inlineStyles": "Innebygde stiler",
    "inlineStylesHint": "(Kan ødelegge mediespørringer)",
    "optimize": "Optimaliser SVG"
  }
}
</i18n>
