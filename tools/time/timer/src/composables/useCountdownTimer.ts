import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFullscreen, useNow, useStorage } from '@vueuse/core'
import Pause16Regular from '@vicons/fluent/Pause16Regular'
import Play16Regular from '@vicons/fluent/Play16Regular'
import { formatCountdown } from '../utils/format'

type CountdownI18n = {
  start: () => string
  resume: () => string
  pause: () => string
  errorNoDuration: () => string
  notificationTitle: () => string
  notificationBody: () => string
  notificationUnsupported: () => string
  notificationDenied: () => string
  notificationDefault: () => string
  notificationGranted: () => string
}

export const useCountdownTimer = (i18n: CountdownI18n) => {
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

  const startLabel = computed(() => {
    if (displayRemainingMs.value === 0 || displayRemainingMs.value === durationMs.value) {
      return i18n.start()
    }
    return i18n.resume()
  })

  const toggleLabel = computed(() => (running.value ? i18n.pause() : startLabel.value))
  const toggleIcon = computed(() => (running.value ? Pause16Regular : Play16Regular))

  const canReset = computed(
    () => !running.value && durationMs.value > 0 && displayRemainingMs.value !== durationMs.value,
  )

  const notificationPermission = ref<NotificationPermission | 'unsupported'>(
    notificationSupported ? Notification.permission : 'unsupported',
  )
  const notificationHint = computed(() => {
    if (!notificationSupported) return i18n.notificationUnsupported()
    if (!notificationEnabled.value) return ''
    if (notificationPermission.value === 'denied') return i18n.notificationDenied()
    if (notificationPermission.value === 'default') return i18n.notificationDefault()
    return i18n.notificationGranted()
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
      new Notification(i18n.notificationTitle(), {
        body: i18n.notificationBody(),
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
      errorMessage.value = i18n.errorNoDuration()
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

  const toggleRun = async () => {
    if (running.value) {
      pause()
      return
    }
    await start()
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

  return {
    fullscreenTarget,
    fullscreenAvailable,
    isFullscreenActive,
    isFullscreenOverlay,
    formattedRemaining,
    toggleLabel,
    toggleIcon,
    canReset,
    hours,
    minutes,
    seconds,
    running,
    remainingMs,
    presetMinutes,
    soundEnabled,
    vibrationEnabled,
    notificationEnabled,
    soundSupported,
    vibrationSupported,
    notificationSupported,
    notificationPermission,
    notificationHint,
    updateHours,
    updateMinutes,
    updateSeconds,
    applyPreset,
    start,
    pause,
    toggleRun,
    reset,
    enterFullscreen,
    exitFullscreen,
    setBodyOverflow,
    requestNotificationPermission,
    errorMessage,
  }
}
