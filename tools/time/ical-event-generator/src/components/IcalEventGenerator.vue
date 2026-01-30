<template>
  <n-grid cols="1 900:2" x-gap="16" y-gap="16">
    <n-gi>
      <IcalEventDetailsSection
        v-model:title="title"
        v-model:location="location"
        v-model:description="description"
        v-model:url="url"
        v-model:uid="uid"
        @regenerate-uid="regenerateUid"
      />
      <IcalEventDateTimeSection
        v-model:is-all-day="isAllDay"
        v-model:time-zone="timeZone"
        v-model:output-mode="outputMode"
        v-model:date-range="dateRange"
        :time-zone-options="timeZoneOptions"
        :offset-label="offsetLabel"
        :range-error-key="rangeErrorKey || undefined"
      />
      <IcalEventRecurrenceSection
        v-model:recurrence-frequency="recurrenceFrequency"
        v-model:recurrence-interval="recurrenceInterval"
        v-model:recurrence-weekdays="recurrenceWeekdays"
        v-model:recurrence-month-day="recurrenceMonthDay"
        v-model:recurrence-month="recurrenceMonth"
        v-model:recurrence-end-mode="recurrenceEndMode"
        v-model:recurrence-count="recurrenceCount"
        v-model:recurrence-until-input="recurrenceUntilInput"
        :recurrence-until-status="recurrenceUntilStatus"
        :recurrence-until-error-key="recurrenceUntilErrorKey || undefined"
        :is-all-day="isAllDay"
      />
      <IcalEventRemindersSection
        v-model:reminders-enabled="remindersEnabled"
        v-model:reminders="reminders"
        v-model:default-reminder="reminderDefault"
      />
    </n-gi>

    <n-gi>
      <IcalEventOutputSection
        :ics-content="icsContent"
        :ics-href="icsHref"
        :output-error-key="outputErrorKey || undefined"
      />
      <IcalEventQrCodeSection :text="icsContent || ' '" :qr-options="qrOptions" />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import { NGi, NGrid } from 'naive-ui'
import IcalEventDateTimeSection from './IcalEventDateTimeSection.vue'
import IcalEventDetailsSection from './IcalEventDetailsSection.vue'
import IcalEventOutputSection from './IcalEventOutputSection.vue'
import IcalEventQrCodeSection from './IcalEventQrCodeSection.vue'
import IcalEventRecurrenceSection from './IcalEventRecurrenceSection.vue'
import IcalEventRemindersSection from './IcalEventRemindersSection.vue'
import { qrOptions } from '../utils/icalEventHelpers'
import { useIcalEventGenerator } from '../composables/useIcalEventGenerator'

const {
  timeZoneOptions,
  title,
  location,
  description,
  url,
  uid,
  regenerateUid,
  isAllDay,
  timeZone,
  outputMode,
  dateRange,
  offsetLabel,
  rangeErrorKey,
  recurrenceFrequency,
  recurrenceInterval,
  recurrenceWeekdays,
  recurrenceMonthDay,
  recurrenceMonth,
  recurrenceEndMode,
  recurrenceCount,
  recurrenceUntilInput,
  recurrenceUntilStatus,
  recurrenceUntilErrorKey,
  remindersEnabled,
  reminders,
  reminderDefault,
  icsContent,
  icsHref,
  outputErrorKey,
} = useIcalEventGenerator()
</script>
