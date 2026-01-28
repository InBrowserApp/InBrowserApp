<template>
  <n-text strong>{{ fieldLabel }}</n-text>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

type FieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'

const props = defineProps<{
  fieldName: FieldName
}>()

const { t } = useI18n()

const fieldLabel = computed(
  () =>
    ({
      minute: t('minute'),
      hour: t('hour'),
      dayOfMonth: t('dayOfMonth'),
      month: t('month'),
      dayOfWeek: t('dayOfWeek'),
    })[props.fieldName],
)
</script>

<i18n lang="json">
{
  "en": {
    "minute": "Minute",
    "hour": "Hour",
    "dayOfMonth": "Day of Month",
    "month": "Month",
    "dayOfWeek": "Day of Week"
  },
  "zh": {
    "minute": "分钟",
    "hour": "小时",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期"
  },
  "zh-CN": {
    "minute": "分钟",
    "hour": "小时",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期"
  },
  "zh-TW": {
    "minute": "分鐘",
    "hour": "小時",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期"
  },
  "zh-HK": {
    "minute": "分鐘",
    "hour": "小時",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期"
  },
  "es": {
    "minute": "Minuto",
    "hour": "Hora",
    "dayOfMonth": "Dia del mes",
    "month": "Mes",
    "dayOfWeek": "Dia de la semana"
  },
  "fr": {
    "minute": "Minute",
    "hour": "Heure",
    "dayOfMonth": "Jour du mois",
    "month": "Mois",
    "dayOfWeek": "Jour de la semaine"
  },
  "de": {
    "minute": "Minute",
    "hour": "Stunde",
    "dayOfMonth": "Tag des Monats",
    "month": "Monat",
    "dayOfWeek": "Wochentag"
  },
  "it": {
    "minute": "Minuto",
    "hour": "Ora",
    "dayOfMonth": "Giorno del mese",
    "month": "Mese",
    "dayOfWeek": "Giorno della settimana"
  },
  "ja": {
    "minute": "分",
    "hour": "時",
    "dayOfMonth": "日",
    "month": "月",
    "dayOfWeek": "曜日"
  },
  "ko": {
    "minute": "분",
    "hour": "시",
    "dayOfMonth": "일",
    "month": "월",
    "dayOfWeek": "요일"
  },
  "ru": {
    "minute": "Минута",
    "hour": "Час",
    "dayOfMonth": "День месяца",
    "month": "Месяц",
    "dayOfWeek": "День недели"
  },
  "pt": {
    "minute": "Minuto",
    "hour": "Hora",
    "dayOfMonth": "Dia do mes",
    "month": "Mes",
    "dayOfWeek": "Dia da semana"
  },
  "ar": {
    "minute": "دقيقة",
    "hour": "ساعة",
    "dayOfMonth": "يوم الشهر",
    "month": "شهر",
    "dayOfWeek": "يوم الاسبوع"
  },
  "hi": {
    "minute": "मिनट",
    "hour": "घंटा",
    "dayOfMonth": "महीने का दिन",
    "month": "महीना",
    "dayOfWeek": "सप्ताह का दिन"
  },
  "tr": {
    "minute": "Dakika",
    "hour": "Saat",
    "dayOfMonth": "Ayin gunu",
    "month": "Ay",
    "dayOfWeek": "Haftanin gunu"
  },
  "nl": {
    "minute": "Minuut",
    "hour": "Uur",
    "dayOfMonth": "Dag van de maand",
    "month": "Maand",
    "dayOfWeek": "Dag van de week"
  },
  "sv": {
    "minute": "Minut",
    "hour": "Timme",
    "dayOfMonth": "Dag i manaden",
    "month": "Manad",
    "dayOfWeek": "Veckodag"
  },
  "pl": {
    "minute": "Minuta",
    "hour": "Godzina",
    "dayOfMonth": "Dzien miesiaca",
    "month": "Miesiac",
    "dayOfWeek": "Dzien tygodnia"
  },
  "vi": {
    "minute": "Phut",
    "hour": "Gio",
    "dayOfMonth": "Ngay trong thang",
    "month": "Thang",
    "dayOfWeek": "Ngay trong tuan"
  },
  "th": {
    "minute": "นาที",
    "hour": "ชั่วโมง",
    "dayOfMonth": "วันของเดือน",
    "month": "เดือน",
    "dayOfWeek": "วันในสัปดาห์"
  },
  "id": {
    "minute": "Menit",
    "hour": "Jam",
    "dayOfMonth": "Hari dalam bulan",
    "month": "Bulan",
    "dayOfWeek": "Hari dalam minggu"
  },
  "he": {
    "minute": "דקה",
    "hour": "שעה",
    "dayOfMonth": "יום בחודש",
    "month": "חודש",
    "dayOfWeek": "יום בשבוע"
  },
  "ms": {
    "minute": "Minit",
    "hour": "Jam",
    "dayOfMonth": "Hari dalam bulan",
    "month": "Bulan",
    "dayOfWeek": "Hari dalam minggu"
  },
  "no": {
    "minute": "Minutt",
    "hour": "Time",
    "dayOfMonth": "Dag i maneden",
    "month": "Maned",
    "dayOfWeek": "Ukedag"
  }
}
</i18n>
