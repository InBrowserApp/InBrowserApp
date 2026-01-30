<template>
  <n-flex vertical :size="12">
    <n-text strong>{{ t('selection-mode') }}</n-text>
    <n-radio-group v-model:value="weekdayMode">
      <n-flex :size="16">
        <n-radio value="weekend">{{ t('weekend-days') }}</n-radio>
        <n-radio value="working">{{ t('working-days') }}</n-radio>
      </n-flex>
    </n-radio-group>

    <n-text depth="3">{{ selectionHint }}</n-text>
    <n-checkbox-group v-model:value="weekdaySelection">
      <n-flex :size="12" wrap>
        <n-checkbox v-for="option in weekdayOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </n-checkbox>
      </n-flex>
    </n-checkbox-group>

    <n-text v-if="!hasWorkingDays" type="error">{{ t('no-working-days') }}</n-text>
  </n-flex>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCheckbox, NCheckboxGroup, NFlex, NRadio, NRadioGroup, NText } from 'naive-ui'

const weekdayMode = defineModel<'weekend' | 'working'>('weekdayMode', { required: true })
const weekdaySelection = defineModel<number[]>('weekdaySelection', { required: true })

defineProps<{
  hasWorkingDays: boolean
}>()

const { t } = useI18n()

const weekdayOptions = computed(() => [
  { label: t('weekday-sun'), value: 0 },
  { label: t('weekday-mon'), value: 1 },
  { label: t('weekday-tue'), value: 2 },
  { label: t('weekday-wed'), value: 3 },
  { label: t('weekday-thu'), value: 4 },
  { label: t('weekday-fri'), value: 5 },
  { label: t('weekday-sat'), value: 6 },
])

const selectionHint = computed(() =>
  weekdayMode.value === 'weekend' ? t('weekend-hint') : t('working-hint'),
)
</script>

