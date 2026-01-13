<template>
  <ToolSectionHeader>{{ t('difference') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="timezone-card">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ t('start') }}</n-text>
            <n-flex align="center" :size="8">
              <n-button text size="small" @click="setNow('start')">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton v-if="startInput" :content="startInput" size="small" />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="startTimeZone"
              :options="timeZoneOptions"
              filterable
              :placeholder="t('timezone-placeholder')"
            />
            <n-text v-if="startOffsetLabel" depth="3" style="margin-top: 4px">
              {{ t('offset') }}: {{ startOffsetLabel }}
            </n-text>
          </div>

          <div>
            <n-text depth="3">{{ t('date-time') }}</n-text>
            <n-input
              v-model:value="startInput"
              :placeholder="t('datetime-placeholder')"
              :status="startStatus"
            />
            <n-text depth="3" style="margin-top: 4px">
              {{ t('format-hint') }}
            </n-text>
            <n-text v-if="startError" type="error" style="margin-top: 4px">
              {{ t('invalid-date-time') }}
            </n-text>
          </div>
        </n-flex>
      </n-gi>

      <n-gi>
        <n-flex vertical :size="12" class="timezone-card">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ t('end') }}</n-text>
            <n-flex align="center" :size="8">
              <n-button text size="small" @click="setNow('end')">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton v-if="endInput" :content="endInput" size="small" />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="endTimeZone"
              :options="timeZoneOptions"
              filterable
              :placeholder="t('timezone-placeholder')"
            />
            <n-text v-if="endOffsetLabel" depth="3" style="margin-top: 4px">
              {{ t('offset') }}: {{ endOffsetLabel }}
            </n-text>
          </div>

          <div>
            <n-text depth="3">{{ t('date-time') }}</n-text>
            <n-input
              v-model:value="endInput"
              :placeholder="t('datetime-placeholder')"
              :status="endStatus"
            />
            <n-text depth="3" style="margin-top: 4px">
              {{ t('format-hint') }}
            </n-text>
            <n-text v-if="endError" type="error" style="margin-top: 4px">
              {{ t('invalid-date-time') }}
            </n-text>
          </div>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSection>
    <n-flex justify="space-between" align="center" :wrap="true">
      <n-button @click="swapValues" secondary>
        <template #icon>
          <n-icon :component="ArrowSwap20Regular" />
        </template>
        {{ t('swap') }}
      </n-button>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-descriptions :column="1" label-placement="left" bordered>
      <n-descriptions-item :label="t('signed-duration')">
        <n-flex align="center" :size="8">
          <code>{{ signedDurationLabel || '-' }}</code>
          <CopyToClipboardButton
            v-if="signedDurationLabel"
            :content="signedDurationLabel"
            size="tiny"
          />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('absolute-duration')">
        <n-flex align="center" :size="8">
          <code>{{ absoluteDurationLabel || '-' }}</code>
          <CopyToClipboardButton
            v-if="absoluteDurationLabel"
            :content="absoluteDurationLabel"
            size="tiny"
          />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('iso-8601-duration')">
        <n-flex align="center" :size="8">
          <code>{{ isoDuration || '-' }}</code>
          <CopyToClipboardButton v-if="isoDuration" :content="isoDuration" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-milliseconds')">
        <n-flex align="center" :size="8">
          <code>{{ totalMilliseconds || '-' }}</code>
          <CopyToClipboardButton
            v-if="totalMilliseconds"
            :content="totalMilliseconds"
            size="tiny"
          />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-seconds')">
        <n-flex align="center" :size="8">
          <code>{{ totalSeconds || '-' }}</code>
          <CopyToClipboardButton v-if="totalSeconds" :content="totalSeconds" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-minutes')">
        <n-flex align="center" :size="8">
          <code>{{ totalMinutes || '-' }}</code>
          <CopyToClipboardButton v-if="totalMinutes" :content="totalMinutes" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-hours')">
        <n-flex align="center" :size="8">
          <code>{{ totalHours || '-' }}</code>
          <CopyToClipboardButton v-if="totalHours" :content="totalHours" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('total-days')">
        <n-flex align="center" :size="8">
          <code>{{ totalDays || '-' }}</code>
          <CopyToClipboardButton v-if="totalDays" :content="totalDays" size="tiny" />
        </n-flex>
      </n-descriptions-item>
    </n-descriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NInput,
  NSelect,
  NButton,
  NText,
  NIcon,
  NFlex,
  NGrid,
  NGi,
  NDescriptions,
  NDescriptionsItem,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { ArrowSwap20Regular, Clock16Regular } from '@shared/icons/fluent'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import { buildTimeZoneOptions } from '../utils/timeZoneOptions'
