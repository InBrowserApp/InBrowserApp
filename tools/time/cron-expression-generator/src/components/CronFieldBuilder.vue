<template>
  <n-card size="small">
    <template #header>
      <n-text strong>{{ t(fieldName) }}</n-text>
    </template>

    <n-flex vertical :size="12">
      <!-- Mode selection -->
      <n-radio-group v-model:value="mode" size="small">
        <n-flex :size="16" wrap>
          <n-radio value="every">{{ t('every') }}</n-radio>
          <n-radio value="interval">{{ t('interval') }}</n-radio>
          <n-radio value="specific">{{ t('specific') }}</n-radio>
          <n-radio value="range">{{ t('range') }}</n-radio>
        </n-flex>
      </n-radio-group>

      <!-- Mode-specific controls -->
      <template v-if="mode === 'every'">
        <n-text depth="3">{{
          t('everyDescription', { field: t(fieldName).toLowerCase() })
        }}</n-text>
      </template>

      <template v-else-if="mode === 'interval'">
        <n-flex align="center" :size="8">
          <n-text>{{ t('every') }}</n-text>
          <n-input-number
            v-model:value="intervalValue"
            :min="1"
            :max="fieldConfig.max - fieldConfig.min + 1"
            size="small"
            style="width: 80px"
          />
          <n-text>{{ t(fieldConfig.unit) }}</n-text>
        </n-flex>
      </template>

      <template v-else-if="mode === 'specific'">
        <n-checkbox-group v-model:value="specificValues">
          <n-grid :cols="fieldConfig.gridCols" :x-gap="4" :y-gap="4">
            <n-gi v-for="opt in valueOptions" :key="opt.value">
              <n-checkbox :value="opt.value" size="small">
                {{ opt.label }}
              </n-checkbox>
            </n-gi>
          </n-grid>
        </n-checkbox-group>
      </template>

      <template v-else-if="mode === 'range'">
        <n-flex align="center" :size="8">
          <n-text>{{ t('from') }}</n-text>
          <n-select
            v-model:value="rangeStart"
            :options="valueOptions"
            size="small"
            style="width: 100px"
          />
          <n-text>{{ t('to') }}</n-text>
          <n-select
            v-model:value="rangeEnd"
            :options="valueOptions"
            size="small"
            style="width: 100px"
          />
        </n-flex>
      </template>
    </n-flex>
  </n-card>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import {
  NCard,
  NFlex,
  NText,
  NRadioGroup,
  NRadio,
  NInputNumber,
  NCheckboxGroup,
  NCheckbox,
  NGrid,
  NGi,
  NSelect,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'

type FieldName = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek'
type Mode = 'every' | 'interval' | 'specific' | 'range'

interface FieldConfig {
  min: number
  max: number
  unit: string
  gridCols: number
  labels?: string[]
}

const props = defineProps<{
  fieldName: FieldName
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()

const FIELD_CONFIGS: Record<FieldName, FieldConfig> = {
  minute: { min: 0, max: 59, unit: 'minutes', gridCols: 10 },
  hour: { min: 0, max: 23, unit: 'hours', gridCols: 8 },
  dayOfMonth: { min: 1, max: 31, unit: 'days', gridCols: 8 },
  month: {
    min: 1,
    max: 12,
    unit: 'months',
    gridCols: 6,
    labels: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
  },
  dayOfWeek: {
    min: 0,
    max: 6,
    unit: 'daysOfWeek',
    gridCols: 7,
    labels: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
  },
}

const fieldConfig = computed(() => FIELD_CONFIGS[props.fieldName])

const valueOptions = computed(() => {
  const config = fieldConfig.value
  const options = []
  for (let i = config.min; i <= config.max; i++) {
    const label = config.labels ? t(config.labels[i - config.min]!) : String(i)
    options.push({ value: i, label })
  }
  return options
})

// Internal state
const mode = ref<Mode>('every')
const intervalValue = ref(5)
const specificValues = ref<number[]>([])
const rangeStart = ref(fieldConfig.value.min)
const rangeEnd = ref(fieldConfig.value.max)

// Parse initial value
function parseValue(value: string) {
  if (value === '*') {
    mode.value = 'every'
  } else if (value.startsWith('*/')) {
    mode.value = 'interval'
    intervalValue.value = parseInt(value.slice(2)) || 5
  } else if (value.includes('-')) {
    mode.value = 'range'
    const [start, end] = value.split('-').map(Number)
    rangeStart.value = start ?? fieldConfig.value.min
    rangeEnd.value = end ?? fieldConfig.value.max
  } else if (value.includes(',') || /^\d+$/.test(value)) {
    mode.value = 'specific'
    specificValues.value = value
      .split(',')
      .map(Number)
      .filter((n) => !isNaN(n))
  }
}

// Generate cron field value
const generatedValue = computed(() => {
  switch (mode.value) {
    case 'every':
      return '*'
    case 'interval':
      return `*/${intervalValue.value}`
    case 'specific':
      if (specificValues.value.length === 0) {
        return '*'
      }
      return [...specificValues.value].sort((a, b) => a - b).join(',')
    case 'range':
      return `${rangeStart.value}-${rangeEnd.value}`
    default:
      return '*'
  }
})

// Initialize from prop
parseValue(props.modelValue)

// Watch for external changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== generatedValue.value) {
      parseValue(newValue)
    }
  },
)

