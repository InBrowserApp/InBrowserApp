<template>
  <div>
    <ToolSection>
      <div class="stopwatch-display">
        <div class="stopwatch-time" data-testid="elapsed">
          {{ formattedElapsed }}
        </div>
        <n-text depth="3">
          {{ running ? t('status-running') : t('status-paused') }}
        </n-text>
      </div>
    </ToolSection>

    <ToolSection>
      <n-flex :size="12" wrap justify="center">
        <n-button type="primary" :disabled="running" @click="start" data-testid="start">
          <template #icon>
            <n-icon :component="Play16Regular" />
          </template>
          {{ hasElapsed ? t('resume') : t('start') }}
        </n-button>
        <n-button :disabled="!running" @click="pause" data-testid="pause">
          <template #icon>
            <n-icon :component="Pause16Regular" />
          </template>
          {{ t('pause') }}
        </n-button>
        <n-button :disabled="!canLap" @click="recordLap" data-testid="lap">
          <template #icon>
            <n-icon :component="Flag16Regular" />
          </template>
          {{ t('lap') }}
        </n-button>
        <n-button :disabled="!canReset" @click="reset" data-testid="reset">
          <template #icon>
            <n-icon :component="ArrowCounterclockwise16Regular" />
          </template>
          {{ t('reset') }}
        </n-button>
      </n-flex>
    </ToolSection>

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
            @click="clearLaps"
            data-testid="clear-laps"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { DataTableColumns, DataTableInst } from 'naive-ui'
