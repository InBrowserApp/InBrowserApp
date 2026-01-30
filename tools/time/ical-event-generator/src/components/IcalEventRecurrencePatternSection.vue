<template>
  <n-form-item-gi
    v-if="recurrenceFrequency === 'weekly'"
    :label="t('weekdays')"
    :show-feedback="false"
  >
    <n-checkbox-group v-model:value="recurrenceWeekdaysModel">
      <n-flex :size="8" wrap>
        <n-checkbox v-for="option in weekdayOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </n-checkbox>
      </n-flex>
    </n-checkbox-group>
  </n-form-item-gi>

  <n-grid v-if="recurrenceFrequency === 'monthly'" cols="1 900:2" x-gap="12" y-gap="12">
    <n-form-item-gi :label="t('month-day')" :show-feedback="false">
      <n-input-number
        v-model:value="recurrenceMonthDayModel"
        :min="1"
        :max="31"
        :precision="0"
        style="width: 100%"
      />
    </n-form-item-gi>
  </n-grid>

  <n-grid v-if="recurrenceFrequency === 'yearly'" cols="1 900:2" x-gap="12" y-gap="12">
    <n-form-item-gi :label="t('month')" :show-feedback="false">
      <n-input-number
        v-model:value="recurrenceMonthModel"
        :min="1"
        :max="12"
        :precision="0"
        style="width: 100%"
      />
    </n-form-item-gi>
    <n-form-item-gi :label="t('month-day')" :show-feedback="false">
      <n-input-number
        v-model:value="recurrenceMonthDayModel"
        :min="1"
        :max="31"
        :precision="0"
        style="width: 100%"
      />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCheckbox, NCheckboxGroup, NFlex, NFormItemGi, NGrid, NInputNumber } from 'naive-ui'

type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

defineProps<{
  recurrenceFrequency: RecurrenceFrequency
}>()

const { t } = useI18n()

const recurrenceWeekdays = defineModel<string[]>('recurrenceWeekdays', { required: true })
const recurrenceMonthDay = defineModel<number>('recurrenceMonthDay', { required: true })
const recurrenceMonth = defineModel<number>('recurrenceMonth', { required: true })

const recurrenceWeekdaysModel = computed({
  get: () => recurrenceWeekdays.value,
  set: (value) => {
    recurrenceWeekdays.value = value
  },
})

const recurrenceMonthDayModel = computed({
  get: () => recurrenceMonthDay.value,
  set: (value) => {
    recurrenceMonthDay.value = value ?? 1
  },
})

const recurrenceMonthModel = computed({
  get: () => recurrenceMonth.value,
  set: (value) => {
    recurrenceMonth.value = value ?? 1
  },
})

const weekdayOptions = computed(() => [
  { label: t('weekday-mon'), value: 'MO' },
  { label: t('weekday-tue'), value: 'TU' },
  { label: t('weekday-wed'), value: 'WE' },
  { label: t('weekday-thu'), value: 'TH' },
  { label: t('weekday-fri'), value: 'FR' },
  { label: t('weekday-sat'), value: 'SA' },
  { label: t('weekday-sun'), value: 'SU' },
])
</script>

