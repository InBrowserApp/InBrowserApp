<template>
  <ToolSectionHeader>{{ t('duration-calculator') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="timezone-card">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ t('base-time') }}</n-text>
            <n-flex align="center" :size="8">
              <n-button text size="small" @click="setNow">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton v-if="baseInput" :content="baseInput" size="small" />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="baseTimeZone"
              :options="timeZoneOptions"
              filterable
              :placeholder="t('timezone-placeholder')"
            />
            <n-text v-if="baseOffsetLabel" depth="3" style="margin-top: 4px">
              {{ t('offset') }}: {{ baseOffsetLabel }}
            </n-text>
          </div>

          <div>
            <n-text depth="3">{{ t('date-time') }}</n-text>
            <n-input
              v-model:value="baseInput"
              :placeholder="t('datetime-placeholder')"
              :status="baseStatus"
            />
            <n-text depth="3" style="margin-top: 4px">
              {{ t('format-hint') }}
            </n-text>
            <n-text v-if="baseError" type="error" style="margin-top: 4px">
              {{ t('invalid-date-time') }}
            </n-text>
          </div>
        </n-flex>
      </n-gi>

      <n-gi>
        <n-flex vertical :size="12" class="duration-card">
          <n-text strong>{{ t('duration') }}</n-text>

          <n-form-item-gi :label="t('duration-iso')" :show-feedback="false">
            <n-flex align="center" :size="8">
              <n-input
                v-model:value="durationIsoInput"
                :placeholder="t('duration-placeholder')"
                :status="durationIsoStatus"
                style="flex: 1"
              />
              <CopyToClipboardButton
                v-if="normalizedDurationIso"
                :content="normalizedDurationIso"
                size="small"
              />
            </n-flex>
            <template v-if="durationIsoError" #feedback>
              <n-text type="error">{{ durationIsoError }}</n-text>
            </template>
          </n-form-item-gi>

          <n-text depth="3">{{ t('duration-hint') }}</n-text>

          <n-grid cols="2 900:5" :x-gap="12" :y-gap="12">
            <n-form-item-gi :label="t('days')">
              <n-input-number
                v-model:value="durationParts.days"
                :min="0"
                :precision="0"
                style="width: 100%"
              />
            </n-form-item-gi>
            <n-form-item-gi :label="t('hours')">
              <n-input-number
                v-model:value="durationParts.hours"
                :min="0"
                :precision="0"
                style="width: 100%"
              />
            </n-form-item-gi>
            <n-form-item-gi :label="t('minutes')">
              <n-input-number
                v-model:value="durationParts.minutes"
                :min="0"
                :precision="0"
                style="width: 100%"
              />
            </n-form-item-gi>
            <n-form-item-gi :label="t('seconds')">
              <n-input-number
                v-model:value="durationParts.seconds"
                :min="0"
                :precision="0"
                style="width: 100%"
              />
            </n-form-item-gi>
            <n-form-item-gi :label="t('milliseconds')">
              <n-input-number
                v-model:value="durationParts.milliseconds"
                :min="0"
                :precision="0"
                style="width: 100%"
              />
            </n-form-item-gi>
          </n-grid>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="result-card">
          <n-text strong>{{ t('add') }}</n-text>
          <n-descriptions :column="1" label-placement="left" bordered>
            <n-descriptions-item :label="t('date-time')">
              <n-flex align="center" :size="8">
                <code>{{ addedDateTime || '-' }}</code>
                <CopyToClipboardButton v-if="addedDateTime" :content="addedDateTime" size="tiny" />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('iso-8601')">
              <n-flex align="center" :size="8">
                <code>{{ addedIso || '-' }}</code>
                <CopyToClipboardButton v-if="addedIso" :content="addedIso" size="tiny" />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('unix-ms')">
              <n-flex align="center" :size="8">
                <code>{{ addedUnixMs || '-' }}</code>
                <CopyToClipboardButton v-if="addedUnixMs" :content="addedUnixMs" size="tiny" />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('unix-s')">
              <n-flex align="center" :size="8">
                <code>{{ addedUnixSeconds || '-' }}</code>
                <CopyToClipboardButton
                  v-if="addedUnixSeconds"
                  :content="addedUnixSeconds"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
          </n-descriptions>
        </n-flex>
      </n-gi>

      <n-gi>
        <n-flex vertical :size="12" class="result-card">
          <n-text strong>{{ t('subtract') }}</n-text>
          <n-descriptions :column="1" label-placement="left" bordered>
            <n-descriptions-item :label="t('date-time')">
              <n-flex align="center" :size="8">
                <code>{{ subtractedDateTime || '-' }}</code>
                <CopyToClipboardButton
                  v-if="subtractedDateTime"
                  :content="subtractedDateTime"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('iso-8601')">
              <n-flex align="center" :size="8">
                <code>{{ subtractedIso || '-' }}</code>
                <CopyToClipboardButton v-if="subtractedIso" :content="subtractedIso" size="tiny" />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('unix-ms')">
              <n-flex align="center" :size="8">
                <code>{{ subtractedUnixMs || '-' }}</code>
                <CopyToClipboardButton
                  v-if="subtractedUnixMs"
                  :content="subtractedUnixMs"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('unix-s')">
              <n-flex align="center" :size="8">
                <code>{{ subtractedUnixSeconds || '-' }}</code>
                <CopyToClipboardButton
                  v-if="subtractedUnixSeconds"
                  :content="subtractedUnixSeconds"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
          </n-descriptions>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  NInput,
  NInputNumber,
  NSelect,
  NText,
  NFlex,
  NGrid,
  NGi,
  NFormItemGi,
  NDescriptions,
  NDescriptionsItem,
  NButton,
  NIcon,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import Clock16Regular from '@vicons/fluent/Clock16Regular'
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
  durationPartsToMilliseconds,
  formatIsoDuration,
  normalizeDurationParts,
  parseIsoDuration,
  type DurationParts,
} from '../utils/duration'

