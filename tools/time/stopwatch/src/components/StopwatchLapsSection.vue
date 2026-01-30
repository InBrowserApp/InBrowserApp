<template>
  <ToolSectionHeader>
    <span class="laps-heading">
      <span>{{ t('laps') }}</span>
      <span class="laps-actions">
        <n-button
          text
          size="small"
          tag="a"
          :disabled="!canClearLaps"
          :download="csvFilename"
          :href="csvUrl"
          data-testid="export-csv"
        >
          <template #icon>
            <n-icon :component="ArrowDownload16Regular" />
          </template>
          {{ t('export') }} CSV
        </n-button>
        <n-button
          text
          size="small"
          type="error"
          :disabled="!canClearLaps"
          data-testid="clear-laps"
          @click="clearLaps"
        >
          <template #icon>
            <n-icon :component="Delete16Regular" />
          </template>
          {{ t('clear') }}
        </n-button>
      </span>
    </span>
  </ToolSectionHeader>
  <ToolSection>
    <n-data-table
      v-if="lapRows.length"
      ref="tableRef"
      :columns="columns"
      :data="lapRows"
      :bordered="false"
      size="small"
      :pagination="false"
      :row-key="rowKey"
      :row-props="rowProps"
      data-testid="laps-list"
    />
    <n-text v-else depth="3" data-testid="no-laps">
      {{ t('no-laps') }}
    </n-text>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataTableColumns, DataTableInst } from 'naive-ui'
import { NButton, NDataTable, NIcon, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useObjectUrl } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import { formatStopwatch } from '../utils/format'

const props = defineProps<{
  laps: number[]
}>()

const emit = defineEmits<{
  (event: 'update:laps', value: number[]): void
}>()

const { t } = useI18n()

const tableRef = ref<DataTableInst | null>(null)

defineExpose({
  tableRef,
})

const lapsModel = computed({
  get: () => props.laps,
  set: (value) => emit('update:laps', value),
})

const canClearLaps = computed(() => lapsModel.value.length > 0)

type LapRow = {
  key: number
  index: number
  lapTime: number
  totalTime: number
}

const lapRows = computed<LapRow[]>(() => {
  let previousTotal = 0
  return lapsModel.value.map((totalTime, index) => {
    const lapTime = totalTime - previousTotal
    previousTotal = totalTime
    return {
      key: index + 1,
      index: index + 1,
      lapTime,
      totalTime,
    }
  })
})

const columns = computed<DataTableColumns<LapRow>>(() => [
  {
    title: '#',
    key: 'index',
    width: 64,
    sorter: (row1, row2) => row1.index - row2.index,
    render: (row) => `#${row.index}`,
  },
  {
    title: t('lap'),
    key: 'lapTime',
    sorter: (row1, row2) => row1.lapTime - row2.lapTime,
    render: (row) => formatStopwatch(row.lapTime),
  },
  {
    title: t('total'),
    key: 'totalTime',
    sorter: (row1, row2) => row1.totalTime - row2.totalTime,
    render: (row) => formatStopwatch(row.totalTime),
  },
])

const rowKey = (row: LapRow) => row.key
const rowProps = () => ({ class: 'lap-row' })

