<template>
  <ToolSectionHeader>{{ t('converter') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="timezone-card">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ t('from') }}</n-text>
            <n-flex align="center" :size="8">
              <n-button text size="small" @click="setNow('from')">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton v-if="fromInput" :content="fromInput" size="small" />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="fromTimeZone"
              :options="timeZoneOptions"
              filterable
              :placeholder="t('timezone-placeholder')"
            />
            <n-text v-if="fromOffsetLabel" depth="3" style="margin-top: 4px">
              {{ t('offset') }}: {{ fromOffsetLabel }}
            </n-text>
          </div>

          <div>
            <n-text depth="3">{{ t('date-time') }}</n-text>
            <n-input
              v-model:value="fromInput"
              :placeholder="t('datetime-placeholder')"
              :status="fromStatus"
              @update:value="markEdited('from')"
            />
            <n-text depth="3" style="margin-top: 4px">
              {{ t('format-hint') }}
            </n-text>
            <n-text v-if="fromError" type="error" style="margin-top: 4px">
              {{ t('invalid-date-time') }}
            </n-text>
          </div>
        </n-flex>
      </n-gi>

      <n-gi>
        <n-flex vertical :size="12" class="timezone-card">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ t('to') }}</n-text>
            <n-flex align="center" :size="8">
              <n-button text size="small" @click="setNow('to')">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton v-if="toInput" :content="toInput" size="small" />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="toTimeZone"
              :options="timeZoneOptions"
              filterable
              :placeholder="t('timezone-placeholder')"
            />
            <n-text v-if="toOffsetLabel" depth="3" style="margin-top: 4px">
              {{ t('offset') }}: {{ toOffsetLabel }}
            </n-text>
          </div>

          <div>
            <n-text depth="3">{{ t('date-time') }}</n-text>
            <n-input
              v-model:value="toInput"
              :placeholder="t('datetime-placeholder')"
              :status="toStatus"
              @update:value="markEdited('to')"
            />
            <n-text depth="3" style="margin-top: 4px">
              {{ t('format-hint') }}
            </n-text>
            <n-text v-if="toError" type="error" style="margin-top: 4px">
              {{ t('invalid-date-time') }}
            </n-text>
          </div>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSection>
    <n-flex justify="space-between" align="center" :wrap="true">
      <n-button @click="swapTimeZones" secondary>
        <template #icon>
          <n-icon :component="ArrowSwap20Regular" />
        </template>
        {{ t('swap') }}
      </n-button>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('details') }}</ToolSectionHeader>
  <ToolSection>
    <n-descriptions :column="1" label-placement="left" bordered>
      <n-descriptions-item :label="t('iso-8601')">
        <n-flex align="center" :size="8">
          <code>{{ isoString || '-' }}</code>
          <CopyToClipboardButton v-if="isoString" :content="isoString" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('utc')">
        <n-flex align="center" :size="8">
          <code>{{ utcString || '-' }}</code>
          <CopyToClipboardButton v-if="utcString" :content="utcString" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('unix-ms')">
        <n-flex align="center" :size="8">
          <code>{{ unixMilliseconds || '-' }}</code>
          <CopyToClipboardButton v-if="unixMilliseconds" :content="unixMilliseconds" size="tiny" />
        </n-flex>
      </n-descriptions-item>
      <n-descriptions-item :label="t('unix-s')">
        <n-flex align="center" :size="8">
          <code>{{ unixSeconds || '-' }}</code>
          <CopyToClipboardButton v-if="unixSeconds" :content="unixSeconds" size="tiny" />
        </n-flex>
      </n-descriptions-item>
    </n-descriptions>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
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
import {
  formatInTimeZone,
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
} from '../utils/timeZone'

const { t } = useI18n()

const timeZones = getSupportedTimeZones()
const optionReferenceTimestamp = Date.now()
const timeZoneOptions = timeZones.map((timeZone) => {
  try {
    const offsetLabel = formatOffsetLabel(getTimeZoneOffsetMs(optionReferenceTimestamp, timeZone))
    return {
      label: `${timeZone} (${offsetLabel})`,
      value: timeZone,
    }
  } catch {
    return {
      label: timeZone,
      value: timeZone,
    }
  }
})

const resolvedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
const defaultFromTimeZone = isTimeZoneSupported(resolvedTimeZone) ? resolvedTimeZone : 'UTC'
const defaultToCandidate = defaultFromTimeZone === 'UTC' ? 'America/New_York' : 'UTC'
const defaultToTimeZone = isTimeZoneSupported(defaultToCandidate) ? defaultToCandidate : 'UTC'

const fromTimeZone = useStorage('tools:time-zone-converter:from-timezone', defaultFromTimeZone)
const toTimeZone = useStorage('tools:time-zone-converter:to-timezone', defaultToTimeZone)
const fromInput = useStorage(
  'tools:time-zone-converter:from-input',
  formatInTimeZone(Date.now(), defaultFromTimeZone),
)
const toInput = useStorage(
  'tools:time-zone-converter:to-input',
  formatInTimeZone(Date.now(), defaultToTimeZone),
)

if (!isTimeZoneSupported(fromTimeZone.value)) {
  fromTimeZone.value = defaultFromTimeZone
}

if (!isTimeZoneSupported(toTimeZone.value)) {
  toTimeZone.value = defaultToTimeZone
}

const lastEdited = ref<'from' | 'to'>('from')

const fromParts = computed(() => parseDateTimeInput(fromInput.value))
const toParts = computed(() => parseDateTimeInput(toInput.value))

const fromStatus = computed(() => {
  if (!fromInput.value.trim()) return undefined
  return fromParts.value ? 'success' : 'error'
})

const toStatus = computed(() => {
  if (!toInput.value.trim()) return undefined
  return toParts.value ? 'success' : 'error'
})

const fromError = computed(() => Boolean(fromInput.value.trim()) && !fromParts.value)
const toError = computed(() => Boolean(toInput.value.trim()) && !toParts.value)

const baseTimestamp = computed(() => {
  if (lastEdited.value === 'from') {
    if (!fromParts.value || !isTimeZoneSupported(fromTimeZone.value)) return null
    return toUtcTimestamp(fromParts.value, fromTimeZone.value)
  }

  if (!toParts.value || !isTimeZoneSupported(toTimeZone.value)) return null
  return toUtcTimestamp(toParts.value, toTimeZone.value)
})

const referenceTimestamp = computed(() => baseTimestamp.value ?? Date.now())

const fromOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(fromTimeZone.value)) return ''
  return formatOffsetLabel(getTimeZoneOffsetMs(referenceTimestamp.value, fromTimeZone.value))
})

const toOffsetLabel = computed(() => {
  if (!isTimeZoneSupported(toTimeZone.value)) return ''
  return formatOffsetLabel(getTimeZoneOffsetMs(referenceTimestamp.value, toTimeZone.value))
})

const isoString = computed(() => {
  if (baseTimestamp.value === null) return ''
  return new Date(baseTimestamp.value).toISOString()
})

const utcString = computed(() => {
  if (baseTimestamp.value === null) return ''
  return new Date(baseTimestamp.value).toUTCString()
})

const unixMilliseconds = computed(() => {
  if (baseTimestamp.value === null) return ''
  return String(baseTimestamp.value)
})

const unixSeconds = computed(() => {
  if (baseTimestamp.value === null) return ''
  return String(Math.floor(baseTimestamp.value / 1000))
})

watch(
  [baseTimestamp, fromTimeZone, toTimeZone, lastEdited],
  () => {
    if (baseTimestamp.value === null) return
    if (lastEdited.value === 'from') {
      toInput.value = formatInTimeZone(baseTimestamp.value, toTimeZone.value)
      return
    }
    fromInput.value = formatInTimeZone(baseTimestamp.value, fromTimeZone.value)
  },
  { immediate: true },
)

function markEdited(source: 'from' | 'to') {
  lastEdited.value = source
}

function setNow(source: 'from' | 'to') {
  const now = Date.now()
  if (source === 'from') {
    fromInput.value = formatInTimeZone(now, fromTimeZone.value)
    lastEdited.value = 'from'
    return
  }

  toInput.value = formatInTimeZone(now, toTimeZone.value)
  lastEdited.value = 'to'
}

