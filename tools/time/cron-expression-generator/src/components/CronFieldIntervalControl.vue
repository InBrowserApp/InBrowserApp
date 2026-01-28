<template>
  <n-flex align="center" :size="8">
    <n-text>{{ t('every') }}</n-text>
    <n-input-number
      v-model:value="intervalValue"
      :min="1"
      :max="intervalMax"
      size="small"
      style="width: 80px"
    />
    <n-text>{{ unitLabel }}</n-text>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NFlex, NInputNumber, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'

type FieldUnit = 'minutes' | 'hours' | 'days' | 'months' | 'daysOfWeek'

type FieldConfig = {
  min: number
  max: number
  unit: FieldUnit
}

const props = defineProps<{
  fieldConfig: FieldConfig
}>()

const intervalValue = defineModel<number>('intervalValue', { required: true })

const { t } = useI18n()

const unitLabel = computed(
  () =>
    ({
      minutes: t('minutes'),
      hours: t('hours'),
      days: t('days'),
      months: t('months'),
      daysOfWeek: t('daysOfWeek'),
    })[props.fieldConfig.unit],
)

const intervalMax = computed(() => props.fieldConfig.max - props.fieldConfig.min + 1)
</script>

<i18n lang="json">
{
  "en": {
    "every": "Every",
    "minutes": "minute(s)",
    "hours": "hour(s)",
    "days": "day(s)",
    "months": "month(s)",
    "daysOfWeek": "day(s)"
  },
  "zh": {
    "every": "每个",
    "minutes": "分钟",
    "hours": "小时",
    "days": "天",
    "months": "个月",
    "daysOfWeek": "天"
  },
  "zh-CN": {
    "every": "每个",
    "minutes": "分钟",
    "hours": "小时",
    "days": "天",
    "months": "个月",
    "daysOfWeek": "天"
  },
  "zh-TW": {
    "every": "每個",
    "minutes": "分鐘",
    "hours": "小時",
    "days": "天",
    "months": "個月",
    "daysOfWeek": "天"
  },
  "zh-HK": {
    "every": "每個",
    "minutes": "分鐘",
    "hours": "小時",
    "days": "天",
    "months": "個月",
    "daysOfWeek": "天"
  },
  "es": {
    "every": "Cada",
    "minutes": "minuto(s)",
    "hours": "hora(s)",
    "days": "dia(s)",
    "months": "mes(es)",
    "daysOfWeek": "dia(s)"
  },
  "fr": {
    "every": "Chaque",
    "minutes": "minute(s)",
    "hours": "heure(s)",
    "days": "jour(s)",
    "months": "mois",
    "daysOfWeek": "jour(s)"
  },
  "de": {
    "every": "Jede",
    "minutes": "Minute(n)",
    "hours": "Stunde(n)",
    "days": "Tag(e)",
    "months": "Monat(e)",
    "daysOfWeek": "Tag(e)"
  },
  "it": {
    "every": "Ogni",
    "minutes": "minuto/i",
    "hours": "ora/e",
    "days": "giorno/i",
    "months": "mese/i",
    "daysOfWeek": "giorno/i"
  },
  "ja": {
    "every": "毎",
    "minutes": "分",
    "hours": "時間",
    "days": "日",
    "months": "ヶ月",
    "daysOfWeek": "日"
  },
  "ko": {
    "every": "매",
    "minutes": "분",
    "hours": "시간",
    "days": "일",
    "months": "개월",
    "daysOfWeek": "일"
  },
  "ru": {
    "every": "Каждый",
    "minutes": "минут(а)",
    "hours": "час(ов)",
    "days": "день(дней)",
    "months": "месяц(ев)",
    "daysOfWeek": "день(дней)"
  },
  "pt": {
    "every": "Cada",
    "minutes": "minuto(s)",
    "hours": "hora(s)",
    "days": "dia(s)",
    "months": "mes(es)",
    "daysOfWeek": "dia(s)"
  },
  "ar": {
    "every": "كل",
    "minutes": "دقيقة",
    "hours": "ساعة",
    "days": "يوم",
    "months": "شهر",
    "daysOfWeek": "يوم"
  },
  "hi": {
    "every": "हर",
    "minutes": "मिनट",
    "hours": "घंटे",
    "days": "दिन",
    "months": "महीने",
    "daysOfWeek": "दिन"
  },
  "tr": {
    "every": "Her",
    "minutes": "dakika",
    "hours": "saat",
    "days": "gun",
    "months": "ay",
    "daysOfWeek": "gun"
  },
  "nl": {
    "every": "Elke",
    "minutes": "minu(u)t(en)",
    "hours": "uur/uren",
    "days": "dag(en)",
    "months": "maand(en)",
    "daysOfWeek": "dag(en)"
  },
  "sv": {
    "every": "Varje",
    "minutes": "minut(er)",
    "hours": "timme/timmar",
    "days": "dag(ar)",
    "months": "manad(er)",
    "daysOfWeek": "dag(ar)"
  },
  "pl": {
    "every": "Kazdy",
    "minutes": "minut(a)",
    "hours": "godzin(a)",
    "days": "dzien/dni",
    "months": "miesiac/e",
    "daysOfWeek": "dzien/dni"
  },
  "vi": {
    "every": "Moi",
    "minutes": "phut",
    "hours": "gio",
    "days": "ngay",
    "months": "thang",
    "daysOfWeek": "ngay"
  },
  "th": {
    "every": "ทุก",
    "minutes": "นาที",
    "hours": "ชั่วโมง",
    "days": "วัน",
    "months": "เดือน",
    "daysOfWeek": "วัน"
  },
  "id": {
    "every": "Setiap",
    "minutes": "menit",
    "hours": "jam",
    "days": "hari",
    "months": "bulan",
    "daysOfWeek": "hari"
  },
  "he": {
    "every": "כל",
    "minutes": "דקות",
    "hours": "שעות",
    "days": "ימים",
    "months": "חודשים",
    "daysOfWeek": "ימים"
  },
  "ms": {
    "every": "Setiap",
    "minutes": "minit",
    "hours": "jam",
    "days": "hari",
    "months": "bulan",
    "daysOfWeek": "hari"
  },
  "no": {
    "every": "Hver",
    "minutes": "minutt(er)",
    "hours": "time(r)",
    "days": "dag(er)",
    "months": "maned(er)",
    "daysOfWeek": "dag(er)"
  }
}
</i18n>
