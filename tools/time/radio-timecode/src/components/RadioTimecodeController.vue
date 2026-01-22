<template>
  <ToolSectionHeader>{{ t('controls') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="12">
      <n-flex align="center" justify="space-between" :size="12">
        <n-select v-model:value="stationId" :options="stationOptions" style="min-width: 260px" />
        <n-flex :size="8">
          <n-button
            v-if="!isPlaying"
            type="primary"
            @click="handleStart"
            :disabled="!audioAvailable"
          >
            <template #icon>
              <n-icon :component="PlayIcon" />
            </template>
            {{ t('start') }}
          </n-button>
          <n-button v-else type="error" @click="handleStop">
            <template #icon>
              <n-icon :component="StopIcon" />
            </template>
            {{ t('stop') }}
          </n-button>
        </n-flex>
      </n-flex>
      <n-alert v-if="!audioAvailable" type="error" :show-icon="false">
        {{ t('unsupported') }}
      </n-alert>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('output') }}</ToolSectionHeader>
  <ToolSection>
    <n-grid :cols="2" :x-gap="16" :y-gap="12">
      <n-gi>
        <n-flex vertical :size="6">
          <n-text depth="3">{{ t('volume') }}</n-text>
          <n-slider v-model:value="volume" :min="0" :max="1" :step="0.01" />
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="6">
          <n-text depth="3">{{ t('offset') }}</n-text>
          <n-input-number v-model:value="offsetMs" :step="1" />
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="6">
          <n-text depth="3">{{ t('carrier') }}</n-text>
          <n-text>{{ station?.carrierHz.toLocaleString() }} {{ t('hz') }}</n-text>
        </n-flex>
      </n-gi>
      <n-gi>
        <n-flex vertical :size="6">
          <n-text depth="3">{{ t('baseTone') }}</n-text>
          <n-text>{{ station?.baseHz.toLocaleString() }} {{ t('hz') }}</n-text>
        </n-flex>
      </n-gi>
    </n-grid>
  </ToolSection>

  <ToolSectionHeader>{{ t('preview') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="6">
      <n-flex align="center" :size="12">
        <n-text depth="3">{{ t('timeNow') }}</n-text>
        <n-text>{{ stationTime }}</n-text>
      </n-flex>
      <n-flex align="center" :size="12">
        <n-text depth="3">{{ t('timezone') }}</n-text>
        <n-text>{{ station?.timeZone }}</n-text>
      </n-flex>
      <n-flex align="center" :size="12">
        <n-text depth="3">{{ t('symbolNow') }}</n-text>
        <n-text>{{ currentSymbol }}</n-text>
      </n-flex>
    </n-flex>
  </ToolSection>

  <ToolSectionHeader>{{ t('notes') }}</ToolSectionHeader>
  <ToolSection>
    <n-flex vertical :size="6">
      <n-text>{{ t('audioWarning') }}</n-text>
      <n-text>{{ t('localTimeNote') }}</n-text>
      <n-text>{{ t('harmonicNote') }}</n-text>
      <n-text>{{ t('callSignNote') }}</n-text>
    </n-flex>
  </ToolSection>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  NAlert,
  NButton,
  NFlex,
  NGrid,
  NGi,
  NIcon,
  NInputNumber,
  NSelect,
  NSlider,
  NText,
} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import PlayIcon from '@vicons/fluent/Play16Regular'
import StopIcon from '@vicons/fluent/Stop16Regular'
import { SignalEngine } from '../audio/signalEngine'
import { getStationSignal } from '../core/encoders'
import { type StationId } from '../core/encoders'
import { type Station, getStationById, stations } from '../core/stations'
import { getTimeParts } from '../core/time'

const { t } = useI18n()

const stationId = useStorage<StationId>('tools:radio-timecode:station', 'jjy-60')
const volume = useStorage('tools:radio-timecode:volume', 0.6)
const offsetMs = useStorage('tools:radio-timecode:offset', 0)

const isPlaying = ref(false)
const engine = ref<SignalEngine | null>(null)
const now = ref(Date.now())
let timer: number | null = null

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
  if (!engine.value) engine.value = new SignalEngine(createContext)
  await engine.value.start({
    station: station.value,
    volume: volume.value,
    offsetMs: offsetMs.value,
  })
  isPlaying.value = true
}

function handleStop() {
  engine.value?.stop()
  isPlaying.value = false
}

