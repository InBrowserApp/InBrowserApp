<template>
  <ToolSectionHeader>{{ t('converter') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="timezone-card">
          <n-flex justify="space-between" align="center">
            <n-text strong>{{ t('from') }}</n-text>
            <n-flex align="center" :size="8">
              <n-button text size="small" @click="emitSetNow('from')">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton v-if="fromInputModel" :content="fromInputModel" size="small" />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="fromTimeZoneModel"
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
              v-model:value="fromInputModel"
              :placeholder="t('datetime-placeholder')"
              :status="fromStatus"
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
              <n-button text size="small" @click="emitSetNow('to')">
                <template #icon>
                  <n-icon :component="Clock16Regular" />
                </template>
                {{ t('now') }}
              </n-button>
              <CopyToClipboardButton v-if="toInputModel" :content="toInputModel" size="small" />
            </n-flex>
          </n-flex>

          <div>
            <n-text depth="3">{{ t('time-zone') }}</n-text>
            <n-select
              v-model:value="toTimeZoneModel"
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
              v-model:value="toInputModel"
              :placeholder="t('datetime-placeholder')"
              :status="toStatus"
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
  fromInput: string
  toInput: string
  fromStatus?: FormValidationStatus
  toStatus?: FormValidationStatus
  fromError: boolean
  toError: boolean
  fromTimeZone: string
  toTimeZone: string
  timeZoneOptions: SelectOption[]
  fromOffsetLabel: string
  toOffsetLabel: string
}>()

const emit = defineEmits<{
  (event: 'update:fromInput', value: string): void
  (event: 'update:toInput', value: string): void
  (event: 'update:fromTimeZone', value: string): void
  (event: 'update:toTimeZone', value: string): void
  (event: 'set-now', target: 'from' | 'to'): void
  (event: 'mark-edited', target: 'from' | 'to'): void
}>()

const { t } = useI18n()

const fromInputModel = computed({
  get: () => props.fromInput,
  set: (value: string) => {
    emit('update:fromInput', value)
    emit('mark-edited', 'from')
  },
})

const toInputModel = computed({
  get: () => props.toInput,
  set: (value: string) => {
    emit('update:toInput', value)
    emit('mark-edited', 'to')
  },
})

const fromTimeZoneModel = computed({
  get: () => props.fromTimeZone,
  set: (value: string) => emit('update:fromTimeZone', value),
})

const toTimeZoneModel = computed({
  get: () => props.toTimeZone,
  set: (value: string) => emit('update:toTimeZone', value),
})

const emitSetNow = (target: 'from' | 'to') => emit('set-now', target)
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
    "offset": "Offset",
    "invalid-date-time": "Invalid date/time"
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
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间"
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
    "offset": "偏移",
    "invalid-date-time": "无效的日期/时间"
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
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間"
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
    "offset": "偏移",
    "invalid-date-time": "無效的日期/時間"
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
    "offset": "Desfase",
    "invalid-date-time": "Fecha/hora inválida"
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
    "offset": "Décalage",
    "invalid-date-time": "Date/heure invalide"
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
    "offset": "Offset",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit"
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
    "offset": "Offset",
    "invalid-date-time": "Data/ora non valida"
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
    "offset": "オフセット",
    "invalid-date-time": "無効な日付/時刻"
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
    "offset": "오프셋",
    "invalid-date-time": "유효하지 않은 날짜/시간"
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
    "offset": "Смещение",
    "invalid-date-time": "Недействительная дата/время"
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
    "offset": "Offset",
    "invalid-date-time": "Data/hora inválida"
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
    "offset": "الإزاحة",
    "invalid-date-time": "تاريخ/وقت غير صالح"
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
    "offset": "ऑफ़सेट",
    "invalid-date-time": "अमान्य दिनांक/समय"
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
    "offset": "Ofset",
    "invalid-date-time": "Geçersiz tarih/saat"
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
    "offset": "Offset",
    "invalid-date-time": "Ongeldige datum/tijd"
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
    "offset": "Offset",
    "invalid-date-time": "Ogiltigt datum/tid"
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
    "offset": "Przesunięcie",
    "invalid-date-time": "Nieprawidłowa data/godzina"
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
    "offset": "Độ lệch",
    "invalid-date-time": "Ngày/giờ không hợp lệ"
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
    "offset": "ออฟเซ็ต",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง"
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
    "offset": "Offset",
    "invalid-date-time": "Tanggal/waktu tidak valid"
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
    "offset": "היסט",
    "invalid-date-time": "תאריך/שעה לא תקינים"
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
    "offset": "Ofset",
    "invalid-date-time": "Tarikh/masa tidak sah"
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
    "offset": "Offset",
    "invalid-date-time": "Ugyldig dato/tid"
  }
}
</i18n>
