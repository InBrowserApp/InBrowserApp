<template>
  <ToolSectionHeader>{{ t('rules-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12" class="rule-card">
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

      <n-form-item :label="t('holidays')" :show-feedback="holidayInvalidCount > 0">
        <n-input
          v-model:value="holidayList"
          type="textarea"
          :placeholder="t('holiday-placeholder')"
          :autosize="{ minRows: 3, maxRows: 6 }"
          :status="holidayStatus"
        />
        <template v-if="holidayInvalidCount" #feedback>
          <n-text type="error">{{ t('invalid-holidays', { count: holidayInvalidCount }) }}</n-text>
        </template>
      </n-form-item>
      <n-text depth="3">{{ t('holiday-hint') }}</n-text>
      <n-text depth="3">{{ t('holiday-note') }}</n-text>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('count-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="range-card">
          <n-form-item :label="t('start-date')">
            <n-date-picker v-model:value="startDate" type="date" style="width: 100%" />
          </n-form-item>
          <n-form-item :label="t('end-date')">
            <n-date-picker v-model:value="endDate" type="date" style="width: 100%" />
          </n-form-item>
          <n-flex align="center" :size="12">
            <n-switch v-model:value="includeEndpoints" />
            <n-text>{{ t('include-endpoints') }}</n-text>
          </n-flex>
          <n-text v-if="rangeWarning" type="error">{{ rangeWarning }}</n-text>
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="12" class="range-card">
          <n-descriptions :column="1" label-placement="left" bordered>
            <n-descriptions-item :label="t('business-days')">
              <n-flex align="center" :size="8">
                <code>{{ businessDaysLabel || '-' }}</code>
                <CopyToClipboardButton
                  v-if="businessDaysLabel"
                  :content="businessDaysLabel"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('total-days')">
              <n-flex align="center" :size="8">
                <code>{{ totalDaysLabel || '-' }}</code>
                <CopyToClipboardButton
                  v-if="totalDaysLabel"
                  :content="totalDaysLabel"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('weekend-days-count')">
              <n-flex align="center" :size="8">
                <code>{{ weekendDaysLabel || '-' }}</code>
                <CopyToClipboardButton
                  v-if="weekendDaysLabel"
                  :content="weekendDaysLabel"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
            <n-descriptions-item :label="t('holiday-days-count')">
              <n-flex align="center" :size="8">
                <code>{{ holidayDaysLabel || '-' }}</code>
                <CopyToClipboardButton
                  v-if="holidayDaysLabel"
                  :content="holidayDaysLabel"
                  size="tiny"
                />
              </n-flex>
            </n-descriptions-item>
          </n-descriptions>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSectionHeader>{{ t('add-subtract-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid cols="1 900:2" x-gap="16" y-gap="16">
      <n-gi>
        <n-flex vertical :size="12" class="range-card">
          <n-form-item :label="t('base-date')">
            <n-date-picker v-model:value="baseDate" type="date" style="width: 100%" />
          </n-form-item>
          <n-form-item :label="t('business-days-offset')">
            <n-input-number v-model:value="dayOffset" :min="0" :precision="0" style="width: 100%" />
          </n-form-item>
          <n-flex align="center" :size="12">
            <n-switch v-model:value="includeStart" />
            <n-text>{{ t('include-start') }}</n-text>
          </n-flex>
          <n-text v-if="!hasWorkingDays" type="error">{{ t('no-working-days') }}</n-text>
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="12" class="result-column">
          <n-flex vertical :size="8" class="result-card">
            <n-text strong>{{ t('add') }}</n-text>
            <n-descriptions :column="1" label-placement="left" bordered>
              <n-descriptions-item :label="t('result-date')">
                <n-flex align="center" :size="8">
                  <code>{{ addDateLabel || '-' }}</code>
                  <CopyToClipboardButton v-if="addDateLabel" :content="addDateLabel" size="tiny" />
                </n-flex>
              </n-descriptions-item>
            </n-descriptions>
          </n-flex>
          <n-flex vertical :size="8" class="result-card">
            <n-text strong>{{ t('subtract') }}</n-text>
            <n-descriptions :column="1" label-placement="left" bordered>
              <n-descriptions-item :label="t('result-date')">
                <n-flex align="center" :size="8">
                  <code>{{ subtractDateLabel || '-' }}</code>
                  <CopyToClipboardButton
                    v-if="subtractDateLabel"
                    :content="subtractDateLabel"
                    size="tiny"
                  />
                </n-flex>
              </n-descriptions-item>
            </n-descriptions>
          </n-flex>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import {
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NDescriptions,
  NDescriptionsItem,
  NFlex,
  NFormItem,
  NGi,
  NGrid,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NSwitch,
  NText,
} from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { CopyToClipboardButton } from '@shared/ui/base'
import { useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
import {
  addBusinessDays,
  addDays,
  countBusinessDays,
  normalizeWeekdayList,
  parseHolidayList,
  startOfLocalDay,
  toISODate,
  weekdayOrder,
} from '../utils/businessDays'

const { t } = useI18n()

const today = startOfLocalDay(new Date())
const defaultStart = today.getTime()
const defaultEnd = addDays(today, 14).getTime()

const startDate = useStorage<number | null>(
  'tools:business-days-calculator:start-date',
  defaultStart,
)
const endDate = useStorage<number | null>('tools:business-days-calculator:end-date', defaultEnd)
const baseDate = useStorage<number | null>('tools:business-days-calculator:base-date', defaultStart)
const dayOffset = useStorage<number | null>('tools:business-days-calculator:day-offset', 5)
const includeEndpoints = useStorage<boolean>(
  'tools:business-days-calculator:include-endpoints',
  true,
)
const includeStart = useStorage<boolean>('tools:business-days-calculator:include-start-add', false)

const weekdayMode = useStorage<'weekend' | 'working'>(
  'tools:business-days-calculator:weekday-mode',
  'weekend',
)
const weekendDays = useStorage<number[]>('tools:business-days-calculator:weekend-days', [0, 6])
const holidayList = useStorage<string>('tools:business-days-calculator:holidays', '')

const normalizedWeekendDays = computed(() => normalizeWeekdayList(weekendDays.value))

watch(
  normalizedWeekendDays,
  (value) => {
    if (!isSameArray(value, weekendDays.value)) {
      weekendDays.value = value
    }
  },
  { immediate: true },
)

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

const weekdaySelection = computed({
  get() {
    if (weekdayMode.value === 'weekend') {
      return normalizedWeekendDays.value
    }
    return weekdayOrder.filter((day) => !normalizedWeekendDays.value.includes(day))
  },
  set(values: Array<number>) {
    const normalized = normalizeWeekdayList(values)
    if (weekdayMode.value === 'weekend') {
      weekendDays.value = normalized
    } else {
      weekendDays.value = weekdayOrder.filter((day) => !normalized.includes(day))
    }
  },
})

const weekendSet = computed(() => new Set(normalizedWeekendDays.value))
const hasWorkingDays = computed(() => weekendSet.value.size < 7)

const holidayParse = computed(() => parseHolidayList(holidayList.value))
const holidayInvalidCount = computed(() => holidayParse.value.invalid.length)
const holidayStatus = computed(() => {
  if (!holidayList.value.trim()) return undefined
  return holidayInvalidCount.value ? 'error' : 'success'
})

const startDateValue = computed(() => (startDate.value === null ? null : new Date(startDate.value)))
const endDateValue = computed(() => (endDate.value === null ? null : new Date(endDate.value)))

const countResult = computed(() => {
  if (!startDateValue.value || !endDateValue.value) return null
  return countBusinessDays(startDateValue.value, endDateValue.value, {
    weekendDays: weekendSet.value,
    holidays: holidayParse.value.dates,
    includeEndpoints: includeEndpoints.value,
  })
})

const rangeWarning = computed(() => {
  if (!countResult.value) return ''
  return countResult.value.isReversed ? t('range-swapped') : ''
})

const businessDaysLabel = computed(() =>
  countResult.value ? String(countResult.value.businessDays) : '',
)
const totalDaysLabel = computed(() =>
  countResult.value ? String(countResult.value.totalDays) : '',
)
const weekendDaysLabel = computed(() =>
  countResult.value ? String(countResult.value.weekendDays) : '',
)
const holidayDaysLabel = computed(() =>
  countResult.value ? String(countResult.value.holidayDays) : '',
)

const offsetValue = computed(() => {
  if (typeof dayOffset.value !== 'number' || Number.isNaN(dayOffset.value)) return 0
  return Math.max(0, Math.floor(dayOffset.value))
})

const baseDateValue = computed(() => (baseDate.value === null ? null : new Date(baseDate.value)))

const addDate = computed(() => {
  if (!baseDateValue.value || !hasWorkingDays.value) return null
  return addBusinessDays(baseDateValue.value, offsetValue.value, {
    weekendDays: weekendSet.value,
    holidays: holidayParse.value.dates,
    includeStart: includeStart.value,
  })
})

const subtractDate = computed(() => {
  if (!baseDateValue.value || !hasWorkingDays.value) return null
  return addBusinessDays(baseDateValue.value, -offsetValue.value, {
    weekendDays: weekendSet.value,
    holidays: holidayParse.value.dates,
    includeStart: includeStart.value,
  })
})

const addDateLabel = computed(() => (addDate.value ? toISODate(addDate.value) : ''))
const subtractDateLabel = computed(() => (subtractDate.value ? toISODate(subtractDate.value) : ''))

function isSameArray(left: number[], right: number[]): boolean {
  if (left.length !== right.length) return false
  return left.every((value, index) => value === right[index])
}
</script>

<style scoped>
.rule-card,
.range-card,
.result-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}

.result-column {
  width: 100%;
}
</style>

<i18n lang="json">
{
  "en": {
    "rules-title": "Business Day Rules",
    "selection-mode": "Select by",
    "weekend-days": "Weekend days",
    "working-days": "Working days",
    "weekend-hint": "Select which days are weekends.",
    "working-hint": "Select which days are working days.",
    "no-working-days": "No working days selected.",
    "holidays": "Holidays",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), one per line",
    "holiday-hint": "Optional. Holidays on weekdays are excluded.",
    "holiday-note": "Weekend holidays are already excluded by weekend settings.",
    "invalid-holidays": "Invalid entries: {count}",
    "weekday-sun": "Sun",
    "weekday-mon": "Mon",
    "weekday-tue": "Tue",
    "weekday-wed": "Wed",
    "weekday-thu": "Thu",
    "weekday-fri": "Fri",
    "weekday-sat": "Sat",
    "count-title": "Count Business Days",
    "start-date": "Start date",
    "end-date": "End date",
    "include-endpoints": "Include start/end dates",
    "range-swapped": "End date is before start date; results use swapped dates.",
    "business-days": "Business days",
    "total-days": "Total days",
    "weekend-days-count": "Weekend days",
    "holiday-days-count": "Holidays (weekdays)",
    "add-subtract-title": "Add/Subtract Business Days",
    "base-date": "Base date",
    "business-days-offset": "Business days",
    "include-start": "Count start date as day 1",
    "add": "Add",
    "subtract": "Subtract",
    "result-date": "Date"
  },
  "zh": {
    "rules-title": "工作日规则",
    "selection-mode": "选择方式",
    "weekend-days": "周末",
    "working-days": "工作日",
    "weekend-hint": "选择哪些日子是周末。",
    "working-hint": "选择哪些日子是工作日。",
    "no-working-days": "未选择任何工作日。",
    "holidays": "节假日",
    "holiday-placeholder": "例如：2026-01-15（YYYY-MM-DD），每行一个",
    "holiday-hint": "可选。工作日中的节假日将被排除。",
    "holiday-note": "周末节假日已由周末设置排除。",
    "invalid-holidays": "无效条目：{count}",
    "weekday-sun": "周日",
    "weekday-mon": "周一",
    "weekday-tue": "周二",
    "weekday-wed": "周三",
    "weekday-thu": "周四",
    "weekday-fri": "周五",
    "weekday-sat": "周六",
    "count-title": "工作日统计",
    "start-date": "开始日期",
    "end-date": "结束日期",
    "include-endpoints": "包含开始/结束日期",
    "range-swapped": "结束日期早于开始日期；结果已使用交换后的日期。",
    "business-days": "工作日",
    "total-days": "总天数",
    "weekend-days-count": "周末天数",
    "holiday-days-count": "节假日（工作日）",
    "add-subtract-title": "工作日加减",
    "base-date": "基准日期",
    "business-days-offset": "工作日数",
    "include-start": "将开始日期计为第 1 天",
    "add": "加",
    "subtract": "减",
    "result-date": "日期"
  },
  "zh-CN": {
    "rules-title": "工作日规则",
    "selection-mode": "选择方式",
    "weekend-days": "周末",
    "working-days": "工作日",
    "weekend-hint": "选择哪些日子是周末。",
    "working-hint": "选择哪些日子是工作日。",
    "no-working-days": "未选择任何工作日。",
    "holidays": "节假日",
    "holiday-placeholder": "例如：2026-01-15（YYYY-MM-DD），每行一个",
    "holiday-hint": "可选。工作日中的节假日将被排除。",
    "holiday-note": "周末节假日已由周末设置排除。",
    "invalid-holidays": "无效条目：{count}",
    "weekday-sun": "周日",
    "weekday-mon": "周一",
    "weekday-tue": "周二",
    "weekday-wed": "周三",
    "weekday-thu": "周四",
    "weekday-fri": "周五",
    "weekday-sat": "周六",
    "count-title": "工作日统计",
    "start-date": "开始日期",
    "end-date": "结束日期",
    "include-endpoints": "包含开始/结束日期",
    "range-swapped": "结束日期早于开始日期；结果已使用交换后的日期。",
    "business-days": "工作日",
    "total-days": "总天数",
    "weekend-days-count": "周末天数",
    "holiday-days-count": "节假日（工作日）",
    "add-subtract-title": "工作日加减",
    "base-date": "基准日期",
    "business-days-offset": "工作日数",
    "include-start": "将开始日期计为第 1 天",
    "add": "加",
    "subtract": "减",
    "result-date": "日期"
  },
  "zh-TW": {
    "rules-title": "工作日規則",
    "selection-mode": "選擇方式",
    "weekend-days": "週末",
    "working-days": "工作日",
    "weekend-hint": "選擇哪些日子是週末。",
    "working-hint": "選擇哪些日子是工作日。",
    "no-working-days": "未選擇任何工作日。",
    "holidays": "節假日",
    "holiday-placeholder": "例如：2026-01-15（YYYY-MM-DD），每行一個",
    "holiday-hint": "可選。工作日中的節假日將被排除。",
    "holiday-note": "週末節假日已由週末設定排除。",
    "invalid-holidays": "無效項目：{count}",
    "weekday-sun": "週日",
    "weekday-mon": "週一",
    "weekday-tue": "週二",
    "weekday-wed": "週三",
    "weekday-thu": "週四",
    "weekday-fri": "週五",
    "weekday-sat": "週六",
    "count-title": "工作日統計",
    "start-date": "開始日期",
    "end-date": "結束日期",
    "include-endpoints": "包含開始/結束日期",
    "range-swapped": "結束日期早於開始日期；結果已使用交換後的日期。",
    "business-days": "工作日",
    "total-days": "總天數",
    "weekend-days-count": "週末天數",
    "holiday-days-count": "節假日（工作日）",
    "add-subtract-title": "工作日加減",
    "base-date": "基準日期",
    "business-days-offset": "工作日數",
    "include-start": "將開始日期計為第 1 天",
    "add": "加",
    "subtract": "減",
    "result-date": "日期"
  },
  "zh-HK": {
    "rules-title": "工作日規則",
    "selection-mode": "選擇方式",
    "weekend-days": "週末",
    "working-days": "工作日",
    "weekend-hint": "選擇哪些日子是週末。",
    "working-hint": "選擇哪些日子是工作日。",
    "no-working-days": "未選擇任何工作日。",
    "holidays": "節假日",
    "holiday-placeholder": "例如：2026-01-15（YYYY-MM-DD），每行一個",
    "holiday-hint": "可選。工作日中的節假日將被排除。",
    "holiday-note": "週末節假日已由週末設定排除。",
    "invalid-holidays": "無效項目：{count}",
    "weekday-sun": "週日",
    "weekday-mon": "週一",
    "weekday-tue": "週二",
    "weekday-wed": "週三",
    "weekday-thu": "週四",
    "weekday-fri": "週五",
    "weekday-sat": "週六",
    "count-title": "工作日統計",
    "start-date": "開始日期",
    "end-date": "結束日期",
    "include-endpoints": "包含開始/結束日期",
    "range-swapped": "結束日期早於開始日期；結果已使用交換後的日期。",
    "business-days": "工作日",
    "total-days": "總天數",
    "weekend-days-count": "週末天數",
    "holiday-days-count": "節假日（工作日）",
    "add-subtract-title": "工作日加減",
    "base-date": "基準日期",
    "business-days-offset": "工作日數",
    "include-start": "將開始日期計為第 1 天",
    "add": "加",
    "subtract": "減",
    "result-date": "日期"
  },
  "es": {
    "rules-title": "Reglas de días hábiles",
    "selection-mode": "Seleccionar por",
    "weekend-days": "Fines de semana",
    "working-days": "Días laborables",
    "weekend-hint": "Selecciona qué días son fin de semana.",
    "working-hint": "Selecciona qué días son laborables.",
    "no-working-days": "No se seleccionaron días laborables.",
    "holidays": "Festivos",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), uno por línea",
    "holiday-hint": "Opcional. Los festivos en días laborables se excluyen.",
    "holiday-note": "Los festivos en fin de semana ya se excluyen por la configuración de fines de semana.",
    "invalid-holidays": "Entradas inválidas: {count}",
    "weekday-sun": "Dom",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mié",
    "weekday-thu": "Jue",
    "weekday-fri": "Vie",
    "weekday-sat": "Sáb",
    "count-title": "Contar días hábiles",
    "start-date": "Fecha de inicio",
    "end-date": "Fecha de fin",
    "include-endpoints": "Incluir fechas de inicio/fin",
    "range-swapped": "La fecha de fin es anterior a la de inicio; los resultados usan las fechas intercambiadas.",
    "business-days": "Días hábiles",
    "total-days": "Días totales",
    "weekend-days-count": "Fines de semana",
    "holiday-days-count": "Festivos (días laborables)",
    "add-subtract-title": "Sumar/Restar días hábiles",
    "base-date": "Fecha base",
    "business-days-offset": "Días hábiles",
    "include-start": "Contar la fecha de inicio como día 1",
    "add": "Sumar",
    "subtract": "Restar",
    "result-date": "Fecha"
  },
  "fr": {
    "rules-title": "Règles des jours ouvrés",
    "selection-mode": "Sélectionner par",
    "weekend-days": "Week-ends",
    "working-days": "Jours ouvrés",
    "weekend-hint": "Sélectionnez les jours qui sont des week-ends.",
    "working-hint": "Sélectionnez les jours ouvrés.",
    "no-working-days": "Aucun jour ouvré sélectionné.",
    "holidays": "Jours fériés",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), un par ligne",
    "holiday-hint": "Optionnel. Les jours fériés en semaine sont exclus.",
    "holiday-note": "Les jours fériés le week-end sont déjà exclus par les réglages des week-ends.",
    "invalid-holidays": "Entrées invalides : {count}",
    "weekday-sun": "Dim",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mer",
    "weekday-thu": "Jeu",
    "weekday-fri": "Ven",
    "weekday-sat": "Sam",
    "count-title": "Compter les jours ouvrés",
    "start-date": "Date de début",
    "end-date": "Date de fin",
    "include-endpoints": "Inclure les dates de début/fin",
    "range-swapped": "La date de fin est antérieure à la date de début ; résultats calculés avec les dates inversées.",
    "business-days": "Jours ouvrés",
    "total-days": "Jours totaux",
    "weekend-days-count": "Week-ends",
    "holiday-days-count": "Jours fériés (en semaine)",
    "add-subtract-title": "Ajouter/Soustraire des jours ouvrés",
    "base-date": "Date de base",
    "business-days-offset": "Jours ouvrés",
    "include-start": "Compter la date de départ comme jour 1",
    "add": "Ajouter",
    "subtract": "Soustraire",
    "result-date": "Date"
  },
  "de": {
    "rules-title": "Regeln für Arbeitstage",
    "selection-mode": "Auswahl nach",
    "weekend-days": "Wochenenden",
    "working-days": "Arbeitstage",
    "weekend-hint": "Wähle aus, welche Tage Wochenenden sind.",
    "working-hint": "Wähle aus, welche Tage Arbeitstage sind.",
    "no-working-days": "Keine Arbeitstage ausgewählt.",
    "holidays": "Feiertage",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), eine pro Zeile",
    "holiday-hint": "Optional. Feiertage an Werktagen werden ausgeschlossen.",
    "holiday-note": "Feiertage am Wochenende sind durch die Wochenendeinstellungen bereits ausgeschlossen.",
    "invalid-holidays": "Ungültige Einträge: {count}",
    "weekday-sun": "So",
    "weekday-mon": "Mo",
    "weekday-tue": "Di",
    "weekday-wed": "Mi",
    "weekday-thu": "Do",
    "weekday-fri": "Fr",
    "weekday-sat": "Sa",
    "count-title": "Arbeitstage zählen",
    "start-date": "Startdatum",
    "end-date": "Enddatum",
    "include-endpoints": "Start-/Enddatum einschließen",
    "range-swapped": "Enddatum liegt vor dem Startdatum; Ergebnisse verwenden vertauschte Daten.",
    "business-days": "Arbeitstage",
    "total-days": "Gesamttage",
    "weekend-days-count": "Wochenenden",
    "holiday-days-count": "Feiertage (Werktage)",
    "add-subtract-title": "Arbeitstage hinzufügen/abziehen",
    "base-date": "Basisdatum",
    "business-days-offset": "Arbeitstage",
    "include-start": "Startdatum als Tag 1 zählen",
    "add": "Hinzufügen",
    "subtract": "Abziehen",
    "result-date": "Datum"
  },
  "it": {
    "rules-title": "Regole dei giorni lavorativi",
    "selection-mode": "Seleziona per",
    "weekend-days": "Weekend",
    "working-days": "Giorni lavorativi",
    "weekend-hint": "Seleziona quali giorni sono weekend.",
    "working-hint": "Seleziona quali giorni sono lavorativi.",
    "no-working-days": "Nessun giorno lavorativo selezionato.",
    "holidays": "Festività",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), uno per riga",
    "holiday-hint": "Opzionale. Le festività nei giorni lavorativi sono escluse.",
    "holiday-note": "Le festività nel weekend sono già escluse dalle impostazioni del weekend.",
    "invalid-holidays": "Voci non valide: {count}",
    "weekday-sun": "Dom",
    "weekday-mon": "Lun",
    "weekday-tue": "Mar",
    "weekday-wed": "Mer",
    "weekday-thu": "Gio",
    "weekday-fri": "Ven",
    "weekday-sat": "Sab",
    "count-title": "Conta giorni lavorativi",
    "start-date": "Data di inizio",
    "end-date": "Data di fine",
    "include-endpoints": "Includi date di inizio/fine",
    "range-swapped": "La data di fine è precedente alla data di inizio; risultati calcolati con date invertite.",
    "business-days": "Giorni lavorativi",
    "total-days": "Giorni totali",
    "weekend-days-count": "Weekend",
    "holiday-days-count": "Festività (giorni feriali)",
    "add-subtract-title": "Aggiungi/Sottrai giorni lavorativi",
    "base-date": "Data base",
    "business-days-offset": "Giorni lavorativi",
    "include-start": "Conta la data di inizio come giorno 1",
    "add": "Aggiungi",
    "subtract": "Sottrai",
    "result-date": "Data"
  },
  "ja": {
    "rules-title": "営業日ルール",
    "selection-mode": "選択基準",
    "weekend-days": "週末",
    "working-days": "営業日",
    "weekend-hint": "週末にする曜日を選択します。",
    "working-hint": "営業日にする曜日を選択します。",
    "no-working-days": "営業日が選択されていません。",
    "holidays": "祝日",
    "holiday-placeholder": "2026-01-15（YYYY-MM-DD）、1行に1件",
    "holiday-hint": "任意。平日の祝日は除外されます。",
    "holiday-note": "週末の祝日は週末設定で既に除外されます。",
    "invalid-holidays": "無効な項目: {count}",
    "weekday-sun": "日",
    "weekday-mon": "月",
    "weekday-tue": "火",
    "weekday-wed": "水",
    "weekday-thu": "木",
    "weekday-fri": "金",
    "weekday-sat": "土",
    "count-title": "営業日を数える",
    "start-date": "開始日",
    "end-date": "終了日",
    "include-endpoints": "開始日/終了日を含める",
    "range-swapped": "終了日が開始日より前のため、日付を入れ替えて計算しました。",
    "business-days": "営業日",
    "total-days": "合計日数",
    "weekend-days-count": "週末",
    "holiday-days-count": "祝日（平日）",
    "add-subtract-title": "営業日の加算/減算",
    "base-date": "基準日",
    "business-days-offset": "営業日数",
    "include-start": "開始日を1日目として数える",
    "add": "加算",
    "subtract": "減算",
    "result-date": "日付"
  },
  "ko": {
    "rules-title": "영업일 규칙",
    "selection-mode": "선택 기준",
    "weekend-days": "주말",
    "working-days": "근무일",
    "weekend-hint": "주말로 지정할 요일을 선택하세요.",
    "working-hint": "근무일로 지정할 요일을 선택하세요.",
    "no-working-days": "근무일이 선택되지 않았습니다.",
    "holidays": "공휴일",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), 한 줄에 하나",
    "holiday-hint": "선택 사항. 평일 공휴일은 제외됩니다.",
    "holiday-note": "주말 공휴일은 주말 설정으로 이미 제외됩니다.",
    "invalid-holidays": "잘못된 항목: {count}",
    "weekday-sun": "일",
    "weekday-mon": "월",
    "weekday-tue": "화",
    "weekday-wed": "수",
    "weekday-thu": "목",
    "weekday-fri": "금",
    "weekday-sat": "토",
    "count-title": "영업일 계산",
    "start-date": "시작일",
    "end-date": "종료일",
    "include-endpoints": "시작/종료일 포함",
    "range-swapped": "종료일이 시작일보다 이전입니다. 날짜를 바꿔 계산했습니다.",
    "business-days": "영업일",
    "total-days": "전체 일수",
    "weekend-days-count": "주말",
    "holiday-days-count": "공휴일(평일)",
    "add-subtract-title": "영업일 더하기/빼기",
    "base-date": "기준일",
    "business-days-offset": "영업일 수",
    "include-start": "시작일을 1일차로 계산",
    "add": "더하기",
    "subtract": "빼기",
    "result-date": "날짜"
  },
  "ru": {
    "rules-title": "Правила рабочих дней",
    "selection-mode": "Выбор по",
    "weekend-days": "Выходные",
    "working-days": "Рабочие дни",
    "weekend-hint": "Выберите дни, которые считаются выходными.",
    "working-hint": "Выберите дни, которые считаются рабочими.",
    "no-working-days": "Рабочие дни не выбраны.",
    "holidays": "Праздники",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), по одному в строке",
    "holiday-hint": "Необязательно. Праздники в будни исключаются.",
    "holiday-note": "Праздники в выходные уже исключены настройками выходных.",
    "invalid-holidays": "Недействительные записи: {count}",
    "weekday-sun": "Вс",
    "weekday-mon": "Пн",
    "weekday-tue": "Вт",
    "weekday-wed": "Ср",
    "weekday-thu": "Чт",
    "weekday-fri": "Пт",
    "weekday-sat": "Сб",
    "count-title": "Подсчет рабочих дней",
    "start-date": "Дата начала",
    "end-date": "Дата окончания",
    "include-endpoints": "Включать даты начала/окончания",
    "range-swapped": "Дата окончания раньше даты начала; результаты рассчитаны с перестановкой дат.",
    "business-days": "Рабочие дни",
    "total-days": "Всего дней",
    "weekend-days-count": "Выходные",
    "holiday-days-count": "Праздники (будни)",
    "add-subtract-title": "Добавить/вычесть рабочие дни",
    "base-date": "Базовая дата",
    "business-days-offset": "Рабочие дни",
    "include-start": "Считать дату начала как день 1",
    "add": "Добавить",
    "subtract": "Вычесть",
    "result-date": "Дата"
  },
  "pt": {
    "rules-title": "Regras de dias úteis",
    "selection-mode": "Selecionar por",
    "weekend-days": "Fins de semana",
    "working-days": "Dias úteis",
    "weekend-hint": "Selecione quais dias são fins de semana.",
    "working-hint": "Selecione quais dias são dias úteis.",
    "no-working-days": "Nenhum dia útil selecionado.",
    "holidays": "Feriados",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), um por linha",
    "holiday-hint": "Opcional. Feriados em dias úteis são excluídos.",
    "holiday-note": "Feriados no fim de semana já são excluídos pelas configurações de fim de semana.",
    "invalid-holidays": "Entradas inválidas: {count}",
    "weekday-sun": "Dom",
    "weekday-mon": "Seg",
    "weekday-tue": "Ter",
    "weekday-wed": "Qua",
    "weekday-thu": "Qui",
    "weekday-fri": "Sex",
    "weekday-sat": "Sáb",
    "count-title": "Contar dias úteis",
    "start-date": "Data de início",
    "end-date": "Data de término",
    "include-endpoints": "Incluir datas de início/fim",
    "range-swapped": "A data de término é anterior à data de início; resultados usam datas trocadas.",
    "business-days": "Dias úteis",
    "total-days": "Dias totais",
    "weekend-days-count": "Fins de semana",
    "holiday-days-count": "Feriados (dias úteis)",
    "add-subtract-title": "Adicionar/Subtrair dias úteis",
    "base-date": "Data base",
    "business-days-offset": "Dias úteis",
    "include-start": "Contar a data de início como dia 1",
    "add": "Adicionar",
    "subtract": "Subtrair",
    "result-date": "Data"
  },
  "ar": {
    "rules-title": "قواعد أيام العمل",
    "selection-mode": "اختيار حسب",
    "weekend-days": "عطلة نهاية الأسبوع",
    "working-days": "أيام العمل",
    "weekend-hint": "اختر الأيام التي تعتبر عطلة نهاية الأسبوع.",
    "working-hint": "اختر الأيام التي تعتبر أيام عمل.",
    "no-working-days": "لم يتم اختيار أي أيام عمل.",
    "holidays": "العطلات",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD)، واحد لكل سطر",
    "holiday-hint": "اختياري. يتم استبعاد العطلات في أيام العمل.",
    "holiday-note": "عطلات نهاية الأسبوع مستبعدة بالفعل عبر إعدادات نهاية الأسبوع.",
    "invalid-holidays": "إدخالات غير صالحة: {count}",
    "weekday-sun": "الأحد",
    "weekday-mon": "الاثنين",
    "weekday-tue": "الثلاثاء",
    "weekday-wed": "الأربعاء",
    "weekday-thu": "الخميس",
    "weekday-fri": "الجمعة",
    "weekday-sat": "السبت",
    "count-title": "حساب أيام العمل",
    "start-date": "تاريخ البدء",
    "end-date": "تاريخ الانتهاء",
    "include-endpoints": "تضمين تاريخي البدء/الانتهاء",
    "range-swapped": "تاريخ الانتهاء يسبق تاريخ البدء؛ تم الحساب بعد تبديل التواريخ.",
    "business-days": "أيام العمل",
    "total-days": "إجمالي الأيام",
    "weekend-days-count": "عطلة نهاية الأسبوع",
    "holiday-days-count": "العطلات (أيام عمل)",
    "add-subtract-title": "إضافة/طرح أيام العمل",
    "base-date": "التاريخ الأساسي",
    "business-days-offset": "أيام العمل",
    "include-start": "اعتبار تاريخ البدء اليوم الأول",
    "add": "إضافة",
    "subtract": "طرح",
    "result-date": "التاريخ"
  },
  "hi": {
    "rules-title": "कार्यदिवस नियम",
    "selection-mode": "चयन विधि",
    "weekend-days": "सप्ताहांत",
    "working-days": "कार्यदिवस",
    "weekend-hint": "चुनें कि कौन से दिन सप्ताहांत हैं।",
    "working-hint": "चुनें कि कौन से दिन कार्यदिवस हैं।",
    "no-working-days": "कोई कार्यदिवस चयनित नहीं है।",
    "holidays": "छुट्टियां",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), प्रति पंक्ति एक",
    "holiday-hint": "वैकल्पिक। कार्यदिवस की छुट्टियां शामिल नहीं होंगी।",
    "holiday-note": "सप्ताहांत की छुट्टियां पहले से ही सप्ताहांत सेटिंग से हटाई जाती हैं।",
    "invalid-holidays": "अमान्य प्रविष्टियां: {count}",
    "weekday-sun": "रवि",
    "weekday-mon": "सोम",
    "weekday-tue": "मंगल",
    "weekday-wed": "बुध",
    "weekday-thu": "गुरु",
    "weekday-fri": "शुक्र",
    "weekday-sat": "शनि",
    "count-title": "कार्यदिवस गिनें",
    "start-date": "आरंभ तिथि",
    "end-date": "समाप्ति तिथि",
    "include-endpoints": "आरंभ/समाप्ति तिथियां शामिल करें",
    "range-swapped": "समाप्ति तिथि आरंभ तिथि से पहले है; परिणामों में तिथियां बदलकर ली गई हैं।",
    "business-days": "कार्यदिवस",
    "total-days": "कुल दिन",
    "weekend-days-count": "सप्ताहांत",
    "holiday-days-count": "छुट्टियां (कार्यदिवस)",
    "add-subtract-title": "कार्यदिवस जोड़ें/घटाएं",
    "base-date": "आधार तिथि",
    "business-days-offset": "कार्यदिवस",
    "include-start": "आरंभ तिथि को दिन 1 मानें",
    "add": "जोड़ें",
    "subtract": "घटाएं",
    "result-date": "तिथि"
  },
  "tr": {
    "rules-title": "İş günü kuralları",
    "selection-mode": "Seçim ölçütü",
    "weekend-days": "Hafta sonları",
    "working-days": "İş günleri",
    "weekend-hint": "Hangi günlerin hafta sonu olduğunu seçin.",
    "working-hint": "Hangi günlerin iş günü olduğunu seçin.",
    "no-working-days": "Hiç iş günü seçilmedi.",
    "holidays": "Tatiller",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), satır başına bir",
    "holiday-hint": "İsteğe bağlı. Hafta içi tatiller hariç tutulur.",
    "holiday-note": "Hafta sonu tatilleri hafta sonu ayarlarıyla zaten hariç tutulur.",
    "invalid-holidays": "Geçersiz girdiler: {count}",
    "weekday-sun": "Paz",
    "weekday-mon": "Pzt",
    "weekday-tue": "Sal",
    "weekday-wed": "Çar",
    "weekday-thu": "Per",
    "weekday-fri": "Cum",
    "weekday-sat": "Cmt",
    "count-title": "İş günü say",
    "start-date": "Başlangıç tarihi",
    "end-date": "Bitiş tarihi",
    "include-endpoints": "Başlangıç/bitiş tarihlerini dahil et",
    "range-swapped": "Bitiş tarihi başlangıç tarihinden önce; sonuçlar tarihler değiştirilerek hesaplandı.",
    "business-days": "İş günleri",
    "total-days": "Toplam gün",
    "weekend-days-count": "Hafta sonları",
    "holiday-days-count": "Tatiller (hafta içi)",
    "add-subtract-title": "İş günü ekle/çıkar",
    "base-date": "Temel tarih",
    "business-days-offset": "İş günleri",
    "include-start": "Başlangıç tarihini 1. gün say",
    "add": "Ekle",
    "subtract": "Çıkar",
    "result-date": "Tarih"
  },
  "nl": {
    "rules-title": "Werkdagenregels",
    "selection-mode": "Selecteer op",
    "weekend-days": "Weekenden",
    "working-days": "Werkdagen",
    "weekend-hint": "Selecteer welke dagen weekend zijn.",
    "working-hint": "Selecteer welke dagen werkdagen zijn.",
    "no-working-days": "Geen werkdagen geselecteerd.",
    "holidays": "Feestdagen",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), één per regel",
    "holiday-hint": "Optioneel. Feestdagen op werkdagen worden uitgesloten.",
    "holiday-note": "Feestdagen in het weekend zijn al uitgesloten via de weekendinstellingen.",
    "invalid-holidays": "Ongeldige items: {count}",
    "weekday-sun": "Zo",
    "weekday-mon": "Ma",
    "weekday-tue": "Di",
    "weekday-wed": "Wo",
    "weekday-thu": "Do",
    "weekday-fri": "Vr",
    "weekday-sat": "Za",
    "count-title": "Werkdagen tellen",
    "start-date": "Startdatum",
    "end-date": "Einddatum",
    "include-endpoints": "Start-/einddatum opnemen",
    "range-swapped": "Einddatum ligt vóór startdatum; resultaten gebruiken omgewisselde datums.",
    "business-days": "Werkdagen",
    "total-days": "Totaal dagen",
    "weekend-days-count": "Weekenden",
    "holiday-days-count": "Feestdagen (werkdagen)",
    "add-subtract-title": "Werkdagen optellen/aftrekken",
    "base-date": "Basisdatum",
    "business-days-offset": "Werkdagen",
    "include-start": "Startdatum als dag 1 tellen",
    "add": "Optellen",
    "subtract": "Aftrekken",
    "result-date": "Datum"
  },
  "sv": {
    "rules-title": "Regler för arbetsdagar",
    "selection-mode": "Välj efter",
    "weekend-days": "Helger",
    "working-days": "Arbetsdagar",
    "weekend-hint": "Välj vilka dagar som är helg.",
    "working-hint": "Välj vilka dagar som är arbetsdagar.",
    "no-working-days": "Inga arbetsdagar valda.",
    "holidays": "Helgdagar",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), en per rad",
    "holiday-hint": "Valfritt. Helgdagar på vardagar utesluts.",
    "holiday-note": "Helgdagar på helger är redan uteslutna via helginställningar.",
    "invalid-holidays": "Ogiltiga poster: {count}",
    "weekday-sun": "Sön",
    "weekday-mon": "Mån",
    "weekday-tue": "Tis",
    "weekday-wed": "Ons",
    "weekday-thu": "Tor",
    "weekday-fri": "Fre",
    "weekday-sat": "Lör",
    "count-title": "Räkna arbetsdagar",
    "start-date": "Startdatum",
    "end-date": "Slutdatum",
    "include-endpoints": "Inkludera start-/slutdatum",
    "range-swapped": "Slutdatum är före startdatum; resultaten använder ombytta datum.",
    "business-days": "Arbetsdagar",
    "total-days": "Totalt antal dagar",
    "weekend-days-count": "Helger",
    "holiday-days-count": "Helgdagar (vardagar)",
    "add-subtract-title": "Lägg till/ta bort arbetsdagar",
    "base-date": "Basdatum",
    "business-days-offset": "Arbetsdagar",
    "include-start": "Räkna startdatum som dag 1",
    "add": "Lägg till",
    "subtract": "Ta bort",
    "result-date": "Datum"
  },
  "pl": {
    "rules-title": "Zasady dni roboczych",
    "selection-mode": "Wybierz według",
    "weekend-days": "Weekend",
    "working-days": "Dni robocze",
    "weekend-hint": "Wybierz, które dni są weekendem.",
    "working-hint": "Wybierz, które dni są robocze.",
    "no-working-days": "Nie wybrano dni roboczych.",
    "holidays": "Święta",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), po jednym na linię",
    "holiday-hint": "Opcjonalnie. Święta w dni robocze są wykluczane.",
    "holiday-note": "Święta w weekendy są już wykluczone przez ustawienia weekendu.",
    "invalid-holidays": "Nieprawidłowe wpisy: {count}",
    "weekday-sun": "Nd",
    "weekday-mon": "Pn",
    "weekday-tue": "Wt",
    "weekday-wed": "Śr",
    "weekday-thu": "Cz",
    "weekday-fri": "Pt",
    "weekday-sat": "Sb",
    "count-title": "Licz dni robocze",
    "start-date": "Data początkowa",
    "end-date": "Data końcowa",
    "include-endpoints": "Uwzględnij daty początku/końca",
    "range-swapped": "Data końcowa jest wcześniejsza od początkowej; wyniki używają zamienionych dat.",
    "business-days": "Dni robocze",
    "total-days": "Łącznie dni",
    "weekend-days-count": "Weekend",
    "holiday-days-count": "Święta (dni robocze)",
    "add-subtract-title": "Dodaj/odejmij dni robocze",
    "base-date": "Data bazowa",
    "business-days-offset": "Dni robocze",
    "include-start": "Licz datę początkową jako dzień 1",
    "add": "Dodaj",
    "subtract": "Odejmij",
    "result-date": "Data"
  },
  "vi": {
    "rules-title": "Quy tắc ngày làm việc",
    "selection-mode": "Chọn theo",
    "weekend-days": "Cuối tuần",
    "working-days": "Ngày làm việc",
    "weekend-hint": "Chọn những ngày là cuối tuần.",
    "working-hint": "Chọn những ngày là ngày làm việc.",
    "no-working-days": "Chưa chọn ngày làm việc.",
    "holidays": "Ngày lễ",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), mỗi dòng một ngày",
    "holiday-hint": "Tùy chọn. Ngày lễ rơi vào ngày làm việc sẽ bị loại trừ.",
    "holiday-note": "Ngày lễ vào cuối tuần đã được loại trừ bởi thiết lập cuối tuần.",
    "invalid-holidays": "Mục không hợp lệ: {count}",
    "weekday-sun": "CN",
    "weekday-mon": "T2",
    "weekday-tue": "T3",
    "weekday-wed": "T4",
    "weekday-thu": "T5",
    "weekday-fri": "T6",
    "weekday-sat": "T7",
    "count-title": "Đếm ngày làm việc",
    "start-date": "Ngày bắt đầu",
    "end-date": "Ngày kết thúc",
    "include-endpoints": "Bao gồm ngày bắt đầu/kết thúc",
    "range-swapped": "Ngày kết thúc trước ngày bắt đầu; kết quả dùng ngày đã hoán đổi.",
    "business-days": "Ngày làm việc",
    "total-days": "Tổng số ngày",
    "weekend-days-count": "Cuối tuần",
    "holiday-days-count": "Ngày lễ (ngày làm việc)",
    "add-subtract-title": "Cộng/Trừ ngày làm việc",
    "base-date": "Ngày cơ sở",
    "business-days-offset": "Ngày làm việc",
    "include-start": "Tính ngày bắt đầu là ngày 1",
    "add": "Cộng",
    "subtract": "Trừ",
    "result-date": "Ngày"
  },
  "th": {
    "rules-title": "กฎวันทำงาน",
    "selection-mode": "เลือกตาม",
    "weekend-days": "วันสุดสัปดาห์",
    "working-days": "วันทำงาน",
    "weekend-hint": "เลือกว่าวันใดเป็นวันสุดสัปดาห์",
    "working-hint": "เลือกว่าวันใดเป็นวันทำงาน",
    "no-working-days": "ยังไม่ได้เลือกวันทำงาน",
    "holidays": "วันหยุด",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), หนึ่งรายการต่อบรรทัด",
    "holiday-hint": "ไม่บังคับ วันหยุดที่ตรงกับวันทำงานจะถูกตัดออก",
    "holiday-note": "วันหยุดที่ตรงกับวันสุดสัปดาห์ถูกตัดออกแล้วตามการตั้งค่าวันสุดสัปดาห์",
    "invalid-holidays": "รายการไม่ถูกต้อง: {count}",
    "weekday-sun": "อา",
    "weekday-mon": "จ",
    "weekday-tue": "อ",
    "weekday-wed": "พ",
    "weekday-thu": "พฤ",
    "weekday-fri": "ศ",
    "weekday-sat": "ส",
    "count-title": "นับวันทำงาน",
    "start-date": "วันที่เริ่มต้น",
    "end-date": "วันที่สิ้นสุด",
    "include-endpoints": "รวมวันที่เริ่มต้น/สิ้นสุด",
    "range-swapped": "วันที่สิ้นสุดก่อนวันที่เริ่มต้น; ผลลัพธ์ใช้วันที่ที่สลับแล้ว",
    "business-days": "วันทำงาน",
    "total-days": "จำนวนวันทั้งหมด",
    "weekend-days-count": "วันสุดสัปดาห์",
    "holiday-days-count": "วันหยุด (วันทำงาน)",
    "add-subtract-title": "บวก/ลบวันทำงาน",
    "base-date": "วันที่อ้างอิง",
    "business-days-offset": "วันทำงาน",
    "include-start": "นับวันที่เริ่มต้นเป็นวันที่ 1",
    "add": "บวก",
    "subtract": "ลบ",
    "result-date": "วันที่"
  },
  "id": {
    "rules-title": "Aturan hari kerja",
    "selection-mode": "Pilih berdasarkan",
    "weekend-days": "Akhir pekan",
    "working-days": "Hari kerja",
    "weekend-hint": "Pilih hari yang termasuk akhir pekan.",
    "working-hint": "Pilih hari yang termasuk hari kerja.",
    "no-working-days": "Tidak ada hari kerja yang dipilih.",
    "holidays": "Hari libur",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), satu per baris",
    "holiday-hint": "Opsional. Hari libur pada hari kerja akan dikecualikan.",
    "holiday-note": "Hari libur di akhir pekan sudah dikecualikan oleh pengaturan akhir pekan.",
    "invalid-holidays": "Entri tidak valid: {count}",
    "weekday-sun": "Min",
    "weekday-mon": "Sen",
    "weekday-tue": "Sel",
    "weekday-wed": "Rab",
    "weekday-thu": "Kam",
    "weekday-fri": "Jum",
    "weekday-sat": "Sab",
    "count-title": "Hitung hari kerja",
    "start-date": "Tanggal mulai",
    "end-date": "Tanggal selesai",
    "include-endpoints": "Sertakan tanggal mulai/selesai",
    "range-swapped": "Tanggal selesai sebelum tanggal mulai; hasil menggunakan tanggal yang ditukar.",
    "business-days": "Hari kerja",
    "total-days": "Total hari",
    "weekend-days-count": "Akhir pekan",
    "holiday-days-count": "Hari libur (hari kerja)",
    "add-subtract-title": "Tambah/Kurang hari kerja",
    "base-date": "Tanggal dasar",
    "business-days-offset": "Hari kerja",
    "include-start": "Hitung tanggal mulai sebagai hari ke-1",
    "add": "Tambah",
    "subtract": "Kurangi",
    "result-date": "Tanggal"
  },
  "he": {
    "rules-title": "כללי ימי עבודה",
    "selection-mode": "בחירה לפי",
    "weekend-days": "סופי שבוע",
    "working-days": "ימי עבודה",
    "weekend-hint": "בחר אילו ימים הם סוף שבוע.",
    "working-hint": "בחר אילו ימים הם ימי עבודה.",
    "no-working-days": "לא נבחרו ימי עבודה.",
    "holidays": "חגים",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), אחד בכל שורה",
    "holiday-hint": "אופציונלי. חגים בימי חול אינם נכללים.",
    "holiday-note": "חגים בסופי שבוע כבר מוחרגים באמצעות הגדרות סוף השבוע.",
    "invalid-holidays": "ערכים לא תקינים: {count}",
    "weekday-sun": "א'",
    "weekday-mon": "ב'",
    "weekday-tue": "ג'",
    "weekday-wed": "ד'",
    "weekday-thu": "ה'",
    "weekday-fri": "ו'",
    "weekday-sat": "ש'",
    "count-title": "ספירת ימי עבודה",
    "start-date": "תאריך התחלה",
    "end-date": "תאריך סיום",
    "include-endpoints": "כלול תאריכי התחלה/סיום",
    "range-swapped": "תאריך הסיום מוקדם מתאריך ההתחלה; התוצאות משתמשות בתאריכים שהוחלפו.",
    "business-days": "ימי עבודה",
    "total-days": "סה\"כ ימים",
    "weekend-days-count": "סופי שבוע",
    "holiday-days-count": "חגים (ימי חול)",
    "add-subtract-title": "הוספה/הפחתה של ימי עבודה",
    "base-date": "תאריך בסיס",
    "business-days-offset": "ימי עבודה",
    "include-start": "ספור את תאריך ההתחלה כיום 1",
    "add": "הוסף",
    "subtract": "החסר",
    "result-date": "תאריך"
  },
  "ms": {
    "rules-title": "Peraturan hari bekerja",
    "selection-mode": "Pilih mengikut",
    "weekend-days": "Hujung minggu",
    "working-days": "Hari bekerja",
    "weekend-hint": "Pilih hari yang dianggap hujung minggu.",
    "working-hint": "Pilih hari yang dianggap hari bekerja.",
    "no-working-days": "Tiada hari bekerja dipilih.",
    "holidays": "Cuti umum",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), satu setiap baris",
    "holiday-hint": "Pilihan. Cuti umum pada hari bekerja akan dikecualikan.",
    "holiday-note": "Cuti umum pada hujung minggu sudah dikecualikan oleh tetapan hujung minggu.",
    "invalid-holidays": "Kemasukan tidak sah: {count}",
    "weekday-sun": "Ahd",
    "weekday-mon": "Isn",
    "weekday-tue": "Sel",
    "weekday-wed": "Rab",
    "weekday-thu": "Kha",
    "weekday-fri": "Jum",
    "weekday-sat": "Sab",
    "count-title": "Kira hari bekerja",
    "start-date": "Tarikh mula",
    "end-date": "Tarikh tamat",
    "include-endpoints": "Sertakan tarikh mula/tamat",
    "range-swapped": "Tarikh tamat lebih awal daripada tarikh mula; keputusan menggunakan tarikh yang ditukar.",
    "business-days": "Hari bekerja",
    "total-days": "Jumlah hari",
    "weekend-days-count": "Hujung minggu",
    "holiday-days-count": "Cuti umum (hari bekerja)",
    "add-subtract-title": "Tambah/Tolak hari bekerja",
    "base-date": "Tarikh asas",
    "business-days-offset": "Hari bekerja",
    "include-start": "Kira tarikh mula sebagai hari 1",
    "add": "Tambah",
    "subtract": "Tolak",
    "result-date": "Tarikh"
  },
  "no": {
    "rules-title": "Regler for arbeidsdager",
    "selection-mode": "Velg etter",
    "weekend-days": "Helger",
    "working-days": "Arbeidsdager",
    "weekend-hint": "Velg hvilke dager som er helg.",
    "working-hint": "Velg hvilke dager som er arbeidsdager.",
    "no-working-days": "Ingen arbeidsdager valgt.",
    "holidays": "Fridager",
    "holiday-placeholder": "2026-01-15 (YYYY-MM-DD), én per linje",
    "holiday-hint": "Valgfritt. Fridager på hverdager utelates.",
    "holiday-note": "Fridager i helgen er allerede utelatt via helgeinnstillingene.",
    "invalid-holidays": "Ugyldige oppføringer: {count}",
    "weekday-sun": "Søn",
    "weekday-mon": "Man",
    "weekday-tue": "Tir",
    "weekday-wed": "Ons",
    "weekday-thu": "Tor",
    "weekday-fri": "Fre",
    "weekday-sat": "Lør",
    "count-title": "Tell arbeidsdager",
    "start-date": "Startdato",
    "end-date": "Sluttdato",
    "include-endpoints": "Inkluder start-/sluttdato",
    "range-swapped": "Sluttdato er før startdato; resultatene bruker byttede datoer.",
    "business-days": "Arbeidsdager",
    "total-days": "Totale dager",
    "weekend-days-count": "Helger",
    "holiday-days-count": "Fridager (hverdager)",
    "add-subtract-title": "Legg til/trekk fra arbeidsdager",
    "base-date": "Basedato",
    "business-days-offset": "Arbeidsdager",
    "include-start": "Tell startdato som dag 1",
    "add": "Legg til",
    "subtract": "Trekk fra",
    "result-date": "Dato"
  }
}
</i18n>