<i18n lang="json">
{
  "en": {
    "selection-mode": "Select by",
    "weekend-days": "Weekend days",
    "working-days": "Working days",
    "weekend-hint": "Select which days are weekends.",
    "working-hint": "Select which days are working days.",
    "no-working-days": "No working days selected.",
    "weekday-sun": "Sun",
    "weekday-mon": "Mon",
    "weekday-tue": "Tue",
    "weekday-wed": "Wed",
    "weekday-thu": "Thu",
    "weekday-fri": "Fri",
    "weekday-sat": "Sat"
  },
  "zh": {
    "selection-mode": "选择方式",
    "weekend-days": "周末",
    "working-days": "工作日",
    "weekend-hint": "选择哪些日子是周末。",
    "working-hint": "选择哪些日子是工作日。",
    "no-working-days": "未选择任何工作日。",
    "weekday-sun": "周日",
    "weekday-mon": "周一",
    "weekday-tue": "周二",
    "weekday-wed": "周三",
    "weekday-thu": "周四",
    "weekday-fri": "周五",
    "weekday-sat": "周六"
  },
  "zh-CN": {
    "selection-mode": "选择方式",
    "weekend-days": "周末",
    "working-days": "工作日",
    "weekend-hint": "选择哪些日子是周末。",
    "working-hint": "选择哪些日子是工作日。",
    "no-working-days": "未选择任何工作日。",
    "weekday-sun": "周日",
    "weekday-mon": "周一",
    "weekday-tue": "周二",
    "weekday-wed": "周三",
    "weekday-thu": "周四",
    "weekday-fri": "周五",
    "weekday-sat": "周六"
  },
  "zh-TW": {
    "selection-mode": "選擇方式",
    "weekend-days": "週末",
    "working-days": "工作日",
    "weekend-hint": "選擇哪些日子是週末。",
    "working-hint": "選擇哪些日子是工作日。",
    "no-working-days": "未選擇任何工作日。",
    "weekday-sun": "週日",
    "weekday-mon": "週一",
    "weekday-tue": "週二",
    "weekday-wed": "週三",
    "weekday-thu": "週四",
    "weekday-fri": "週五",
    "weekday-sat": "週六"
  },
  "zh-HK": {
    "selection-mode": "選擇方式",
    "weekend-days": "週末",
    "working-days": "工作日",
    "weekend-hint": "選擇哪些日子是週末。",
    "working-hint": "選擇哪些日子是工作日。",
    "no-working-days": "未選擇任何工作日。",
    "weekday-sun": "週日",
    "weekday-mon": "週一",
    "weekday-tue": "週二",
    "weekday-wed": "週三",
    "weekday-thu": "週四",
    "weekday-fri": "週五",
    "weekday-sat": "週六"
  },
  "es": {
    "selection-mode": "Seleccionar por",
    "weekend-days": "Fines de semana",
    "working-days": "Días laborables",
    "weekend-hint": "Selecciona qué días son fin de semana.",
    "working-hint": "Selecciona qué días son laborables.",
    "no-working-days": "No se seleccionaron días laborables.",
    "weekday-sun": "Dom",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mié",
    "weekday-thu": "Jue",
    "weekday-fri": "Vie",
    "weekday-sat": "Sáb"
  },
  "fr": {
    "selection-mode": "Sélectionner par",
    "weekend-days": "Week-ends",
    "working-days": "Jours ouvrés",
    "weekend-hint": "Sélectionnez les jours qui sont des week-ends.",
    "working-hint": "Sélectionnez les jours ouvrés.",
    "no-working-days": "Aucun jour ouvré sélectionné.",
    "weekday-sun": "Dim",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mer",
    "weekday-thu": "Jeu",
    "weekday-fri": "Ven",
    "weekday-sat": "Sam"
  },
  "de": {
    "selection-mode": "Auswahl nach",
    "weekend-days": "Wochenenden",
    "working-days": "Arbeitstage",
    "weekend-hint": "Wähle aus, welche Tage Wochenenden sind.",
    "working-hint": "Wähle aus, welche Tage Arbeitstage sind.",
    "no-working-days": "Keine Arbeitstage ausgewählt.",
    "weekday-sun": "So",
    "weekday-mon": "Mo",
    "weekday-tue": "Di",
    "weekday-wed": "Mi",
    "weekday-thu": "Do",
    "weekday-fri": "Fr",
    "weekday-sat": "Sa"
  },
  "it": {
    "selection-mode": "Seleziona per",
    "weekend-days": "Weekend",
    "working-days": "Giorni lavorativi",
    "weekend-hint": "Seleziona quali giorni sono weekend.",
    "working-hint": "Seleziona quali giorni sono lavorativi.",
    "no-working-days": "Nessun giorno lavorativo selezionato.",
    "weekday-sun": "Dom",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mer",
    "weekday-thu": "Gio",
    "weekday-fri": "Ven",
    "weekday-sat": "Sab"
  },
  "ja": {
    "selection-mode": "選択基準",
    "weekend-days": "週末",
    "working-days": "営業日",
    "weekend-hint": "週末にする曜日を選択します。",
    "working-hint": "営業日にする曜日を選択します。",
    "no-working-days": "営業日が選択されていません。",
    "weekday-sun": "日",
    "weekday-mon": "月",
    "weekday-tue": "火",
    "weekday-wed": "水",
    "weekday-thu": "木",
    "weekday-fri": "金",
    "weekday-sat": "土"
  },
  "ko": {
    "selection-mode": "선택 기준",
    "weekend-days": "주말",
    "working-days": "근무일",
    "weekend-hint": "주말로 지정할 요일을 선택하세요.",
    "working-hint": "근무일로 지정할 요일을 선택하세요.",
    "no-working-days": "근무일이 선택되지 않았습니다.",
    "weekday-sun": "일",
    "weekday-mon": "월",
    "weekday-tue": "화",
    "weekday-wed": "수",
    "weekday-thu": "목",
    "weekday-fri": "금",
    "weekday-sat": "토"
  },
  "ru": {
    "selection-mode": "Выбор по",
    "weekend-days": "Выходные",
    "working-days": "Рабочие дни",
    "weekend-hint": "Выберите дни, которые считаются выходными.",
    "working-hint": "Выберите дни, которые считаются рабочими.",
    "no-working-days": "Рабочие дни не выбраны.",
    "weekday-sun": "Вс",
    "weekday-mon": "Пн",
    "weekday-tue": "Вт",
    "weekday-wed": "Ср",
    "weekday-thu": "Чт",
    "weekday-fri": "Пт",
    "weekday-sat": "Сб"
  },
  "pt": {
    "selection-mode": "Selecionar por",
    "weekend-days": "Fins de semana",
    "working-days": "Dias úteis",
    "weekend-hint": "Selecione quais dias são fins de semana.",
    "working-hint": "Selecione quais dias são dias úteis.",
    "no-working-days": "Nenhum dia útil selecionado.",
    "weekday-sun": "Dom",
    "weekday-mon": "Seg",
    "weekday-tue": "Ter",
    "weekday-wed": "Qua",
    "weekday-thu": "Qui",
    "weekday-fri": "Sex",
    "weekday-sat": "Sáb"
  },
  "ar": {
    "selection-mode": "اختيار حسب",
    "weekend-days": "عطلة نهاية الأسبوع",
    "working-days": "أيام العمل",
    "weekend-hint": "اختر الأيام التي تعتبر عطلة نهاية الأسبوع.",
    "working-hint": "اختر الأيام التي تعتبر أيام عمل.",
    "no-working-days": "لم يتم اختيار أي أيام عمل.",
    "weekday-sun": "الأحد",
    "weekday-mon": "الاثنين",
    "weekday-tue": "الثلاثاء",
    "weekday-wed": "الأربعاء",
    "weekday-thu": "الخميس",
    "weekday-fri": "الجمعة",
    "weekday-sat": "السبت"
  },
  "hi": {
    "selection-mode": "चयन विधि",
    "weekend-days": "सप्ताहांत",
    "working-days": "कार्यदिवस",
    "weekend-hint": "चुनें कि कौन से दिन सप्ताहांत हैं।",
    "working-hint": "चुनें कि कौन से दिन कार्यदिवस हैं।",
    "no-working-days": "कोई कार्यदिवस चयनित नहीं है।",
    "weekday-sun": "रवि",
    "weekday-mon": "सोम",
    "weekday-tue": "मंगल",
    "weekday-wed": "बुध",
    "weekday-thu": "गुरु",
    "weekday-fri": "शुक्र",
    "weekday-sat": "शनि"
  },
  "tr": {
    "selection-mode": "Seçim ölçütü",
    "weekend-days": "Hafta sonları",
    "working-days": "İş günleri",
    "weekend-hint": "Hangi günlerin hafta sonu olduğunu seçin.",
    "working-hint": "Hangi günlerin iş günü olduğunu seçin.",
    "no-working-days": "Hiç iş günü seçilmedi.",
    "weekday-sun": "Paz",
    "weekday-mon": "Pzt",
    "weekday-tue": "Sal",
    "weekday-wed": "Çar",
    "weekday-thu": "Per",
    "weekday-fri": "Cum",
    "weekday-sat": "Cmt"
  },
  "nl": {
    "selection-mode": "Selecteer op",
    "weekend-days": "Weekenden",
    "working-days": "Werkdagen",
    "weekend-hint": "Selecteer welke dagen weekend zijn.",
    "working-hint": "Selecteer welke dagen werkdagen zijn.",
    "no-working-days": "Geen werkdagen geselecteerd.",
    "weekday-sun": "Zo",
    "weekday-mon": "Ma",
    "weekday-tue": "Di",
    "weekday-wed": "Wo",
    "weekday-thu": "Do",
    "weekday-fri": "Vr",
    "weekday-sat": "Za"
  },
  "sv": {
    "selection-mode": "Välj efter",
    "weekend-days": "Helger",
    "working-days": "Arbetsdagar",
    "weekend-hint": "Välj vilka dagar som är helg.",
    "working-hint": "Välj vilka dagar som är arbetsdagar.",
    "no-working-days": "Inga arbetsdagar valda.",
    "weekday-sun": "Sön",
    "weekday-mon": "Mån",
    "weekday-tue": "Tis",
    "weekday-wed": "Ons",
    "weekday-thu": "Tor",
    "weekday-fri": "Fre",
    "weekday-sat": "Lör"
  },
  "pl": {
    "selection-mode": "Wybierz według",
    "weekend-days": "Weekend",
    "working-days": "Dni robocze",
    "weekend-hint": "Wybierz, które dni są weekendem.",
    "working-hint": "Wybierz, które dni są robocze.",
    "no-working-days": "Nie wybrano dni roboczych.",
    "weekday-sun": "Nd",
    "weekday-mon": "Pn",
    "weekday-tue": "Wt",
    "weekday-wed": "Śr",
    "weekday-thu": "Cz",
    "weekday-fri": "Pt",
    "weekday-sat": "Sb"
  },
  "vi": {
    "selection-mode": "Chọn theo",
    "weekend-days": "Cuối tuần",
    "working-days": "Ngày làm việc",
    "weekend-hint": "Chọn những ngày là cuối tuần.",
    "working-hint": "Chọn những ngày là ngày làm việc.",
    "no-working-days": "Chưa chọn ngày làm việc.",
    "weekday-sun": "CN",
    "weekday-mon": "T2",
    "weekday-tue": "T3",
    "weekday-wed": "T4",
    "weekday-thu": "T5",
    "weekday-fri": "T6",
    "weekday-sat": "T7"
  },
  "th": {
    "selection-mode": "เลือกตาม",
    "weekend-days": "วันสุดสัปดาห์",
    "working-days": "วันทำงาน",
    "weekend-hint": "เลือกว่าวันใดเป็นวันสุดสัปดาห์",
    "working-hint": "เลือกว่าวันใดเป็นวันทำงาน",
    "no-working-days": "ยังไม่ได้เลือกวันทำงาน",
    "weekday-sun": "อา",
    "weekday-mon": "จ",
    "weekday-tue": "อ",
    "weekday-wed": "พ",
    "weekday-thu": "พฤ",
    "weekday-fri": "ศ",
    "weekday-sat": "ส"
  },
  "id": {
    "selection-mode": "Pilih berdasarkan",
    "weekend-days": "Akhir pekan",
    "working-days": "Hari kerja",
    "weekend-hint": "Pilih hari yang termasuk akhir pekan.",
    "working-hint": "Pilih hari yang termasuk hari kerja.",
    "no-working-days": "Tidak ada hari kerja yang dipilih.",
    "weekday-sun": "Min",
    "weekday-mon": "Sen",
    "weekday-tue": "Sel",
    "weekday-wed": "Rab",
    "weekday-thu": "Kam",
    "weekday-fri": "Jum",
    "weekday-sat": "Sab"
  },
  "he": {
    "selection-mode": "בחירה לפי",
    "weekend-days": "סופי שבוע",
    "working-days": "ימי עבודה",
    "weekend-hint": "בחרו אילו ימים הם סוף שבוע.",
    "working-hint": "בחרו אילו ימים הם ימי עבודה.",
    "no-working-days": "לא נבחרו ימי עבודה.",
    "weekday-sun": "א׳",
    "weekday-mon": "ב׳",
    "weekday-tue": "ג׳",
    "weekday-wed": "ד׳",
    "weekday-thu": "ה׳",
    "weekday-fri": "ו׳",
    "weekday-sat": "ש׳"
  },
  "ms": {
    "selection-mode": "Pilih mengikut",
    "weekend-days": "Hujung minggu",
    "working-days": "Hari bekerja",
    "weekend-hint": "Pilih hari yang merupakan hujung minggu.",
    "working-hint": "Pilih hari yang merupakan hari bekerja.",
    "no-working-days": "Tiada hari bekerja dipilih.",
    "weekday-sun": "Ahd",
    "weekday-mon": "Isn",
    "weekday-tue": "Sel",
    "weekday-wed": "Rab",
    "weekday-thu": "Kha",
    "weekday-fri": "Jum",
    "weekday-sat": "Sab"
  },
  "no": {
    "selection-mode": "Velg etter",
    "weekend-days": "Helger",
    "working-days": "Arbeidsdager",
    "weekend-hint": "Velg hvilke dager som er helger.",
    "working-hint": "Velg hvilke dager som er arbeidsdager.",
    "no-working-days": "Ingen arbeidsdager valgt.",
    "weekday-sun": "Søn",
    "weekday-mon": "Man",
    "weekday-tue": "Tir",
    "weekday-wed": "Ons",
    "weekday-thu": "Tor",
    "weekday-fri": "Fre",
    "weekday-sat": "Lør"
  }
}
</i18n>