// Emit changes
watch(generatedValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<i18n lang="json">
{
  "en": {
    "minute": "Minute",
    "hour": "Hour",
    "dayOfMonth": "Day of Month",
    "month": "Month",
    "dayOfWeek": "Day of Week",
    "every": "Every",
    "interval": "Interval",
    "specific": "Specific",
    "range": "Range",
    "everyDescription": "Runs on every {field}",
    "from": "From",
    "to": "to",
    "minutes": "minute(s)",
    "hours": "hour(s)",
    "days": "day(s)",
    "months": "month(s)",
    "daysOfWeek": "day(s)",
    "sun": "Sun",
    "mon": "Mon",
    "tue": "Tue",
    "wed": "Wed",
    "thu": "Thu",
    "fri": "Fri",
    "sat": "Sat",
    "jan": "Jan",
    "feb": "Feb",
    "mar": "Mar",
    "apr": "Apr",
    "may": "May",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Aug",
    "sep": "Sep",
    "oct": "Oct",
    "nov": "Nov",
    "dec": "Dec"
  },
  "zh": {
    "minute": "分钟",
    "hour": "小时",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期",
    "every": "每个",
    "interval": "间隔",
    "specific": "指定",
    "range": "范围",
    "everyDescription": "每个{field}都运行",
    "from": "从",
    "to": "到",
    "minutes": "分钟",
    "hours": "小时",
    "days": "天",
    "months": "个月",
    "daysOfWeek": "天",
    "sun": "周日",
    "mon": "周一",
    "tue": "周二",
    "wed": "周三",
    "thu": "周四",
    "fri": "周五",
    "sat": "周六",
    "jan": "1月",
    "feb": "2月",
    "mar": "3月",
    "apr": "4月",
    "may": "5月",
    "jun": "6月",
    "jul": "7月",
    "aug": "8月",
    "sep": "9月",
    "oct": "10月",
    "nov": "11月",
    "dec": "12月"
  },
  "zh-CN": {
    "minute": "分钟",
    "hour": "小时",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期",
    "every": "每个",
    "interval": "间隔",
    "specific": "指定",
    "range": "范围",
    "everyDescription": "每个{field}都运行",
    "from": "从",
    "to": "到",
    "minutes": "分钟",
    "hours": "小时",
    "days": "天",
    "months": "个月",
    "daysOfWeek": "天",
    "sun": "周日",
    "mon": "周一",
    "tue": "周二",
    "wed": "周三",
    "thu": "周四",
    "fri": "周五",
    "sat": "周六",
    "jan": "1月",
    "feb": "2月",
    "mar": "3月",
    "apr": "4月",
    "may": "5月",
    "jun": "6月",
    "jul": "7月",
    "aug": "8月",
    "sep": "9月",
    "oct": "10月",
    "nov": "11月",
    "dec": "12月"
  },
  "zh-TW": {
    "minute": "分鐘",
    "hour": "小時",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期",
    "every": "每個",
    "interval": "間隔",
    "specific": "指定",
    "range": "範圍",
    "everyDescription": "每個{field}都執行",
    "from": "從",
    "to": "到",
    "minutes": "分鐘",
    "hours": "小時",
    "days": "天",
    "months": "個月",
    "daysOfWeek": "天",
    "sun": "週日",
    "mon": "週一",
    "tue": "週二",
    "wed": "週三",
    "thu": "週四",
    "fri": "週五",
    "sat": "週六",
    "jan": "1月",
    "feb": "2月",
    "mar": "3月",
    "apr": "4月",
    "may": "5月",
    "jun": "6月",
    "jul": "7月",
    "aug": "8月",
    "sep": "9月",
    "oct": "10月",
    "nov": "11月",
    "dec": "12月"
  },
  "zh-HK": {
    "minute": "分鐘",
    "hour": "小時",
    "dayOfMonth": "日期",
    "month": "月份",
    "dayOfWeek": "星期",
    "every": "每個",
    "interval": "間隔",
    "specific": "指定",
    "range": "範圍",
    "everyDescription": "每個{field}都執行",
    "from": "從",
    "to": "到",
    "minutes": "分鐘",
    "hours": "小時",
    "days": "天",
    "months": "個月",
    "daysOfWeek": "天",
    "sun": "週日",
    "mon": "週一",
    "tue": "週二",
    "wed": "週三",
    "thu": "週四",
    "fri": "週五",
    "sat": "週六",
    "jan": "1月",
    "feb": "2月",
    "mar": "3月",
    "apr": "4月",
    "may": "5月",
    "jun": "6月",
    "jul": "7月",
    "aug": "8月",
    "sep": "9月",
    "oct": "10月",
    "nov": "11月",
    "dec": "12月"
  },
  "es": {
    "minute": "Minuto",
    "hour": "Hora",
    "dayOfMonth": "Dia del mes",
    "month": "Mes",
    "dayOfWeek": "Dia de la semana",
    "every": "Cada",
    "interval": "Intervalo",
    "specific": "Especifico",
    "range": "Rango",
    "everyDescription": "Se ejecuta cada {field}",
    "from": "Desde",
    "to": "hasta",
    "minutes": "minuto(s)",
    "hours": "hora(s)",
    "days": "dia(s)",
    "months": "mes(es)",
    "daysOfWeek": "dia(s)",
    "sun": "Dom",
    "mon": "Lun",
    "tue": "Mar",
    "wed": "Mie",
    "thu": "Jue",
    "fri": "Vie",
    "sat": "Sab",
    "jan": "Ene",
    "feb": "Feb",
    "mar": "Mar",
    "apr": "Abr",
    "may": "May",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Ago",
    "sep": "Sep",
    "oct": "Oct",
    "nov": "Nov",
    "dec": "Dic"
  },
  "fr": {
    "minute": "Minute",
    "hour": "Heure",
    "dayOfMonth": "Jour du mois",
    "month": "Mois",
    "dayOfWeek": "Jour de la semaine",
    "every": "Chaque",
    "interval": "Intervalle",
    "specific": "Specifique",
    "range": "Plage",
    "everyDescription": "S'execute chaque {field}",
    "from": "De",
    "to": "a",
    "minutes": "minute(s)",
    "hours": "heure(s)",
    "days": "jour(s)",
    "months": "mois",
    "daysOfWeek": "jour(s)",
    "sun": "Dim",
    "mon": "Lun",
    "tue": "Mar",
    "wed": "Mer",
    "thu": "Jeu",
    "fri": "Ven",
    "sat": "Sam",
    "jan": "Jan",
    "feb": "Fev",
    "mar": "Mar",
    "apr": "Avr",
    "may": "Mai",
    "jun": "Juin",
    "jul": "Juil",
    "aug": "Aout",
    "sep": "Sep",
    "oct": "Oct",
    "nov": "Nov",
    "dec": "Dec"
  },
  "de": {
    "minute": "Minute",
    "hour": "Stunde",
    "dayOfMonth": "Tag des Monats",
    "month": "Monat",
    "dayOfWeek": "Wochentag",
    "every": "Jede",
    "interval": "Intervall",
    "specific": "Spezifisch",
    "range": "Bereich",
    "everyDescription": "Wird jede {field} ausgefuhrt",
    "from": "Von",
    "to": "bis",
    "minutes": "Minute(n)",
    "hours": "Stunde(n)",
    "days": "Tag(e)",
    "months": "Monat(e)",
    "daysOfWeek": "Tag(e)",
    "sun": "So",
    "mon": "Mo",
    "tue": "Di",
    "wed": "Mi",
    "thu": "Do",
    "fri": "Fr",
    "sat": "Sa",
    "jan": "Jan",
    "feb": "Feb",
    "mar": "Mar",
    "apr": "Apr",
    "may": "Mai",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Aug",
    "sep": "Sep",
    "oct": "Okt",
    "nov": "Nov",
    "dec": "Dez"
  },
  "it": {
    "minute": "Minuto",
    "hour": "Ora",
    "dayOfMonth": "Giorno del mese",
    "month": "Mese",
    "dayOfWeek": "Giorno della settimana",
    "every": "Ogni",
    "interval": "Intervallo",
    "specific": "Specifico",
    "range": "Intervallo",
    "everyDescription": "Viene eseguito ogni {field}",
    "from": "Da",
    "to": "a",
    "minutes": "minuto/i",
    "hours": "ora/e",
    "days": "giorno/i",
    "months": "mese/i",
    "daysOfWeek": "giorno/i",
    "sun": "Dom",
    "mon": "Lun",
    "tue": "Mar",
    "wed": "Mer",
    "thu": "Gio",
    "fri": "Ven",
    "sat": "Sab",
    "jan": "Gen",
    "feb": "Feb",
    "mar": "Mar",
    "apr": "Apr",
    "may": "Mag",
    "jun": "Giu",
    "jul": "Lug",
    "aug": "Ago",
    "sep": "Set",
    "oct": "Ott",
    "nov": "Nov",
    "dec": "Dic"
  },
  "ja": {
    "minute": "分",
    "hour": "時",
    "dayOfMonth": "日",
    "month": "月",
    "dayOfWeek": "曜日",
    "every": "毎",
    "interval": "間隔",
    "specific": "指定",
    "range": "範囲",
    "everyDescription": "毎{field}実行",
    "from": "開始",
    "to": "終了",
    "minutes": "分",
    "hours": "時間",
    "days": "日",
    "months": "ヶ月",
    "daysOfWeek": "日",
    "sun": "日",
    "mon": "月",
    "tue": "火",
    "wed": "水",
    "thu": "木",
    "fri": "金",
    "sat": "土",
    "jan": "1月",
    "feb": "2月",
    "mar": "3月",
    "apr": "4月",
    "may": "5月",
    "jun": "6月",
    "jul": "7月",
    "aug": "8月",
    "sep": "9月",
    "oct": "10月",
    "nov": "11月",
    "dec": "12月"
  },
  "ko": {
    "minute": "분",
    "hour": "시",
    "dayOfMonth": "일",
    "month": "월",
    "dayOfWeek": "요일",
    "every": "매",
    "interval": "간격",
    "specific": "지정",
    "range": "범위",
    "everyDescription": "매 {field}마다 실행",
    "from": "시작",
    "to": "끝",
    "minutes": "분",
    "hours": "시간",
    "days": "일",
    "months": "개월",
    "daysOfWeek": "일",
    "sun": "일",
    "mon": "월",
    "tue": "화",
    "wed": "수",
    "thu": "목",
    "fri": "금",
    "sat": "토",
    "jan": "1월",
    "feb": "2월",
    "mar": "3월",
    "apr": "4월",
    "may": "5월",
    "jun": "6월",
    "jul": "7월",
    "aug": "8월",
    "sep": "9월",
    "oct": "10월",
    "nov": "11월",
    "dec": "12월"
  },
  "ru": {
    "minute": "Минута",
    "hour": "Час",
    "dayOfMonth": "День месяца",
    "month": "Месяц",
    "dayOfWeek": "День недели",
    "every": "Каждый",
    "interval": "Интервал",
    "specific": "Конкретный",
    "range": "Диапазон",
    "everyDescription": "Выполняется каждый {field}",
    "from": "От",
    "to": "до",
    "minutes": "минут(а)",
    "hours": "час(ов)",
    "days": "день(дней)",
    "months": "месяц(ев)",
    "daysOfWeek": "день(дней)",
    "sun": "Вс",
    "mon": "Пн",
    "tue": "Вт",
    "wed": "Ср",
    "thu": "Чт",
    "fri": "Пт",
    "sat": "Сб",
    "jan": "Янв",
    "feb": "Фев",
    "mar": "Мар",
    "apr": "Апр",
    "may": "Май",
    "jun": "Июн",
    "jul": "Июл",
    "aug": "Авг",
    "sep": "Сен",
    "oct": "Окт",
    "nov": "Ноя",
    "dec": "Дек"
  },
  "pt": {
    "minute": "Minuto",
    "hour": "Hora",
    "dayOfMonth": "Dia do mes",
    "month": "Mes",
    "dayOfWeek": "Dia da semana",
    "every": "Cada",
    "interval": "Intervalo",
    "specific": "Especifico",
    "range": "Faixa",
    "everyDescription": "Executa a cada {field}",
    "from": "De",
    "to": "ate",
    "minutes": "minuto(s)",
    "hours": "hora(s)",
    "days": "dia(s)",
    "months": "mes(es)",
    "daysOfWeek": "dia(s)",
    "sun": "Dom",
    "mon": "Seg",
    "tue": "Ter",
    "wed": "Qua",
    "thu": "Qui",
    "fri": "Sex",
    "sat": "Sab",
    "jan": "Jan",
    "feb": "Fev",
    "mar": "Mar",
    "apr": "Abr",
    "may": "Mai",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Ago",
    "sep": "Set",
    "oct": "Out",
    "nov": "Nov",
    "dec": "Dez"
  },
  "ar": {
    "minute": "دقيقة",
    "hour": "ساعة",
    "dayOfMonth": "يوم الشهر",
    "month": "شهر",
    "dayOfWeek": "يوم الاسبوع",
    "every": "كل",
    "interval": "فاصل",
    "specific": "محدد",
    "range": "نطاق",
    "everyDescription": "يعمل كل {field}",
    "from": "من",
    "to": "الى",
    "minutes": "دقيقة",
    "hours": "ساعة",
    "days": "يوم",
    "months": "شهر",
    "daysOfWeek": "يوم",
    "sun": "احد",
    "mon": "اثنين",
    "tue": "ثلاثاء",
    "wed": "اربعاء",
    "thu": "خميس",
    "fri": "جمعة",
    "sat": "سبت",
    "jan": "يناير",
    "feb": "فبراير",
    "mar": "مارس",
    "apr": "ابريل",
    "may": "مايو",
    "jun": "يونيو",
    "jul": "يوليو",
    "aug": "اغسطس",
    "sep": "سبتمبر",
    "oct": "اكتوبر",
    "nov": "نوفمبر",
    "dec": "ديسمبر"
  },
  "hi": {
    "minute": "मिनट",
    "hour": "घंटा",
    "dayOfMonth": "महीने का दिन",
    "month": "महीना",
    "dayOfWeek": "सप्ताह का दिन",
    "every": "हर",
    "interval": "अंतराल",
    "specific": "विशिष्ट",
    "range": "सीमा",
    "everyDescription": "हर {field} पर चलता है",
    "from": "से",
    "to": "तक",
    "minutes": "मिनट",
    "hours": "घंटे",
    "days": "दिन",
    "months": "महीने",
    "daysOfWeek": "दिन",
    "sun": "रवि",
    "mon": "सोम",
    "tue": "मंगल",
    "wed": "बुध",
    "thu": "गुरु",
    "fri": "शुक्र",
    "sat": "शनि",
    "jan": "जन",
    "feb": "फर",
    "mar": "मार्च",
    "apr": "अप्रैल",
    "may": "मई",
    "jun": "जून",
    "jul": "जुला",
    "aug": "अग",
    "sep": "सित",
    "oct": "अक्टू",
    "nov": "नव",
    "dec": "दिस"
  },
  "tr": {
    "minute": "Dakika",
    "hour": "Saat",
    "dayOfMonth": "Ayin gunu",
    "month": "Ay",
    "dayOfWeek": "Haftanin gunu",
    "every": "Her",
    "interval": "Aralik",
    "specific": "Belirli",
    "range": "Aralik",
    "everyDescription": "Her {field} calisir",
    "from": "Baslangic",
    "to": "bitis",
    "minutes": "dakika",
    "hours": "saat",
    "days": "gun",
    "months": "ay",
    "daysOfWeek": "gun",
    "sun": "Paz",
    "mon": "Pzt",
    "tue": "Sal",
    "wed": "Car",
    "thu": "Per",
    "fri": "Cum",
    "sat": "Cmt",
    "jan": "Oca",
    "feb": "Sub",
    "mar": "Mar",
    "apr": "Nis",
    "may": "May",
    "jun": "Haz",
    "jul": "Tem",
    "aug": "Agu",
    "sep": "Eyl",
    "oct": "Eki",
    "nov": "Kas",
    "dec": "Ara"
  },
  "nl": {
    "minute": "Minuut",
    "hour": "Uur",
    "dayOfMonth": "Dag van de maand",
    "month": "Maand",
    "dayOfWeek": "Dag van de week",
    "every": "Elke",
    "interval": "Interval",
    "specific": "Specifiek",
    "range": "Bereik",
    "everyDescription": "Wordt elke {field} uitgevoerd",
    "from": "Van",
    "to": "tot",
    "minutes": "minu(u)t(en)",
    "hours": "uur/uren",
    "days": "dag(en)",
    "months": "maand(en)",
    "daysOfWeek": "dag(en)",
    "sun": "Zo",
    "mon": "Ma",
    "tue": "Di",
    "wed": "Wo",
    "thu": "Do",
    "fri": "Vr",
    "sat": "Za",
    "jan": "Jan",
    "feb": "Feb",
    "mar": "Mrt",
    "apr": "Apr",
    "may": "Mei",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Aug",
    "sep": "Sep",
    "oct": "Okt",
    "nov": "Nov",
    "dec": "Dec"
  },
  "sv": {
    "minute": "Minut",
    "hour": "Timme",
    "dayOfMonth": "Dag i manaden",
    "month": "Manad",
    "dayOfWeek": "Veckodag",
    "every": "Varje",
    "interval": "Intervall",
    "specific": "Specifik",
    "range": "Omrade",
    "everyDescription": "Kors varje {field}",
    "from": "Fran",
    "to": "till",
    "minutes": "minut(er)",
    "hours": "timme/timmar",
    "days": "dag(ar)",
    "months": "manad(er)",
    "daysOfWeek": "dag(ar)",
    "sun": "Son",
    "mon": "Man",
    "tue": "Tis",
    "wed": "Ons",
    "thu": "Tor",
    "fri": "Fre",
    "sat": "Lor",
    "jan": "Jan",
    "feb": "Feb",
    "mar": "Mar",
    "apr": "Apr",
    "may": "Maj",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Aug",
    "sep": "Sep",
    "oct": "Okt",
    "nov": "Nov",
    "dec": "Dec"
  },
  "pl": {
    "minute": "Minuta",
    "hour": "Godzina",
    "dayOfMonth": "Dzien miesiaca",
    "month": "Miesiac",
    "dayOfWeek": "Dzien tygodnia",
    "every": "Kazdy",
    "interval": "Interwal",
    "specific": "Okreslony",
    "range": "Zakres",
    "everyDescription": "Uruchamia sie co {field}",
    "from": "Od",
    "to": "do",
    "minutes": "minut(a)",
    "hours": "godzin(a)",
    "days": "dzien/dni",
    "months": "miesiac/e",
    "daysOfWeek": "dzien/dni",
    "sun": "Nd",
    "mon": "Pn",
    "tue": "Wt",
    "wed": "Sr",
    "thu": "Cz",
    "fri": "Pt",
    "sat": "Sb",
    "jan": "Sty",
    "feb": "Lut",
    "mar": "Mar",
    "apr": "Kwi",
    "may": "Maj",
    "jun": "Cze",
    "jul": "Lip",
    "aug": "Sie",
    "sep": "Wrz",
    "oct": "Paz",
    "nov": "Lis",
    "dec": "Gru"
  },
  "vi": {
    "minute": "Phut",
    "hour": "Gio",
    "dayOfMonth": "Ngay trong thang",
    "month": "Thang",
    "dayOfWeek": "Ngay trong tuan",
    "every": "Moi",
    "interval": "Khoang",
    "specific": "Cu the",
    "range": "Pham vi",
    "everyDescription": "Chay moi {field}",
    "from": "Tu",
    "to": "den",
    "minutes": "phut",
    "hours": "gio",
    "days": "ngay",
    "months": "thang",
    "daysOfWeek": "ngay",
    "sun": "CN",
    "mon": "T2",
    "tue": "T3",
    "wed": "T4",
    "thu": "T5",
    "fri": "T6",
    "sat": "T7",
    "jan": "Th1",
    "feb": "Th2",
    "mar": "Th3",
    "apr": "Th4",
    "may": "Th5",
    "jun": "Th6",
    "jul": "Th7",
    "aug": "Th8",
    "sep": "Th9",
    "oct": "Th10",
    "nov": "Th11",
    "dec": "Th12"
  },
  "th": {
    "minute": "นาที",
    "hour": "ชั่วโมง",
    "dayOfMonth": "วันของเดือน",
    "month": "เดือน",
    "dayOfWeek": "วันในสัปดาห์",
    "every": "ทุก",
    "interval": "ช่วง",
    "specific": "เฉพาะ",
    "range": "ช่วง",
    "everyDescription": "ทำงานทุก {field}",
    "from": "จาก",
    "to": "ถึง",
    "minutes": "นาที",
    "hours": "ชั่วโมง",
    "days": "วัน",
    "months": "เดือน",
    "daysOfWeek": "วัน",
    "sun": "อา",
    "mon": "จ",
    "tue": "อ",
    "wed": "พ",
    "thu": "พฤ",
    "fri": "ศ",
    "sat": "ส",
    "jan": "ม.ค.",
    "feb": "ก.พ.",
    "mar": "มี.ค.",
    "apr": "เม.ย.",
    "may": "พ.ค.",
    "jun": "มิ.ย.",
    "jul": "ก.ค.",
    "aug": "ส.ค.",
    "sep": "ก.ย.",
    "oct": "ต.ค.",
    "nov": "พ.ย.",
    "dec": "ธ.ค."
  },
  "id": {
    "minute": "Menit",
    "hour": "Jam",
    "dayOfMonth": "Hari dalam bulan",
    "month": "Bulan",
    "dayOfWeek": "Hari dalam minggu",
    "every": "Setiap",
    "interval": "Interval",
    "specific": "Spesifik",
    "range": "Rentang",
    "everyDescription": "Berjalan setiap {field}",
    "from": "Dari",
    "to": "sampai",
    "minutes": "menit",
    "hours": "jam",
    "days": "hari",
    "months": "bulan",
    "daysOfWeek": "hari",
    "sun": "Min",
    "mon": "Sen",
    "tue": "Sel",
    "wed": "Rab",
    "thu": "Kam",
    "fri": "Jum",
    "sat": "Sab",
    "jan": "Jan",
    "feb": "Feb",
    "mar": "Mar",
    "apr": "Apr",
    "may": "Mei",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Agu",
    "sep": "Sep",
    "oct": "Okt",
    "nov": "Nov",
    "dec": "Des"
  },
  "he": {
    "minute": "דקה",
    "hour": "שעה",
    "dayOfMonth": "יום בחודש",
    "month": "חודש",
    "dayOfWeek": "יום בשבוע",
    "every": "כל",
    "interval": "מרווח",
    "specific": "ספציפי",
    "range": "טווח",
    "everyDescription": "רץ כל {field}",
    "from": "מ",
    "to": "עד",
    "minutes": "דקות",
    "hours": "שעות",
    "days": "ימים",
    "months": "חודשים",
    "daysOfWeek": "ימים",
    "sun": "א",
    "mon": "ב",
    "tue": "ג",
    "wed": "ד",
    "thu": "ה",
    "fri": "ו",
    "sat": "ש",
    "jan": "ינו",
    "feb": "פבר",
    "mar": "מרץ",
    "apr": "אפר",
    "may": "מאי",
    "jun": "יונ",
    "jul": "יול",
    "aug": "אוג",
    "sep": "ספט",
    "oct": "אוק",
    "nov": "נוב",
    "dec": "דצמ"
  },
  "ms": {
    "minute": "Minit",
    "hour": "Jam",
    "dayOfMonth": "Hari dalam bulan",
    "month": "Bulan",
    "dayOfWeek": "Hari dalam minggu",
    "every": "Setiap",
    "interval": "Selang",
    "specific": "Khusus",
    "range": "Julat",
    "everyDescription": "Berjalan setiap {field}",
    "from": "Dari",
    "to": "hingga",
    "minutes": "minit",
    "hours": "jam",
    "days": "hari",
    "months": "bulan",
    "daysOfWeek": "hari",
    "sun": "Ahd",
    "mon": "Isn",
    "tue": "Sel",
    "wed": "Rab",
    "thu": "Kha",
    "fri": "Jum",
    "sat": "Sab",
    "jan": "Jan",
    "feb": "Feb",
    "mar": "Mac",
    "apr": "Apr",
    "may": "Mei",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Ogo",
    "sep": "Sep",
    "oct": "Okt",
    "nov": "Nov",
    "dec": "Dis"
  },
  "no": {
    "minute": "Minutt",
    "hour": "Time",
    "dayOfMonth": "Dag i maneden",
    "month": "Maned",
    "dayOfWeek": "Ukedag",
    "every": "Hver",
    "interval": "Intervall",
    "specific": "Spesifikk",
    "range": "Omrade",
    "everyDescription": "Kjorer hver {field}",
    "from": "Fra",
    "to": "til",
    "minutes": "minutt(er)",
    "hours": "time(r)",
    "days": "dag(er)",
    "months": "maned(er)",
    "daysOfWeek": "dag(er)",
    "sun": "Son",
    "mon": "Man",
    "tue": "Tir",
    "wed": "Ons",
    "thu": "Tor",
    "fri": "Fre",
    "sat": "Lor",
    "jan": "Jan",
    "feb": "Feb",
    "mar": "Mar",
    "apr": "Apr",
    "may": "Mai",
    "jun": "Jun",
    "jul": "Jul",
    "aug": "Aug",
    "sep": "Sep",
    "oct": "Okt",
    "nov": "Nov",
    "dec": "Des"
  }
}
</i18n>
