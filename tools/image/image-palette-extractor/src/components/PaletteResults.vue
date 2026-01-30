<template>
  <ToolSection>
    <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
    <n-spin :show="isLoading">
      <template v-if="colors.length">
        <PaletteOverview :colors="colors" :dominant="dominant" :total-pixels="totalPixels" />
        <PaletteSwatchGrid :colors="colors" />
        <PaletteExportPanel :colors="colors" :file-name="fileName" />
      </template>
      <n-empty v-else :description="t('empty')" />
    </n-spin>
  </ToolSection>
</template>

<script setup lang="ts">
import { NEmpty, NSpin } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import type { PaletteSwatch } from '../types'
import PaletteExportPanel from './PaletteExportPanel.vue'
import PaletteOverview from './PaletteOverview.vue'
import PaletteSwatchGrid from './PaletteSwatchGrid.vue'

defineProps<{
  colors: PaletteSwatch[]
  dominant: PaletteSwatch | null
  totalPixels: number
  fileName: string
  isLoading: boolean
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<i18n lang="json">
{
  "en": {
    "results": "Palette Results",
    "empty": "No colors extracted yet."
  },
  "zh": {
    "results": "调色板结果",
    "empty": "暂无可用颜色。"
  },
  "zh-CN": {
    "results": "调色板结果",
    "empty": "暂无可用颜色。"
  },
  "zh-TW": {
    "results": "調色板結果",
    "empty": "尚未擷取到顏色。"
  },
  "zh-HK": {
    "results": "調色板結果",
    "empty": "尚未擷取到顏色。"
  },
  "es": {
    "results": "Resultados de la paleta",
    "empty": "Aún no se han extraído colores."
  },
  "fr": {
    "results": "Résultats de la palette",
    "empty": "Aucune couleur extraite pour l'instant."
  },
  "de": {
    "results": "Palettenergebnisse",
    "empty": "Noch keine Farben extrahiert."
  },
  "it": {
    "results": "Risultati della palette",
    "empty": "Nessun colore estratto."
  },
  "ja": {
    "results": "パレット結果",
    "empty": "まだ色が抽出されていません。"
  },
  "ko": {
    "results": "팔레트 결과",
    "empty": "아직 색상이 추출되지 않았습니다."
  },
  "ru": {
    "results": "Результаты палитры",
    "empty": "Цвета пока не извлечены."
  },
  "pt": {
    "results": "Resultados da paleta",
    "empty": "Nenhuma cor extraída ainda."
  },
  "ar": {
    "results": "نتائج اللوحة",
    "empty": "لم يتم استخراج ألوان بعد."
  },
  "hi": {
    "results": "पैलेट परिणाम",
    "empty": "अब तक कोई रंग नहीं निकाला गया।"
  },
  "tr": {
    "results": "Palet sonuclari",
    "empty": "Henuz renk cikarilmadi."
  },
  "nl": {
    "results": "Palette-resultaten",
    "empty": "Nog geen kleuren geëxtraheerd."
  },
  "sv": {
    "results": "Palettresultat",
    "empty": "Inga färger extraherade ännu."
  },
  "pl": {
    "results": "Wyniki palety",
    "empty": "Brak wyodrębnionych kolorów."
  },
  "vi": {
    "results": "Kết quả bảng màu",
    "empty": "Chưa trích xuất màu nào."
  },
  "th": {
    "results": "ผลลัพธ์พาเล็ต",
    "empty": "ยังไม่มีสีที่ถูกดึงออกมา"
  },
  "id": {
    "results": "Hasil palet",
    "empty": "Belum ada warna yang diekstrak."
  },
  "he": {
    "results": "תוצאות הפלטה",
    "empty": "עדיין לא חולצו צבעים."
  },
  "ms": {
    "results": "Hasil palet",
    "empty": "Belum ada warna yang diekstrak."
  },
  "no": {
    "results": "Palettresultat",
    "empty": "Ingen farger er hentet ut ennå."
  }
}
</i18n>
