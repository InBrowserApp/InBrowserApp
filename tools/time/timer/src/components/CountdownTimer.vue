<template>
  <div
    ref="fullscreenTarget"
    class="timer-root"
    :class="{
      'timer-root--fullscreen': isFullscreenActive,
      'timer-root--overlay': isFullscreenOverlay,
    }"
  >
    <ToolSection>
      <div class="timer-display" :class="{ 'timer-display--fullscreen': isFullscreenActive }">
        <div class="timer-time" data-testid="timer-display">{{ formattedRemaining }}</div>
        <n-text depth="3" :type="statusType" data-testid="timer-status">
          {{ statusText }}
        </n-text>
      </div>
    </ToolSection>

    <ToolSection v-show="!isFullscreenActive">
      <n-flex :size="12" wrap justify="center">
        <n-button type="primary" :disabled="running" @click="start" data-testid="start">
          <template #icon>
            <n-icon :component="Play16Regular" />
          </template>
          {{ startLabel }}
        </n-button>
        <n-button :disabled="!running" @click="pause" data-testid="pause">
          <template #icon>
            <n-icon :component="Pause16Regular" />
          </template>
          {{ t('pause') }}
        </n-button>
        <n-button :disabled="!canReset" @click="reset" data-testid="reset">
          <template #icon>
            <n-icon :component="ArrowCounterclockwise16Regular" />
          </template>
          {{ t('reset') }}
        </n-button>
        <n-button
          v-show="fullscreenAvailable"
          @click="enterFullscreen"
          data-testid="fullscreen-enter"
        >
          <template #icon>
            <n-icon :component="FullScreenMaximize16Regular" />
          </template>
          {{ t('fullscreenEnter') }}
        </n-button>
      </n-flex>
    </ToolSection>

    <div v-show="isFullscreenActive" class="fullscreen-controls" data-testid="fullscreen-controls">
      <n-flex :size="8" align="center">
        <n-button type="primary" :disabled="running" @click="start" data-testid="fullscreen-start">
          <template #icon>
            <n-icon :component="Play16Regular" />
          </template>
          {{ startLabel }}
        </n-button>
        <n-button :disabled="!running" @click="pause" data-testid="fullscreen-pause">
          <template #icon>
            <n-icon :component="Pause16Regular" />
          </template>
          {{ t('pause') }}
        </n-button>
        <n-button :disabled="!canReset" @click="reset" data-testid="fullscreen-reset">
          <template #icon>
            <n-icon :component="ArrowCounterclockwise16Regular" />
          </template>
          {{ t('reset') }}
        </n-button>
        <n-button @click="exitFullscreen" data-testid="fullscreen-exit">
          <template #icon>
            <n-icon :component="FullScreenMinimize24Regular" />
          </template>
          {{ t('fullscreenExit') }}
        </n-button>
      </n-flex>
    </div>

    <n-alert v-show="errorMessage" type="error" :title="t('errorTitle')">
      {{ errorMessage }}
    </n-alert>

    <ToolSectionHeader>{{ t('durationTitle') }}</ToolSectionHeader>
    <ToolSection>
      <n-grid cols="1 s:3" responsive="screen" :x-gap="12" :y-gap="12">
        <n-form-item-gi :label="t('hours')" :show-feedback="false">
          <n-input-number
            :value="hours"
            :min="0"
            :precision="0"
            :disabled="running"
            class="monospace-input"
            data-testid="hours"
            style="width: 100%"
            @update:value="updateHours"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('minutes')" :show-feedback="false">
          <n-input-number
            :value="minutes"
            :min="0"
            :max="59"
            :precision="0"
            :disabled="running"
            class="monospace-input"
            data-testid="minutes"
            style="width: 100%"
            @update:value="updateMinutes"
          />
        </n-form-item-gi>
        <n-form-item-gi :label="t('seconds')" :show-feedback="false">
          <n-input-number
            :value="seconds"
            :min="0"
            :max="59"
            :precision="0"
            :disabled="running"
            class="monospace-input"
            data-testid="seconds"
            style="width: 100%"
            @update:value="updateSeconds"
          />
        </n-form-item-gi>
      </n-grid>
      <n-text depth="3" class="input-hint">{{ t('durationHint') }}</n-text>
      <n-text depth="3" class="input-hint">{{ t('presets') }}</n-text>
      <n-space :size="8" wrap>
        <n-button
          v-for="preset in presetMinutes"
          :key="preset"
          size="small"
          :disabled="running"
          @click="applyPreset(preset)"
          :data-testid="`preset-${preset}`"
        >
          {{ t('presetMinutes', { minutes: preset }) }}
        </n-button>
      </n-space>
    </ToolSection>

    <ToolSectionHeader>{{ t('alertsTitle') }}</ToolSectionHeader>
    <ToolSection>
      <n-grid cols="1 s:3" responsive="screen" :x-gap="12" :y-gap="12">
        <n-form-item-gi :label="t('soundLabel')" :show-feedback="false">
          <n-switch v-model:value="soundEnabled" :disabled="!soundSupported" />
        </n-form-item-gi>
        <n-form-item-gi :label="t('vibrationLabel')" :show-feedback="false">
          <n-switch v-model:value="vibrationEnabled" :disabled="!vibrationSupported" />
        </n-form-item-gi>
        <n-form-item-gi
          v-show="notificationSupported"
          :label="t('notificationLabel')"
          :show-feedback="false"
        >
          <n-flex align="center" justify="space-between" style="width: 100%">
            <n-switch
              v-model:value="notificationEnabled"
              @update:value="handleNotificationToggle"
            />
            <n-button
              v-show="showNotificationButton"
              text
              size="small"
              data-testid="notification-permission"
              @click="requestNotificationPermission"
            >
              {{ t('notificationRequest') }}
            </n-button>
          </n-flex>
        </n-form-item-gi>
      </n-grid>
      <n-text
        v-show="notificationSupported && notificationHint"
        depth="3"
        class="input-hint"
        data-testid="notification-hint"
      >
        {{ notificationHint }}
      </n-text>
    </ToolSection>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  NAlert,
  NButton,
  NFlex,
  NFormItemGi,
  NGrid,
  NIcon,
  NInputNumber,
  NSpace,
  NSwitch,
  NText,
} from 'naive-ui'
import { useFullscreen, useNow, useStorage } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { ToolSection, ToolSectionHeader } from '@shared/ui/tool'
import ArrowCounterclockwise16Regular from '@vicons/fluent/ArrowCounterclockwise16Regular'
import FullScreenMaximize16Regular from '@vicons/fluent/FullScreenMaximize16Regular'
import FullScreenMinimize24Regular from '@vicons/fluent/FullScreenMinimize24Regular'
import Pause16Regular from '@vicons/fluent/Pause16Regular'
import Play16Regular from '@vicons/fluent/Play16Regular'
import { formatCountdown } from '../utils/format'

