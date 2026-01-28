<template>
  <n-text depth="3">{{ t('everyDescription', { field: fieldLabel.toLowerCase() }) }}</n-text>
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
    "everyDescription": "Runs on every {field}",
    "minute": "Minute",
    "hour": "Hour",
    "dayOfMonth": "Day of Month",
    "month": "Month",
    "dayOfWeek": "Day of Week"
  },
  "zh": {
    "everyDescription": "每个{field}都运行",
    "minute": "分钟",
    "hour": "小时",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期"
  },
  "zh-CN": {
    "everyDescription": "每个{field}都运行",
    "minute": "分钟",
    "hour": "小时",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期"
  },
  "zh-TW": {
    "everyDescription": "每個{field}都執行",
    "minute": "分鐘",
    "hour": "小時",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期"
  },
  "zh-HK": {
    "everyDescription": "每個{field}都執行",
    "minute": "分鐘",
    "hour": "小時",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期"
  },
  "es": {
    "everyDescription": "Se ejecuta cada {field}",
    "minute": "Minuto",
    "hour": "Hora",
    "dayOfMonth": "Dia del mes",
    "month": "Mes",
    "dayOfWeek": "Dia de la semana"
  },
  "fr": {
    "everyDescription": "S'execute chaque {field}",
    "minute": "Minute",
    "hour": "Heure",
    "dayOfMonth": "Jour du mois",
    "month": "Mois",
    "dayOfWeek": "Jour de la semaine"
  },
  "de": {
    "everyDescription": "Wird jede {field} ausgefuhrt",
    "minute": "Minute",
    "hour": "Stunde",
    "dayOfMonth": "Tag des Monats",
    "month": "Monat",
    "dayOfWeek": "Wochentag"
  },
  "it": {
    "everyDescription": "Viene eseguito ogni {field}",
    "minute": "Minuto",
    "hour": "Ora",
    "dayOfMonth": "Giorno del mese",
    "month": "Mese",
    "dayOfWeek": "Giorno della settimana"
  },
  "ja": {
    "everyDescription": "毎{field}実行",
    "minute": "分",
    "hour": "時",
    "dayOfMonth": "日",
    "month": "月",
    "dayOfWeek": "曜日"
  },
  "ko": {
    "everyDescription": "매 {field}마다 실행",
    "minute": "분",
    "hour": "시",
    "dayOfMonth": "일",
    "month": "월",
    "dayOfWeek": "요일"
  },
  "ru": {
    "everyDescription": "Выполняется каждый {field}",
    "minute": "Минута",
    "hour": "Час",
    "dayOfMonth": "День месяца",
    "month": "Месяц",
    "dayOfWeek": "День недели"
  },
  "pt": {
    "everyDescription": "Executa a cada {field}",
    "minute": "Minuto",
    "hour": "Hora",
    "dayOfMonth": "Dia do mes",
    "month": "Mes",
    "dayOfWeek": "Dia da semana"
  },
  "ar": {
    "everyDescription": "يعمل كل {field}",
    "minute": "دقيقة",
    "hour": "ساعة",
    "dayOfMonth": "يوم الشهر",
    "month": "شهر",
    "dayOfWeek": "يوم الاسبوع"
  },
  "hi": {
    "everyDescription": "हर {field} पर चलता है",
    "minute": "मिनट",
    "hour": "घंटा",
    "dayOfMonth": "महीने का दिन",
    "month": "महीना",
    "dayOfWeek": "सप्ताह का दिन"
  },
  "tr": {
    "everyDescription": "Her {field} calisir",
    "minute": "Dakika",
    "hour": "Saat",
    "dayOfMonth": "Ayin gunu",
    "month": "Ay",
    "dayOfWeek": "Haftanin gunu"
  },
  "nl": {
    "everyDescription": "Wordt elke {field} uitgevoerd",
    "minute": "Minuut",
    "hour": "Uur",
    "dayOfMonth": "Dag van de maand",
    "month": "Maand",
    "dayOfWeek": "Dag van de week"
  },
  "sv": {
    "everyDescription": "Kors varje {field}",
    "minute": "Minut",
    "hour": "Timme",
    "dayOfMonth": "Dag i manaden",
    "month": "Manad",
    "dayOfWeek": "Veckodag"
  },
  "pl": {
    "everyDescription": "Uruchamia sie co {field}",
    "minute": "Minuta",
    "hour": "Godzina",
    "dayOfMonth": "Dzien miesiaca",
    "month": "Miesiac",
    "dayOfWeek": "Dzien tygodnia"
  },
  "vi": {
    "everyDescription": "Chay moi {field}",
    "minute": "Phut",
    "hour": "Gio",
    "dayOfMonth": "Ngay trong thang",
    "month": "Thang",
    "dayOfWeek": "Ngay trong tuan"
  },
  "th": {
    "everyDescription": "ทำงานทุก {field}",
    "minute": "นาที",
    "hour": "ชั่วโมง",
    "dayOfMonth": "วันของเดือน",
    "month": "เดือน",
    "dayOfWeek": "วันในสัปดาห์"
  },
  "id": {
    "everyDescription": "Berjalan setiap {field}",
    "minute": "Menit",
    "hour": "Jam",
    "dayOfMonth": "Hari dalam bulan",
    "month": "Bulan",
    "dayOfWeek": "Hari dalam minggu"
  },
  "he": {
    "everyDescription": "רץ כל {field}",
    "minute": "דקה",
    "hour": "שעה",
    "dayOfMonth": "יום בחודש",
    "month": "חודש",
    "dayOfWeek": "יום בשבוע"
  },
  "ms": {
    "everyDescription": "Berjalan setiap {field}",
    "minute": "Minit",
    "hour": "Jam",
    "dayOfMonth": "Hari dalam bulan",
    "month": "Bulan",
    "dayOfWeek": "Hari dalam minggu"
  },
  "no": {
    "everyDescription": "Kjorer hver {field}",
    "minute": "Minutt",
    "hour": "Time",
    "dayOfMonth": "Dag i maneden",
    "month": "Maned",
    "dayOfWeek": "Ukedag"
  }
}
</i18n>
