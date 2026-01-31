<template>
  <n-grid cols="1 900:2" x-gap="12" y-gap="12">
    <n-form-item-gi :label="t('repeat')" :show-feedback="false">
      <n-select v-model:value="recurrenceFrequencyModel" :options="frequencyOptions" />
    </n-form-item-gi>
    <n-form-item-gi
      v-if="recurrenceFrequencyModel !== 'none'"
      :label="t('interval')"
      :show-feedback="false"
    >
      <n-input-number
        v-model:value="recurrenceIntervalModel"
        :min="1"
        :precision="0"
        style="width: 100%"
      />
    </n-form-item-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NFormItemGi, NGrid, NInputNumber, NSelect } from 'naive-ui'

type RecurrenceFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

const recurrenceFrequency = defineModel<RecurrenceFrequency>('recurrenceFrequency', {
  required: true,
})
const recurrenceInterval = defineModel<number>('recurrenceInterval', { required: true })

const { t } = useI18n()

const recurrenceFrequencyModel = computed({
  get: () => recurrenceFrequency.value,
  set: (value) => {
    recurrenceFrequency.value = value
  },
})

const recurrenceIntervalModel = computed({
  get: () => recurrenceInterval.value,
  set: (value) => {
    recurrenceInterval.value = value ?? 1
  },
})

const frequencyOptions = computed(() => [
  { label: t('frequency-none'), value: 'none' },
  { label: t('frequency-daily'), value: 'daily' },
  { label: t('frequency-weekly'), value: 'weekly' },
  { label: t('frequency-monthly'), value: 'monthly' },
  { label: t('frequency-yearly'), value: 'yearly' },
])
</script>