<i18n lang="json">
{
  "en": {
    "weekdays": "Weekdays",
    "weekday-sun": "Sun",
    "weekday-mon": "Mon",
    "weekday-tue": "Tue",
    "weekday-wed": "Wed",
    "weekday-thu": "Thu",
    "weekday-fri": "Fri",
    "weekday-sat": "Sat",
    "month-day": "Day of month",
    "month": "Month"
  },
  "zh": {
    "weekdays": "星期",
    "weekday-sun": "周日",
    "weekday-mon": "周一",
    "weekday-tue": "周二",
    "weekday-wed": "周三",
    "weekday-thu": "周四",
    "weekday-fri": "周五",
    "weekday-sat": "周六",
    "month-day": "每月日期",
    "month": "月份"
  },
  "zh-CN": {
    "weekdays": "星期",
    "weekday-sun": "周日",
    "weekday-mon": "周一",
    "weekday-tue": "周二",
    "weekday-wed": "周三",
    "weekday-thu": "周四",
    "weekday-fri": "周五",
    "weekday-sat": "周六",
    "month-day": "每月日期",
    "month": "月份"
  },
  "zh-TW": {
    "weekdays": "星期",
    "weekday-sun": "週日",
    "weekday-mon": "週一",
    "weekday-tue": "週二",
    "weekday-wed": "週三",
    "weekday-thu": "週四",
    "weekday-fri": "週五",
    "weekday-sat": "週六",
    "month-day": "每月日期",
    "month": "月份"
  },
  "zh-HK": {
    "weekdays": "星期",
    "weekday-sun": "週日",
    "weekday-mon": "週一",
    "weekday-tue": "週二",
    "weekday-wed": "週三",
    "weekday-thu": "週四",
    "weekday-fri": "週五",
    "weekday-sat": "週六",
    "month-day": "每月日期",
    "month": "月份"
  },
  "es": {
    "weekdays": "Días de la semana",
    "weekday-sun": "Dom",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mié",
    "weekday-thu": "Jue",
    "weekday-fri": "Vie",
    "weekday-sat": "Sáb",
    "month-day": "Día del mes",
    "month": "Mes"
  },
  "fr": {
    "weekdays": "Jours de la semaine",
    "weekday-sun": "Dim",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mer",
    "weekday-thu": "Jeu",
    "weekday-fri": "Ven",
    "weekday-sat": "Sam",
    "month-day": "Jour du mois",
    "month": "Mois"
  },
  "de": {
    "weekdays": "Wochentage",
    "weekday-sun": "So",
    "weekday-mon": "Mo",
    "weekday-tue": "Di",
    "weekday-wed": "Mi",
    "weekday-thu": "Do",
    "weekday-fri": "Fr",
    "weekday-sat": "Sa",
    "month-day": "Tag des Monats",
    "month": "Monat"
  },
  "it": {
    "weekdays": "Giorni della settimana",
    "weekday-sun": "Dom",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mer",
    "weekday-thu": "Gio",
    "weekday-fri": "Ven",
    "weekday-sat": "Sab",
    "month-day": "Giorno del mese",
    "month": "Mese"
  },
  "ja": {
    "weekdays": "曜日",
    "weekday-sun": "日",
    "weekday-mon": "月",
    "weekday-tue": "火",
    "weekday-wed": "水",
    "weekday-thu": "木",
    "weekday-fri": "金",
    "weekday-sat": "土",
    "month-day": "日付",
    "month": "月"
  },
  "ko": {
    "weekdays": "요일",
    "weekday-sun": "일",
    "weekday-mon": "월",
    "weekday-tue": "화",
    "weekday-wed": "수",
    "weekday-thu": "목",
    "weekday-fri": "금",
    "weekday-sat": "토",
    "month-day": "월의 날짜",
    "month": "월"
  },
  "ru": {
    "weekdays": "Дни недели",
    "weekday-sun": "Вс",
    "weekday-mon": "Пн",
    "weekday-tue": "Вт",
    "weekday-wed": "Ср",
    "weekday-thu": "Чт",
    "weekday-fri": "Пт",
    "weekday-sat": "Сб",
    "month-day": "День месяца",
    "month": "Месяц"
  },
  "pt": {
    "weekdays": "Dias da semana",
    "weekday-sun": "Dom",
    "weekday-mon": "Seg",
    "weekday-tue": "Ter",
    "weekday-wed": "Qua",
    "weekday-thu": "Qui",
    "weekday-fri": "Sex",
    "weekday-sat": "Sáb",
    "month-day": "Dia do mês",
    "month": "Mês"
  },
  "ar": {
    "weekdays": "أيام الأسبوع",
    "weekday-sun": "الأحد",
    "weekday-mon": "الاثنين",
    "weekday-tue": "الثلاثاء",
    "weekday-wed": "الأربعاء",
    "weekday-thu": "الخميس",
    "weekday-fri": "الجمعة",
    "weekday-sat": "السبت",
    "month-day": "يوم من الشهر",
    "month": "الشهر"
  },
  "hi": {
    "weekdays": "सप्ताह के दिन",
    "weekday-sun": "रवि",
    "weekday-mon": "सोम",
    "weekday-tue": "मंगल",
    "weekday-wed": "बुध",
    "weekday-thu": "गुरु",
    "weekday-fri": "शुक्र",
    "weekday-sat": "शनि",
    "month-day": "महीने का दिन",
    "month": "महीना"
  },
  "tr": {
    "weekdays": "Haftanın günleri",
    "weekday-sun": "Paz",
    "weekday-mon": "Pzt",
    "weekday-tue": "Sal",
    "weekday-wed": "Çar",
    "weekday-thu": "Per",
    "weekday-fri": "Cum",
    "weekday-sat": "Cmt",
    "month-day": "Ayın günü",
    "month": "Ay"
  },
  "nl": {
    "weekdays": "Weekdagen",
    "weekday-sun": "Zo",
    "weekday-mon": "Ma",
    "weekday-tue": "Di",
    "weekday-wed": "Wo",
    "weekday-thu": "Do",
    "weekday-fri": "Vr",
    "weekday-sat": "Za",
    "month-day": "Dag van de maand",
    "month": "Maand"
  },
  "sv": {
    "weekdays": "Veckodagar",
    "weekday-sun": "Sön",
    "weekday-mon": "Mån",
    "weekday-tue": "Tis",
    "weekday-wed": "Ons",
    "weekday-thu": "Tor",
    "weekday-fri": "Fre",
    "weekday-sat": "Lör",
    "month-day": "Dag i månaden",
    "month": "Månad"
  },
  "pl": {
    "weekdays": "Dni tygodnia",
    "weekday-sun": "Nd",
    "weekday-mon": "Pn",
    "weekday-tue": "Wt",
    "weekday-wed": "Śr",
    "weekday-thu": "Cz",
    "weekday-fri": "Pt",
    "weekday-sat": "Sb",
    "month-day": "Dzień miesiąca",
    "month": "Miesiąc"
  },
  "vi": {
    "weekdays": "Ngày trong tuần",
    "weekday-sun": "CN",
    "weekday-mon": "T2",
    "weekday-tue": "T3",
    "weekday-wed": "T4",
    "weekday-thu": "T5",
    "weekday-fri": "T6",
    "weekday-sat": "T7",
    "month-day": "Ngày trong tháng",
    "month": "Tháng"
  },
  "th": {
    "weekdays": "วันในสัปดาห์",
    "weekday-sun": "อา",
    "weekday-mon": "จ",
    "weekday-tue": "อ",
    "weekday-wed": "พ",
    "weekday-thu": "พฤ",
    "weekday-fri": "ศ",
    "weekday-sat": "ส",
    "month-day": "วันที่ของเดือน",
    "month": "เดือน"
  },
  "id": {
    "weekdays": "Hari dalam minggu",
    "weekday-sun": "Min",
    "weekday-mon": "Sen",
    "weekday-tue": "Sel",
    "weekday-wed": "Rab",
    "weekday-thu": "Kam",
    "weekday-fri": "Jum",
    "weekday-sat": "Sab",
    "month-day": "Hari dalam bulan",
    "month": "Bulan"
  },
  "he": {
    "weekdays": "ימי השבוע",
    "weekday-sun": "א'",
    "weekday-mon": "ב'",
    "weekday-tue": "ג'",
    "weekday-wed": "ד'",
    "weekday-thu": "ה'",
    "weekday-fri": "ו'",
    "weekday-sat": "ש'",
    "month-day": "יום בחודש",
    "month": "חודש"
  },
  "ms": {
    "weekdays": "Hari dalam minggu",
    "weekday-sun": "Ahd",
    "weekday-mon": "Isn",
    "weekday-tue": "Sel",
    "weekday-wed": "Rab",
    "weekday-thu": "Kha",
    "weekday-fri": "Jum",
    "weekday-sat": "Sab",
    "month-day": "Hari dalam bulan",
    "month": "Bulan"
  },
  "no": {
    "weekdays": "Ukedager",
    "weekday-sun": "Søn",
    "weekday-mon": "Man",
    "weekday-tue": "Tir",
    "weekday-wed": "Ons",
    "weekday-thu": "Tor",
    "weekday-fri": "Fre",
    "weekday-sat": "Lør",
    "month-day": "Dag i måneden",
    "month": "Måned"
  }
}
</i18n>
