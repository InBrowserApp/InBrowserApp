<template>
  <ToolSectionHeader>{{ t('rules-title') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12" class="rule-card">
      <BusinessDaysWeekdayRules
        v-model:weekday-mode="weekdayMode"
        v-model:weekday-selection="weekdaySelection"
        :has-working-days="hasWorkingDays"
      />
      <BusinessDaysHolidayRules
        v-model:holiday-list="holidayList"
        :holiday-invalid-count="holidayInvalidCount"
        :holiday-status="holidayStatus"
      />
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NFlex } from 'naive-ui'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import BusinessDaysHolidayRules from './BusinessDaysHolidayRules.vue'
import BusinessDaysWeekdayRules from './BusinessDaysWeekdayRules.vue'

const weekdayMode = defineModel<'weekend' | 'working'>('weekdayMode', { required: true })
const weekdaySelection = defineModel<number[]>('weekdaySelection', { required: true })
const holidayList = defineModel<string>('holidayList', { required: true })

defineProps<{
  hasWorkingDays: boolean
  holidayInvalidCount: number
  holidayStatus?: 'error' | 'success'
}>()

const { t } = useI18n()
</script>

<style scoped>
.rule-card {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--n-border-color);
}
</style>

<i18n lang="json">
{
  "en": {
    "rules-title": "Business Day Rules"
  },
  "zh": {
    "rules-title": "工作日规则"
  },
  "zh-CN": {
    "rules-title": "工作日规则"
  },
  "zh-TW": {
    "rules-title": "工作日規則"
  },
  "zh-HK": {
    "rules-title": "工作日規則"
  },
  "es": {
    "rules-title": "Reglas de días hábiles"
  },
  "fr": {
    "rules-title": "Règles des jours ouvrés"
  },
  "de": {
    "rules-title": "Regeln für Arbeitstage"
  },
  "it": {
    "rules-title": "Regole dei giorni lavorativi"
  },
  "ja": {
    "rules-title": "営業日ルール"
  },
  "ko": {
    "rules-title": "영업일 규칙"
  },
  "ru": {
    "rules-title": "Правила рабочих дней"
  },
  "pt": {
    "rules-title": "Regras de dias úteis"
  },
  "ar": {
    "rules-title": "قواعد أيام العمل"
  },
  "hi": {
    "rules-title": "कार्यदिवस नियम"
  },
  "tr": {
    "rules-title": "İş günü kuralları"
  },
  "nl": {
    "rules-title": "Werkdagenregels"
  },
  "sv": {
    "rules-title": "Regler för arbetsdagar"
  },
  "pl": {
    "rules-title": "Zasady dni roboczych"
  },
  "vi": {
    "rules-title": "Quy tắc ngày làm việc"
  },
  "th": {
    "rules-title": "กฎวันทำงาน"
  },
  "id": {
    "rules-title": "Aturan hari kerja"
  },
  "he": {
    "rules-title": "כללי ימי עבודה"
  },
  "ms": {
    "rules-title": "Peraturan hari bekerja"
  },
  "no": {
    "rules-title": "Regler for arbeidsdager"
  }
}
</i18n>