import { NButton, NDataTable, NFlex, NIcon, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useIntervalFn, useObjectUrl, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'
import ArrowDownload16Regular from '@vicons/fluent/ArrowDownload16Regular'
import Delete16Regular from '@vicons/fluent/Delete16Regular'
import Flag16Regular from '@vicons/fluent/Flag16Regular'
import Pause16Regular from '@vicons/fluent/Pause16Regular'
import Play16Regular from '@vicons/fluent/Play16Regular'
import { formatStopwatch } from '../utils/format'

const { t } = useI18n()

const running = useStorage('tools:stopwatch:running', false)
const startTime = useStorage('tools:stopwatch:start-time', 0)
const accumulated = useStorage('tools:stopwatch:accumulated', 0)
const now = ref(Date.now())
const laps = useStorage<number[]>('tools:stopwatch:laps', [])
const tableRef = ref<DataTableInst | null>(null)

const { pause: pauseTicker, resume: resumeTicker } = useIntervalFn(
  () => {
    now.value = Date.now()
  },
  50,
  { immediate: false },
)

const elapsedMs = computed(() => {
  if (!running.value) return accumulated.value
  return accumulated.value + (now.value - startTime.value)
})

const formattedElapsed = computed(() => formatStopwatch(elapsedMs.value))
const hasElapsed = computed(() => elapsedMs.value > 0)
const canLap = computed(() => running.value && elapsedMs.value > 0)
const canReset = computed(() => !running.value && (elapsedMs.value > 0 || laps.value.length > 0))
const canClearLaps = computed(() => laps.value.length > 0)

type LapRow = {
  key: number
  index: number
  lapTime: number
  totalTime: number
}

const lapRows = computed<LapRow[]>(() => {
  let previousTotal = 0
  return laps.value.map((totalTime, index) => {
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
const csvLines = ref<string[]>([])

watch(
  lapRows,
  (current, previous) => {
    if (!current.length) {
      csvLines.value = []
      return
    }
    if (!previous || current.length <= previous.length) {
      csvLines.value = current.map(formatCsvRow)
      return
    }
    const newLines = current.slice(previous.length).map(formatCsvRow)
    csvLines.value = [...csvLines.value, ...newLines]
  },
  { immediate: true },
)

const csvContent = computed(() => {
  if (!csvLines.value.length) return ''
  return `\ufeff${[csvHeader.value, ...csvLines.value].join('\n')}`
})

const csvBlob = computed(() => {
  if (!csvContent.value) return null
  return new Blob([csvContent.value], { type: 'text/csv;charset=utf-8' })
})

const csvUrl = useObjectUrl(csvBlob)
const csvFilename = 'stopwatch-laps.csv'

const captureNow = () => {
  now.value = Date.now()
}

onMounted(() => {
  if (!running.value) return
  if (!startTime.value) {
    running.value = false
    return
  }
  captureNow()
  resumeTicker()
})

const start = () => {
  if (running.value) return
  captureNow()
  startTime.value = now.value
  running.value = true
  resumeTicker()
}

const pause = () => {
  if (!running.value) return
  captureNow()
  accumulated.value = elapsedMs.value
  running.value = false
  pauseTicker()
}

const reset = () => {
  running.value = false
  accumulated.value = 0
  startTime.value = 0
  laps.value = []
  pauseTicker()
  captureNow()
}

const clearLaps = () => {
  if (!canClearLaps.value) return
  laps.value = []
}

const recordLap = () => {
  if (!running.value) return
  captureNow()
  laps.value = [...laps.value, elapsedMs.value]
}
</script>

<style scoped>
.stopwatch-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
}

.stopwatch-time {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

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
    "start": "Start",
    "pause": "Pause",
    "resume": "Resume",
    "lap": "Lap",
    "reset": "Reset",
    "laps": "Laps",
    "clear": "Clear",
    "export": "Export",
    "no-laps": "No laps yet",
    "total": "Total",
    "lap-ms": "Lap (ms)",
    "total-ms": "Total (ms)",
    "status-running": "Running",
    "status-paused": "Paused"
  },
  "zh": {
    "start": "开始",
    "pause": "暂停",
    "resume": "继续",
    "lap": "计次",
    "reset": "重置",
    "laps": "计次记录",
    "clear": "清空",
    "export": "导出",
    "no-laps": "暂无计次记录",
    "total": "总计",
    "lap-ms": "计次(毫秒)",
    "total-ms": "总计(毫秒)",
    "status-running": "计时中",
    "status-paused": "已暂停"
  },
  "zh-CN": {
    "start": "开始",
    "pause": "暂停",
    "resume": "继续",
    "lap": "计次",
    "reset": "重置",
    "laps": "计次记录",
    "clear": "清空",
    "export": "导出",
    "no-laps": "暂无计次记录",
    "total": "总计",
    "lap-ms": "计次(毫秒)",
    "total-ms": "总计(毫秒)",
    "status-running": "计时中",
    "status-paused": "已暂停"
  },
  "zh-TW": {
    "start": "開始",
    "pause": "暫停",
    "resume": "繼續",
    "lap": "計次",
    "reset": "重置",
    "laps": "計次記錄",
    "clear": "清除",
    "export": "匯出",
    "no-laps": "尚無計次記錄",
    "total": "總計",
    "lap-ms": "計次(毫秒)",
    "total-ms": "總計(毫秒)",
    "status-running": "計時中",
    "status-paused": "已暫停"
  },
  "zh-HK": {
    "start": "開始",
    "pause": "暫停",
    "resume": "繼續",
    "lap": "計次",
    "reset": "重置",
    "laps": "計次記錄",
    "clear": "清除",
    "export": "匯出",
    "no-laps": "尚無計次記錄",
    "total": "總計",
    "lap-ms": "計次(毫秒)",
    "total-ms": "總計(毫秒)",
    "status-running": "計時中",
    "status-paused": "已暫停"
  },
  "es": {
    "start": "Iniciar",
    "pause": "Pausar",
    "resume": "Reanudar",
    "lap": "Vuelta",
    "reset": "Restablecer",
    "laps": "Vueltas",
    "clear": "Limpiar",
    "export": "Exportar",
    "no-laps": "Sin vueltas",
    "total": "Total",
    "lap-ms": "Vuelta (ms)",
    "total-ms": "Total (ms)",
    "status-running": "En marcha",
    "status-paused": "Pausado"
  },
  "fr": {
    "start": "Démarrer",
    "pause": "Pause",
    "resume": "Reprendre",
    "lap": "Tour",
    "reset": "Réinitialiser",
    "laps": "Tours",
    "clear": "Effacer",
    "export": "Exporter",
    "no-laps": "Aucun tour",
    "total": "Total",
    "lap-ms": "Tour (ms)",
    "total-ms": "Total (ms)",
    "status-running": "En cours",
    "status-paused": "En pause"
  },
  "de": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Fortsetzen",
    "lap": "Runde",
    "reset": "Zurücksetzen",
    "laps": "Runden",
    "clear": "Leeren",
    "export": "Exportieren",
    "no-laps": "Keine Runden",
    "total": "Gesamt",
    "lap-ms": "Runde (ms)",
    "total-ms": "Gesamt (ms)",
    "status-running": "Läuft",
    "status-paused": "Pausiert"
  },
  "it": {
    "start": "Avvia",
    "pause": "Pausa",
    "resume": "Riprendi",
    "lap": "Giro",
    "reset": "Reimposta",
    "laps": "Giri",
    "clear": "Cancella",
    "export": "Esporta",
    "no-laps": "Nessun giro",
    "total": "Totale",
    "lap-ms": "Giro (ms)",
    "total-ms": "Totale (ms)",
    "status-running": "In corso",
    "status-paused": "In pausa"
  },
  "ja": {
    "start": "開始",
    "pause": "一時停止",
    "resume": "再開",
    "lap": "ラップ",
    "reset": "リセット",
    "laps": "ラップ",
    "clear": "クリア",
    "export": "エクスポート",
    "no-laps": "ラップはありません",
    "total": "合計",
    "lap-ms": "ラップ(ms)",
    "total-ms": "合計(ms)",
    "status-running": "計測中",
    "status-paused": "一時停止中"
  },
  "ko": {
    "start": "시작",
    "pause": "일시정지",
    "resume": "재개",
    "lap": "랩",
    "reset": "초기화",
    "laps": "랩",
    "clear": "지우기",
    "export": "내보내기",
    "no-laps": "랩 없음",
    "total": "총합",
    "lap-ms": "랩(ms)",
    "total-ms": "총합(ms)",
    "status-running": "진행 중",
    "status-paused": "일시정지됨"
  },
  "ru": {
    "start": "Старт",
    "pause": "Пауза",
    "resume": "Продолжить",
    "lap": "Круг",
    "reset": "Сброс",
    "laps": "Круги",
    "clear": "Очистить",
    "export": "Экспорт",
    "no-laps": "Кругов нет",
    "total": "Итого",
    "lap-ms": "Круг (мс)",
    "total-ms": "Итого (мс)",
    "status-running": "Идет",
    "status-paused": "Пауза"
  },
  "pt": {
    "start": "Iniciar",
    "pause": "Pausar",
    "resume": "Retomar",
    "lap": "Volta",
    "reset": "Redefinir",
    "laps": "Voltas",
    "clear": "Limpar",
    "export": "Exportar",
    "no-laps": "Sem voltas",
    "total": "Total",
    "lap-ms": "Volta (ms)",
    "total-ms": "Total (ms)",
    "status-running": "Em andamento",
    "status-paused": "Pausado"
  },
  "ar": {
    "start": "بدء",
    "pause": "إيقاف مؤقت",
    "resume": "استئناف",
    "lap": "لفة",
    "reset": "إعادة ضبط",
    "laps": "اللفات",
    "clear": "مسح",
    "export": "تصدير",
    "no-laps": "لا توجد لفات بعد",
    "total": "الإجمالي",
    "lap-ms": "لفة (مللي ثانية)",
    "total-ms": "الإجمالي (مللي ثانية)",
    "status-running": "قيد التشغيل",
    "status-paused": "متوقف مؤقتًا"
  },
  "hi": {
    "start": "शुरू",
    "pause": "रोकें",
    "resume": "फिर से शुरू करें",
    "lap": "लैप",
    "reset": "रीसेट",
    "laps": "लैप्स",
    "clear": "साफ़ करें",
    "export": "निर्यात",
    "no-laps": "कोई लैप नहीं",
    "total": "कुल",
    "lap-ms": "लैप (मि.से.)",
    "total-ms": "कुल (मि.से.)",
    "status-running": "चल रहा है",
    "status-paused": "रुका हुआ"
  },
  "tr": {
    "start": "Başlat",
    "pause": "Duraklat",
    "resume": "Sürdür",
    "lap": "Tur",
    "reset": "Sıfırla",
    "laps": "Turlar",
    "clear": "Temizle",
    "export": "Dışa Aktar",
    "no-laps": "Tur yok",
    "total": "Toplam",
    "lap-ms": "Tur (ms)",
    "total-ms": "Toplam (ms)",
    "status-running": "Çalışıyor",
    "status-paused": "Duraklatıldı"
  },
  "nl": {
    "start": "Start",
    "pause": "Pauze",
    "resume": "Hervatten",
    "lap": "Ronde",
    "reset": "Reset",
    "laps": "Rondes",
    "clear": "Wissen",
    "export": "Exporteren",
    "no-laps": "Geen rondes",
    "total": "Totaal",
    "lap-ms": "Ronde (ms)",
    "total-ms": "Totaal (ms)",
    "status-running": "Bezig",
    "status-paused": "Gepauzeerd"
  },
  "sv": {
    "start": "Starta",
    "pause": "Pausa",
    "resume": "Fortsätt",
    "lap": "Varv",
    "reset": "Återställ",
    "laps": "Varv",
    "clear": "Rensa",
    "export": "Exportera",
    "no-laps": "Inga varv",
    "total": "Totalt",
    "lap-ms": "Varv (ms)",
    "total-ms": "Totalt (ms)",
    "status-running": "Pågår",
    "status-paused": "Pausad"
  },
  "pl": {
    "start": "Start",
    "pause": "Pauza",
    "resume": "Wznów",
    "lap": "Okrążenie",
    "reset": "Resetuj",
    "laps": "Okrążenia",
    "clear": "Wyczyść",
    "export": "Eksportuj",
    "no-laps": "Brak okrążeń",
    "total": "Razem",
    "lap-ms": "Okrążenie (ms)",
    "total-ms": "Razem (ms)",
    "status-running": "Trwa",
    "status-paused": "Wstrzymany"
  },
  "vi": {
    "start": "Bắt đầu",
    "pause": "Tạm dừng",
    "resume": "Tiếp tục",
    "lap": "Vòng",
    "reset": "Đặt lại",
    "laps": "Vòng",
    "clear": "Xóa",
    "export": "Xuất",
    "no-laps": "Chưa có vòng",
    "total": "Tổng",
    "lap-ms": "Vòng (ms)",
    "total-ms": "Tổng (ms)",
    "status-running": "Đang chạy",
    "status-paused": "Đã tạm dừng"
  },
  "th": {
    "start": "เริ่ม",
    "pause": "หยุดชั่วคราว",
    "resume": "ทำต่อ",
    "lap": "รอบ",
    "reset": "รีเซ็ต",
    "laps": "รอบ",
    "clear": "ล้าง",
    "export": "ส่งออก",
    "no-laps": "ยังไม่มีรอบ",
    "total": "รวม",
    "lap-ms": "รอบ (มิลลิวินาที)",
    "total-ms": "รวม (มิลลิวินาที)",
    "status-running": "กำลังทำงาน",
    "status-paused": "หยุดชั่วคราว"
  },
  "id": {
    "start": "Mulai",
    "pause": "Jeda",
    "resume": "Lanjutkan",
    "lap": "Putaran",
    "reset": "Reset",
    "laps": "Putaran",
    "clear": "Bersihkan",
    "export": "Ekspor",
    "no-laps": "Belum ada putaran",
    "total": "Total",
    "lap-ms": "Putaran (ms)",
    "total-ms": "Total (ms)",
    "status-running": "Berjalan",
    "status-paused": "Dijeda"
  },
  "he": {
    "start": "התחל",
    "pause": "השהה",
    "resume": "המשך",
    "lap": "הקפה",
    "reset": "אפס",
    "laps": "הקפות",
    "clear": "נקה",
    "export": "ייצוא",
    "no-laps": "אין הקפות",
    "total": "סך הכל",
    "lap-ms": "הקפה (מילישניות)",
    "total-ms": "סך הכל (מילישניות)",
    "status-running": "פועל",
    "status-paused": "מושהה"
  },
  "ms": {
    "start": "Mula",
    "pause": "Jeda",
    "resume": "Sambung",
    "lap": "Pusingan",
    "reset": "Set semula",
    "laps": "Pusingan",
    "clear": "Kosongkan",
    "export": "Eksport",
    "no-laps": "Tiada pusingan",
    "total": "Jumlah",
    "lap-ms": "Pusingan (ms)",
    "total-ms": "Jumlah (ms)",
    "status-running": "Sedang berjalan",
    "status-paused": "Dijeda"
  },
  "no": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Fortsett",
    "lap": "Runde",
    "reset": "Nullstill",
    "laps": "Runder",
    "clear": "Tøm",
    "export": "Eksporter",
    "no-laps": "Ingen runder",
    "total": "Totalt",
    "lap-ms": "Runde (ms)",
    "total-ms": "Totalt (ms)",
    "status-running": "Kjører",
    "status-paused": "Pauset"
  }
}
</i18n>