const { t } = useI18n()

const hours = useStorage('tools:timer:hours', 0)
const minutes = useStorage('tools:timer:minutes', 5)
const seconds = useStorage('tools:timer:seconds', 0)

const running = useStorage('tools:timer:running', false)
const remainingMs = useStorage('tools:timer:remaining-ms', 0)
const endTime = useStorage('tools:timer:end-time', 0)
const soundEnabled = useStorage('tools:timer:sound', true)
const vibrationEnabled = useStorage('tools:timer:vibration', true)
const notificationEnabled = useStorage('tools:timer:notification', false)

const fullscreenTarget = ref<HTMLElement | null>(null)
const {
  isSupported: fullscreenSupported,
  isFullscreen: isNativeFullscreen,
  enter: enterNativeFullscreen,
  exit: exitNativeFullscreen,
} = useFullscreen(fullscreenTarget)

const fullscreenAvailable = computed(() => true)
const pseudoFullscreen = ref(false)
const isFullscreenActive = computed(() =>
  fullscreenSupported.value ? isNativeFullscreen.value : pseudoFullscreen.value,
)
const isFullscreenOverlay = computed(() => !fullscreenSupported.value && pseudoFullscreen.value)
const bodyOverflow = ref<string | null>(null)

const setBodyOverflow = (locked: boolean) => {
  if (locked) {
    if (bodyOverflow.value === null) {
      bodyOverflow.value = document.body.style.overflow
    }
    document.body.style.overflow = 'hidden'
    return
  }
  if (bodyOverflow.value !== null) {
    document.body.style.overflow = bodyOverflow.value
    bodyOverflow.value = null
  }
}

const {
  now,
  pause: pauseTicker,
  resume: resumeTicker,
} = useNow({
  interval: 'requestAnimationFrame',
  controls: true,
  immediate: false,
})
const nowMs = computed(() => now.value.getTime())
const errorMessage = ref('')

const presetMinutes = [1, 5, 10, 25, 30, 60]

const soundSupported = typeof AudioContext !== 'undefined'
const vibrationSupported =
  typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function'
const notificationSupported = typeof Notification !== 'undefined'

const durationMs = computed(() =>
  Math.max(0, (hours.value * 3600 + minutes.value * 60 + seconds.value) * 1000),
)

const displayRemainingMs = computed(() => {
  if (!running.value) return remainingMs.value
  return Math.max(0, endTime.value - nowMs.value)
})

const formattedRemaining = computed(() => formatCountdown(displayRemainingMs.value))

const isComplete = computed(
  () => !running.value && durationMs.value > 0 && displayRemainingMs.value === 0,
)

const statusText = computed(() => {
  if (isComplete.value) return t('statusComplete')
  if (!running.value && durationMs.value > 0) return t('statusPaused')
  return ''
})

const statusType = computed(() => (isComplete.value ? 'success' : undefined))

const startLabel = computed(() => {
  if (displayRemainingMs.value === 0 || displayRemainingMs.value === durationMs.value) {
    return t('start')
  }
  return t('resume')
})

const canReset = computed(
  () => !running.value && durationMs.value > 0 && displayRemainingMs.value !== durationMs.value,
)

const notificationPermission = ref<NotificationPermission | 'unsupported'>(
  notificationSupported ? Notification.permission : 'unsupported',
)

const showNotificationButton = computed(
  () =>
    notificationEnabled.value &&
    notificationSupported &&
    notificationPermission.value === 'default',
)

const notificationHint = computed(() => {
  if (!notificationSupported) return t('notificationUnsupported')
  if (!notificationEnabled.value) return ''
  if (notificationPermission.value === 'denied') return t('notificationDenied')
  if (notificationPermission.value === 'default') return t('notificationDefault')
  return t('notificationGranted')
})

watch(pseudoFullscreen, (value) => {
  setBodyOverflow(value)
})

onBeforeUnmount(() => {
  setBodyOverflow(false)
})

let audioContext: AudioContext | null = null

const clampInt = (value: number | null, max?: number) => {
  const safe = Math.max(0, Math.floor(value ?? 0))
  if (typeof max === 'number') return Math.min(max, safe)
  return safe
}

const updateHours = (value: number | null) => {
  hours.value = clampInt(value)
}

const updateMinutes = (value: number | null) => {
  minutes.value = clampInt(value, 59)
}

const updateSeconds = (value: number | null) => {
  seconds.value = clampInt(value, 59)
}

const applyPreset = (preset: number) => {
  if (running.value) return
  const totalSeconds = preset * 60
  hours.value = Math.floor(totalSeconds / 3600)
  minutes.value = Math.floor((totalSeconds % 3600) / 60)
  seconds.value = totalSeconds % 60
}

