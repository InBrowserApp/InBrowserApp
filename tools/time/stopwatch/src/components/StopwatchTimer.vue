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

    <ToolSectionHeader>{{ t('laps') }}</ToolSectionHeader>
    <ToolSection>
      <div v-if="lapRows.length" class="laps-table" data-testid="laps-list">
        <div class="laps-row laps-header">
          <n-text depth="3">#</n-text>
          <n-text depth="3">{{ t('lap') }}</n-text>
          <n-text depth="3">{{ t('total') }}</n-text>
        </div>
        <div v-for="row in lapRows" :key="row.index" class="laps-row" data-testid="lap-row">
          <n-text>#{{ row.index }}</n-text>
          <n-text>{{ formatStopwatch(row.lapTime) }}</n-text>
          <n-text>{{ formatStopwatch(row.totalTime) }}</n-text>
        </div>
      </div>
      <n-text v-else depth="3" data-testid="no-laps">
        {{ t('no-laps') }}
      </n-text>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NFlex, NIcon, NText } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { useIntervalFn } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import {
  ArrowCounterclockwise16Regular,
  Flag16Regular,
  Pause16Regular,
  Play16Regular,
} from '@shared/icons/fluent'
import { formatStopwatch } from '../utils/format'

const { t } = useI18n()

const running = ref(false)
const startTime = ref(0)
const accumulated = ref(0)
const now = ref(Date.now())
const laps = ref<number[]>([])

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

const lapRows = computed(() => {
  let previousTotal = 0
  return laps.value.map((totalTime, index) => {
    const lapTime = totalTime - previousTotal
    previousTotal = totalTime
    return {
      index: index + 1,
      lapTime,
      totalTime,
    }
  })
})

const captureNow = () => {
  now.value = Date.now()
}

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

.laps-table {
  display: grid;
  gap: 8px;
}

.laps-row {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) minmax(0, 1fr);
  gap: 8px;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid var(--n-border-color, rgba(0, 0, 0, 0.08));
}

.laps-row:last-child {
  border-bottom: none;
}

.laps-header {
  padding-bottom: 4px;
  border-bottom: 1px solid var(--n-border-color, rgba(0, 0, 0, 0.12));
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
    "no-laps": "No laps yet",
    "total": "Total",
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
    "no-laps": "暂无计次记录",
    "total": "总计",
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
    "no-laps": "暂无计次记录",
    "total": "总计",
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
    "no-laps": "尚無計次記錄",
    "total": "總計",
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
    "no-laps": "尚無計次記錄",
    "total": "總計",
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
    "no-laps": "Sin vueltas",
    "total": "Total",
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
    "no-laps": "Aucun tour",
    "total": "Total",
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
    "no-laps": "Keine Runden",
    "total": "Gesamt",
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
    "no-laps": "Nessun giro",
    "total": "Totale",
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
    "no-laps": "ラップはありません",
    "total": "合計",
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
    "no-laps": "랩 없음",
    "total": "총합",
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
    "no-laps": "Кругов нет",
    "total": "Итого",
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
    "no-laps": "Sem voltas",
    "total": "Total",
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
    "no-laps": "لا توجد لفات بعد",
    "total": "الإجمالي",
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
    "no-laps": "कोई लैप नहीं",
    "total": "कुल",
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
    "no-laps": "Tur yok",
    "total": "Toplam",
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
    "no-laps": "Geen rondes",
    "total": "Totaal",
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
    "no-laps": "Inga varv",
    "total": "Totalt",
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
    "no-laps": "Brak okrążeń",
    "total": "Razem",
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
    "no-laps": "Chưa có vòng",
    "total": "Tổng",
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
    "no-laps": "ยังไม่มีรอบ",
    "total": "รวม",
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
    "no-laps": "Belum ada putaran",
    "total": "Total",
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
    "no-laps": "אין הקפות",
    "total": "סך הכל",
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
    "no-laps": "Tiada pusingan",
    "total": "Jumlah",
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
    "no-laps": "Ingen runder",
    "total": "Totalt",
    "status-running": "Kjører",
    "status-paused": "Pauset"
  }
}
</i18n>
