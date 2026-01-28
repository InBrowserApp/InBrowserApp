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

const weekdayLabels = computed(() => [
  t('sun'),
  t('mon'),
  t('tue'),
  t('wed'),
  t('thu'),
  t('fri'),
  t('sat'),
])

const options = computed(() => weekdayLabels.value.map((label, index) => ({ value: index, label })))
</script>

<i18n lang="json">
{
  "en": {
    "from": "From",
    "to": "to",
    "sun": "Sun",
    "mon": "Mon",
    "tue": "Tue",
    "wed": "Wed",
    "thu": "Thu",
    "fri": "Fri",
    "sat": "Sat"
  },
  "zh": {
    "from": "从",
    "to": "到",
    "sun": "周日",
    "mon": "周一",
    "tue": "周二",
    "wed": "周三",
    "thu": "周四",
    "fri": "周五",
    "sat": "周六"
  },
  "zh-CN": {
    "from": "从",
    "to": "到",
    "sun": "周日",
    "mon": "周一",
    "tue": "周二",
    "wed": "周三",
    "thu": "周四",
    "fri": "周五",
    "sat": "周六"
  },
  "zh-TW": {
    "from": "從",
    "to": "到",
    "sun": "週日",
    "mon": "週一",
    "tue": "週二",
    "wed": "週三",
    "thu": "週四",
    "fri": "週五",
    "sat": "週六"
  },
  "zh-HK": {
    "from": "從",
    "to": "到",
    "sun": "週日",
    "mon": "週一",
    "tue": "週二",
    "wed": "週三",
    "thu": "週四",
    "fri": "週五",
    "sat": "週六"
  },
  "es": {
    "from": "Desde",
    "to": "hasta",
    "sun": "Dom",
    "mon": "Lun",
    "tue": "Mar",
    "wed": "Mie",
    "thu": "Jue",
    "fri": "Vie",
    "sat": "Sab"
  },
  "fr": {
    "from": "De",
    "to": "a",
    "sun": "Dim",
    "mon": "Lun",
    "tue": "Mar",
    "wed": "Mer",
    "thu": "Jeu",
    "fri": "Ven",
    "sat": "Sam"
  },
  "de": {
    "from": "Von",
    "to": "bis",
    "sun": "So",
    "mon": "Mo",
    "tue": "Di",
    "wed": "Mi",
    "thu": "Do",
    "fri": "Fr",
    "sat": "Sa"
  },
  "it": {
    "from": "Da",
    "to": "a",
    "sun": "Dom",
    "mon": "Lun",
    "tue": "Mar",
    "wed": "Mer",
    "thu": "Gio",
    "fri": "Ven",
    "sat": "Sab"
  },
  "ja": {
    "from": "開始",
    "to": "終了",
    "sun": "日",
    "mon": "月",
    "tue": "火",
    "wed": "水",
    "thu": "木",
    "fri": "金",
    "sat": "土"
  },
  "ko": {
    "from": "시작",
    "to": "끝",
    "sun": "일",
    "mon": "월",
    "tue": "화",
    "wed": "수",
    "thu": "목",
    "fri": "금",
    "sat": "토"
  },
  "ru": {
    "from": "От",
    "to": "до",
    "sun": "Вс",
    "mon": "Пн",
    "tue": "Вт",
    "wed": "Ср",
    "thu": "Чт",
    "fri": "Пт",
    "sat": "Сб"
  },
  "pt": {
    "from": "De",
    "to": "ate",
    "sun": "Dom",
    "mon": "Seg",
    "tue": "Ter",
    "wed": "Qua",
    "thu": "Qui",
    "fri": "Sex",
    "sat": "Sab"
  },
  "ar": {
    "from": "من",
    "to": "الى",
    "sun": "احد",
    "mon": "اثنين",
    "tue": "ثلاثاء",
    "wed": "اربعاء",
    "thu": "خميس",
    "fri": "جمعة",
    "sat": "سبت"
  },
  "hi": {
    "from": "से",
    "to": "तक",
    "sun": "रवि",
    "mon": "सोम",
    "tue": "मंगल",
    "wed": "बुध",
    "thu": "गुरु",
    "fri": "शुक्र",
    "sat": "शनि"
  },
  "tr": {
    "from": "Baslangic",
    "to": "bitis",
    "sun": "Paz",
    "mon": "Pzt",
    "tue": "Sal",
    "wed": "Car",
    "thu": "Per",
    "fri": "Cum",
    "sat": "Cmt"
  },
  "nl": {
    "from": "Van",
    "to": "tot",
    "sun": "Zo",
    "mon": "Ma",
    "tue": "Di",
    "wed": "Wo",
    "thu": "Do",
    "fri": "Vr",
    "sat": "Za"
  },
  "sv": {
    "from": "Fran",
    "to": "till",
    "sun": "Son",
    "mon": "Man",
    "tue": "Tis",
    "wed": "Ons",
    "thu": "Tor",
    "fri": "Fre",
    "sat": "Lor"
  },
  "pl": {
    "from": "Od",
    "to": "do",
    "sun": "Nd",
    "mon": "Pn",
    "tue": "Wt",
    "wed": "Sr",
    "thu": "Cz",
    "fri": "Pt",
    "sat": "Sb"
  },
  "vi": {
    "from": "Tu",
    "to": "den",
    "sun": "CN",
    "mon": "T2",
    "tue": "T3",
    "wed": "T4",
    "thu": "T5",
    "fri": "T6",
    "sat": "T7"
  },
  "th": {
    "from": "จาก",
    "to": "ถึง",
    "sun": "อา",
    "mon": "จ",
    "tue": "อ",
    "wed": "พ",
    "thu": "พฤ",
    "fri": "ศ",
    "sat": "ส"
  },
  "id": {
    "from": "Dari",
    "to": "sampai",
    "sun": "Min",
    "mon": "Sen",
    "tue": "Sel",
    "wed": "Rab",
    "thu": "Kam",
    "fri": "Jum",
    "sat": "Sab"
  },
  "he": {
    "from": "מ",
    "to": "עד",
    "sun": "א",
    "mon": "ב",
    "tue": "ג",
    "wed": "ד",
    "thu": "ה",
    "fri": "ו",
    "sat": "ש"
  },
  "ms": {
    "from": "Dari",
    "to": "hingga",
    "sun": "Ahd",
    "mon": "Isn",
    "tue": "Sel",
    "wed": "Rab",
    "thu": "Kha",
    "fri": "Jum",
    "sat": "Sab"
  },
  "no": {
    "from": "Fra",
    "to": "til",
    "sun": "Son",
    "mon": "Man",
    "tue": "Tir",
    "wed": "Ons",
    "thu": "Tor",
    "fri": "Fre",
    "sat": "Lor"
  }
}
</i18n>