const getAudioContext = () => {
  if (!soundSupported) return null
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

const unlockAudio = async () => {
  const ctx = getAudioContext()
  if (!ctx) return false
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
  return true
}

const playBeep = async () => {
  if (!soundEnabled.value) return
  const ctx = getAudioContext()
  if (!ctx) return
  await unlockAudio()

  const startTime = ctx.currentTime
  const beepDuration = 0.15
  const gap = 0.08
  const count = 3

  for (let index = 0; index < count; index += 1) {
    const toneStart = startTime + index * (beepDuration + gap)
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = 880

    gain.gain.setValueAtTime(0, toneStart)
    gain.gain.linearRampToValueAtTime(0.2, toneStart + 0.01)
    gain.gain.linearRampToValueAtTime(0, toneStart + beepDuration)

    oscillator.connect(gain)
    gain.connect(ctx.destination)

    oscillator.start(toneStart)
    oscillator.stop(toneStart + beepDuration + 0.02)
  }
}

const triggerVibration = () => {
  if (!vibrationEnabled.value || !vibrationSupported) return
  navigator.vibrate([200, 100, 200, 100, 400])
}

const sendNotification = () => {
  if (!notificationEnabled.value || !notificationSupported) return
  if (notificationPermission.value !== 'granted') return
  try {
    new Notification(t('notificationTitle'), {
      body: t('notificationBody'),
    })
  } catch {
    // Ignore notification errors.
  }
}

const updateNotificationPermission = (value?: NotificationPermission) => {
  notificationPermission.value = value ?? Notification.permission
}

if (notificationSupported) {
  updateNotificationPermission()
}

const requestNotificationPermission = async () => {
  if (!notificationSupported) return
  if (notificationPermission.value !== 'default') return
  try {
    const permission = await Notification.requestPermission()
    updateNotificationPermission(permission)
  } catch {
    // Ignore permission errors.
  }
}

const handleNotificationToggle = async (value: boolean) => {
  if (!value) return
  await requestNotificationPermission()
}

const enterFullscreen = async () => {
  if (fullscreenSupported.value) {
    await enterNativeFullscreen()
    return
  }
  pseudoFullscreen.value = true
}

const exitFullscreen = async () => {
  if (fullscreenSupported.value) {
    await exitNativeFullscreen()
    return
  }
  pseudoFullscreen.value = false
}

const resetOutputError = () => {
  errorMessage.value = ''
}

const completeTimer = (notify: boolean) => {
  running.value = false
  endTime.value = 0
  remainingMs.value = 0
  pauseTicker()

  if (notify) {
    void playBeep()
    triggerVibration()
    sendNotification()
  }
}

const start = async () => {
  if (running.value) return
  resetOutputError()

  if (durationMs.value <= 0) {
    errorMessage.value = t('errorNoDuration')
    return
  }

  if (displayRemainingMs.value === 0) {
    remainingMs.value = durationMs.value
  }

  const targetRemaining = remainingMs.value
  const startTime = Date.now()
  now.value = new Date(startTime)
  endTime.value = startTime + targetRemaining
  running.value = true
  resumeTicker()
  await unlockAudio()
}

const pause = () => {
  if (!running.value) return
  now.value = new Date()
  remainingMs.value = displayRemainingMs.value
  running.value = false
  endTime.value = 0
  pauseTicker()
}

const reset = () => {
  running.value = false
  endTime.value = 0
  remainingMs.value = durationMs.value
  resetOutputError()
  pauseTicker()
  now.value = new Date()
}

watch(durationMs, (value) => {
  if (running.value) return
  remainingMs.value = value
  if (value > 0) {
    resetOutputError()
  }
})

watch(displayRemainingMs, (value) => {
  if (!running.value) return
  if (value > 0) return
  completeTimer(true)
})

onMounted(() => {
  if (!running.value) {
    if (remainingMs.value === 0 && durationMs.value > 0) {
      remainingMs.value = durationMs.value
    }
    return
  }

  if (!endTime.value) {
    running.value = false
    return
  }

  now.value = new Date()
  if (endTime.value <= nowMs.value) {
    completeTimer(false)
    return
  }

  resumeTicker()
})
</script>

<style scoped>
.timer-root {
  position: relative;
}

.timer-root--fullscreen {
  min-height: 100vh;
  padding: 24px 16px 96px;
}

.timer-root--overlay {
  position: fixed;
  inset: 0;
  z-index: 10;
  background: var(--n-color);
  overflow: auto;
  padding: calc(24px + env(safe-area-inset-top)) 16px calc(96px + env(safe-area-inset-bottom));
}

.timer-root--fullscreen .timer-time {
  font-size: clamp(3rem, 10vw, 6rem);
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
}

.timer-time {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 600;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  font-family: var(--n-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.monospace-input :deep(input) {
  font-family: var(--n-font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
}

.input-hint {
  display: block;
  margin-top: 8px;
}
.fullscreen-controls {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 2;
}
</style>

<i18n lang="json">
{
  "en": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Resume",
    "reset": "Reset",
    "fullscreenEnter": "Fullscreen",
    "fullscreenExit": "Exit fullscreen",
    "durationTitle": "Duration",
    "durationHint": "Set the countdown duration before starting.",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds",
    "presets": "Quick Presets",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Alerts",
    "soundLabel": "Sound",
    "vibrationLabel": "Vibration",
    "notificationLabel": "Notifications",
    "notificationUnsupported": "Notifications are not supported in this browser.",
    "notificationDenied": "Notifications are blocked in browser settings.",
    "notificationDefault": "Allow notifications to receive alerts.",
    "notificationGranted": "Notifications are enabled.",
    "notificationRequest": "Enable",
    "notificationTitle": "Timer finished",
    "notificationBody": "Time's up.",
    "statusPaused": "Paused",
    "statusComplete": "Completed",
    "errorTitle": "Error",
    "errorNoDuration": "Set a duration greater than zero."
  },
  "zh": {
    "start": "开始",
    "pause": "暂停",
    "resume": "继续",
    "reset": "重置",
    "fullscreenEnter": "全屏",
    "fullscreenExit": "退出全屏",
    "durationTitle": "时长",
    "durationHint": "开始前请设置倒计时时长。",
    "hours": "小时",
    "minutes": "分钟",
    "seconds": "秒",
    "presets": "快速预设",
    "presetMinutes": "{minutes} 分钟",
    "alertsTitle": "提醒",
    "soundLabel": "提示音",
    "vibrationLabel": "震动",
    "notificationLabel": "通知",
    "notificationUnsupported": "当前浏览器不支持通知。",
    "notificationDenied": "通知已在浏览器设置中被阻止。",
    "notificationDefault": "允许通知以接收提醒。",
    "notificationGranted": "通知已启用。",
    "notificationRequest": "启用",
    "notificationTitle": "倒计时结束",
    "notificationBody": "时间到了。",
    "statusPaused": "已暂停",
    "statusComplete": "已完成",
    "errorTitle": "错误",
    "errorNoDuration": "请设置大于 0 的时长。"
  },
  "zh-CN": {
    "start": "开始",
    "pause": "暂停",
    "resume": "继续",
    "reset": "重置",
    "fullscreenEnter": "全屏",
    "fullscreenExit": "退出全屏",
    "durationTitle": "时长",
    "durationHint": "开始前请设置倒计时时长。",
    "hours": "小时",
    "minutes": "分钟",
    "seconds": "秒",
    "presets": "快速预设",
    "presetMinutes": "{minutes} 分钟",
    "alertsTitle": "提醒",
    "soundLabel": "提示音",
    "vibrationLabel": "震动",
    "notificationLabel": "通知",
    "notificationUnsupported": "当前浏览器不支持通知。",
    "notificationDenied": "通知已在浏览器设置中被阻止。",
    "notificationDefault": "允许通知以接收提醒。",
    "notificationGranted": "通知已启用。",
    "notificationRequest": "启用",
    "notificationTitle": "倒计时结束",
    "notificationBody": "时间到了。",
    "statusPaused": "已暂停",
    "statusComplete": "已完成",
    "errorTitle": "错误",
    "errorNoDuration": "请设置大于 0 的时长。"
  },
  "zh-TW": {
    "start": "開始",
    "pause": "暫停",
    "resume": "繼續",
    "reset": "重置",
    "fullscreenEnter": "全螢幕",
    "fullscreenExit": "退出全螢幕",
    "durationTitle": "時長",
    "durationHint": "開始前請設定倒數計時時長。",
    "hours": "小時",
    "minutes": "分鐘",
    "seconds": "秒",
    "presets": "快速預設",
    "presetMinutes": "{minutes} 分鐘",
    "alertsTitle": "提醒",
    "soundLabel": "提示音",
    "vibrationLabel": "震動",
    "notificationLabel": "通知",
    "notificationUnsupported": "目前瀏覽器不支援通知。",
    "notificationDenied": "通知已在瀏覽器設定中被封鎖。",
    "notificationDefault": "允許通知以接收提醒。",
    "notificationGranted": "通知已啟用。",
    "notificationRequest": "啟用",
    "notificationTitle": "倒數計時結束",
    "notificationBody": "時間到了。",
    "statusPaused": "已暫停",
    "statusComplete": "已完成",
    "errorTitle": "錯誤",
    "errorNoDuration": "請設定大於 0 的時長。"
  },
  "zh-HK": {
    "start": "開始",
    "pause": "暫停",
    "resume": "繼續",
    "reset": "重置",
    "fullscreenEnter": "全螢幕",
    "fullscreenExit": "退出全螢幕",
    "durationTitle": "時長",
    "durationHint": "開始前請設定倒數計時時長。",
    "hours": "小時",
    "minutes": "分鐘",
    "seconds": "秒",
    "presets": "快速預設",
    "presetMinutes": "{minutes} 分鐘",
    "alertsTitle": "提醒",
    "soundLabel": "提示音",
    "vibrationLabel": "震動",
    "notificationLabel": "通知",
    "notificationUnsupported": "目前瀏覽器不支援通知。",
    "notificationDenied": "通知已在瀏覽器設定中被封鎖。",
    "notificationDefault": "允許通知以接收提醒。",
    "notificationGranted": "通知已啟用。",
    "notificationRequest": "啟用",
    "notificationTitle": "倒數計時結束",
    "notificationBody": "時間到了。",
    "statusPaused": "已暫停",
    "statusComplete": "已完成",
    "errorTitle": "錯誤",
    "errorNoDuration": "請設定大於 0 的時長。"
  },
  "es": {
    "start": "Iniciar",
    "pause": "Pausar",
    "resume": "Reanudar",
    "reset": "Restablecer",
    "fullscreenEnter": "Pantalla completa",
    "fullscreenExit": "Salir de pantalla completa",
    "durationTitle": "Duración",
    "durationHint": "Configura la duración antes de iniciar.",
    "hours": "Horas",
    "minutes": "Minutos",
    "seconds": "Segundos",
    "presets": "Ajustes rápidos",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Alertas",
    "soundLabel": "Sonido",
    "vibrationLabel": "Vibración",
    "notificationLabel": "Notificaciones",
    "notificationUnsupported": "Las notificaciones no son compatibles con este navegador.",
    "notificationDenied": "Las notificaciones están bloqueadas en la configuración del navegador.",
    "notificationDefault": "Permite notificaciones para recibir alertas.",
    "notificationGranted": "Las notificaciones están habilitadas.",
    "notificationRequest": "Habilitar",
    "notificationTitle": "Temporizador finalizado",
    "notificationBody": "Se acabó el tiempo.",
    "statusPaused": "Pausado",
    "statusComplete": "Completado",
    "errorTitle": "Error",
    "errorNoDuration": "Configura una duración mayor que cero."
  },
  "fr": {
    "start": "Démarrer",
    "pause": "Pause",
    "resume": "Reprendre",
    "reset": "Réinitialiser",
    "fullscreenEnter": "Plein écran",
    "fullscreenExit": "Quitter le plein écran",
    "durationTitle": "Durée",
    "durationHint": "Réglez la durée avant de démarrer.",
    "hours": "Heures",
    "minutes": "Minutes",
    "seconds": "Secondes",
    "presets": "Préréglages rapides",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Alertes",
    "soundLabel": "Son",
    "vibrationLabel": "Vibration",
    "notificationLabel": "Notifications",
    "notificationUnsupported": "Les notifications ne sont pas prises en charge par ce navigateur.",
    "notificationDenied": "Les notifications sont bloquées dans les paramètres du navigateur.",
    "notificationDefault": "Autorisez les notifications pour recevoir des alertes.",
    "notificationGranted": "Les notifications sont activées.",
    "notificationRequest": "Activer",
    "notificationTitle": "Minuteur terminé",
    "notificationBody": "Le temps est écoulé.",
    "statusPaused": "En pause",
    "statusComplete": "Terminé",
    "errorTitle": "Erreur",
    "errorNoDuration": "Définissez une durée supérieure à zéro."
  },
  "de": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Fortsetzen",
    "reset": "Zurücksetzen",
    "fullscreenEnter": "Vollbild",
    "fullscreenExit": "Vollbild verlassen",
    "durationTitle": "Dauer",
    "durationHint": "Legen Sie die Dauer vor dem Start fest.",
    "hours": "Stunden",
    "minutes": "Minuten",
    "seconds": "Sekunden",
    "presets": "Schnellvorlagen",
    "presetMinutes": "{minutes} Min",
    "alertsTitle": "Hinweise",
    "soundLabel": "Ton",
    "vibrationLabel": "Vibration",
    "notificationLabel": "Benachrichtigungen",
    "notificationUnsupported": "Benachrichtigungen werden in diesem Browser nicht unterstützt.",
    "notificationDenied": "Benachrichtigungen sind in den Browser-Einstellungen blockiert.",
    "notificationDefault": "Benachrichtigungen zulassen, um Hinweise zu erhalten.",
    "notificationGranted": "Benachrichtigungen sind aktiviert.",
    "notificationRequest": "Aktivieren",
    "notificationTitle": "Timer beendet",
    "notificationBody": "Die Zeit ist abgelaufen.",
    "statusPaused": "Pausiert",
    "statusComplete": "Abgeschlossen",
    "errorTitle": "Fehler",
    "errorNoDuration": "Legen Sie eine Dauer größer als null fest."
  },
  "it": {
    "start": "Avvia",
    "pause": "Pausa",
    "resume": "Riprendi",
    "reset": "Reimposta",
    "fullscreenEnter": "Schermo intero",
    "fullscreenExit": "Esci da schermo intero",
    "durationTitle": "Durata",
    "durationHint": "Imposta la durata prima di avviare.",
    "hours": "Ore",
    "minutes": "Minuti",
    "seconds": "Secondi",
    "presets": "Preset rapidi",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Avvisi",
    "soundLabel": "Suono",
    "vibrationLabel": "Vibrazione",
    "notificationLabel": "Notifiche",
    "notificationUnsupported": "Le notifiche non sono supportate da questo browser.",
    "notificationDenied": "Le notifiche sono bloccate nelle impostazioni del browser.",
    "notificationDefault": "Consenti le notifiche per ricevere gli avvisi.",
    "notificationGranted": "Le notifiche sono attive.",
    "notificationRequest": "Attiva",
    "notificationTitle": "Timer terminato",
    "notificationBody": "Il tempo è scaduto.",
    "statusPaused": "In pausa",
    "statusComplete": "Completato",
    "errorTitle": "Errore",
    "errorNoDuration": "Imposta una durata maggiore di zero."
  },
  "ja": {
    "start": "開始",
    "pause": "一時停止",
    "resume": "再開",
    "reset": "リセット",
    "fullscreenEnter": "全画面",
    "fullscreenExit": "全画面を終了",
    "durationTitle": "時間",
    "durationHint": "開始前にカウントダウン時間を設定してください。",
    "hours": "時間",
    "minutes": "分",
    "seconds": "秒",
    "presets": "クイックプリセット",
    "presetMinutes": "{minutes} 分",
    "alertsTitle": "通知",
    "soundLabel": "音",
    "vibrationLabel": "振動",
    "notificationLabel": "通知",
    "notificationUnsupported": "このブラウザでは通知がサポートされていません。",
    "notificationDenied": "通知はブラウザ設定でブロックされています。",
    "notificationDefault": "通知を許可してアラートを受け取ってください。",
    "notificationGranted": "通知が有効になっています。",
    "notificationRequest": "有効化",
    "notificationTitle": "タイマー終了",
    "notificationBody": "時間になりました。",
    "statusPaused": "一時停止",
    "statusComplete": "完了",
    "errorTitle": "エラー",
    "errorNoDuration": "0 より大きい時間を設定してください。"
  },
  "ko": {
    "start": "시작",
    "pause": "일시정지",
    "resume": "재개",
    "reset": "초기화",
    "fullscreenEnter": "전체 화면",
    "fullscreenExit": "전체 화면 종료",
    "durationTitle": "시간",
    "durationHint": "시작 전에 카운트다운 시간을 설정하세요.",
    "hours": "시간",
    "minutes": "분",
    "seconds": "초",
    "presets": "빠른 프리셋",
    "presetMinutes": "{minutes}분",
    "alertsTitle": "알림",
    "soundLabel": "소리",
    "vibrationLabel": "진동",
    "notificationLabel": "알림",
    "notificationUnsupported": "이 브라우저에서는 알림을 지원하지 않습니다.",
    "notificationDenied": "알림이 브라우저 설정에서 차단되었습니다.",
    "notificationDefault": "알림을 허용하면 알림을 받을 수 있습니다.",
    "notificationGranted": "알림이 활성화되었습니다.",
    "notificationRequest": "활성화",
    "notificationTitle": "타이머 종료",
    "notificationBody": "시간이 다 됐습니다.",
    "statusPaused": "일시정지",
    "statusComplete": "완료",
    "errorTitle": "오류",
    "errorNoDuration": "0보다 큰 시간을 설정하세요."
  },
  "ru": {
    "start": "Старт",
    "pause": "Пауза",
    "resume": "Продолжить",
    "reset": "Сброс",
    "fullscreenEnter": "Полноэкранный",
    "fullscreenExit": "Выйти из полноэкранного режима",
    "durationTitle": "Длительность",
    "durationHint": "Задайте длительность перед запуском.",
    "hours": "Часы",
    "minutes": "Минуты",
    "seconds": "Секунды",
    "presets": "Быстрые пресеты",
    "presetMinutes": "{minutes} мин",
    "alertsTitle": "Оповещения",
    "soundLabel": "Звук",
    "vibrationLabel": "Вибрация",
    "notificationLabel": "Уведомления",
    "notificationUnsupported": "Уведомления не поддерживаются этим браузером.",
    "notificationDenied": "Уведомления заблокированы в настройках браузера.",
    "notificationDefault": "Разрешите уведомления для получения оповещений.",
    "notificationGranted": "Уведомления включены.",
    "notificationRequest": "Включить",
    "notificationTitle": "Таймер завершён",
    "notificationBody": "Время вышло.",
    "statusPaused": "Пауза",
    "statusComplete": "Завершено",
    "errorTitle": "Ошибка",
    "errorNoDuration": "Установите длительность больше нуля."
  },
  "pt": {
    "start": "Iniciar",
    "pause": "Pausar",
    "resume": "Retomar",
    "reset": "Redefinir",
    "fullscreenEnter": "Tela cheia",
    "fullscreenExit": "Sair da tela cheia",
    "durationTitle": "Duração",
    "durationHint": "Defina a duração antes de iniciar.",
    "hours": "Horas",
    "minutes": "Minutos",
    "seconds": "Segundos",
    "presets": "Predefinições rápidas",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Alertas",
    "soundLabel": "Som",
    "vibrationLabel": "Vibração",
    "notificationLabel": "Notificações",
    "notificationUnsupported": "Notificações não são suportadas neste navegador.",
    "notificationDenied": "Notificações estão bloqueadas nas configurações do navegador.",
    "notificationDefault": "Permita notificações para receber alertas.",
    "notificationGranted": "Notificações ativadas.",
    "notificationRequest": "Ativar",
    "notificationTitle": "Temporizador concluído",
    "notificationBody": "O tempo acabou.",
    "statusPaused": "Pausado",
    "statusComplete": "Concluído",
    "errorTitle": "Erro",
    "errorNoDuration": "Defina uma duração maior que zero."
  },
  "ar": {
    "start": "ابدأ",
    "pause": "إيقاف مؤقت",
    "resume": "استئناف",
    "reset": "إعادة ضبط",
    "fullscreenEnter": "ملء الشاشة",
    "fullscreenExit": "الخروج من ملء الشاشة",
    "durationTitle": "المدة",
    "durationHint": "اضبط مدة العد التنازلي قبل البدء.",
    "hours": "ساعات",
    "minutes": "دقائق",
    "seconds": "ثوانٍ",
    "presets": "إعدادات سريعة",
    "presetMinutes": "{minutes} دقيقة",
    "alertsTitle": "تنبيهات",
    "soundLabel": "صوت",
    "vibrationLabel": "اهتزاز",
    "notificationLabel": "إشعارات",
    "notificationUnsupported": "الإشعارات غير مدعومة في هذا المتصفح.",
    "notificationDenied": "تم حظر الإشعارات في إعدادات المتصفح.",
    "notificationDefault": "اسمح بالإشعارات لتلقي التنبيهات.",
    "notificationGranted": "الإشعارات مفعلة.",
    "notificationRequest": "تفعيل",
    "notificationTitle": "انتهى المؤقت",
    "notificationBody": "انتهى الوقت.",
    "statusPaused": "متوقف",
    "statusComplete": "مكتمل",
    "errorTitle": "خطأ",
    "errorNoDuration": "عيّن مدة أكبر من صفر."
  },
  "hi": {
    "start": "शुरू",
    "pause": "रोकें",
    "resume": "जारी रखें",
    "reset": "रीसेट",
    "fullscreenEnter": "पूर्ण स्क्रीन",
    "fullscreenExit": "पूर्ण स्क्रीन से बाहर",
    "durationTitle": "अवधि",
    "durationHint": "शुरू करने से पहले अवधि सेट करें।",
    "hours": "घंटे",
    "minutes": "मिनट",
    "seconds": "सेकंड",
    "presets": "त्वरित प्रीसेट",
    "presetMinutes": "{minutes} मिनट",
    "alertsTitle": "अलर्ट",
    "soundLabel": "ध्वनि",
    "vibrationLabel": "कंपन",
    "notificationLabel": "सूचनाएँ",
    "notificationUnsupported": "इस ब्राउज़र में सूचनाएँ समर्थित नहीं हैं।",
    "notificationDenied": "सूचनाएँ ब्राउज़र सेटिंग में ब्लॉक हैं।",
    "notificationDefault": "अलर्ट पाने के लिए सूचनाएँ अनुमति दें।",
    "notificationGranted": "सूचनाएँ सक्षम हैं।",
    "notificationRequest": "सक्षम करें",
    "notificationTitle": "टाइमर समाप्त",
    "notificationBody": "समय समाप्त।",
    "statusPaused": "रुका हुआ",
    "statusComplete": "पूर्ण",
    "errorTitle": "त्रुटि",
    "errorNoDuration": "0 से अधिक अवधि सेट करें।"
  },
  "tr": {
    "start": "Başlat",
    "pause": "Duraklat",
    "resume": "Devam et",
    "reset": "Sıfırla",
    "fullscreenEnter": "Tam Ekran",
    "fullscreenExit": "Tam ekrandan çık",
    "durationTitle": "Süre",
    "durationHint": "Başlatmadan önce süreyi ayarlayın.",
    "hours": "Saat",
    "minutes": "Dakika",
    "seconds": "Saniye",
    "presets": "Hızlı ayarlar",
    "presetMinutes": "{minutes} dk",
    "alertsTitle": "Uyarılar",
    "soundLabel": "Ses",
    "vibrationLabel": "Titreşim",
    "notificationLabel": "Bildirimler",
    "notificationUnsupported": "Bildirimler bu tarayıcıda desteklenmiyor.",
    "notificationDenied": "Bildirimler tarayıcı ayarlarında engellendi.",
    "notificationDefault": "Uyarılar için bildirimlere izin verin.",
    "notificationGranted": "Bildirimler etkin.",
    "notificationRequest": "Etkinleştir",
    "notificationTitle": "Zamanlayıcı bitti",
    "notificationBody": "Süre doldu.",
    "statusPaused": "Duraklatıldı",
    "statusComplete": "Tamamlandı",
    "errorTitle": "Hata",
    "errorNoDuration": "Sıfırdan büyük bir süre ayarlayın."
  },
  "nl": {
    "start": "Start",
    "pause": "Pauze",
    "resume": "Hervatten",
    "reset": "Reset",
    "fullscreenEnter": "Volledig scherm",
    "fullscreenExit": "Volledig scherm verlaten",
    "durationTitle": "Duur",
    "durationHint": "Stel de duur in voordat je start.",
    "hours": "Uren",
    "minutes": "Minuten",
    "seconds": "Seconden",
    "presets": "Snelle presets",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Meldingen",
    "soundLabel": "Geluid",
    "vibrationLabel": "Trillen",
    "notificationLabel": "Notificaties",
    "notificationUnsupported": "Notificaties worden niet ondersteund in deze browser.",
    "notificationDenied": "Notificaties zijn geblokkeerd in de browserinstellingen.",
    "notificationDefault": "Sta notificaties toe om meldingen te ontvangen.",
    "notificationGranted": "Notificaties zijn ingeschakeld.",
    "notificationRequest": "Inschakelen",
    "notificationTitle": "Timer afgelopen",
    "notificationBody": "De tijd is om.",
    "statusPaused": "Gepauzeerd",
    "statusComplete": "Voltooid",
    "errorTitle": "Fout",
    "errorNoDuration": "Stel een duur groter dan nul in."
  },
  "sv": {
    "start": "Start",
    "pause": "Paus",
    "resume": "Fortsätt",
    "reset": "Återställ",
    "fullscreenEnter": "Fullskärm",
    "fullscreenExit": "Avsluta helskärm",
    "durationTitle": "Varaktighet",
    "durationHint": "Ställ in varaktigheten innan du startar.",
    "hours": "Timmar",
    "minutes": "Minuter",
    "seconds": "Sekunder",
    "presets": "Snabbval",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Aviseringar",
    "soundLabel": "Ljud",
    "vibrationLabel": "Vibration",
    "notificationLabel": "Notifieringar",
    "notificationUnsupported": "Notifieringar stöds inte i denna webbläsare.",
    "notificationDenied": "Notifieringar är blockerade i webbläsarens inställningar.",
    "notificationDefault": "Tillåt notifieringar för att få aviseringar.",
    "notificationGranted": "Notifieringar är aktiverade.",
    "notificationRequest": "Aktivera",
    "notificationTitle": "Timer klar",
    "notificationBody": "Tiden är ute.",
    "statusPaused": "Pausad",
    "statusComplete": "Klar",
    "errorTitle": "Fel",
    "errorNoDuration": "Ange en varaktighet större än noll."
  },
  "pl": {
    "start": "Start",
    "pause": "Pauza",
    "resume": "Wznów",
    "reset": "Reset",
    "fullscreenEnter": "Pełny ekran",
    "fullscreenExit": "Wyjdź z pełnego ekranu",
    "durationTitle": "Czas",
    "durationHint": "Ustaw czas przed rozpoczęciem.",
    "hours": "Godziny",
    "minutes": "Minuty",
    "seconds": "Sekundy",
    "presets": "Szybkie ustawienia",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Alerty",
    "soundLabel": "Dźwięk",
    "vibrationLabel": "Wibracja",
    "notificationLabel": "Powiadomienia",
    "notificationUnsupported": "Powiadomienia nie są obsługiwane w tej przeglądarce.",
    "notificationDenied": "Powiadomienia są zablokowane w ustawieniach przeglądarki.",
    "notificationDefault": "Zezwól na powiadomienia, aby otrzymywać alerty.",
    "notificationGranted": "Powiadomienia są włączone.",
    "notificationRequest": "Włącz",
    "notificationTitle": "Koniec timera",
    "notificationBody": "Czas minął.",
    "statusPaused": "Wstrzymany",
    "statusComplete": "Zakończony",
    "errorTitle": "Błąd",
    "errorNoDuration": "Ustaw czas większy niż zero."
  },
  "vi": {
    "start": "Bắt đầu",
    "pause": "Tạm dừng",
    "resume": "Tiếp tục",
    "reset": "Đặt lại",
    "fullscreenEnter": "Toàn màn hình",
    "fullscreenExit": "Thoát toàn màn hình",
    "durationTitle": "Thời lượng",
    "durationHint": "Hãy đặt thời lượng trước khi bắt đầu.",
    "hours": "Giờ",
    "minutes": "Phút",
    "seconds": "Giây",
    "presets": "Cài đặt nhanh",
    "presetMinutes": "{minutes} phút",
    "alertsTitle": "Cảnh báo",
    "soundLabel": "Âm thanh",
    "vibrationLabel": "Rung",
    "notificationLabel": "Thông báo",
    "notificationUnsupported": "Trình duyệt này không hỗ trợ thông báo.",
    "notificationDenied": "Thông báo bị chặn trong cài đặt trình duyệt.",
    "notificationDefault": "Cho phép thông báo để nhận cảnh báo.",
    "notificationGranted": "Thông báo đã bật.",
    "notificationRequest": "Bật",
    "notificationTitle": "Hết giờ",
    "notificationBody": "Đã hết thời gian.",
    "statusPaused": "Tạm dừng",
    "statusComplete": "Hoàn thành",
    "errorTitle": "Lỗi",
    "errorNoDuration": "Hãy đặt thời lượng lớn hơn 0."
  },
  "th": {
    "start": "เริ่ม",
    "pause": "หยุดชั่วคราว",
    "resume": "ทำต่อ",
    "reset": "รีเซ็ต",
    "fullscreenEnter": "เต็มหน้าจอ",
    "fullscreenExit": "ออกจากเต็มหน้าจอ",
    "durationTitle": "ระยะเวลา",
    "durationHint": "ตั้งระยะเวลาก่อนเริ่มนับถอยหลัง",
    "hours": "ชั่วโมง",
    "minutes": "นาที",
    "seconds": "วินาที",
    "presets": "ตั้งค่าด่วน",
    "presetMinutes": "{minutes} นาที",
    "alertsTitle": "การแจ้งเตือน",
    "soundLabel": "เสียง",
    "vibrationLabel": "การสั่น",
    "notificationLabel": "การแจ้งเตือน",
    "notificationUnsupported": "เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน",
    "notificationDenied": "การแจ้งเตือนถูกบล็อกในตั้งค่าเบราว์เซอร์",
    "notificationDefault": "อนุญาตการแจ้งเตือนเพื่อรับการเตือน",
    "notificationGranted": "เปิดการแจ้งเตือนแล้ว",
    "notificationRequest": "เปิดใช้งาน",
    "notificationTitle": "ตัวตั้งเวลาเสร็จสิ้น",
    "notificationBody": "หมดเวลาแล้ว",
    "statusPaused": "หยุดชั่วคราว",
    "statusComplete": "เสร็จสิ้น",
    "errorTitle": "ข้อผิดพลาด",
    "errorNoDuration": "ตั้งระยะเวลามากกว่า 0"
  },
  "id": {
    "start": "Mulai",
    "pause": "Jeda",
    "resume": "Lanjutkan",
    "reset": "Reset",
    "fullscreenEnter": "Layar penuh",
    "fullscreenExit": "Keluar dari layar penuh",
    "durationTitle": "Durasi",
    "durationHint": "Atur durasi sebelum memulai.",
    "hours": "Jam",
    "minutes": "Menit",
    "seconds": "Detik",
    "presets": "Preset cepat",
    "presetMinutes": "{minutes} menit",
    "alertsTitle": "Peringatan",
    "soundLabel": "Suara",
    "vibrationLabel": "Getar",
    "notificationLabel": "Notifikasi",
    "notificationUnsupported": "Notifikasi tidak didukung di browser ini.",
    "notificationDenied": "Notifikasi diblokir di pengaturan browser.",
    "notificationDefault": "Izinkan notifikasi untuk menerima peringatan.",
    "notificationGranted": "Notifikasi diaktifkan.",
    "notificationRequest": "Aktifkan",
    "notificationTitle": "Timer selesai",
    "notificationBody": "Waktu habis.",
    "statusPaused": "Dijeda",
    "statusComplete": "Selesai",
    "errorTitle": "Kesalahan",
    "errorNoDuration": "Atur durasi lebih dari 0."
  },
  "he": {
    "start": "התחל",
    "pause": "השהה",
    "resume": "המשך",
    "reset": "אפס",
    "fullscreenEnter": "מסך מלא",
    "fullscreenExit": "צא ממסך מלא",
    "durationTitle": "משך",
    "durationHint": "הגדר משך לפני ההתחלה.",
    "hours": "שעות",
    "minutes": "דקות",
    "seconds": "שניות",
    "presets": "קיצורים",
    "presetMinutes": "{minutes} דק'",
    "alertsTitle": "התראות",
    "soundLabel": "צליל",
    "vibrationLabel": "רטט",
    "notificationLabel": "התראות",
    "notificationUnsupported": "התראות אינן נתמכות בדפדפן זה.",
    "notificationDenied": "התראות נחסמו בהגדרות הדפדפן.",
    "notificationDefault": "אפשר התראות כדי לקבל התראות.",
    "notificationGranted": "התראות מופעלות.",
    "notificationRequest": "הפעל",
    "notificationTitle": "הטיימר הסתיים",
    "notificationBody": "הזמן נגמר.",
    "statusPaused": "מושהה",
    "statusComplete": "הושלם",
    "errorTitle": "שגיאה",
    "errorNoDuration": "הגדר משך גדול מאפס."
  },
  "ms": {
    "start": "Mula",
    "pause": "Jeda",
    "resume": "Sambung",
    "reset": "Tetapkan semula",
    "fullscreenEnter": "Skrin penuh",
    "fullscreenExit": "Keluar skrin penuh",
    "durationTitle": "Tempoh",
    "durationHint": "Tetapkan tempoh sebelum mula.",
    "hours": "Jam",
    "minutes": "Minit",
    "seconds": "Saat",
    "presets": "Pratetap pantas",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Makluman",
    "soundLabel": "Bunyi",
    "vibrationLabel": "Getaran",
    "notificationLabel": "Pemberitahuan",
    "notificationUnsupported": "Pemberitahuan tidak disokong dalam pelayar ini.",
    "notificationDenied": "Pemberitahuan disekat dalam tetapan pelayar.",
    "notificationDefault": "Benarkan pemberitahuan untuk menerima makluman.",
    "notificationGranted": "Pemberitahuan diaktifkan.",
    "notificationRequest": "Aktifkan",
    "notificationTitle": "Pemasa tamat",
    "notificationBody": "Masa tamat.",
    "statusPaused": "Dijeda",
    "statusComplete": "Selesai",
    "errorTitle": "Ralat",
    "errorNoDuration": "Tetapkan tempoh lebih besar daripada sifar."
  },
  "no": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Fortsett",
    "reset": "Tilbakestill",
    "fullscreenEnter": "Fullskjerm",
    "fullscreenExit": "Avslutt fullskjerm",
    "durationTitle": "Varighet",
    "durationHint": "Angi varighet før du starter.",
    "hours": "Timer",
    "minutes": "Minutter",
    "seconds": "Sekunder",
    "presets": "Hurtigvalg",
    "presetMinutes": "{minutes} min",
    "alertsTitle": "Varsler",
    "soundLabel": "Lyd",
    "vibrationLabel": "Vibrasjon",
    "notificationLabel": "Varsler",
    "notificationUnsupported": "Varsler støttes ikke i denne nettleseren.",
    "notificationDenied": "Varsler er blokkert i nettleserinnstillingene.",
    "notificationDefault": "Tillat varsler for å motta påminnelser.",
    "notificationGranted": "Varsler er aktivert.",
    "notificationRequest": "Aktiver",
    "notificationTitle": "Nedtelling ferdig",
    "notificationBody": "Tiden er ute.",
    "statusPaused": "Pauset",
    "statusComplete": "Fullført",
    "errorTitle": "Feil",
    "errorNoDuration": "Angi en varighet større enn null."
  }
}
</i18n>
