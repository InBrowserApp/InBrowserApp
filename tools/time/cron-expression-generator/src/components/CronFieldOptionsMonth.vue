<template>
  <n-checkbox-group v-if="mode === 'specific'" v-model:value="specificValues">
    <n-grid :cols="fieldConfig.gridCols" :x-gap="4" :y-gap="4">
      <n-gi v-for="opt in options" :key="opt.value">
        <n-checkbox :value="opt.value" size="small">
          {{ opt.label }}
        </n-checkbox>
      </n-gi>
    </n-grid>
  </n-checkbox-group>
  <n-flex v-else align="center" :size="8">
    <n-text>{{ t('from') }}</n-text>
    <n-select v-model:value="rangeStart" :options="options" size="small" style="width: 100px" />
    <n-text>{{ t('to') }}</n-text>
    <n-select v-model:value="rangeEnd" :options="options" size="small" style="width: 100px" />
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCheckbox, NCheckboxGroup, NFlex, NGi, NGrid, NSelect, NText } from 'naive-ui'

type FieldConfig = {
  gridCols: number
}

type Mode = 'specific' | 'range'

defineProps<{
  fieldConfig: FieldConfig
  mode: Mode
}>()

const specificValues = defineModel<number[]>('specificValues', { required: true })
const rangeStart = defineModel<number>('rangeStart', { required: true })
const rangeEnd = defineModel<number>('rangeEnd', { required: true })

const { t } = useI18n()

const monthLabels = computed(() => [
  t('jan'),
  t('feb'),
  t('mar'),
  t('apr'),
  t('may'),
  t('jun'),
  t('jul'),
  t('aug'),
  t('sep'),
  t('oct'),
  t('nov'),
  t('dec'),
])

const options = computed(() =>
  monthLabels.value.map((label, index) => ({ value: index + 1, label })),
)
</script>

<i18n lang="json">
{
  "en": {
    "from": "From",
    "to": "to",
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
    "from": "从",
    "to": "到",
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
    "from": "从",
    "to": "到",
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
    "from": "從",
    "to": "到",
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
    "from": "從",
    "to": "到",
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
    "from": "Desde",
    "to": "hasta",
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
    "from": "De",
    "to": "a",
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
    "from": "Von",
    "to": "bis",
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
    "from": "Da",
    "to": "a",
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
    "from": "開始",
    "to": "終了",
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
    "from": "시작",
    "to": "끝",
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
    "from": "От",
    "to": "до",
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
    "from": "De",
    "to": "ate",
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
    "from": "من",
    "to": "الى",
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
    "from": "से",
    "to": "तक",
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
    "from": "Baslangic",
    "to": "bitis",
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
    "from": "Van",
    "to": "tot",
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
    "from": "Fran",
    "to": "till",
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
    "from": "Od",
    "to": "do",
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
    "from": "Tu",
    "to": "den",
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
    "from": "จาก",
    "to": "ถึง",
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
    "from": "Dari",
    "to": "sampai",
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
    "from": "מ",
    "to": "עד",
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
    "from": "Dari",
    "to": "hingga",
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
    "from": "Fra",
    "to": "til",
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
