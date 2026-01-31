<template>
  <n-grid v-if="recurrenceFrequency !== 'none'" cols="1 900:2" x-gap="12" y-gap="12">
    <n-form-item-gi :label="t('ends')" :show-feedback="false">
      <n-select v-model:value="recurrenceEndModeModel" :options="endModeOptions" />
    </n-form-item-gi>
    <n-form-item-gi
      v-if="recurrenceEndModeModel === 'count'"
      :label="t('count')"
      :show-feedback="false"
    >
      <n-input-number
        v-model:value="recurrenceCountModel"
        :min="1"
        :precision="0"
        style="width: 100%"
      />
    </n-form-item-gi>
    <n-form-item-gi
      v-if="recurrenceEndModeModel === 'until'"
      :label="t('until')"
      :show-feedback="!!recurrenceUntilErrorMessage"
    >
      <n-input
        v-model:value="recurrenceUntilInputModel"
        :placeholder="isAllDay ? t('date-placeholder') : t('until-placeholder')"
        :status="recurrenceUntilStatus"
      />
      <template v-if="recurrenceUntilErrorMessage" #feedback>
        <n-text type="error">{{ recurrenceUntilErrorMessage }}</n-text>
      </template>
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInput, NInputNumber, NSelect, NText } from 'naive-ui'

type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
type RecurrenceEndMode = 'never' | 'count' | 'until'
type RecurrenceErrorKey = 'invalid-date-time' | 'invalid-date'

const props = defineProps<{
  recurrenceFrequency: RecurrenceFrequency
  recurrenceUntilStatus?: 'error' | 'success'
  recurrenceUntilErrorKey?: RecurrenceErrorKey
  isAllDay: boolean
}>()

const recurrenceEndMode = defineModel<RecurrenceEndMode>('recurrenceEndMode', { required: true })
const recurrenceCount = defineModel<number>('recurrenceCount', { required: true })
const recurrenceUntilInput = defineModel<string>('recurrenceUntilInput', { required: true })

const { t } = useI18n()

const recurrenceEndModeModel = computed({
  get: () => recurrenceEndMode.value,
  set: (value) => {
    recurrenceEndMode.value = value
  },
})

const recurrenceCountModel = computed({
  get: () => recurrenceCount.value,
  set: (value) => {
    recurrenceCount.value = value ?? 1
  },
})

const recurrenceUntilInputModel = computed({
  get: () => recurrenceUntilInput.value,
  set: (value) => {
    recurrenceUntilInput.value = value
  },
})

const endModeOptions = computed(() => [
  { label: t('ends-never'), value: 'never' },
  { label: t('ends-count'), value: 'count' },
  { label: t('ends-until'), value: 'until' },
])

const recurrenceUntilErrorMessages = computed<Record<RecurrenceErrorKey, string>>(() => ({
  'invalid-date-time': t('invalid-date-time'),
  'invalid-date': t('invalid-date'),
}))

const recurrenceUntilErrorMessage = computed(() =>
  props.recurrenceUntilErrorKey
    ? recurrenceUntilErrorMessages.value[props.recurrenceUntilErrorKey]
    : '',
)
</script>

