<template>
  <div>
    <StopwatchDisplaySection :formatted-elapsed="formattedElapsed" :running="running" />
    <StopwatchControlsSection
      :running="running"
      :has-elapsed="hasElapsed"
      :can-lap="canLap"
      :can-reset="canReset"
      @start="start"
      @pause="pause"
      @lap="recordLap"
      @reset="reset"
    />
    <StopwatchLapsSection ref="lapsSectionRef" v-model:laps="laps" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { DataTableInst } from 'naive-ui'
import { useIntervalFn, useStorage } from '@vueuse/core'
import StopwatchControlsSection from './StopwatchControlsSection.vue'
import StopwatchDisplaySection from './StopwatchDisplaySection.vue'
import StopwatchLapsSection from './StopwatchLapsSection.vue'
import { formatStopwatch } from '../utils/format'

const running = useStorage('tools:stopwatch:running', false)
const startTime = useStorage('tools:stopwatch:start-time', 0)
const accumulated = useStorage('tools:stopwatch:accumulated', 0)
const now = ref(Date.now())
const laps = useStorage<number[]>('tools:stopwatch:laps', [])
const lapsSectionRef = ref<{ tableRef: DataTableInst | null } | null>(null)

const { pause: pauseTicker, resume: resumeTicker } = useIntervalFn(
  () => {
    now.value = Date.now()
  },
  50,
  { immediate: false },
)

const elapsedMs = computed(() => {
  if (!running.value) return accumulated.value
  return accumulated.value + (now.value - startTime.value)
})

const formattedElapsed = computed(() => formatStopwatch(elapsedMs.value))
const hasElapsed = computed(() => elapsedMs.value > 0)
const canLap = computed(() => running.value && elapsedMs.value > 0)
const canReset = computed(() => !running.value && (elapsedMs.value > 0 || laps.value.length > 0))
const tableRef = computed<DataTableInst | null>(() => lapsSectionRef.value?.tableRef ?? null)

const captureNow = () => {
  now.value = Date.now()
}

onMounted(() => {
  if (!running.value) return
  if (!startTime.value) {
    running.value = false
    return
  }
  captureNow()
  resumeTicker()
})

const start = () => {
  if (running.value) return
  captureNow()
  startTime.value = now.value
  running.value = true
  resumeTicker()
}

const pause = () => {
  if (!running.value) return
  captureNow()
  accumulated.value = elapsedMs.value
  running.value = false
  pauseTicker()
}

const reset = () => {
  running.value = false
  accumulated.value = 0
  startTime.value = 0
  laps.value = []
  pauseTicker()
  captureNow()
}

const recordLap = () => {
  if (!running.value) return
  captureNow()
  laps.value = [...laps.value, elapsedMs.value]
}

defineExpose({
  tableRef,
})
</script>