const escapeCsv = (value: string) => {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const formatCsvRow = (row: LapRow) =>
  [
    escapeCsv(String(row.index)),
    escapeCsv(formatStopwatch(row.lapTime)),
    escapeCsv(formatStopwatch(row.totalTime)),
    escapeCsv(String(row.lapTime)),
    escapeCsv(String(row.totalTime)),
  ].join(',')

const csvHeader = computed(() =>
  [
    escapeCsv('#'),
    escapeCsv(t('lap')),
    escapeCsv(t('total')),
    escapeCsv(t('lap-ms')),
    escapeCsv(t('total-ms')),
  ].join(','),
)

const csvLines = computed(() => lapRows.value.map(formatCsvRow))

const csvContent = computed(() => {
  if (!csvLines.value.length) return ''
  return `﻿${[csvHeader.value, ...csvLines.value].join('\n')}`
})

const csvBlob = computed(() => {
  if (!csvContent.value) return null
  return new Blob([csvContent.value], { type: 'text/csv;charset=utf-8' })
})

const csvUrl = useObjectUrl(csvBlob)
const csvFilename = 'stopwatch-laps.csv'

const clearLaps = () => {
  if (!canClearLaps.value) return
  lapsModel.value = []
}
</script>

<style scoped>
.laps-heading {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
  flex-wrap: wrap;
}

.laps-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
</style>

<i18n lang="json">
{
  "en": {
    "laps": "Laps",
    "clear": "Clear",
    "export": "Export",
    "no-laps": "No laps yet",
    "lap": "Lap",
    "total": "Total",
    "lap-ms": "Lap (ms)",
    "total-ms": "Total (ms)"
  },
  "zh": {
    "laps": "计次记录",
    "clear": "清空",
    "export": "导出",
    "no-laps": "暂无计次记录",
    "lap": "计次",
    "total": "总计",
    "lap-ms": "计次(毫秒)",
    "total-ms": "总计(毫秒)"
  },
  "zh-CN": {
    "laps": "计次记录",
    "clear": "清空",
    "export": "导出",
    "no-laps": "暂无计次记录",
    "lap": "计次",
    "total": "总计",
    "lap-ms": "计次(毫秒)",
    "total-ms": "总计(毫秒)"
  },
  "zh-TW": {
    "laps": "計次記錄",
    "clear": "清除",
    "export": "匯出",
    "no-laps": "尚無計次記錄",
    "lap": "計次",
    "total": "總計",
    "lap-ms": "計次(毫秒)",
    "total-ms": "總計(毫秒)"
  },
  "zh-HK": {
    "laps": "計次記錄",
    "clear": "清除",
    "export": "匯出",
    "no-laps": "尚無計次記錄",
    "lap": "計次",
    "total": "總計",
    "lap-ms": "計次(毫秒)",
    "total-ms": "總計(毫秒)"
  },
  "es": {
    "laps": "Vueltas",
    "clear": "Limpiar",
    "export": "Exportar",
    "no-laps": "Sin vueltas",
    "lap": "Vuelta",
    "total": "Total",
    "lap-ms": "Vuelta (ms)",
    "total-ms": "Total (ms)"
  },
  "fr": {
    "laps": "Tours",
    "clear": "Effacer",
    "export": "Exporter",
    "no-laps": "Aucun tour",
    "lap": "Tour",
    "total": "Total",
    "lap-ms": "Tour (ms)",
    "total-ms": "Total (ms)"
  },
  "de": {
    "laps": "Runden",
    "clear": "Leeren",
    "export": "Exportieren",
    "no-laps": "Keine Runden",
    "lap": "Runde",
    "total": "Gesamt",
    "lap-ms": "Runde (ms)",
    "total-ms": "Gesamt (ms)"
  },
  "it": {
    "laps": "Giri",
    "clear": "Cancella",
    "export": "Esporta",
    "no-laps": "Nessun giro",
    "lap": "Giro",
    "total": "Totale",
    "lap-ms": "Giro (ms)",
    "total-ms": "Totale (ms)"
  },
  "ja": {
    "laps": "ラップ",
    "clear": "クリア",
    "export": "エクスポート",
    "no-laps": "ラップはありません",
    "lap": "ラップ",
    "total": "合計",
    "lap-ms": "ラップ(ms)",
    "total-ms": "合計(ms)"
  },
  "ko": {
    "laps": "랩",
    "clear": "지우기",
    "export": "내보내기",
    "no-laps": "랩 없음",
    "lap": "랩",
    "total": "총합",
    "lap-ms": "랩(ms)",
    "total-ms": "총합(ms)"
  },
  "ru": {
    "laps": "Круги",
    "clear": "Очистить",
    "export": "Экспорт",
    "no-laps": "Кругов нет",
    "lap": "Круг",
    "total": "Итого",
    "lap-ms": "Круг (мс)",
    "total-ms": "Итого (мс)"
  },
  "pt": {
    "laps": "Voltas",
    "clear": "Limpar",
    "export": "Exportar",
    "no-laps": "Sem voltas",
    "lap": "Volta",
    "total": "Total",
    "lap-ms": "Volta (ms)",
    "total-ms": "Total (ms)"
  },
  "ar": {
    "laps": "اللفات",
    "clear": "مسح",
    "export": "تصدير",
    "no-laps": "لا توجد لفات بعد",
    "lap": "لفة",
    "total": "الإجمالي",
    "lap-ms": "لفة (مللي ثانية)",
    "total-ms": "الإجمالي (مللي ثانية)"
  },
  "hi": {
    "laps": "लैप्स",
    "clear": "साफ़ करें",
    "export": "निर्यात",
    "no-laps": "कोई लैप नहीं",
    "lap": "लैप",
    "total": "कुल",
    "lap-ms": "लैप (मि.से.)",
    "total-ms": "कुल (मि.से.)"
  },
  "tr": {
    "laps": "Turlar",
    "clear": "Temizle",
    "export": "Dışa Aktar",
    "no-laps": "Tur yok",
    "lap": "Tur",
    "total": "Toplam",
    "lap-ms": "Tur (ms)",
    "total-ms": "Toplam (ms)"
  },
  "nl": {
    "laps": "Rondes",
    "clear": "Wissen",
    "export": "Exporteren",
    "no-laps": "Geen rondes",
    "lap": "Ronde",
    "total": "Totaal",
    "lap-ms": "Ronde (ms)",
    "total-ms": "Totaal (ms)"
  },
  "sv": {
    "laps": "Varv",
    "clear": "Rensa",
    "export": "Exportera",
    "no-laps": "Inga varv",
    "lap": "Varv",
    "total": "Totalt",
    "lap-ms": "Varv (ms)",
    "total-ms": "Totalt (ms)"
  },
  "pl": {
    "laps": "Okrążenia",
    "clear": "Wyczyść",
    "export": "Eksportuj",
    "no-laps": "Brak okrążeń",
    "lap": "Okrążenie",
    "total": "Razem",
    "lap-ms": "Okrążenie (ms)",
    "total-ms": "Razem (ms)"
  },
  "vi": {
    "laps": "Vòng",
    "clear": "Xóa",
    "export": "Xuất",
    "no-laps": "Chưa có vòng",
    "lap": "Vòng",
    "total": "Tổng",
    "lap-ms": "Vòng (ms)",
    "total-ms": "Tổng (ms)"
  },
  "th": {
    "laps": "รอบ",
    "clear": "ล้าง",
    "export": "ส่งออก",
    "no-laps": "ยังไม่มีรอบ",
    "lap": "รอบ",
    "total": "รวม",
    "lap-ms": "รอบ (มิลลิวินาที)",
    "total-ms": "รวม (มิลลิวินาที)"
  },
  "id": {
    "laps": "Putaran",
    "clear": "Bersihkan",
    "export": "Ekspor",
    "no-laps": "Belum ada putaran",
    "lap": "Putaran",
    "total": "Total",
    "lap-ms": "Putaran (ms)",
    "total-ms": "Total (ms)"
  },
  "he": {
    "laps": "הקפות",
    "clear": "נקה",
    "export": "ייצוא",
    "no-laps": "אין הקפות",
    "lap": "הקפה",
    "total": "סך הכל",
    "lap-ms": "הקפה (מילישניות)",
    "total-ms": "סך הכל (מילישניות)"
  },
  "ms": {
    "laps": "Pusingan",
    "clear": "Kosongkan",
    "export": "Eksport",
    "no-laps": "Tiada pusingan",
    "lap": "Pusingan",
    "total": "Jumlah",
    "lap-ms": "Pusingan (ms)",
    "total-ms": "Jumlah (ms)"
  },
  "no": {
    "laps": "Runder",
    "clear": "Tøm",
    "export": "Eksporter",
    "no-laps": "Ingen runder",
    "lap": "Runde",
    "total": "Totalt",
    "lap-ms": "Runde (ms)",
    "total-ms": "Totalt (ms)"
  }
}
</i18n>