watch([stationId, volume, offsetMs], () => {
  if (isPlaying.value) {
    handleStart()
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
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "zh": {
    "controls": "控制",
    "output": "输出",
    "preview": "实时预览",
    "notes": "说明",
    "start": "开始",
    "stop": "停止",
    "volume": "音量",
    "offset": "时间偏移（毫秒）",
    "carrier": "载波",
    "baseTone": "输出音调",
    "timeNow": "台站时间",
    "timezone": "时区",
    "symbolNow": "当前符号",
    "audioWarning": "请保持低音量，高频音可能不适。",
    "localTimeNote": "仅使用本机时间（离线）。",
    "harmonicNote": "输出为低频谐波近似，效果与设备和摆放位置有关。",
    "callSignNote": "JJY 在 15/45 分的呼号未模拟。",
    "unsupported": "当前浏览器不支持 AudioContext。",
    "hz": "赫兹"
  },
  "zh-CN": {
    "controls": "控制",
    "output": "输出",
    "preview": "实时预览",
    "notes": "说明",
    "start": "开始",
    "stop": "停止",
    "volume": "音量",
    "offset": "时间偏移（毫秒）",
    "carrier": "载波",
    "baseTone": "输出音调",
    "timeNow": "台站时间",
    "timezone": "时区",
    "symbolNow": "当前符号",
    "audioWarning": "请保持低音量，高频音可能不适。",
    "localTimeNote": "仅使用本机时间（离线）。",
    "harmonicNote": "输出为低频谐波近似，效果与设备和摆放位置有关。",
    "callSignNote": "JJY 在 15/45 分的呼号未模拟。",
    "unsupported": "当前浏览器不支持 AudioContext。",
    "hz": "赫兹"
  },
  "zh-TW": {
    "controls": "控制",
    "output": "輸出",
    "preview": "即時預覽",
    "notes": "說明",
    "start": "開始",
    "stop": "停止",
    "volume": "音量",
    "offset": "時間偏移（毫秒）",
    "carrier": "載波",
    "baseTone": "輸出音調",
    "timeNow": "台站時間",
    "timezone": "時區",
    "symbolNow": "目前符號",
    "audioWarning": "請保持低音量，高頻音可能不適。",
    "localTimeNote": "僅使用本機時間（離線）。",
    "harmonicNote": "輸出為低頻諧波近似，效果與裝置和擺放位置有關。",
    "callSignNote": "JJY 在 15/45 分的呼號未模擬。",
    "unsupported": "目前瀏覽器不支援 AudioContext。",
    "hz": "赫茲"
  },
  "zh-HK": {
    "controls": "控制",
    "output": "輸出",
    "preview": "即時預覽",
    "notes": "說明",
    "start": "開始",
    "stop": "停止",
    "volume": "音量",
    "offset": "時間偏移（毫秒）",
    "carrier": "載波",
    "baseTone": "輸出音調",
    "timeNow": "台站時間",
    "timezone": "時區",
    "symbolNow": "目前符號",
    "audioWarning": "請保持低音量，高頻音可能不適。",
    "localTimeNote": "僅使用本機時間（離線）。",
    "harmonicNote": "輸出為低頻諧波近似，效果與裝置和擺放位置有關。",
    "callSignNote": "JJY 在 15/45 分的呼號未模擬。",
    "unsupported": "目前瀏覽器不支援 AudioContext。",
    "hz": "赫茲"
  },
  "es": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "fr": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "de": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "it": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "ja": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "ko": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "ru": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "pt": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "ar": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "hi": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "tr": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "nl": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "sv": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "pl": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "vi": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "th": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "id": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "he": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "ms": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  },
  "no": {
    "controls": "Controls",
    "output": "Output",
    "preview": "Live Preview",
    "notes": "Notes",
    "start": "Start",
    "stop": "Stop",
    "volume": "Volume",
    "offset": "Time Offset (ms)",
    "carrier": "Carrier",
    "baseTone": "Output tone",
    "timeNow": "Station time",
    "timezone": "Time zone",
    "symbolNow": "Current symbol",
    "audioWarning": "Keep volume low; high-frequency audio can be uncomfortable.",
    "localTimeNote": "Uses local system time only (offline).",
    "harmonicNote": "Output uses a lower-frequency harmonic approximation; results depend on device and placement.",
    "callSignNote": "JJY call sign minutes (15/45) are not simulated.",
    "unsupported": "AudioContext is not supported in this browser.",
    "hz": "Hz"
  }
}
</i18n>
