<template>
  <div>
    <ToolSectionHeader>{{ t('unix-timestamp') }}</ToolSectionHeader>
    <ToolSection>
      <n-input
        v-model:value="timestampInput"
        type="text"
        :placeholder="t('timestamp-placeholder')"
        :status="isValidTimestamp ? undefined : 'error'"
      />
    </ToolSection>
    <ToolSection>
      <n-flex justify="space-between" align="center">
        <n-flex :size="12">
          <CopyToClipboardButton :content="timestampInput" />
          <n-button text @click="setNow">
            <template #icon>
              <n-icon :component="ClockIcon" />
            </template>
            {{ t('now') }}
          </n-button>
        </n-flex>
        <template v-if="!isValidTimestamp">
          <n-text type="error">{{ t('invalid-timestamp') }}</n-text>
        </template>
      </n-flex>
    </ToolSection>

    <ToolSectionHeader>{{ t('unit') }}</ToolSectionHeader>
    <ToolSection>
      <n-radio-group v-model:value="unit">
        <n-flex :size="16">
          <n-radio value="auto">{{ t('auto') }}</n-radio>
          <n-radio value="seconds">{{ t('seconds') }}</n-radio>
          <n-radio value="milliseconds">{{ t('milliseconds') }}</n-radio>
          <n-radio value="nanoseconds">{{ t('nanoseconds') }}</n-radio>
        </n-flex>
      </n-radio-group>
    </ToolSection>
    <ToolSection v-if="unit === 'auto' && isValidTimestamp">
      <n-text depth="3">
        {{ t('detected') }}: {{ t(detectedUnit) }} ({{ digitCount }} {{ t('digits') }})
      </n-text>
    </ToolSection>

    <ToolSectionHeader>{{ t('date-time') }}</ToolSectionHeader>
    <ToolSection>
      <n-date-picker
        v-model:value="datePickerValue"
        type="datetime"
        :disabled="!isValidTimestamp"
        style="width: 100%"
      />
    </ToolSection>
    <ToolSection>
      <CopyToClipboardButton :content="localDateString" />
    </ToolSection>

    <ToolSection v-if="isValidTimestamp">
      <n-descriptions :column="1" label-placement="left" bordered>
        <n-descriptions-item :label="t('iso-8601')">
          <n-flex align="center" :size="8">
            <code>{{ isoString }}</code>
            <CopyToClipboardButton :content="isoString" size="tiny" />
          </n-flex>
        </n-descriptions-item>
        <n-descriptions-item :label="t('utc')">
          <n-flex align="center" :size="8">
            <code>{{ utcString }}</code>
            <CopyToClipboardButton :content="utcString" size="tiny" />
          </n-flex>
        </n-descriptions-item>
        <n-descriptions-item :label="t('relative')">
          <n-time :time="datePickerValue ?? undefined" type="relative" :to="now" />
        </n-descriptions-item>
      </n-descriptions>
    </ToolSection>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import {
  NInput,
  NFlex,
  NText,
  NButton,
  NIcon,
  NRadioGroup,
  NRadio,
  NDatePicker,
  NDescriptions,
  NDescriptionsItem,
  NTime,
} from 'naive-ui'
import { ToolSectionHeader, ToolSection } from '@shared/ui/tool'
import { useI18n } from 'vue-i18n'
import { CopyToClipboardButton } from '@shared/ui/base'
import { Clock16Regular as ClockIcon } from '@shared/icons/fluent'
import { useNow } from '@vueuse/core'

const { t } = useI18n()

type TimestampUnit = 'auto' | 'seconds' | 'milliseconds' | 'nanoseconds'

// State
const timestampInput = ref<string>(String(Date.now()))
const unit = ref<TimestampUnit>('auto')

// Detect unit based on digit count
function detectUnit(timestamp: number): 'seconds' | 'milliseconds' | 'nanoseconds' {
  const len = String(Math.abs(Math.floor(timestamp))).length
  if (len <= 10) return 'seconds'
  if (len <= 13) return 'milliseconds'
  return 'nanoseconds'
}