import {
  formatInTimeZone,
  formatOffsetLabel,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
} from '../utils/timeZone'
import {
  formatDurationLabel,
  formatFraction,
  formatIsoDuration,
  millisecondsToDurationParts,
} from '../utils/duration'

const { t } = useI18n()

const timeZoneOptions = buildTimeZoneOptions(Date.now())

const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const defaultTimeZone = isTimeZoneSupported(resolvedTimeZone) ? resolvedTimeZone : 'UTC'

const nowTimestamp = Date.now()
const defaultStart = formatInTimeZone(nowTimestamp, defaultTimeZone)
const defaultEnd = formatInTimeZone(nowTimestamp + 60 * 60 * 1000, defaultTimeZone)

const startTimeZone = useStorage('tools:time-diff-calculator:start-timezone', defaultTimeZone)
const endTimeZone = useStorage('tools:time-diff-calculator:end-timezone', defaultTimeZone)
const startInput = useStorage('tools:time-diff-calculator:start-input', defaultStart)
const endInput = useStorage('tools:time-diff-calculator:end-input', defaultEnd)

if (!isTimeZoneSupported(startTimeZone.value)) {
  startTimeZone.value = defaultTimeZone
}

if (!isTimeZoneSupported(endTimeZone.value)) {
  endTimeZone.value = defaultTimeZone
}

const startParts = computed(() => parseDateTimeInput(startInput.value))
const endParts = computed(() => parseDateTimeInput(endInput.value))

const startStatus = computed(() => {
  if (!startInput.value.trim()) return undefined
  return startParts.value ? 'success' : 'error'
})

const endStatus = computed(() => {
  if (!endInput.value.trim()) return undefined
  return endParts.value ? 'success' : 'error'
})

const startError = computed(() => Boolean(startInput.value.trim()) && !startParts.value)
const endError = computed(() => Boolean(endInput.value.trim()) && !endParts.value)

const startTimestamp = computed(() => {
  if (!startParts.value || !isTimeZoneSupported(startTimeZone.value)) return null
  return toUtcTimestamp(startParts.value, startTimeZone.value)
})

const endTimestamp = computed(() => {
  if (!endParts.value || !isTimeZoneSupported(endTimeZone.value)) return null
  return toUtcTimestamp(endParts.value, endTimeZone.value)
})

const startOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(startTimeZone.value)) return ''
  const reference = startTimestamp.value ?? Date.now()
  return formatOffsetLabel(getTimeZoneOffsetMs(reference, startTimeZone.value))
})

const endOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(endTimeZone.value)) return ''
  const reference = endTimestamp.value ?? Date.now()
  return formatOffsetLabel(getTimeZoneOffsetMs(reference, endTimeZone.value))
})

const diffMilliseconds = computed(() => {
  if (startTimestamp.value === null || endTimestamp.value === null) return null
  return endTimestamp.value - startTimestamp.value
})

const absoluteDiff = computed(() => {
  if (diffMilliseconds.value === null) return null
  return Math.abs(diffMilliseconds.value)
})

const diffParts = computed(() => {
  if (absoluteDiff.value === null) return null
  return millisecondsToDurationParts(absoluteDiff.value)
})

const signedDurationLabel = computed(() => {
  if (!diffParts.value || diffMilliseconds.value === null) return ''
  const label = formatDurationLabel(diffParts.value)
  return diffMilliseconds.value < 0 ? `-${label}` : label
})

const absoluteDurationLabel = computed(() => {
  if (!diffParts.value) return ''
  return formatDurationLabel(diffParts.value)
})