<i18n lang="json">
{
  "en": {
    "ends": "Ends",
    "ends-never": "Never",
    "ends-count": "After count",
    "ends-until": "On date",
    "count": "Count",
    "until": "Until",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Invalid date/time",
    "invalid-date": "Invalid date"
  },
  "zh": {
    "ends": "结束",
    "ends-never": "永不",
    "ends-count": "按次数",
    "ends-until": "指定日期",
    "count": "次数",
    "until": "直到",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "无效的日期/时间",
    "invalid-date": "无效的日期"
  },
  "zh-CN": {
    "ends": "结束",
    "ends-never": "永不",
    "ends-count": "按次数",
    "ends-until": "指定日期",
    "count": "次数",
    "until": "直到",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "无效的日期/时间",
    "invalid-date": "无效的日期"
  },
  "zh-TW": {
    "ends": "結束",
    "ends-never": "永不",
    "ends-count": "按次數",
    "ends-until": "指定日期",
    "count": "次數",
    "until": "直到",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "無效的日期/時間",
    "invalid-date": "無效的日期"
  },
  "zh-HK": {
    "ends": "結束",
    "ends-never": "永不",
    "ends-count": "按次數",
    "ends-until": "指定日期",
    "count": "次數",
    "until": "直到",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "無效的日期/時間",
    "invalid-date": "無效的日期"
  },
  "es": {
    "ends": "Finaliza",
    "ends-never": "Nunca",
    "ends-count": "Después de un número",
    "ends-until": "En la fecha",
    "count": "Cantidad",
    "until": "Hasta",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Fecha/hora inválida",
    "invalid-date": "Fecha inválida"
  },
  "fr": {
    "ends": "Se termine",
    "ends-never": "Jamais",
    "ends-count": "Après un nombre",
    "ends-until": "À la date",
    "count": "Nombre",
    "until": "Jusqu'à",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Date/heure invalide",
    "invalid-date": "Date invalide"
  },
  "de": {
    "ends": "Endet",
    "ends-never": "Nie",
    "ends-count": "Nach Anzahl",
    "ends-until": "Am Datum",
    "count": "Anzahl",
    "until": "Bis",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ungültiges Datum/Uhrzeit",
    "invalid-date": "Ungültiges Datum"
  },
  "it": {
    "ends": "Termina",
    "ends-never": "Mai",
    "ends-count": "Dopo un numero",
    "ends-until": "Alla data",
    "count": "Conteggio",
    "until": "Fino a",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Data/ora non valida",
    "invalid-date": "Data non valida"
  },
  "ja": {
    "ends": "終了",
    "ends-never": "なし",
    "ends-count": "回数後",
    "ends-until": "指定日",
    "count": "回数",
    "until": "まで",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "無効な日付/時刻",
    "invalid-date": "無効な日付"
  },
  "ko": {
    "ends": "종료",
    "ends-never": "안 함",
    "ends-count": "횟수 후",
    "ends-until": "날짜 지정",
    "count": "횟수",
    "until": "까지",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "유효하지 않은 날짜/시간",
    "invalid-date": "유효하지 않은 날짜"
  },
  "ru": {
    "ends": "Окончание",
    "ends-never": "Никогда",
    "ends-count": "После количества",
    "ends-until": "В дату",
    "count": "Количество",
    "until": "До",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Недопустимая дата/время",
    "invalid-date": "Недопустимая дата"
  },
  "pt": {
    "ends": "Termina",
    "ends-never": "Nunca",
    "ends-count": "Após contagem",
    "ends-until": "Na data",
    "count": "Contagem",
    "until": "Até",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Data/hora inválida",
    "invalid-date": "Data inválida"
  },
  "ar": {
    "ends": "ينتهي",
    "ends-never": "أبدًا",
    "ends-count": "بعد عدد",
    "ends-until": "في تاريخ",
    "count": "العدد",
    "until": "حتى",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "تاريخ/وقت غير صالح",
    "invalid-date": "تاريخ غير صالح"
  },
  "hi": {
    "ends": "समाप्त होता है",
    "ends-never": "कभी नहीं",
    "ends-count": "गिनती के बाद",
    "ends-until": "तारीख पर",
    "count": "गिनती",
    "until": "तक",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "अमान्य तिथि/समय",
    "invalid-date": "अमान्य तिथि"
  },
  "tr": {
    "ends": "Biter",
    "ends-never": "Asla",
    "ends-count": "Sayıdan sonra",
    "ends-until": "Tarihte",
    "count": "Sayı",
    "until": "Kadar",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Geçersiz tarih/saat",
    "invalid-date": "Geçersiz tarih"
  },
  "nl": {
    "ends": "Eindigt",
    "ends-never": "Nooit",
    "ends-count": "Na aantal",
    "ends-until": "Op datum",
    "count": "Aantal",
    "until": "Tot",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ongeldige datum/tijd",
    "invalid-date": "Ongeldige datum"
  },
  "sv": {
    "ends": "Slutar",
    "ends-never": "Aldrig",
    "ends-count": "Efter antal",
    "ends-until": "På datum",
    "count": "Antal",
    "until": "Till",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ogiltigt datum/tid",
    "invalid-date": "Ogiltigt datum"
  },
  "pl": {
    "ends": "Kończy się",
    "ends-never": "Nigdy",
    "ends-count": "Po liczbie",
    "ends-until": "W dniu",
    "count": "Liczba",
    "until": "Do",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Nieprawidłowa data/godzina",
    "invalid-date": "Nieprawidłowa data"
  },
  "vi": {
    "ends": "Kết thúc",
    "ends-never": "Không bao giờ",
    "ends-count": "Sau số lần",
    "ends-until": "Vào ngày",
    "count": "Số lần",
    "until": "Đến",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ngày/giờ không hợp lệ",
    "invalid-date": "Ngày không hợp lệ"
  },
  "th": {
    "ends": "สิ้นสุด",
    "ends-never": "ไม่สิ้นสุด",
    "ends-count": "หลังจากจำนวนครั้ง",
    "ends-until": "ในวันที่",
    "count": "จำนวน",
    "until": "จนถึง",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "วันที่/เวลาไม่ถูกต้อง",
    "invalid-date": "วันที่ไม่ถูกต้อง"
  },
  "id": {
    "ends": "Berakhir",
    "ends-never": "Tidak pernah",
    "ends-count": "Setelah jumlah",
    "ends-until": "Pada tanggal",
    "count": "Jumlah",
    "until": "Sampai",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Tanggal/waktu tidak valid",
    "invalid-date": "Tanggal tidak valid"
  },
  "he": {
    "ends": "מסתיים",
    "ends-never": "לעולם לא",
    "ends-count": "לאחר ספירה",
    "ends-until": "בתאריך",
    "count": "ספירה",
    "until": "עד",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "תאריך/שעה לא תקינים",
    "invalid-date": "תאריך לא תקין"
  },
  "ms": {
    "ends": "Berakhir",
    "ends-never": "Tidak pernah",
    "ends-count": "Selepas kiraan",
    "ends-until": "Pada tarikh",
    "count": "Kiraan",
    "until": "Hingga",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Tarikh/masa tidak sah",
    "invalid-date": "Tarikh tidak sah"
  },
  "no": {
    "ends": "Slutter",
    "ends-never": "Aldri",
    "ends-count": "Etter antall",
    "ends-until": "På dato",
    "count": "Antall",
    "until": "Til",
    "until-placeholder": "YYYY-MM-DD HH:mm:ss",
    "date-placeholder": "YYYY-MM-DD",
    "invalid-date-time": "Ugyldig dato/tid",
    "invalid-date": "Ugyldig dato"
  }
}
</i18n>