// Convert to milliseconds (Date uses milliseconds)
function toMilliseconds(ts: number, tsUnit: 'seconds' | 'milliseconds' | 'nanoseconds'): number {
  switch (tsUnit) {
    case 'seconds':
      return ts * 1000
    case 'milliseconds':
      return ts
    case 'nanoseconds':
      return Math.floor(ts / 1_000_000)
  }
}

// Convert from milliseconds to target unit
function fromMilliseconds(ms: number, tsUnit: 'seconds' | 'milliseconds' | 'nanoseconds'): number {
  switch (tsUnit) {
    case 'seconds':
      return Math.floor(ms / 1000)
    case 'milliseconds':
      return ms
    case 'nanoseconds':
      return ms * 1_000_000
  }
}

// Computed properties
const isValidTimestamp = computed(() => {
  const value = timestampInput.value.trim()
  if (value === '') return false
  const num = Number(value)
  return !isNaN(num) && isFinite(num)
})

const timestampNumber = computed(() => Number(timestampInput.value))

const digitCount = computed(() => {
  if (!isValidTimestamp.value) return 0
  return String(Math.abs(Math.floor(timestampNumber.value))).length
})

const detectedUnit = computed(() => {
  if (!isValidTimestamp.value) return 'milliseconds'
  return detectUnit(timestampNumber.value)
})

const effectiveUnit = computed(() => {
  return unit.value === 'auto' ? detectedUnit.value : unit.value
})

const dateObject = computed(() => {
  if (!isValidTimestamp.value) return null
  const ms = toMilliseconds(timestampNumber.value, effectiveUnit.value)
  return new Date(ms)
})

const datePickerValue = computed({
  get: () => {
    if (!dateObject.value) return null
    return dateObject.value.getTime()
  },
  set: (value: number | null) => {
    if (value === null) return
    const newTimestamp = fromMilliseconds(value, effectiveUnit.value)
    timestampInput.value = String(newTimestamp)
  },
})

const localDateString = computed(() => {
  if (!dateObject.value) return ''
  return dateObject.value.toLocaleString()
})

const isoString = computed(() => {
  if (!dateObject.value) return ''
  return dateObject.value.toISOString()
})

const utcString = computed(() => {
  if (!dateObject.value) return ''
  return dateObject.value.toUTCString()
})

// Reactive current time for relative display
const now = useNow({ interval: 1000 })

// Methods
function setNow() {
  const now = Date.now()
  timestampInput.value = String(fromMilliseconds(now, effectiveUnit.value))
}

// Watch for unit changes - recalculate timestamp when switching units
watch(unit, (newUnit, oldUnit) => {
  if (!isValidTimestamp.value) return
  if (newUnit === 'auto' || oldUnit === 'auto') return

  // Convert current timestamp to milliseconds using old unit, then to new unit
  const ms = toMilliseconds(
    timestampNumber.value,
    oldUnit as 'seconds' | 'milliseconds' | 'nanoseconds',
  )
  const newTimestamp = fromMilliseconds(ms, newUnit as 'seconds' | 'milliseconds' | 'nanoseconds')
  timestampInput.value = String(newTimestamp)
})
</script>

