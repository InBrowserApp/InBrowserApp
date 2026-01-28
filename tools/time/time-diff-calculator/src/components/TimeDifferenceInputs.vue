<template>
  <ToolSectionHeader>{{ t('difference') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="timezone-card">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ t('start') }}</n-text>
            <n-flex align="center" :size="8">
              <n-button text size="small" @click="emitSetNow('start')">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton
                v-if="startInputModel"
                :content="startInputModel"
                size="small"
              />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="startTimeZoneModel"
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
              v-model:value="startInputModel"
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
              <n-button text size="small" @click="emitSetNow('end')">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton v-if="endInputModel" :content="endInputModel" size="small" />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="endTimeZoneModel"
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
              v-model:value="endInputModel"
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FormValidationStatus, SelectOption } from 'naive-ui'
import { NButton, NFlex, NGi, NGrid, NIcon, NInput, NSelect, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import Clock16Regular from '@vicons/fluent/Clock16Regular'

const props = defineProps<{
  startInput: string
  endInput: string
  startStatus?: FormValidationStatus
  endStatus?: FormValidationStatus
  startError: boolean
  endError: boolean
  startTimeZone: string
  endTimeZone: string
  timeZoneOptions: SelectOption[]
  startOffsetLabel: string
  endOffsetLabel: string
}>()

const emit = defineEmits<{
  (event: 'update:startInput', value: string): void
  (event: 'update:endInput', value: string): void
  (event: 'update:startTimeZone', value: string): void
  (event: 'update:endTimeZone', value: string): void
  (event: 'set-now', target: 'start' | 'end'): void
}>()

const { t } = useI18n()

const startInputModel = computed({
  get: () => props.startInput,
  set: (value: string) => emit('update:startInput', value),
})

const endInputModel = computed({
  get: () => props.endInput,
  set: (value: string) => emit('update:endInput', value),
})

const startTimeZoneModel = computed({
  get: () => props.startTimeZone,
  set: (value: string) => emit('update:startTimeZone', value),
})

const endTimeZoneModel = computed({
  get: () => props.endTimeZone,
  set: (value: string) => emit('update:endTimeZone', value),
})

const emitSetNow = (target: 'start' | 'end') => emit('set-now', target)
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
    "offset": "Offset",
    "invalid-date-time": "Invalid date/time"
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
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间"
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
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间"
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
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間"
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
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間"
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
    "offset": "Desfase",
    "invalid-date-time": "Fecha/hora inválida"
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
    "offset": "Décalage",
    "invalid-date-time": "Date/heure invalide"
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
    "offset": "Offset",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit"
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
    "offset": "Offset",
    "invalid-date-time": "Data/ora non valida"
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
    "offset": "オフセット",
    "invalid-date-time": "無効な日付/時刻"
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
    "offset": "오프셋",
    "invalid-date-time": "유효하지 않은 날짜/시간"
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
    "offset": "Смещение",
    "invalid-date-time": "Недопустимая дата/время"
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
    "offset": "Offset",
    "invalid-date-time": "Data/hora inválida"
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
    "offset": "الإزاحة",
    "invalid-date-time": "تاريخ/وقت غير صالح"
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
    "offset": "ऑफ़सेट",
    "invalid-date-time": "अमान्य तिथि/समय"
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
    "offset": "Ofset",
    "invalid-date-time": "Geçersiz tarih/saat"
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
    "offset": "Offset",
    "invalid-date-time": "Ongeldige datum/tijd"
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
    "offset": "Offset",
    "invalid-date-time": "Ogiltigt datum/tid"
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
    "offset": "Przesunięcie",
    "invalid-date-time": "Nieprawidłowa data/czas"
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
    "offset": "Độ lệch",
    "invalid-date-time": "Ngày/giờ không hợp lệ"
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
    "offset": "ออฟเซ็ต",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง"
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
    "offset": "Offset",
    "invalid-date-time": "Tanggal/waktu tidak valid"
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
    "offset": "היסט",
    "invalid-date-time": "תאריך/שעה לא תקינים"
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
    "offset": "Ofset",
    "invalid-date-time": "Tarikh/masa tidak sah"
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
    "offset": "Offset",
    "invalid-date-time": "Ugyldig dato/tid"
  }
}
</i18n>
