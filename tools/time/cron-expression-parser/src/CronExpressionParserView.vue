<template>
  <ToolDefaultPageLayout :info="toolInfo">
    <CronInput v-model:expression="expression" />
    <CronBuilder @select="expression = $event" />
    <CronExplanation :human-description="humanDescription" :fields="fields" />
    <NextRunTimes :run-times="nextRunTimes" />
  </ToolDefaultPageLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolDefaultPageLayout } from '@shared/ui/tool'
import * as toolInfo from './info'
import CronInput from './components/CronInput.vue'
import CronBuilder from './components/CronBuilder.vue'
import CronExplanation from './components/CronExplanation.vue'
import NextRunTimes from './components/NextRunTimes.vue'
import { validateExpression, getHumanDescription, getNextRunTimes, parseFields } from './utils/cron'

const { locale } = useI18n()

const expression = useStorage('cron-expression-parser:expression', '*/5 * * * *')

const isValid = computed(() => validateExpression(expression.value).valid)

const humanDescription = computed(() => {
  if (!isValid.value) return ''
  return getHumanDescription(expression.value, locale.value)
})

const nextRunTimes = computed(() => {
  if (!isValid.value) return []
  return getNextRunTimes(expression.value, 10)
})

const fields = computed(() => {
  if (!isValid.value) return []
  return parseFields(expression.value)
})
</script>