const { t } = useI18n()

const timeZoneOptions = buildTimeZoneOptions(Date.now())

const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const defaultTimeZone = isTimeZoneSupported(resolvedTimeZone) ? resolvedTimeZone : 'UTC'

const nowTimestamp = Date.now()

const baseTimeZone = useStorage('tools:duration-calculator:base-timezone', defaultTimeZone)
const baseInput = useStorage(
  'tools:duration-calculator:base-input',
  formatInTimeZone(nowTimestamp, defaultTimeZone),
)

const durationIsoInput = useStorage('tools:duration-calculator:duration-iso', 'PT1H')
const durationParts = useStorage<DurationParts>('tools:duration-calculator:duration-parts', {
  days: 0,
  hours: 1,
  minutes: 0,
  seconds: 0,
  milliseconds: 0,
})

if (!isTimeZoneSupported(baseTimeZone.value)) {
  baseTimeZone.value = defaultTimeZone
}

const baseParts = computed(() => parseDateTimeInput(baseInput.value))

const baseStatus = computed(() => {
  if (!baseInput.value.trim()) return undefined
  return baseParts.value ? 'success' : 'error'
})

const baseError = computed(() => Boolean(baseInput.value.trim()) && !baseParts.value)

const baseTimestamp = computed(() => {
  if (!baseParts.value || !isTimeZoneSupported(baseTimeZone.value)) return null
  return toUtcTimestamp(baseParts.value, baseTimeZone.value)
})

const baseOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(baseTimeZone.value)) return ''
  const reference = baseTimestamp.value ?? Date.now()
  return formatOffsetLabel(getTimeZoneOffsetMs(reference, baseTimeZone.value))
})

const durationIsoParsed = computed(() => {
  const parsed = parseIsoDuration(durationIsoInput.value)
  if (!parsed || parsed.sign < 0) return null
  return parsed
})

const durationIsoStatus = computed(() => {
  if (!durationIsoInput.value.trim()) return undefined
  return durationIsoParsed.value ? 'success' : 'error'
})

const durationIsoError = computed(() => {
  if (!durationIsoInput.value.trim()) return ''
  return durationIsoParsed.value ? '' : t('invalid-duration')
})

const normalizedDurationParts = computed(() => normalizeDurationParts(durationParts.value))
const normalizedDurationIso = computed(() => formatIsoDuration(normalizedDurationParts.value))