<i18n lang="json">
{
  "en": {
    "repeat": "Repeat",
    "frequency-none": "Does not repeat",
    "frequency-daily": "Daily",
    "frequency-weekly": "Weekly",
    "frequency-monthly": "Monthly",
    "frequency-yearly": "Yearly",
    "interval": "Interval"
  },
  "zh": {
    "repeat": "重复",
    "frequency-none": "不重复",
    "frequency-daily": "每天",
    "frequency-weekly": "每周",
    "frequency-monthly": "每月",
    "frequency-yearly": "每年",
    "interval": "间隔"
  },
  "zh-CN": {
    "repeat": "重复",
    "frequency-none": "不重复",
    "frequency-daily": "每天",
    "frequency-weekly": "每周",
    "frequency-monthly": "每月",
    "frequency-yearly": "每年",
    "interval": "间隔"
  },
  "zh-TW": {
    "repeat": "重複",
    "frequency-none": "不重複",
    "frequency-daily": "每天",
    "frequency-weekly": "每週",
    "frequency-monthly": "每月",
    "frequency-yearly": "每年",
    "interval": "間隔"
  },
  "zh-HK": {
    "repeat": "重複",
    "frequency-none": "不重複",
    "frequency-daily": "每天",
    "frequency-weekly": "每週",
    "frequency-monthly": "每月",
    "frequency-yearly": "每年",
    "interval": "間隔"
  },
  "es": {
    "repeat": "Repetir",
    "frequency-none": "No se repite",
    "frequency-daily": "Diario",
    "frequency-weekly": "Semanal",
    "frequency-monthly": "Mensual",
    "frequency-yearly": "Anual",
    "interval": "Intervalo"
  },
  "fr": {
    "repeat": "Répéter",
    "frequency-none": "Ne se répète pas",
    "frequency-daily": "Quotidien",
    "frequency-weekly": "Hebdomadaire",
    "frequency-monthly": "Mensuel",
    "frequency-yearly": "Annuel",
    "interval": "Intervalle"
  },
  "de": {
    "repeat": "Wiederholen",
    "frequency-none": "Keine Wiederholung",
    "frequency-daily": "Täglich",
    "frequency-weekly": "Wöchentlich",
    "frequency-monthly": "Monatlich",
    "frequency-yearly": "Jährlich",
    "interval": "Intervall"
  },
  "it": {
    "repeat": "Ripeti",
    "frequency-none": "Nessuna ripetizione",
    "frequency-daily": "Giornaliero",
    "frequency-weekly": "Settimanale",
    "frequency-monthly": "Mensile",
    "frequency-yearly": "Annuale",
    "interval": "Intervallo"
  },
  "ja": {
    "repeat": "繰り返す",
    "frequency-none": "繰り返しなし",
    "frequency-daily": "毎日",
    "frequency-weekly": "毎週",
    "frequency-monthly": "毎月",
    "frequency-yearly": "毎年",
    "interval": "間隔"
  },
  "ko": {
    "repeat": "반복",
    "frequency-none": "반복 없음",
    "frequency-daily": "매일",
    "frequency-weekly": "매주",
    "frequency-monthly": "매월",
    "frequency-yearly": "매년",
    "interval": "간격"
  },
  "ru": {
    "repeat": "Повторять",
    "frequency-none": "Без повторения",
    "frequency-daily": "Ежедневно",
    "frequency-weekly": "Еженедельно",
    "frequency-monthly": "Ежемесячно",
    "frequency-yearly": "Ежегодно",
    "interval": "Интервал"
  },
  "pt": {
    "repeat": "Repetir",
    "frequency-none": "Não se repete",
    "frequency-daily": "Diário",
    "frequency-weekly": "Semanal",
    "frequency-monthly": "Mensal",
    "frequency-yearly": "Anual",
    "interval": "Intervalo"
  },
  "ar": {
    "repeat": "تكرار",
    "frequency-none": "بدون تكرار",
    "frequency-daily": "يومي",
    "frequency-weekly": "أسبوعي",
    "frequency-monthly": "شهري",
    "frequency-yearly": "سنوي",
    "interval": "الفاصل"
  },
  "hi": {
    "repeat": "दोहराएँ",
    "frequency-none": "दोहराव नहीं",
    "frequency-daily": "दैनिक",
    "frequency-weekly": "साप्ताहिक",
    "frequency-monthly": "मासिक",
    "frequency-yearly": "वार्षिक",
    "interval": "अंतराल"
  },
  "tr": {
    "repeat": "Yinele",
    "frequency-none": "Yineleme yok",
    "frequency-daily": "Günlük",
    "frequency-weekly": "Haftalık",
    "frequency-monthly": "Aylık",
    "frequency-yearly": "Yıllık",
    "interval": "Aralık"
  },
  "nl": {
    "repeat": "Herhalen",
    "frequency-none": "Geen herhaling",
    "frequency-daily": "Dagelijks",
    "frequency-weekly": "Wekelijks",
    "frequency-monthly": "Maandelijks",
    "frequency-yearly": "Jaarlijks",
    "interval": "Interval"
  },
  "sv": {
    "repeat": "Upprepa",
    "frequency-none": "Ingen upprepning",
    "frequency-daily": "Dagligen",
    "frequency-weekly": "Veckovis",
    "frequency-monthly": "Månadsvis",
    "frequency-yearly": "Årligen",
    "interval": "Intervall"
  },
  "pl": {
    "repeat": "Powtarzaj",
    "frequency-none": "Brak powtórzeń",
    "frequency-daily": "Codziennie",
    "frequency-weekly": "Co tydzień",
    "frequency-monthly": "Co miesiąc",
    "frequency-yearly": "Co rok",
    "interval": "Interwał"
  },
  "vi": {
    "repeat": "Lặp lại",
    "frequency-none": "Không lặp",
    "frequency-daily": "Hàng ngày",
    "frequency-weekly": "Hàng tuần",
    "frequency-monthly": "Hàng tháng",
    "frequency-yearly": "Hàng năm",
    "interval": "Khoảng"
  },
  "th": {
    "repeat": "ทำซ้ำ",
    "frequency-none": "ไม่ทำซ้ำ",
    "frequency-daily": "รายวัน",
    "frequency-weekly": "รายสัปดาห์",
    "frequency-monthly": "รายเดือน",
    "frequency-yearly": "รายปี",
    "interval": "ช่วงเวลา"
  },
  "id": {
    "repeat": "Ulangi",
    "frequency-none": "Tidak berulang",
    "frequency-daily": "Harian",
    "frequency-weekly": "Mingguan",
    "frequency-monthly": "Bulanan",
    "frequency-yearly": "Tahunan",
    "interval": "Interval"
  },
  "he": {
    "repeat": "חזור",
    "frequency-none": "ללא חזרה",
    "frequency-daily": "יומי",
    "frequency-weekly": "שבועי",
    "frequency-monthly": "חודשי",
    "frequency-yearly": "שנתי",
    "interval": "מרווח"
  },
  "ms": {
    "repeat": "Ulang",
    "frequency-none": "Tiada ulangan",
    "frequency-daily": "Harian",
    "frequency-weekly": "Mingguan",
    "frequency-monthly": "Bulanan",
    "frequency-yearly": "Tahunan",
    "interval": "Selang"
  },
  "no": {
    "repeat": "Gjenta",
    "frequency-none": "Ingen gjentakelse",
    "frequency-daily": "Daglig",
    "frequency-weekly": "Ukentlig",
    "frequency-monthly": "Månedlig",
    "frequency-yearly": "Årlig",
    "interval": "Intervall"
  }
}
</i18n>
