<template>
  <n-flex vertical :size="12" class="timezone-card">
    <n-flex justify="space-between" align="center">
      <n-text strong>{{ t('base-time') }}</n-text>
      <n-flex align="center" :size="8">
        <n-button text size="small" @click="emit('now')">
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
        v-model:value="baseTimeZoneModel"
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
        v-model:value="baseInputModel"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormValidationStatus, SelectOption } from 'naive-ui'
import { NInput, NSelect, NText, NFlex, NButton, NIcon } from 'naive-ui'
import { CopyToClipboardButton } from '@shared/ui/base'
import Clock16Regular from '@vicons/fluent/Clock16Regular'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  baseInput: string
  baseStatus?: FormValidationStatus
  baseError: boolean
  baseTimeZone: string
  baseOffsetLabel: string
  timeZoneOptions: SelectOption[]
}>()

const emit = defineEmits<{
  (event: 'update:baseInput', value: string): void
  (event: 'update:baseTimeZone', value: string): void
  (event: 'now'): void
}>()

const { t } = useI18n()

const baseInputModel = computed({
  get: () => props.baseInput,
  set: (value) => emit('update:baseInput', value),
})

const baseTimeZoneModel = computed({
  get: () => props.baseTimeZone,
  set: (value) => emit('update:baseTimeZone', value),
})
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
    "base-time": "Base time",
    "time-zone": "Time zone",
    "timezone-placeholder": "Select a time zone",
    "date-time": "Date & time",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Now",
    "offset": "Offset",
    "invalid-date-time": "Invalid date/time"
  },
  "zh": {
    "base-time": "基准时间",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "date-time": "日期与时间",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "现在",
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间"
  },
  "zh-CN": {
    "base-time": "基准时间",
    "time-zone": "时区",
    "timezone-placeholder": "选择时区",
    "date-time": "日期与时间",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "现在",
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间"
  },
  "zh-TW": {
    "base-time": "基準時間",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "date-time": "日期與時間",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間"
  },
  "zh-HK": {
    "base-time": "基準時間",
    "time-zone": "時區",
    "timezone-placeholder": "選擇時區",
    "date-time": "日期與時間",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "格式：YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間"
  },
  "es": {
    "base-time": "Hora base",
    "time-zone": "Zona horaria",
    "timezone-placeholder": "Selecciona una zona horaria",
    "date-time": "Fecha y hora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Ahora",
    "offset": "Desfase",
    "invalid-date-time": "Fecha/hora inválida"
  },
  "fr": {
    "base-time": "Heure de base",
    "time-zone": "Fuseau horaire",
    "timezone-placeholder": "Sélectionner un fuseau horaire",
    "date-time": "Date et heure",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format : YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Maintenant",
    "offset": "Décalage",
    "invalid-date-time": "Date/heure invalide"
  },
  "de": {
    "base-time": "Basiszeit",
    "time-zone": "Zeitzone",
    "timezone-placeholder": "Zeitzone auswählen",
    "date-time": "Datum und Uhrzeit",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Jetzt",
    "offset": "Offset",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit"
  },
  "it": {
    "base-time": "Ora base",
    "time-zone": "Fuso orario",
    "timezone-placeholder": "Seleziona un fuso orario",
    "date-time": "Data e ora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Adesso",
    "offset": "Offset",
    "invalid-date-time": "Data/ora non valida"
  },
  "ja": {
    "base-time": "基準時刻",
    "time-zone": "タイムゾーン",
    "timezone-placeholder": "タイムゾーンを選択",
    "date-time": "日付と時刻",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "形式: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "現在",
    "offset": "オフセット",
    "invalid-date-time": "無効な日付/時刻"
  },
  "ko": {
    "base-time": "기준 시간",
    "time-zone": "시간대",
    "timezone-placeholder": "시간대 선택",
    "date-time": "날짜 및 시간",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "형식: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "현재",
    "offset": "오프셋",
    "invalid-date-time": "유효하지 않은 날짜/시간"
  },
  "ru": {
    "base-time": "Базовое время",
    "time-zone": "Часовой пояс",
    "timezone-placeholder": "Выберите часовой пояс",
    "date-time": "Дата и время",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Формат: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Сейчас",
    "offset": "Смещение",
    "invalid-date-time": "Недопустимая дата/время"
  },
  "pt": {
    "base-time": "Hora base",
    "time-zone": "Fuso horário",
    "timezone-placeholder": "Selecione um fuso horário",
    "date-time": "Data e hora",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formato: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Agora",
    "offset": "Offset",
    "invalid-date-time": "Data/hora inválida"
  },
  "ar": {
    "base-time": "الوقت الأساسي",
    "time-zone": "المنطقة الزمنية",
    "timezone-placeholder": "اختر منطقة زمنية",
    "date-time": "التاريخ والوقت",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "التنسيق: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "الآن",
    "offset": "الإزاحة",
    "invalid-date-time": "تاريخ/وقت غير صالح"
  },
  "hi": {
    "base-time": "आधार समय",
    "time-zone": "समय क्षेत्र",
    "timezone-placeholder": "समय क्षेत्र चुनें",
    "date-time": "तिथि और समय",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "फ़ॉर्मेट: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "अभी",
    "offset": "ऑफ़सेट",
    "invalid-date-time": "अमान्य तिथि/समय"
  },
  "tr": {
    "base-time": "Temel zaman",
    "time-zone": "Saat dilimi",
    "timezone-placeholder": "Saat dilimi seçin",
    "date-time": "Tarih ve saat",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Biçim: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Şimdi",
    "offset": "Ofset",
    "invalid-date-time": "Geçersiz tarih/saat"
  },
  "nl": {
    "base-time": "Basistijd",
    "time-zone": "Tijdzone",
    "timezone-placeholder": "Selecteer een tijdzone",
    "date-time": "Datum en tijd",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Formaat: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nu",
    "offset": "Offset",
    "invalid-date-time": "Ongeldige datum/tijd"
  },
  "sv": {
    "base-time": "Basstid",
    "time-zone": "Tidszon",
    "timezone-placeholder": "Välj en tidszon",
    "date-time": "Datum och tid",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nu",
    "offset": "Offset",
    "invalid-date-time": "Ogiltigt datum/tid"
  },
  "pl": {
    "base-time": "Czas bazowy",
    "time-zone": "Strefa czasowa",
    "timezone-placeholder": "Wybierz strefę czasową",
    "date-time": "Data i czas",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Teraz",
    "offset": "Przesunięcie",
    "invalid-date-time": "Nieprawidłowa data/czas"
  },
  "vi": {
    "base-time": "Thời gian gốc",
    "time-zone": "Múi giờ",
    "timezone-placeholder": "Chọn múi giờ",
    "date-time": "Ngày và giờ",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Định dạng: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Bây giờ",
    "offset": "Độ lệch",
    "invalid-date-time": "Ngày/giờ không hợp lệ"
  },
  "th": {
    "base-time": "เวลาฐาน",
    "time-zone": "เขตเวลา",
    "timezone-placeholder": "เลือกเขตเวลา",
    "date-time": "วันที่และเวลา",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "รูปแบบ: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "ตอนนี้",
    "offset": "ออฟเซ็ต",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง"
  },
  "id": {
    "base-time": "Waktu dasar",
    "time-zone": "Zona waktu",
    "timezone-placeholder": "Pilih zona waktu",
    "date-time": "Tanggal dan waktu",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Sekarang",
    "offset": "Offset",
    "invalid-date-time": "Tanggal/waktu tidak valid"
  },
  "he": {
    "base-time": "זמן בסיס",
    "time-zone": "אזור זמן",
    "timezone-placeholder": "בחר אזור זמן",
    "date-time": "תאריך ושעה",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "פורמט: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "עכשיו",
    "offset": "היסט",
    "invalid-date-time": "תאריך/שעה לא תקינים"
  },
  "ms": {
    "base-time": "Masa asas",
    "time-zone": "Zon masa",
    "timezone-placeholder": "Pilih zon masa",
    "date-time": "Tarikh dan masa",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Sekarang",
    "offset": "Ofset",
    "invalid-date-time": "Tarikh/masa tidak sah"
  },
  "no": {
    "base-time": "Basistid",
    "time-zone": "Tidssone",
    "timezone-placeholder": "Velg en tidssone",
    "date-time": "Dato og tid",
    "datetime-placeholder": "YYYY-MM-DD HH:mm:ss.SSS",
    "format-hint": "Format: YYYY-MM-DD HH:mm:ss.SSS",
    "now": "Nå",
    "offset": "Offset",
    "invalid-date-time": "Ugyldig dato/tid"
  }
}
</i18n>