watch(
  durationIsoParsed,
  (parsed) => {
    if (!parsed) return
    if (!isSameDurationParts(parsed.parts, durationParts.value)) {
      durationParts.value = parsed.parts
    }
  },
  { immediate: true },
)

watch(
  durationParts,
  (parts) => {
    const normalized = normalizeDurationParts(parts)
    if (!isSameDurationParts(normalized, parts)) {
      durationParts.value = normalized
      return
    }
    const nextIso = formatIsoDuration(normalized)
    if (nextIso !== durationIsoInput.value) {
      durationIsoInput.value = nextIso
    }
  },
  { deep: true },
)

const durationMs = computed(() => durationPartsToMilliseconds(normalizedDurationParts.value))

const addedTimestamp = computed(() => {
  if (baseTimestamp.value === null) return null
  return baseTimestamp.value + durationMs.value
})

const subtractedTimestamp = computed(() => {
  if (baseTimestamp.value === null) return null
  return baseTimestamp.value - durationMs.value
})

const addedDateTime = computed(() => {
  if (addedTimestamp.value === null) return ''
  return formatInTimeZone(addedTimestamp.value, baseTimeZone.value)
})

const subtractedDateTime = computed(() => {
  if (subtractedTimestamp.value === null) return ''
  return formatInTimeZone(subtractedTimestamp.value, baseTimeZone.value)
})

const addedIso = computed(() => {
  if (addedTimestamp.value === null) return ''
  return new Date(addedTimestamp.value).toISOString()
})

const subtractedIso = computed(() => {
  if (subtractedTimestamp.value === null) return ''
  return new Date(subtractedTimestamp.value).toISOString()
})

const addedUnixMs = computed(() => {
  if (addedTimestamp.value === null) return ''
  return String(addedTimestamp.value)
})

const subtractedUnixMs = computed(() => {
  if (subtractedTimestamp.value === null) return ''
  return String(subtractedTimestamp.value)
})

const addedUnixSeconds = computed(() => {
  if (addedTimestamp.value === null) return ''
  return String(Math.floor(addedTimestamp.value / 1000))
})

const subtractedUnixSeconds = computed(() => {
  if (subtractedTimestamp.value === null) return ''
  return String(Math.floor(subtractedTimestamp.value / 1000))
})

function isSameDurationParts(left: DurationParts, right: DurationParts): boolean {
  return (
    left.days === right.days &&
    left.hours === right.hours &&
    left.minutes === right.minutes &&
    left.seconds === right.seconds &&
    left.milliseconds === right.milliseconds
  )
}

function setNow() {
  baseInput.value = formatInTimeZone(Date.now(), baseTimeZone.value)
}
</script>

<style scoped>
.timezone-card,
.duration-card,
.result-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}
</style>

