<template>
  <n-grid cols="1 900:2" x-gap="16" y-gap="16">
    <n-gi>
      <DurationCalculatorBaseTimeCard
        v-model:base-input="baseInput"
        v-model:base-time-zone="baseTimeZone"
        :base-status="baseStatus"
        :base-error="baseError"
        :base-offset-label="baseOffsetLabel"
        :time-zone-options="timeZoneOptions"
        @now="emit('now')"
      />
    </n-gi>
    <n-gi>
      <DurationCalculatorDurationCard
        v-model:duration-iso-input="durationIsoInput"
        v-model:duration-parts="durationParts"
        :duration-iso-status="durationIsoStatus"
        :duration-iso-invalid="durationIsoInvalid"
        :normalized-duration-iso="normalizedDurationIso"
      />
    </n-gi>
  </n-grid>
</template>

<script setup lang="ts">
import type { FormValidationStatus, SelectOption } from 'naive-ui'
import { NGrid, NGi } from 'naive-ui'
import type { DurationParts } from '../utils/duration'
import DurationCalculatorBaseTimeCard from './DurationCalculatorBaseTimeCard.vue'
import DurationCalculatorDurationCard from './DurationCalculatorDurationCard.vue'

defineProps<{
  baseStatus?: FormValidationStatus
  baseError: boolean
  baseOffsetLabel: string
  timeZoneOptions: SelectOption[]
  durationIsoStatus?: FormValidationStatus
  durationIsoInvalid: boolean
  normalizedDurationIso: string
}>()

const emit = defineEmits<{ (event: 'now'): void }>()
const baseInput = defineModel<string>('baseInput', { required: true })
const baseTimeZone = defineModel<string>('baseTimeZone', { required: true })
const durationIsoInput = defineModel<string>('durationIsoInput', { required: true })
const durationParts = defineModel<DurationParts>('durationParts', { required: true })
</script>
