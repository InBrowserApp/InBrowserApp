<template>
  <n-grid cols="1 900:2" x-gap="16" y-gap="16">
    <n-gi>
      <DurationCalculatorBaseTimeCard
        :base-input="baseInput"
        :base-time-zone="baseTimeZone"
        :base-status="baseStatus"
        :base-error="baseError"
        :base-offset-label="baseOffsetLabel"
        :time-zone-options="timeZoneOptions"
        @update:base-input="emit('update:baseInput', $event)"
        @update:base-time-zone="emit('update:baseTimeZone', $event)"
        @now="emit('now')"
      />
    </n-gi>
    <n-gi>
      <DurationCalculatorDurationCard
        :duration-iso-input="durationIsoInput"
        :duration-parts="durationParts"
        :duration-iso-status="durationIsoStatus"
        :duration-iso-invalid="durationIsoInvalid"
        :normalized-duration-iso="normalizedDurationIso"
        @update:duration-iso-input="emit('update:durationIsoInput', $event)"
        @update:duration-parts="emit('update:durationParts', $event)"
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
  baseInput: string
  baseStatus?: FormValidationStatus
  baseError: boolean
  baseTimeZone: string
  baseOffsetLabel: string
  timeZoneOptions: SelectOption[]
  durationIsoInput: string
  durationIsoStatus?: FormValidationStatus
  durationIsoInvalid: boolean
  normalizedDurationIso: string
  durationParts: DurationParts
}>()

const emit = defineEmits<{
  (event: 'update:baseInput', value: string): void
  (event: 'update:baseTimeZone', value: string): void
  (event: 'update:durationIsoInput', value: string): void
  (event: 'update:durationParts', value: DurationParts): void
  (event: 'now'): void
}>()
</script>
