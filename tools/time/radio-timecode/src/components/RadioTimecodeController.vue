<template>
  <ToolSectionHeader>{{ t('controls') }}</ToolSectionHeader>
  <ToolSection>
    <RadioTimecodeControlsSection
      v-model:station-id="stationId"
      :station-options="stationOptions"
      :is-playing="isPlaying"
      :is-starting="isStarting"
      :audio-available="audioAvailable"
      :start-error="startError"
      @start="handleStart"
      @stop="handleStop"
    />
  </ToolSection>

  <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
  <ToolSection>
    <RadioTimecodeOutputSection
      v-model:volume="volume"
      v-model:offset-ms="offsetMs"
      :carrier-hz="station?.carrierHz"
      :base-hz="station?.baseHz"
    />
  </ToolSection>

  <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
  <ToolSection>
    <RadioTimecodePreviewSection
      :station-time="stationTime"
      :time-zone="station?.timeZone"
      :current-symbol="currentSymbol"
    />
  </ToolSection>

  <ToolSectionHeader>{{ t('notes') }}</ToolSectionHeader>
  <ToolSection>
    <RadioTimecodeNotesSection />
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import { SignalEngine } from '../audio/signalEngine'
import { getStationSignal } from '../core/encoders'
import { type StationId } from '../core/encoders'
import { type Station, getStationById, stations } from '../core/stations'
import { getTimeParts } from '../core/time'
import RadioTimecodeControlsSection from './RadioTimecodeControlsSection.vue'
import RadioTimecodeNotesSection from './RadioTimecodeNotesSection.vue'
import RadioTimecodeOutputSection from './RadioTimecodeOutputSection.vue'
import RadioTimecodePreviewSection from './RadioTimecodePreviewSection.vue'

const { t } = useI18n()

const stationId = useStorage<StationId>('tools:radio-timecode:station', 'jjy-60')
const volume = useStorage('tools:radio-timecode:volume', 0.6)
const offsetMs = useStorage('tools:radio-timecode:offset', 0)

const isPlaying = ref(false)
const isStarting = ref(false)
const startError = ref(false)
const engine = ref<SignalEngine | null>(null)
const now = ref(Date.now())
let timer: number | null = null
let pendingRestart = false
let startSerial = 0

const audioAvailable = computed(
  () =>
    typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window),
)

const station = computed<Station>(() => getStationById(stationId.value) ?? stations[0]!)

const stationOptions = computed(() =>
  stations.map((item) => ({ label: item.label, value: item.id })),
)

const stationTime = computed(() => {
  if (!station.value) return ''
  const parts = getTimeParts(new Date(now.value), station.value.timeZone)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(
    parts.minute,
  )}:${pad(parts.second)}`
})

const currentSymbol = computed(() => {
  if (!station.value) return '-'
  return getStationSignal(station.value.id, new Date(now.value)).symbol
})

function createContext() {
  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  return new AudioContextCtor()
}

async function handleStart() {
  if (!station.value || !audioAvailable.value) return
  if (isStarting.value) {
    pendingRestart = true
    return
  }
  if (!engine.value) engine.value = new SignalEngine(createContext)
  isStarting.value = true
  startError.value = false
  pendingRestart = false
  const serial = (startSerial += 1)
  try {
    await engine.value.start({
      station: station.value,
      volume: volume.value,
      offsetMs: offsetMs.value,
    })
    if (serial !== startSerial) return
    isPlaying.value = true
  } catch {
    if (serial !== startSerial) return
    engine.value?.stop()
    isPlaying.value = false
    startError.value = true
  } finally {
    if (serial === startSerial) {
      isStarting.value = false
    }
    if (pendingRestart && serial === startSerial) {
      pendingRestart = false
      void handleStart()
    }
  }
}

function handleStop() {
  startSerial += 1
  pendingRestart = false
  isStarting.value = false
  startError.value = false
  engine.value?.stop()
  isPlaying.value = false
}

watch([stationId, offsetMs], () => {
  if (isPlaying.value) {
    void handleStart()
  }
})

watch(volume, (value) => {
  if (isPlaying.value) {
    engine.value?.setVolume(value)
  }
})

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now()
  }, 500)
})

onBeforeUnmount(() => {
  if (timer !== null) window.clearInterval(timer)
  handleStop()
})
</script>

<i18n lang="json">
{
  "en": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "zh": {
    "controls": "控制",
    "output": "输出",
    "preview": "实时预览",
    "notes": "说明"
  },
  "zh-CN": {
    "controls": "控制",
    "output": "输出",
    "preview": "实时预览",
    "notes": "说明"
  },
  "zh-TW": {
    "controls": "控制",
    "output": "輸出",
    "preview": "即時預覽",
    "notes": "說明"
  },
  "zh-HK": {
    "controls": "控制",
    "output": "輸出",
    "preview": "即時預覽",
    "notes": "說明"
  },
  "es": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "fr": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "de": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "it": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "ja": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "ko": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "ru": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "pt": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "ar": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "hi": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "tr": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "nl": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "sv": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "pl": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "vi": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "th": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "id": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "he": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "ms": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  },
  "no": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes"
  }
}
</i18n>