<i18n lang="json">
{
  "en": {
    "duration-calculator": "Duration Add/Subtract Calculator",
    "base-time": "Base time",
    "time-zone": "Time zone",
    "timezone-placeholder": "Select a time zone",
    "date-time": "Date & time",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Now",
    "offset": "Offset",
    "invalid-date-time": "Invalid date/time",
    "duration": "Duration",
    "duration-iso": "ISO 8601 duration",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Supports PnDTnHnMnS with optional milliseconds.",
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "milliseconds": "Milliseconds",
    "invalid-duration": "Invalid duration",
    "results": "Results",
    "add": "Add",
    "subtract": "Subtract",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix timestamp (ms)",
    "unix-s": "Unix timestamp (s)"
  },
  "zh": {
    "duration-calculator": "时长加减计算器",
    "base-time": "基准时间",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "date-time": "日期与时间",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "现在",
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间",
    "duration": "时长",
    "duration-iso": "ISO 8601 时长",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "支持 PnDTnHnMnS，可包含毫秒。",
    "days": "天",
    "hours": "小时",
    "minutes": "分钟",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "invalid-duration": "无效的时长",
    "results": "结果",
    "add": "加",
    "subtract": "减",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 时间戳（毫秒）",
    "unix-s": "Unix 时间戳（秒）"
  },
  "zh-CN": {
    "duration-calculator": "时长加减计算器",
    "base-time": "基准时间",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "date-time": "日期与时间",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "现在",
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间",
    "duration": "时长",
    "duration-iso": "ISO 8601 时长",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "支持 PnDTnHnMnS，可包含毫秒。",
    "days": "天",
    "hours": "小时",
    "minutes": "分钟",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "invalid-duration": "无效的时长",
    "results": "结果",
    "add": "加",
    "subtract": "减",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 时间戳（毫秒）",
    "unix-s": "Unix 时间戳（秒）"
  },
  "zh-TW": {
    "duration-calculator": "時長加減計算器",
    "base-time": "基準時間",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "date-time": "日期與時間",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間",
    "duration": "時長",
    "duration-iso": "ISO 8601 時長",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "支援 PnDTnHnMnS，可包含毫秒。",
    "days": "天",
    "hours": "小時",
    "minutes": "分鐘",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "invalid-duration": "無效的時長",
    "results": "結果",
    "add": "加",
    "subtract": "減",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 時間戳記（毫秒）",
    "unix-s": "Unix 時間戳記（秒）"
  },
  "zh-HK": {
    "duration-calculator": "時長加減計算器",
    "base-time": "基準時間",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "date-time": "日期與時間",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間",
    "duration": "時長",
    "duration-iso": "ISO 8601 時長",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "支援 PnDTnHnMnS，可包含毫秒。",
    "days": "天",
    "hours": "小時",
    "minutes": "分鐘",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "invalid-duration": "無效的時長",
    "results": "結果",
    "add": "加",
    "subtract": "減",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 時間戳記（毫秒）",
    "unix-s": "Unix 時間戳記（秒）"
  },
  "es": {
    "duration-calculator": "Calculadora de suma/resta de duración",
    "base-time": "Hora base",
    "time-zone": "Zona horaria",
    "timezone-placeholder": "Selecciona una zona horaria",
    "date-time": "Fecha y hora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Ahora",
    "offset": "Desfase",
    "invalid-date-time": "Fecha/hora inválida",
    "duration": "Duración",
    "duration-iso": "Duración ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Admite PnDTnHnMnS con milisegundos opcionales.",
    "days": "Días",
    "hours": "Horas",
    "minutes": "Minutos",
    "seconds": "Segundos",
    "milliseconds": "Milisegundos",
    "invalid-duration": "Duración inválida",
    "results": "Resultados",
    "add": "Sumar",
    "subtract": "Restar",
    "iso-8601": "ISO 8601",
    "unix-ms": "Marca de tiempo Unix (ms)",
    "unix-s": "Marca de tiempo Unix (s)"
  },
  "fr": {
    "duration-calculator": "Calculateur d'ajout/soustraction de durée",
    "base-time": "Heure de base",
    "time-zone": "Fuseau horaire",
    "timezone-placeholder": "Sélectionner un fuseau horaire",
    "date-time": "Date et heure",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format : YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Maintenant",
    "offset": "Décalage",
    "invalid-date-time": "Date/heure invalide",
    "duration": "Durée",
    "duration-iso": "Durée ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Prend en charge PnDTnHnMnS avec millisecondes en option.",
    "days": "Jours",
    "hours": "Heures",
    "minutes": "Minutes",
    "seconds": "Secondes",
    "milliseconds": "Millisecondes",
    "invalid-duration": "Durée invalide",
    "results": "Résultats",
    "add": "Ajouter",
    "subtract": "Soustraire",
    "iso-8601": "ISO 8601",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "de": {
    "duration-calculator": "Dauer-Addieren/Subtrahieren-Rechner",
    "base-time": "Basiszeit",
    "time-zone": "Zeitzone",
    "timezone-placeholder": "Zeitzone auswählen",
    "date-time": "Datum und Uhrzeit",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Jetzt",
    "offset": "Offset",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit",
    "duration": "Dauer",
    "duration-iso": "ISO 8601-Dauer",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Unterstützt PnDTnHnMnS mit optionalen Millisekunden.",
    "days": "Tage",
    "hours": "Stunden",
    "minutes": "Minuten",
    "seconds": "Sekunden",
    "milliseconds": "Millisekunden",
    "invalid-duration": "Ungültige Dauer",
    "results": "Ergebnisse",
    "add": "Addieren",
    "subtract": "Subtrahieren",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-Zeitstempel (ms)",
    "unix-s": "Unix-Zeitstempel (s)"
  },
  "it": {
    "duration-calculator": "Calcolatore di somma/sottrazione della durata",
    "base-time": "Ora base",
    "time-zone": "Fuso orario",
    "timezone-placeholder": "Seleziona un fuso orario",
    "date-time": "Data e ora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Adesso",
    "offset": "Offset",
    "invalid-date-time": "Data/ora non valida",
    "duration": "Durata",
    "duration-iso": "Durata ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Supporta PnDTnHnMnS con millisecondi opzionali.",
    "days": "Giorni",
    "hours": "Ore",
    "minutes": "Minuti",
    "seconds": "Secondi",
    "milliseconds": "Millisecondi",
    "invalid-duration": "Durata non valida",
    "results": "Risultati",
    "add": "Aggiungi",
    "subtract": "Sottrai",
    "iso-8601": "ISO 8601",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "ja": {
    "duration-calculator": "期間の加算/減算計算ツール",
    "base-time": "基準時刻",
    "time-zone": "タイムゾーン",
    "timezone-placeholder": "タイムゾーンを選択",
    "date-time": "日付と時刻",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "形式: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "offset": "オフセット",
    "invalid-date-time": "無効な日付/時刻",
    "duration": "期間",
    "duration-iso": "ISO 8601 期間",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "PnDTnHnMnS に対応（ミリ秒は任意）。",
    "days": "日",
    "hours": "時間",
    "minutes": "分",
    "seconds": "秒",
    "milliseconds": "ミリ秒",
    "invalid-duration": "無効な期間",
    "results": "結果",
    "add": "加算",
    "subtract": "減算",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix タイムスタンプ (ms)",
    "unix-s": "Unix タイムスタンプ (s)"
  },
  "ko": {
    "duration-calculator": "기간 더하기/빼기 계산기",
    "base-time": "기준 시간",
    "time-zone": "시간대",
    "timezone-placeholder": "시간대 선택",
    "date-time": "날짜 및 시간",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "형식: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "현재",
    "offset": "오프셋",
    "invalid-date-time": "유효하지 않은 날짜/시간",
    "duration": "기간",
    "duration-iso": "ISO 8601 기간",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "PnDTnHnMnS 형식 지원(밀리초 선택).",
    "days": "일",
    "hours": "시간",
    "minutes": "분",
    "seconds": "초",
    "milliseconds": "밀리초",
    "invalid-duration": "유효하지 않은 기간",
    "results": "결과",
    "add": "더하기",
    "subtract": "빼기",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix 타임스탬프 (ms)",
    "unix-s": "Unix 타임스탬프 (s)"
  },
  "ru": {
    "duration-calculator": "Калькулятор сложения/вычитания длительности",
    "base-time": "Базовое время",
    "time-zone": "Часовой пояс",
    "timezone-placeholder": "Выберите часовой пояс",
    "date-time": "Дата и время",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Формат: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Сейчас",
    "offset": "Смещение",
    "invalid-date-time": "Недопустимая дата/время",
    "duration": "Длительность",
    "duration-iso": "Длительность ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Поддерживает PnDTnHnMnS с необязательными миллисекундами.",
    "days": "Дни",
    "hours": "Часы",
    "minutes": "Минуты",
    "seconds": "Секунды",
    "milliseconds": "Миллисекунды",
    "invalid-duration": "Недопустимая длительность",
    "results": "Результаты",
    "add": "Добавить",
    "subtract": "Вычесть",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-метка времени (мс)",
    "unix-s": "Unix-метка времени (с)"
  },
  "pt": {
    "duration-calculator": "Calculadora de adicionar/subtrair duração",
    "base-time": "Hora base",
    "time-zone": "Fuso horário",
    "timezone-placeholder": "Selecione um fuso horário",
    "date-time": "Data e hora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Agora",
    "offset": "Offset",
    "invalid-date-time": "Data/hora inválida",
    "duration": "Duração",
    "duration-iso": "Duração ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Suporta PnDTnHnMnS com milissegundos opcionais.",
    "days": "Dias",
    "hours": "Horas",
    "minutes": "Minutos",
    "seconds": "Segundos",
    "milliseconds": "Milissegundos",
    "invalid-duration": "Duração inválida",
    "results": "Resultados",
    "add": "Adicionar",
    "subtract": "Subtrair",
    "iso-8601": "ISO 8601",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "ar": {
    "duration-calculator": "حاسبة إضافة/طرح المدة",
    "base-time": "الوقت الأساسي",
    "time-zone": "المنطقة الزمنية",
    "timezone-placeholder": "اختر منطقة زمنية",
    "date-time": "التاريخ والوقت",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "التنسيق: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "الآن",
    "offset": "الإزاحة",
    "invalid-date-time": "تاريخ/وقت غير صالح",
    "duration": "المدة",
    "duration-iso": "مدة ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "يدعم PnDTnHnMnS مع مللي ثانية اختيارية.",
    "days": "أيام",
    "hours": "ساعات",
    "minutes": "دقائق",
    "seconds": "ثوانٍ",
    "milliseconds": "مللي ثانية",
    "invalid-duration": "مدة غير صالحة",
    "results": "النتائج",
    "add": "إضافة",
    "subtract": "طرح",
    "iso-8601": "ISO 8601",
    "unix-ms": "الطابع الزمني Unix (مللي ثانية)",
    "unix-s": "الطابع الزمني Unix (ثانية)"
  },
  "hi": {
    "duration-calculator": "अवधि जोड़ें/घटाएं कैलकुलेटर",
    "base-time": "आधार समय",
    "time-zone": "समय क्षेत्र",
    "timezone-placeholder": "समय क्षेत्र चुनें",
    "date-time": "तिथि और समय",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "फ़ॉर्मेट: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "अभी",
    "offset": "ऑफ़सेट",
    "invalid-date-time": "अमान्य तिथि/समय",
    "duration": "अवधि",
    "duration-iso": "ISO 8601 अवधि",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "PnDTnHnMnS समर्थित (मिलीसेकंड वैकल्पिक)।",
    "days": "दिन",
    "hours": "घंटे",
    "minutes": "मिनट",
    "seconds": "सेकंड",
    "milliseconds": "मिलीसेकंड",
    "invalid-duration": "अमान्य अवधि",
    "results": "परिणाम",
    "add": "जोड़ें",
    "subtract": "घटाएं",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix टाइमस्टैम्प (मिलीसेकंड)",
    "unix-s": "Unix टाइमस्टैम्प (सेकंड)"
  },
  "tr": {
    "duration-calculator": "Süre Ekle/Çıkar Hesaplayıcı",
    "base-time": "Temel zaman",
    "time-zone": "Saat dilimi",
    "timezone-placeholder": "Saat dilimi seçin",
    "date-time": "Tarih ve saat",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Biçim: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Şimdi",
    "offset": "Ofset",
    "invalid-date-time": "Geçersiz tarih/saat",
    "duration": "Süre",
    "duration-iso": "ISO 8601 süresi",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "PnDTnHnMnS destekler (isteğe bağlı milisaniye).",
    "days": "Gün",
    "hours": "Saat",
    "minutes": "Dakika",
    "seconds": "Saniye",
    "milliseconds": "Milisaniye",
    "invalid-duration": "Geçersiz süre",
    "results": "Sonuçlar",
    "add": "Ekle",
    "subtract": "Çıkar",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix zaman damgası (ms)",
    "unix-s": "Unix zaman damgası (s)"
  },
  "nl": {
    "duration-calculator": "Duur optellen/aftrekken-calculator",
    "base-time": "Basistijd",
    "time-zone": "Tijdzone",
    "timezone-placeholder": "Selecteer een tijdzone",
    "date-time": "Datum en tijd",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formaat: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nu",
    "offset": "Offset",
    "invalid-date-time": "Ongeldige datum/tijd",
    "duration": "Duur",
    "duration-iso": "ISO 8601-duur",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Ondersteunt PnDTnHnMnS met optionele milliseconden.",
    "days": "Dagen",
    "hours": "Uren",
    "minutes": "Minuten",
    "seconds": "Seconden",
    "milliseconds": "Milliseconden",
    "invalid-duration": "Ongeldige duur",
    "results": "Resultaten",
    "add": "Optellen",
    "subtract": "Aftrekken",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-tijdstempel (ms)",
    "unix-s": "Unix-tijdstempel (s)"
  },
  "sv": {
    "duration-calculator": "Lägg till/ta bort varaktighet-räknare",
    "base-time": "Basstid",
    "time-zone": "Tidszon",
    "timezone-placeholder": "Välj en tidszon",
    "date-time": "Datum och tid",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nu",
    "offset": "Offset",
    "invalid-date-time": "Ogiltigt datum/tid",
    "duration": "Varaktighet",
    "duration-iso": "ISO 8601-varaktighet",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Stödjer PnDTnHnMnS med valfria millisekunder.",
    "days": "Dagar",
    "hours": "Timmar",
    "minutes": "Minuter",
    "seconds": "Sekunder",
    "milliseconds": "Millisekunder",
    "invalid-duration": "Ogiltig varaktighet",
    "results": "Resultat",
    "add": "Lägg till",
    "subtract": "Subtrahera",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-tidsstämpel (ms)",
    "unix-s": "Unix-tidsstämpel (s)"
  },
  "pl": {
    "duration-calculator": "Kalkulator dodawania/odejmowania czasu trwania",
    "base-time": "Czas bazowy",
    "time-zone": "Strefa czasowa",
    "timezone-placeholder": "Wybierz strefę czasową",
    "date-time": "Data i czas",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Teraz",
    "offset": "Przesunięcie",
    "invalid-date-time": "Nieprawidłowa data/czas",
    "duration": "Czas trwania",
    "duration-iso": "Czas trwania ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Obsługuje PnDTnHnMnS z opcjonalnymi milisekundami.",
    "days": "Dni",
    "hours": "Godziny",
    "minutes": "Minuty",
    "seconds": "Sekundy",
    "milliseconds": "Milisekundy",
    "invalid-duration": "Nieprawidłowy czas trwania",
    "results": "Wyniki",
    "add": "Dodaj",
    "subtract": "Odejmij",
    "iso-8601": "ISO 8601",
    "unix-ms": "Znacznik czasu Unix (ms)",
    "unix-s": "Znacznik czasu Unix (s)"
  },
  "vi": {
    "duration-calculator": "Máy tính cộng/trừ thời lượng",
    "base-time": "Thời gian gốc",
    "time-zone": "Múi giờ",
    "timezone-placeholder": "Chọn múi giờ",
    "date-time": "Ngày và giờ",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Định dạng: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Bây giờ",
    "offset": "Độ lệch",
    "invalid-date-time": "Ngày/giờ không hợp lệ",
    "duration": "Thời lượng",
    "duration-iso": "Thời lượng ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Hỗ trợ PnDTnHnMnS với mili giây tùy chọn.",
    "days": "Ngày",
    "hours": "Giờ",
    "minutes": "Phút",
    "seconds": "Giây",
    "milliseconds": "Mili giây",
    "invalid-duration": "Thời lượng không hợp lệ",
    "results": "Kết quả",
    "add": "Cộng",
    "subtract": "Trừ",
    "iso-8601": "ISO 8601",
    "unix-ms": "Dấu thời gian Unix (ms)",
    "unix-s": "Dấu thời gian Unix (s)"
  },
  "th": {
    "duration-calculator": "เครื่องคำนวณบวก/ลบระยะเวลา",
    "base-time": "เวลาฐาน",
    "time-zone": "เขตเวลา",
    "timezone-placeholder": "เลือกเขตเวลา",
    "date-time": "วันที่และเวลา",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "รูปแบบ: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "ตอนนี้",
    "offset": "ออฟเซ็ต",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง",
    "duration": "ระยะเวลา",
    "duration-iso": "ระยะเวลา ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "รองรับ PnDTnHnMnS พร้อมมิลลิวินาทีเป็นตัวเลือก",
    "days": "วัน",
    "hours": "ชั่วโมง",
    "minutes": "นาที",
    "seconds": "วินาที",
    "milliseconds": "มิลลิวินาที",
    "invalid-duration": "ระยะเวลาไม่ถูกต้อง",
    "results": "ผลลัพธ์",
    "add": "บวก",
    "subtract": "ลบ",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix timestamp (มิลลิวินาที)",
    "unix-s": "Unix timestamp (วินาที)"
  },
  "id": {
    "duration-calculator": "Kalkulator tambah/kurangi durasi",
    "base-time": "Waktu dasar",
    "time-zone": "Zona waktu",
    "timezone-placeholder": "Pilih zona waktu",
    "date-time": "Tanggal dan waktu",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Sekarang",
    "offset": "Offset",
    "invalid-date-time": "Tanggal/waktu tidak valid",
    "duration": "Durasi",
    "duration-iso": "Durasi ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Mendukung PnDTnHnMnS dengan milidetik opsional.",
    "days": "Hari",
    "hours": "Jam",
    "minutes": "Menit",
    "seconds": "Detik",
    "milliseconds": "Milidetik",
    "invalid-duration": "Durasi tidak valid",
    "results": "Hasil",
    "add": "Tambah",
    "subtract": "Kurangi",
    "iso-8601": "ISO 8601",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "he": {
    "duration-calculator": "מחשבון הוספה/חיסור משך",
    "base-time": "זמן בסיס",
    "time-zone": "אזור זמן",
    "timezone-placeholder": "בחר אזור זמן",
    "date-time": "תאריך ושעה",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "פורמט: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "עכשיו",
    "offset": "היסט",
    "invalid-date-time": "תאריך/שעה לא תקינים",
    "duration": "משך",
    "duration-iso": "משך ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "תומך ב‑PnDTnHnMnS עם מילישניות אופציונליות.",
    "days": "ימים",
    "hours": "שעות",
    "minutes": "דקות",
    "seconds": "שניות",
    "milliseconds": "מילישניות",
    "invalid-duration": "משך לא תקין",
    "results": "תוצאות",
    "add": "הוסף",
    "subtract": "החסר",
    "iso-8601": "ISO 8601",
    "unix-ms": "חותמת זמן Unix (מילישניות)",
    "unix-s": "חותמת זמן Unix (שניות)"
  },
  "ms": {
    "duration-calculator": "Pengira tambah/tolak durasi",
    "base-time": "Masa asas",
    "time-zone": "Zon masa",
    "timezone-placeholder": "Pilih zon masa",
    "date-time": "Tarikh dan masa",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Sekarang",
    "offset": "Ofset",
    "invalid-date-time": "Tarikh/masa tidak sah",
    "duration": "Durasi",
    "duration-iso": "Durasi ISO 8601",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Menyokong PnDTnHnMnS dengan milisaat pilihan.",
    "days": "Hari",
    "hours": "Jam",
    "minutes": "Minit",
    "seconds": "Saat",
    "milliseconds": "Milisaat",
    "invalid-duration": "Durasi tidak sah",
    "results": "Keputusan",
    "add": "Tambah",
    "subtract": "Tolak",
    "iso-8601": "ISO 8601",
    "unix-ms": "Cap masa Unix (ms)",
    "unix-s": "Cap masa Unix (s)"
  },
  "no": {
    "duration-calculator": "Kalkulator for legg til/trekk fra varighet",
    "base-time": "Basistid",
    "time-zone": "Tidssone",
    "timezone-placeholder": "Velg en tidssone",
    "date-time": "Dato og tid",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nå",
    "offset": "Offset",
    "invalid-date-time": "Ugyldig dato/tid",
    "duration": "Varighet",
    "duration-iso": "ISO 8601-varighet",
    "duration-placeholder": "P1DT2H3M4.005S",
    "duration-hint": "Støtter PnDTnHnMnS med valgfrie millisekunder.",
    "days": "Dager",
    "hours": "Timer",
    "minutes": "Minutter",
    "seconds": "Sekunder",
    "milliseconds": "Millisekunder",
    "invalid-duration": "Ugyldig varighet",
    "results": "Resultater",
    "add": "Legg til",
    "subtract": "Trekk fra",
    "iso-8601": "ISO 8601",
    "unix-ms": "Unix-tidsstempel (ms)",
    "unix-s": "Unix-tidsstempel (s)"
  }
}
</i18n>