<i18n lang="json">
{
  "en": {
    "unix-timestamp": "Unix Timestamp",
    "timestamp-placeholder": "Enter Unix timestamp...",
    "invalid-timestamp": "Invalid timestamp",
    "now": "Now",
    "unit": "Unit",
    "auto": "Auto",
    "seconds": "Seconds",
    "milliseconds": "Milliseconds",
    "nanoseconds": "Nanoseconds",
    "detected": "Detected",
    "digits": "digits",
    "date-time": "Date & Time",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relative"
  },
  "zh": {
    "unix-timestamp": "Unix 时间戳",
    "timestamp-placeholder": "输入 Unix 时间戳...",
    "invalid-timestamp": "无效的时间戳",
    "now": "现在",
    "unit": "单位",
    "auto": "自动",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "nanoseconds": "纳秒",
    "detected": "检测到",
    "digits": "位",
    "date-time": "日期与时间",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相对时间"
  },
  "zh-CN": {
    "unix-timestamp": "Unix 时间戳",
    "timestamp-placeholder": "输入 Unix 时间戳...",
    "invalid-timestamp": "无效的时间戳",
    "now": "现在",
    "unit": "单位",
    "auto": "自动",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "nanoseconds": "纳秒",
    "detected": "检测到",
    "digits": "位",
    "date-time": "日期与时间",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相对时间"
  },
  "zh-TW": {
    "unix-timestamp": "Unix 時間戳記",
    "timestamp-placeholder": "輸入 Unix 時間戳記...",
    "invalid-timestamp": "無效的時間戳記",
    "now": "現在",
    "unit": "單位",
    "auto": "自動",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "nanoseconds": "奈秒",
    "detected": "偵測到",
    "digits": "位",
    "date-time": "日期與時間",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相對時間"
  },
  "zh-HK": {
    "unix-timestamp": "Unix 時間戳記",
    "timestamp-placeholder": "輸入 Unix 時間戳記...",
    "invalid-timestamp": "無效的時間戳記",
    "now": "現在",
    "unit": "單位",
    "auto": "自動",
    "seconds": "秒",
    "milliseconds": "毫秒",
    "nanoseconds": "納秒",
    "detected": "偵測到",
    "digits": "位",
    "date-time": "日期與時間",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相對時間"
  },
  "es": {
    "unix-timestamp": "Marca de Tiempo Unix",
    "timestamp-placeholder": "Ingrese marca de tiempo Unix...",
    "invalid-timestamp": "Marca de tiempo inválida",
    "now": "Ahora",
    "unit": "Unidad",
    "auto": "Auto",
    "seconds": "Segundos",
    "milliseconds": "Milisegundos",
    "nanoseconds": "Nanosegundos",
    "detected": "Detectado",
    "digits": "dígitos",
    "date-time": "Fecha y Hora",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativo"
  },
  "fr": {
    "unix-timestamp": "Timestamp Unix",
    "timestamp-placeholder": "Entrez le timestamp Unix...",
    "invalid-timestamp": "Timestamp invalide",
    "now": "Maintenant",
    "unit": "Unité",
    "auto": "Auto",
    "seconds": "Secondes",
    "milliseconds": "Millisecondes",
    "nanoseconds": "Nanosecondes",
    "detected": "Détecté",
    "digits": "chiffres",
    "date-time": "Date et Heure",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relatif"
  },
  "de": {
    "unix-timestamp": "Unix-Zeitstempel",
    "timestamp-placeholder": "Unix-Zeitstempel eingeben...",
    "invalid-timestamp": "Ungültiger Zeitstempel",
    "now": "Jetzt",
    "unit": "Einheit",
    "auto": "Auto",
    "seconds": "Sekunden",
    "milliseconds": "Millisekunden",
    "nanoseconds": "Nanosekunden",
    "detected": "Erkannt",
    "digits": "Ziffern",
    "date-time": "Datum und Uhrzeit",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativ"
  },
  "it": {
    "unix-timestamp": "Timestamp Unix",
    "timestamp-placeholder": "Inserisci timestamp Unix...",
    "invalid-timestamp": "Timestamp non valido",
    "now": "Adesso",
    "unit": "Unità",
    "auto": "Auto",
    "seconds": "Secondi",
    "milliseconds": "Millisecondi",
    "nanoseconds": "Nanosecondi",
    "detected": "Rilevato",
    "digits": "cifre",
    "date-time": "Data e Ora",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativo"
  },
  "ja": {
    "unix-timestamp": "Unixタイムスタンプ",
    "timestamp-placeholder": "Unixタイムスタンプを入力...",
    "invalid-timestamp": "無効なタイムスタンプ",
    "now": "現在",
    "unit": "単位",
    "auto": "自動",
    "seconds": "秒",
    "milliseconds": "ミリ秒",
    "nanoseconds": "ナノ秒",
    "detected": "検出",
    "digits": "桁",
    "date-time": "日付と時刻",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "相対時間"
  },
  "ko": {
    "unix-timestamp": "Unix 타임스탬프",
    "timestamp-placeholder": "Unix 타임스탬프 입력...",
    "invalid-timestamp": "유효하지 않은 타임스탬프",
    "now": "현재",
    "unit": "단위",
    "auto": "자동",
    "seconds": "초",
    "milliseconds": "밀리초",
    "nanoseconds": "나노초",
    "detected": "감지됨",
    "digits": "자리",
    "date-time": "날짜 및 시간",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "상대 시간"
  },
  "ru": {
    "unix-timestamp": "Unix-метка времени",
    "timestamp-placeholder": "Введите Unix-метку времени...",
    "invalid-timestamp": "Недопустимая метка времени",
    "now": "Сейчас",
    "unit": "Единица",
    "auto": "Авто",
    "seconds": "Секунды",
    "milliseconds": "Миллисекунды",
    "nanoseconds": "Наносекунды",
    "detected": "Обнаружено",
    "digits": "цифр",
    "date-time": "Дата и время",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Относительное"
  },
  "pt": {
    "unix-timestamp": "Timestamp Unix",
    "timestamp-placeholder": "Digite o timestamp Unix...",
    "invalid-timestamp": "Timestamp inválido",
    "now": "Agora",
    "unit": "Unidade",
    "auto": "Auto",
    "seconds": "Segundos",
    "milliseconds": "Milissegundos",
    "nanoseconds": "Nanossegundos",
    "detected": "Detectado",
    "digits": "dígitos",
    "date-time": "Data e Hora",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativo"
  },
  "ar": {
    "unix-timestamp": "الطابع الزمني Unix",
    "timestamp-placeholder": "أدخل الطابع الزمني Unix...",
    "invalid-timestamp": "طابع زمني غير صالح",
    "now": "الآن",
    "unit": "الوحدة",
    "auto": "تلقائي",
    "seconds": "ثواني",
    "milliseconds": "ملي ثانية",
    "nanoseconds": "نانو ثانية",
    "detected": "تم الكشف",
    "digits": "أرقام",
    "date-time": "التاريخ والوقت",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "نسبي"
  },
  "hi": {
    "unix-timestamp": "Unix टाइमस्टैम्प",
    "timestamp-placeholder": "Unix टाइमस्टैम्प दर्ज करें...",
    "invalid-timestamp": "अमान्य टाइमस्टैम्प",
    "now": "अभी",
    "unit": "इकाई",
    "auto": "स्वचालित",
    "seconds": "सेकंड",
    "milliseconds": "मिलीसेकंड",
    "nanoseconds": "नैनोसेकंड",
    "detected": "पता लगाया",
    "digits": "अंक",
    "date-time": "तिथि और समय",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "सापेक्ष"
  },
  "tr": {
    "unix-timestamp": "Unix Zaman Damgası",
    "timestamp-placeholder": "Unix zaman damgası girin...",
    "invalid-timestamp": "Geçersiz zaman damgası",
    "now": "Şimdi",
    "unit": "Birim",
    "auto": "Otomatik",
    "seconds": "Saniye",
    "milliseconds": "Milisaniye",
    "nanoseconds": "Nanosaniye",
    "detected": "Algılandı",
    "digits": "basamak",
    "date-time": "Tarih ve Saat",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Göreceli"
  },
  "nl": {
    "unix-timestamp": "Unix Tijdstempel",
    "timestamp-placeholder": "Voer Unix tijdstempel in...",
    "invalid-timestamp": "Ongeldige tijdstempel",
    "now": "Nu",
    "unit": "Eenheid",
    "auto": "Auto",
    "seconds": "Seconden",
    "milliseconds": "Milliseconden",
    "nanoseconds": "Nanoseconden",
    "detected": "Gedetecteerd",
    "digits": "cijfers",
    "date-time": "Datum en Tijd",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relatief"
  },
  "sv": {
    "unix-timestamp": "Unix Tidsstämpel",
    "timestamp-placeholder": "Ange Unix tidsstämpel...",
    "invalid-timestamp": "Ogiltig tidsstämpel",
    "now": "Nu",
    "unit": "Enhet",
    "auto": "Auto",
    "seconds": "Sekunder",
    "milliseconds": "Millisekunder",
    "nanoseconds": "Nanosekunder",
    "detected": "Upptäckt",
    "digits": "siffror",
    "date-time": "Datum och Tid",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativ"
  },
  "pl": {
    "unix-timestamp": "Znacznik Czasu Unix",
    "timestamp-placeholder": "Wprowadź znacznik czasu Unix...",
    "invalid-timestamp": "Nieprawidłowy znacznik czasu",
    "now": "Teraz",
    "unit": "Jednostka",
    "auto": "Auto",
    "seconds": "Sekundy",
    "milliseconds": "Milisekundy",
    "nanoseconds": "Nanosekundy",
    "detected": "Wykryto",
    "digits": "cyfr",
    "date-time": "Data i Czas",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Względny"
  },
  "vi": {
    "unix-timestamp": "Dấu Thời Gian Unix",
    "timestamp-placeholder": "Nhập dấu thời gian Unix...",
    "invalid-timestamp": "Dấu thời gian không hợp lệ",
    "now": "Bây giờ",
    "unit": "Đơn vị",
    "auto": "Tự động",
    "seconds": "Giây",
    "milliseconds": "Mili giây",
    "nanoseconds": "Nano giây",
    "detected": "Phát hiện",
    "digits": "chữ số",
    "date-time": "Ngày và Giờ",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Tương đối"
  },
  "th": {
    "unix-timestamp": "Unix Timestamp",
    "timestamp-placeholder": "ป้อน Unix timestamp...",
    "invalid-timestamp": "Timestamp ไม่ถูกต้อง",
    "now": "ตอนนี้",
    "unit": "หน่วย",
    "auto": "อัตโนมัติ",
    "seconds": "วินาที",
    "milliseconds": "มิลลิวินาที",
    "nanoseconds": "นาโนวินาที",
    "detected": "ตรวจพบ",
    "digits": "หลัก",
    "date-time": "วันที่และเวลา",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "สัมพัทธ์"
  },
  "id": {
    "unix-timestamp": "Timestamp Unix",
    "timestamp-placeholder": "Masukkan timestamp Unix...",
    "invalid-timestamp": "Timestamp tidak valid",
    "now": "Sekarang",
    "unit": "Unit",
    "auto": "Otomatis",
    "seconds": "Detik",
    "milliseconds": "Milidetik",
    "nanoseconds": "Nanodetik",
    "detected": "Terdeteksi",
    "digits": "digit",
    "date-time": "Tanggal dan Waktu",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relatif"
  },
  "he": {
    "unix-timestamp": "חותמת זמן Unix",
    "timestamp-placeholder": "הזן חותמת זמן Unix...",
    "invalid-timestamp": "חותמת זמן לא תקינה",
    "now": "עכשיו",
    "unit": "יחידה",
    "auto": "אוטומטי",
    "seconds": "שניות",
    "milliseconds": "אלפיות שנייה",
    "nanoseconds": "ננושניות",
    "detected": "זוהה",
    "digits": "ספרות",
    "date-time": "תאריך ושעה",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "יחסי"
  },
  "ms": {
    "unix-timestamp": "Cap Masa Unix",
    "timestamp-placeholder": "Masukkan cap masa Unix...",
    "invalid-timestamp": "Cap masa tidak sah",
    "now": "Sekarang",
    "unit": "Unit",
    "auto": "Auto",
    "seconds": "Saat",
    "milliseconds": "Milisaat",
    "nanoseconds": "Nanosaat",
    "detected": "Dikesan",
    "digits": "digit",
    "date-time": "Tarikh dan Masa",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relatif"
  },
  "no": {
    "unix-timestamp": "Unix Tidsstempel",
    "timestamp-placeholder": "Skriv inn Unix tidsstempel...",
    "invalid-timestamp": "Ugyldig tidsstempel",
    "now": "Nå",
    "unit": "Enhet",
    "auto": "Auto",
    "seconds": "Sekunder",
    "milliseconds": "Millisekunder",
    "nanoseconds": "Nanosekunder",
    "detected": "Oppdaget",
    "digits": "sifre",
    "date-time": "Dato og Tid",
    "iso-8601": "ISO 8601",
    "utc": "UTC",
    "relative": "Relativ"
  }
}
</i18n>
