<template>
  <ToolSectionHeader>{{ t('duration-calculator') }}</ToolSectionHeader>
  <ToolSection>
    <DurationCalculatorInputs
      v-model:base-input="baseInput"
      v-model:base-time-zone="baseTimeZone"
      v-model:duration-iso-input="durationIsoInput"
      v-model:duration-parts="durationParts"
      :base-status="baseStatus"
      :base-error="baseError"
      :base-offset-label="baseOffsetLabel"
      :time-zone-options="timeZoneOptions"
      :duration-iso-status="durationIsoStatus"
      :duration-iso-invalid="durationIsoInvalid"
      :normalized-duration-iso="normalizedDurationIso"
      @now="setNow"
    />
  </ToolSection>

  <ToolSectionHeader>{{ t('results') }}</ToolSectionHeader>
  <ToolSection>
    <DurationCalculatorResults
      :added-date-time="addedDateTime"
      :added-iso="addedIso"
      :added-unix-ms="addedUnixMs"
      :added-unix-seconds="addedUnixSeconds"
      :subtracted-date-time="subtractedDateTime"
      :subtracted-iso="subtractedIso"
      :subtracted-unix-ms="subtractedUnixMs"
      :subtracted-unix-seconds="subtractedUnixSeconds"
    />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
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
import DurationCalculatorInputs from './DurationCalculatorInputs.vue'
import DurationCalculatorResults from './DurationCalculatorResults.vue'

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

const durationIsoInvalid = computed(
  () => Boolean(durationIsoInput.value.trim()) && !durationIsoParsed.value,
)

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

<i18n lang="json">
{
  "en": {
    "duration-calculator": "Duration Add/Subtract Calculator",
    "results": "Results"
  },
  "zh": {
    "duration-calculator": "时长加减计算器",
    "results": "结果"
  },
  "zh-CN": {
    "duration-calculator": "时长加减计算器",
    "results": "结果"
  },
  "zh-TW": {
    "duration-calculator": "時長加減計算器",
    "results": "結果"
  },
  "zh-HK": {
    "duration-calculator": "時長加減計算器",
    "results": "結果"
  },
  "es": {
    "duration-calculator": "Calculadora de suma/resta de duración",
    "results": "Resultados"
  },
  "fr": {
    "duration-calculator": "Calculateur d'ajout/soustraction de durée",
    "results": "Résultats"
  },
  "de": {
    "duration-calculator": "Dauer-Addieren/Subtrahieren-Rechner",
    "results": "Ergebnisse"
  },
  "it": {
    "duration-calculator": "Calcolatore di somma/sottrazione della durata",
    "results": "Risultati"
  },
  "ja": {
    "duration-calculator": "期間の加算/減算計算ツール",
    "results": "結果"
  },
  "ko": {
    "duration-calculator": "기간 더하기/빼기 계산기",
    "results": "결과"
  },
  "ru": {
    "duration-calculator": "Калькулятор сложения/вычитания длительности",
    "results": "Результаты"
  },
  "pt": {
    "duration-calculator": "Calculadora de adicionar/subtrair duração",
    "results": "Resultados"
  },
  "ar": {
    "duration-calculator": "حاسبة إضافة/طرح المدة",
    "results": "النتائج"
  },
  "hi": {
    "duration-calculator": "अवधि जोड़ें/घटाएं कैलकुलेटर",
    "results": "परिणाम"
  },
  "tr": {
    "duration-calculator": "Süre Ekle/Çıkar Hesaplayıcı",
    "results": "Sonuçlar"
  },
  "nl": {
    "duration-calculator": "Duur optellen/aftrekken-calculator",
    "results": "Resultaten"
  },
  "sv": {
    "duration-calculator": "Lägg till/ta bort varaktighet-räknare",
    "results": "Resultat"
  },
  "pl": {
    "duration-calculator": "Kalkulator dodawania/odejmowania czasu trwania",
    "results": "Wyniki"
  },
  "vi": {
    "duration-calculator": "Máy tính cộng/trừ thời lượng",
    "results": "Kết quả"
  },
  "th": {
    "duration-calculator": "เครื่องคำนวณบวก/ลบระยะเวลา",
    "results": "ผลลัพธ์"
  },
  "id": {
    "duration-calculator": "Kalkulator tambah/kurangi durasi",
    "results": "Hasil"
  },
  "he": {
    "duration-calculator": "מחשבון הוספה/חיסור משך",
    "results": "תוצאות"
  },
  "ms": {
    "duration-calculator": "Pengira tambah/tolak durasi",
    "results": "Keputusan"
  },
  "no": {
    "duration-calculator": "Kalkulator for legg til/trekk fra varighet",
    "results": "Resultater"
  }
}
</i18n>