const isoDuration = computed(() => {
  if (!diffParts.value || diffMilliseconds.value === null) return ''
  return formatIsoDuration(diffParts.value, diffMilliseconds.value < 0 ? -1 : 1)
})

const totalMilliseconds = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return String(diffMilliseconds.value)
})

const totalSeconds = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return formatFraction(diffMilliseconds.value / 1000, 3)
})

const totalMinutes = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return formatFraction(diffMilliseconds.value / 60000, 6)
})

const totalHours = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return formatFraction(diffMilliseconds.value / 3600000, 6)
})

const totalDays = computed(() => {
  if (diffMilliseconds.value === null) return ''
  return formatFraction(diffMilliseconds.value / 86400000, 6)
})

function setNow(target: 'start' | 'end') {
  const now = Date.now()
  if (target === 'start') {
    startInput.value = formatInTimeZone(now, startTimeZone.value)
    return
  }
  endInput.value = formatInTimeZone(now, endTimeZone.value)
}

function swapValues() {
  const nextStartTimeZone = endTimeZone.value
  const nextEndTimeZone = startTimeZone.value
  const nextStartInput = endInput.value
  const nextEndInput = startInput.value

  startTimeZone.value = nextStartTimeZone
  endTimeZone.value = nextEndTimeZone
  startInput.value = nextStartInput
  endInput.value = nextEndInput
}
</script>

<style scoped>
.timezone-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}
</style>