function swapTimeZones() {
  const nextFromZone = toTimeZone.value
  const nextToZone = fromTimeZone.value
  const nextFromInput = toInput.value
  const nextToInput = fromInput.value

  fromTimeZone.value = nextFromZone
  toTimeZone.value = nextToZone
  fromInput.value = nextFromInput
  toInput.value = nextToInput
  lastEdited.value = 'from'
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
    "converter": "Time Zone Converter",
    "from": "From",
    "to": "To",
    "time-zone": "Time zone",
    "timezone-placeholder": "Select a time zone",
    "date-time": "Date & time",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Now",
    "swap": "Swap",
    "offset": "Offset",
    "invalid-date-time": "Invalid date/time",
    "details": "Details",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix timestamp (ms)",
    "unix-s": "Unix timestamp (s)"
  },
  "zh": {
    "converter": "时区转换器",
    "from": "从",
    "to": "到",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "date-time": "日期与时间",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "现在",
    "swap": "交换",
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间",
    "details": "详情",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 时间戳（毫秒）",
    "unix-s": "Unix 时间戳（秒）"
  },
  "zh-CN": {
    "converter": "时区转换器",
    "from": "从",
    "to": "到",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "date-time": "日期与时间",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "现在",
    "swap": "交换",
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间",
    "details": "详情",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 时间戳（毫秒）",
    "unix-s": "Unix 时间戳（秒）"
  },
  "zh-TW": {
    "converter": "時區轉換器",
    "from": "從",
    "to": "到",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "date-time": "日期與時間",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "swap": "交換",
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間",
    "details": "詳情",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 時間戳記（毫秒）",
    "unix-s": "Unix 時間戳記（秒）"
  },
  "zh-HK": {
    "converter": "時區轉換器",
    "from": "從",
    "to": "到",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "date-time": "日期與時間",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "swap": "交換",
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間",
    "details": "詳情",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 時間戳記（毫秒）",
    "unix-s": "Unix 時間戳記（秒）"
  },
  "es": {
    "converter": "Convertidor de Zona Horaria",
    "from": "De",
    "to": "A",
    "time-zone": "Zona horaria",
    "timezone-placeholder": "Selecciona una zona horaria",
    "date-time": "Fecha y hora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Ahora",
    "swap": "Intercambiar",
    "offset": "Desfase",
    "invalid-date-time": "Fecha/hora inválida",
    "details": "Detalles",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Marca de tiempo Unix (ms)",
    "unix-s": "Marca de tiempo Unix (s)"
  },
  "fr": {
    "converter": "Convertisseur de fuseau horaire",
    "from": "De",
    "to": "À",
    "time-zone": "Fuseau horaire",
    "timezone-placeholder": "Sélectionner un fuseau horaire",
    "date-time": "Date et heure",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format : YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Maintenant",
    "swap": "Inverser",
    "offset": "Décalage",
    "invalid-date-time": "Date/heure invalide",
    "details": "Détails",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "de": {
    "converter": "Zeitzonen-Konverter",
    "from": "Von",
    "to": "Nach",
    "time-zone": "Zeitzone",
    "timezone-placeholder": "Zeitzone auswählen",
    "date-time": "Datum und Uhrzeit",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Jetzt",
    "swap": "Tauschen",
    "offset": "Offset",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit",
    "details": "Details",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix-Zeitstempel (ms)",
    "unix-s": "Unix-Zeitstempel (s)"
  },
  "it": {
    "converter": "Convertitore di fuso orario",
    "from": "Da",
    "to": "A",
    "time-zone": "Fuso orario",
    "timezone-placeholder": "Seleziona un fuso orario",
    "date-time": "Data e ora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Adesso",
    "swap": "Scambia",
    "offset": "Offset",
    "invalid-date-time": "Data/ora non valida",
    "details": "Dettagli",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "ja": {
    "converter": "タイムゾーン変換",
    "from": "元",
    "to": "先",
    "time-zone": "タイムゾーン",
    "timezone-placeholder": "タイムゾーンを選択",
    "date-time": "日付と時刻",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "形式: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "swap": "入れ替え",
    "offset": "オフセット",
    "invalid-date-time": "無効な日付/時刻",
    "details": "詳細",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix タイムスタンプ (ms)",
    "unix-s": "Unix タイムスタンプ (s)"
  },
  "ko": {
    "converter": "시간대 변환기",
    "from": "출발",
    "to": "도착",
    "time-zone": "시간대",
    "timezone-placeholder": "시간대 선택",
    "date-time": "날짜 및 시간",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "형식: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "지금",
    "swap": "바꾸기",
    "offset": "오프셋",
    "invalid-date-time": "유효하지 않은 날짜/시간",
    "details": "세부 정보",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix 타임스탬프 (ms)",
    "unix-s": "Unix 타임스탬프 (s)"
  },
  "ru": {
    "converter": "Конвертер часовых поясов",
    "from": "Из",
    "to": "В",
    "time-zone": "Часовой пояс",
    "timezone-placeholder": "Выберите часовой пояс",
    "date-time": "Дата и время",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Формат: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Сейчас",
    "swap": "Поменять",
    "offset": "Смещение",
    "invalid-date-time": "Недействительная дата/время",
    "details": "Детали",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix метка времени (мс)",
    "unix-s": "Unix метка времени (с)"
  },
  "pt": {
    "converter": "Conversor de fuso horário",
    "from": "De",
    "to": "Para",
    "time-zone": "Fuso horário",
    "timezone-placeholder": "Selecione um fuso horário",
    "date-time": "Data e hora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Agora",
    "swap": "Trocar",
    "offset": "Offset",
    "invalid-date-time": "Data/hora inválida",
    "details": "Detalhes",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "ar": {
    "converter": "محول المناطق الزمنية",
    "from": "من",
    "to": "إلى",
    "time-zone": "المنطقة الزمنية",
    "timezone-placeholder": "اختر منطقة زمنية",
    "date-time": "التاريخ والوقت",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "التنسيق: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "الآن",
    "swap": "تبديل",
    "offset": "الإزاحة",
    "invalid-date-time": "تاريخ/وقت غير صالح",
    "details": "التفاصيل",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "طابع زمني Unix (مللي ثانية)",
    "unix-s": "طابع زمني Unix (ثانية)"
  },
  "hi": {
    "converter": "समय क्षेत्र परिवर्तक",
    "from": "से",
    "to": "तक",
    "time-zone": "समय क्षेत्र",
    "timezone-placeholder": "समय क्षेत्र चुनें",
    "date-time": "दिनांक और समय",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "फ़ॉर्मेट: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "अभी",
    "swap": "अदला-बदली",
    "offset": "ऑफ़सेट",
    "invalid-date-time": "अमान्य दिनांक/समय",
    "details": "विवरण",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix टाइमस्टैम्प (ms)",
    "unix-s": "Unix टाइमस्टैम्प (s)"
  },
  "tr": {
    "converter": "Saat Dilimi Dönüştürücü",
    "from": "Başlangıç",
    "to": "Hedef",
    "time-zone": "Saat dilimi",
    "timezone-placeholder": "Saat dilimi seçin",
    "date-time": "Tarih ve saat",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Biçim: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Şimdi",
    "swap": "Değiştir",
    "offset": "Ofset",
    "invalid-date-time": "Geçersiz tarih/saat",
    "details": "Detaylar",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix zaman damgası (ms)",
    "unix-s": "Unix zaman damgası (s)"
  },
  "nl": {
    "converter": "Tijdzoneconverter",
    "from": "Van",
    "to": "Naar",
    "time-zone": "Tijdzone",
    "timezone-placeholder": "Selecteer een tijdzone",
    "date-time": "Datum en tijd",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formaat: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nu",
    "swap": "Wisselen",
    "offset": "Offset",
    "invalid-date-time": "Ongeldige datum/tijd",
    "details": "Details",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix-tijdstempel (ms)",
    "unix-s": "Unix-tijdstempel (s)"
  },
  "sv": {
    "converter": "Tidszonskonverterare",
    "from": "Från",
    "to": "Till",
    "time-zone": "Tidszon",
    "timezone-placeholder": "Välj en tidszon",
    "date-time": "Datum och tid",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nu",
    "swap": "Byt",
    "offset": "Offset",
    "invalid-date-time": "Ogiltigt datum/tid",
    "details": "Detaljer",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix-tidsstämpel (ms)",
    "unix-s": "Unix-tidsstämpel (s)"
  },
  "pl": {
    "converter": "Konwerter stref czasowych",
    "from": "Z",
    "to": "Do",
    "time-zone": "Strefa czasowa",
    "timezone-placeholder": "Wybierz strefę czasową",
    "date-time": "Data i godzina",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Teraz",
    "swap": "Zamień",
    "offset": "Przesunięcie",
    "invalid-date-time": "Nieprawidłowa data/godzina",
    "details": "Szczegóły",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Znacznik czasu Unix (ms)",
    "unix-s": "Znacznik czasu Unix (s)"
  },
  "vi": {
    "converter": "Bộ chuyển đổi múi giờ",
    "from": "Từ",
    "to": "Đến",
    "time-zone": "Múi giờ",
    "timezone-placeholder": "Chọn múi giờ",
    "date-time": "Ngày & giờ",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Định dạng: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Bây giờ",
    "swap": "Hoán đổi",
    "offset": "Độ lệch",
    "invalid-date-time": "Ngày/giờ không hợp lệ",
    "details": "Chi tiết",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Dấu thời gian Unix (ms)",
    "unix-s": "Dấu thời gian Unix (s)"
  },
  "th": {
    "converter": "ตัวแปลงเขตเวลา",
    "from": "จาก",
    "to": "ถึง",
    "time-zone": "เขตเวลา",
    "timezone-placeholder": "เลือกเขตเวลา",
    "date-time": "วันที่และเวลา",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "รูปแบบ: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "ตอนนี้",
    "swap": "สลับ",
    "offset": "ออฟเซ็ต",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง",
    "details": "รายละเอียด",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix timestamp (มิลลิวินาที)",
    "unix-s": "Unix timestamp (วินาที)"
  },
  "id": {
    "converter": "Konverter Zona Waktu",
    "from": "Dari",
    "to": "Ke",
    "time-zone": "Zona waktu",
    "timezone-placeholder": "Pilih zona waktu",
    "date-time": "Tanggal & waktu",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Sekarang",
    "swap": "Tukar",
    "offset": "Offset",
    "invalid-date-time": "Tanggal/waktu tidak valid",
    "details": "Detail",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Timestamp Unix (ms)",
    "unix-s": "Timestamp Unix (s)"
  },
  "he": {
    "converter": "ממיר אזורי זמן",
    "from": "מ",
    "to": "ל",
    "time-zone": "אזור זמן",
    "timezone-placeholder": "בחר אזור זמן",
    "date-time": "תאריך ושעה",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "פורמט: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "עכשיו",
    "swap": "החלפה",
    "offset": "היסט",
    "invalid-date-time": "תאריך/שעה לא תקינים",
    "details": "פרטים",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "חותמת זמן Unix (ms)",
    "unix-s": "חותמת זמן Unix (s)"
  },
  "ms": {
    "converter": "Penukar Zon Masa",
    "from": "Dari",
    "to": "Ke",
    "time-zone": "Zon masa",
    "timezone-placeholder": "Pilih zon masa",
    "date-time": "Tarikh & masa",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Sekarang",
    "swap": "Tukar",
    "offset": "Ofset",
    "invalid-date-time": "Tarikh/masa tidak sah",
    "details": "Butiran",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Cap masa Unix (ms)",
    "unix-s": "Cap masa Unix (s)"
  },
  "no": {
    "converter": "Tidssonekonverterer",
    "from": "Fra",
    "to": "Til",
    "time-zone": "Tidssone",
    "timezone-placeholder": "Velg en tidssone",
    "date-time": "Dato og tid",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nå",
    "swap": "Bytt",
    "offset": "Offset",
    "invalid-date-time": "Ugyldig dato/tid",
    "details": "Detaljer",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "unix-ms": "Unix-tidsstempel (ms)",
    "unix-s": "Unix-tidsstempel (s)"
  }
}
</i18n>