<i18n lang="json">
{
  "en": {
    "difference": "Time Difference",
    "start": "Start",
    "end": "End",
    "time-zone": "Time zone",
    "timezone-placeholder": "Select a time zone",
    "date-time": "Date & time",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Now",
    "swap": "Swap",
    "offset": "Offset",
    "invalid-date-time": "Invalid date/time",
    "results": "Results",
    "signed-duration": "Signed duration",
    "absolute-duration": "Absolute duration",
    "iso-8601-duration": "ISO 8601 duration",
    "total-milliseconds": "Total milliseconds",
    "total-seconds": "Total seconds",
    "total-minutes": "Total minutes",
    "total-hours": "Total hours",
    "total-days": "Total days"
  },
  "zh": {
    "difference": "时间差",
    "start": "开始",
    "end": "结束",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "date-time": "日期与时间",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "现在",
    "swap": "交换",
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间",
    "results": "结果",
    "signed-duration": "带符号时长",
    "absolute-duration": "绝对时长",
    "iso-8601-duration": "ISO 8601 时长",
    "total-milliseconds": "总毫秒",
    "total-seconds": "总秒数",
    "total-minutes": "总分钟",
    "total-hours": "总小时",
    "total-days": "总天数"
  },
  "zh-CN": {
    "difference": "时间差",
    "start": "开始",
    "end": "结束",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "date-time": "日期与时间",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "现在",
    "swap": "交换",
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间",
    "results": "结果",
    "signed-duration": "带符号时长",
    "absolute-duration": "绝对时长",
    "iso-8601-duration": "ISO 8601 时长",
    "total-milliseconds": "总毫秒",
    "total-seconds": "总秒数",
    "total-minutes": "总分钟",
    "total-hours": "总小时",
    "total-days": "总天数"
  },
  "zh-TW": {
    "difference": "時間差",
    "start": "開始",
    "end": "結束",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "date-time": "日期與時間",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "swap": "交換",
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間",
    "results": "結果",
    "signed-duration": "帶符號時長",
    "absolute-duration": "絕對時長",
    "iso-8601-duration": "ISO 8601 時長",
    "total-milliseconds": "總毫秒",
    "total-seconds": "總秒數",
    "total-minutes": "總分鐘",
    "total-hours": "總小時",
    "total-days": "總天數"
  },
  "zh-HK": {
    "difference": "時間差",
    "start": "開始",
    "end": "結束",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "date-time": "日期與時間",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "swap": "交換",
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間",
    "results": "結果",
    "signed-duration": "帶符號時長",
    "absolute-duration": "絕對時長",
    "iso-8601-duration": "ISO 8601 時長",
    "total-milliseconds": "總毫秒",
    "total-seconds": "總秒數",
    "total-minutes": "總分鐘",
    "total-hours": "總小時",
    "total-days": "總天數"
  },
  "es": {
    "difference": "Diferencia de tiempo",
    "start": "Inicio",
    "end": "Fin",
    "time-zone": "Zona horaria",
    "timezone-placeholder": "Selecciona una zona horaria",
    "date-time": "Fecha y hora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Ahora",
    "swap": "Intercambiar",
    "offset": "Desfase",
    "invalid-date-time": "Fecha/hora inválida",
    "results": "Resultados",
    "signed-duration": "Duración con signo",
    "absolute-duration": "Duración absoluta",
    "iso-8601-duration": "Duración ISO 8601",
    "total-milliseconds": "Milisegundos totales",
    "total-seconds": "Segundos totales",
    "total-minutes": "Minutos totales",
    "total-hours": "Horas totales",
    "total-days": "Días totales"
  },
  "fr": {
    "difference": "Différence de temps",
    "start": "Début",
    "end": "Fin",
    "time-zone": "Fuseau horaire",
    "timezone-placeholder": "Sélectionner un fuseau horaire",
    "date-time": "Date et heure",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format : YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Maintenant",
    "swap": "Inverser",
    "offset": "Décalage",
    "invalid-date-time": "Date/heure invalide",
    "results": "Résultats",
    "signed-duration": "Durée signée",
    "absolute-duration": "Durée absolue",
    "iso-8601-duration": "Durée ISO 8601",
    "total-milliseconds": "Millisecondes totales",
    "total-seconds": "Secondes totales",
    "total-minutes": "Minutes totales",
    "total-hours": "Heures totales",
    "total-days": "Jours totaux"
  },
  "de": {
    "difference": "Zeitdifferenz",
    "start": "Start",
    "end": "Ende",
    "time-zone": "Zeitzone",
    "timezone-placeholder": "Zeitzone auswählen",
    "date-time": "Datum und Uhrzeit",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Jetzt",
    "swap": "Tauschen",
    "offset": "Offset",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit",
    "results": "Ergebnisse",
    "signed-duration": "Vorzeichenbehaftete Dauer",
    "absolute-duration": "Absolute Dauer",
    "iso-8601-duration": "ISO 8601-Dauer",
    "total-milliseconds": "Millisekunden gesamt",
    "total-seconds": "Sekunden gesamt",
    "total-minutes": "Minuten gesamt",
    "total-hours": "Stunden gesamt",
    "total-days": "Tage gesamt"
  },
  "it": {
    "difference": "Differenza di tempo",
    "start": "Inizio",
    "end": "Fine",
    "time-zone": "Fuso orario",
    "timezone-placeholder": "Seleziona un fuso orario",
    "date-time": "Data e ora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Adesso",
    "swap": "Scambia",
    "offset": "Offset",
    "invalid-date-time": "Data/ora non valida",
    "results": "Risultati",
    "signed-duration": "Durata con segno",
    "absolute-duration": "Durata assoluta",
    "iso-8601-duration": "Durata ISO 8601",
    "total-milliseconds": "Millisecondi totali",
    "total-seconds": "Secondi totali",
    "total-minutes": "Minuti totali",
    "total-hours": "Ore totali",
    "total-days": "Giorni totali"
  },
  "ja": {
    "difference": "時間差",
    "start": "開始",
    "end": "終了",
    "time-zone": "タイムゾーン",
    "timezone-placeholder": "タイムゾーンを選択",
    "date-time": "日付と時刻",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "形式: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "swap": "入れ替え",
    "offset": "オフセット",
    "invalid-date-time": "無効な日付/時刻",
    "results": "結果",
    "signed-duration": "符号付き期間",
    "absolute-duration": "絶対期間",
    "iso-8601-duration": "ISO 8601 期間",
    "total-milliseconds": "合計ミリ秒",
    "total-seconds": "合計秒",
    "total-minutes": "合計分",
    "total-hours": "合計時間",
    "total-days": "合計日"
  },
  "ko": {
    "difference": "시간 차이",
    "start": "시작",
    "end": "끝",
    "time-zone": "시간대",
    "timezone-placeholder": "시간대 선택",
    "date-time": "날짜 및 시간",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "형식: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "현재",
    "swap": "교환",
    "offset": "오프셋",
    "invalid-date-time": "유효하지 않은 날짜/시간",
    "results": "결과",
    "signed-duration": "부호 있는 기간",
    "absolute-duration": "절대 기간",
    "iso-8601-duration": "ISO 8601 기간",
    "total-milliseconds": "총 밀리초",
    "total-seconds": "총 초",
    "total-minutes": "총 분",
    "total-hours": "총 시간",
    "total-days": "총 일"
  },
  "ru": {
    "difference": "Разница во времени",
    "start": "Начало",
    "end": "Конец",
    "time-zone": "Часовой пояс",
    "timezone-placeholder": "Выберите часовой пояс",
    "date-time": "Дата и время",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Формат: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Сейчас",
    "swap": "Поменять",
    "offset": "Смещение",
    "invalid-date-time": "Недопустимая дата/время",
    "results": "Результаты",
    "signed-duration": "Длительность со знаком",
    "absolute-duration": "Абсолютная длительность",
    "iso-8601-duration": "Длительность ISO 8601",
    "total-milliseconds": "Всего миллисекунд",
    "total-seconds": "Всего секунд",
    "total-minutes": "Всего минут",
    "total-hours": "Всего часов",
    "total-days": "Всего дней"
  },
  "pt": {
    "difference": "Diferença de tempo",
    "start": "Início",
    "end": "Fim",
    "time-zone": "Fuso horário",
    "timezone-placeholder": "Selecione um fuso horário",
    "date-time": "Data e hora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Agora",
    "swap": "Trocar",
    "offset": "Offset",
    "invalid-date-time": "Data/hora inválida",
    "results": "Resultados",
    "signed-duration": "Duração com sinal",
    "absolute-duration": "Duração absoluta",
    "iso-8601-duration": "Duração ISO 8601",
    "total-milliseconds": "Milissegundos totais",
    "total-seconds": "Segundos totais",
    "total-minutes": "Minutos totais",
    "total-hours": "Horas totais",
    "total-days": "Dias totais"
  },
  "ar": {
    "difference": "فرق الوقت",
    "start": "البداية",
    "end": "النهاية",
    "time-zone": "المنطقة الزمنية",
    "timezone-placeholder": "اختر منطقة زمنية",
    "date-time": "التاريخ والوقت",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "التنسيق: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "الآن",
    "swap": "تبديل",
    "offset": "الإزاحة",
    "invalid-date-time": "تاريخ/وقت غير صالح",
    "results": "النتائج",
    "signed-duration": "المدة مع الإشارة",
    "absolute-duration": "المدة المطلقة",
    "iso-8601-duration": "مدة ISO 8601",
    "total-milliseconds": "إجمالي المللي ثانية",
    "total-seconds": "إجمالي الثواني",
    "total-minutes": "إجمالي الدقائق",
    "total-hours": "إجمالي الساعات",
    "total-days": "إجمالي الأيام"
  },
  "hi": {
    "difference": "समय अंतर",
    "start": "प्रारंभ",
    "end": "अंत",
    "time-zone": "समय क्षेत्र",
    "timezone-placeholder": "समय क्षेत्र चुनें",
    "date-time": "तिथि और समय",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "फ़ॉर्मेट: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "अभी",
    "swap": "बदलें",
    "offset": "ऑफ़सेट",
    "invalid-date-time": "अमान्य तिथि/समय",
    "results": "परिणाम",
    "signed-duration": "चिह्नित अवधि",
    "absolute-duration": "पूर्ण अवधि",
    "iso-8601-duration": "ISO 8601 अवधि",
    "total-milliseconds": "कुल मिलीसेकंड",
    "total-seconds": "कुल सेकंड",
    "total-minutes": "कुल मिनट",
    "total-hours": "कुल घंटे",
    "total-days": "कुल दिन"
  },
  "tr": {
    "difference": "Zaman Farkı",
    "start": "Başlangıç",
    "end": "Bitiş",
    "time-zone": "Saat dilimi",
    "timezone-placeholder": "Saat dilimi seçin",
    "date-time": "Tarih ve saat",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Biçim: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Şimdi",
    "swap": "Değiştir",
    "offset": "Ofset",
    "invalid-date-time": "Geçersiz tarih/saat",
    "results": "Sonuçlar",
    "signed-duration": "İşaretli süre",
    "absolute-duration": "Mutlak süre",
    "iso-8601-duration": "ISO 8601 süresi",
    "total-milliseconds": "Toplam milisaniye",
    "total-seconds": "Toplam saniye",
    "total-minutes": "Toplam dakika",
    "total-hours": "Toplam saat",
    "total-days": "Toplam gün"
  },
  "nl": {
    "difference": "Tijdverschil",
    "start": "Start",
    "end": "Einde",
    "time-zone": "Tijdzone",
    "timezone-placeholder": "Selecteer een tijdzone",
    "date-time": "Datum en tijd",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formaat: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nu",
    "swap": "Wisselen",
    "offset": "Offset",
    "invalid-date-time": "Ongeldige datum/tijd",
    "results": "Resultaten",
    "signed-duration": "Gesigneerde duur",
    "absolute-duration": "Absolute duur",
    "iso-8601-duration": "ISO 8601-duur",
    "total-milliseconds": "Totaal milliseconden",
    "total-seconds": "Totaal seconden",
    "total-minutes": "Totaal minuten",
    "total-hours": "Totaal uren",
    "total-days": "Totaal dagen"
  },
  "sv": {
    "difference": "Tidsdifferens",
    "start": "Start",
    "end": "Slut",
    "time-zone": "Tidszon",
    "timezone-placeholder": "Välj en tidszon",
    "date-time": "Datum och tid",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nu",
    "swap": "Byt",
    "offset": "Offset",
    "invalid-date-time": "Ogiltigt datum/tid",
    "results": "Resultat",
    "signed-duration": "Signerad varaktighet",
    "absolute-duration": "Absolut varaktighet",
    "iso-8601-duration": "ISO 8601-varaktighet",
    "total-milliseconds": "Totala millisekunder",
    "total-seconds": "Totala sekunder",
    "total-minutes": "Totala minuter",
    "total-hours": "Totala timmar",
    "total-days": "Totala dagar"
  },
  "pl": {
    "difference": "Różnica czasu",
    "start": "Początek",
    "end": "Koniec",
    "time-zone": "Strefa czasowa",
    "timezone-placeholder": "Wybierz strefę czasową",
    "date-time": "Data i czas",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Teraz",
    "swap": "Zamień",
    "offset": "Przesunięcie",
    "invalid-date-time": "Nieprawidłowa data/czas",
    "results": "Wyniki",
    "signed-duration": "Czas trwania ze znakiem",
    "absolute-duration": "Bezwzględny czas trwania",
    "iso-8601-duration": "Czas trwania ISO 8601",
    "total-milliseconds": "Łącznie milisekund",
    "total-seconds": "Łącznie sekund",
    "total-minutes": "Łącznie minut",
    "total-hours": "Łącznie godzin",
    "total-days": "Łącznie dni"
  },
  "vi": {
    "difference": "Chênh lệch thời gian",
    "start": "Bắt đầu",
    "end": "Kết thúc",
    "time-zone": "Múi giờ",
    "timezone-placeholder": "Chọn múi giờ",
    "date-time": "Ngày và giờ",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Định dạng: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Bây giờ",
    "swap": "Hoán đổi",
    "offset": "Độ lệch",
    "invalid-date-time": "Ngày/giờ không hợp lệ",
    "results": "Kết quả",
    "signed-duration": "Thời lượng có dấu",
    "absolute-duration": "Thời lượng tuyệt đối",
    "iso-8601-duration": "Thời lượng ISO 8601",
    "total-milliseconds": "Tổng mili giây",
    "total-seconds": "Tổng giây",
    "total-minutes": "Tổng phút",
    "total-hours": "Tổng giờ",
    "total-days": "Tổng ngày"
  },
  "th": {
    "difference": "ความต่างของเวลา",
    "start": "เริ่มต้น",
    "end": "สิ้นสุด",
    "time-zone": "เขตเวลา",
    "timezone-placeholder": "เลือกเขตเวลา",
    "date-time": "วันที่และเวลา",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "รูปแบบ: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "ตอนนี้",
    "swap": "สลับ",
    "offset": "ออฟเซ็ต",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง",
    "results": "ผลลัพธ์",
    "signed-duration": "ระยะเวลาพร้อมเครื่องหมาย",
    "absolute-duration": "ระยะเวลาสัมบูรณ์",
    "iso-8601-duration": "ระยะเวลา ISO 8601",
    "total-milliseconds": "มิลลิวินาทีทั้งหมด",
    "total-seconds": "วินาทีทั้งหมด",
    "total-minutes": "นาทีทั้งหมด",
    "total-hours": "ชั่วโมงทั้งหมด",
    "total-days": "วันทั้งหมด"
  },
  "id": {
    "difference": "Selisih waktu",
    "start": "Mulai",
    "end": "Selesai",
    "time-zone": "Zona waktu",
    "timezone-placeholder": "Pilih zona waktu",
    "date-time": "Tanggal dan waktu",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Sekarang",
    "swap": "Tukar",
    "offset": "Offset",
    "invalid-date-time": "Tanggal/waktu tidak valid",
    "results": "Hasil",
    "signed-duration": "Durasi bertanda",
    "absolute-duration": "Durasi absolut",
    "iso-8601-duration": "Durasi ISO 8601",
    "total-milliseconds": "Total milidetik",
    "total-seconds": "Total detik",
    "total-minutes": "Total menit",
    "total-hours": "Total jam",
    "total-days": "Total hari"
  },
  "he": {
    "difference": "הפרש זמן",
    "start": "התחלה",
    "end": "סיום",
    "time-zone": "אזור זמן",
    "timezone-placeholder": "בחר אזור זמן",
    "date-time": "תאריך ושעה",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "פורמט: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "עכשיו",
    "swap": "החלף",
    "offset": "היסט",
    "invalid-date-time": "תאריך/שעה לא תקינים",
    "results": "תוצאות",
    "signed-duration": "משך עם סימן",
    "absolute-duration": "משך מוחלט",
    "iso-8601-duration": "משך ISO 8601",
    "total-milliseconds": "סה\"כ מילישניות",
    "total-seconds": "סה\"כ שניות",
    "total-minutes": "סה\"כ דקות",
    "total-hours": "סה\"כ שעות",
    "total-days": "סה\"כ ימים"
  },
  "ms": {
    "difference": "Perbezaan masa",
    "start": "Mula",
    "end": "Tamat",
    "time-zone": "Zon masa",
    "timezone-placeholder": "Pilih zon masa",
    "date-time": "Tarikh dan masa",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Sekarang",
    "swap": "Tukar",
    "offset": "Ofset",
    "invalid-date-time": "Tarikh/masa tidak sah",
    "results": "Keputusan",
    "signed-duration": "Durasi bertanda",
    "absolute-duration": "Durasi mutlak",
    "iso-8601-duration": "Durasi ISO 8601",
    "total-milliseconds": "Jumlah milisaat",
    "total-seconds": "Jumlah saat",
    "total-minutes": "Jumlah minit",
    "total-hours": "Jumlah jam",
    "total-days": "Jumlah hari"
  },
  "no": {
    "difference": "Tidsforskjell",
    "start": "Start",
    "end": "Slutt",
    "time-zone": "Tidssone",
    "timezone-placeholder": "Velg en tidssone",
    "date-time": "Dato og tid",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nå",
    "swap": "Bytt",
    "offset": "Offset",
    "invalid-date-time": "Ugyldig dato/tid",
    "results": "Resultater",
    "signed-duration": "Varighet med fortegn",
    "absolute-duration": "Absolutt varighet",
    "iso-8601-duration": "ISO 8601-varighet",
    "total-milliseconds": "Totale millisekunder",
    "total-seconds": "Totale sekunder",
    "total-minutes": "Totale minutter",
    "total-hours": "Totale timer",
    "total-days": "Totale dager"
  }
}
</i18n>
