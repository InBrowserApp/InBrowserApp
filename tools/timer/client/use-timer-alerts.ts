import { useEffectEvent, useMemo, useRef, useState } from "react"

import type { NotificationPermissionState, TimerMessages } from "../types"

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

type UseTimerAlertsArgs = Readonly<{
  messages: TimerMessages
  soundEnabled: boolean
  vibrationEnabled: boolean
  notificationEnabled: boolean
}>

function getAudioContextConstructor() {
  if (typeof window === "undefined") {
    return undefined
  }

  return window.AudioContext ?? (window as AudioWindow).webkitAudioContext
}

function getInitialNotificationPermission(): NotificationPermissionState {
  if (typeof Notification === "undefined") {
    return "unsupported"
  }

  return Notification.permission
}

function useTimerAlerts({
  messages,
  soundEnabled,
  vibrationEnabled,
  notificationEnabled,
}: UseTimerAlertsArgs) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>(getInitialNotificationPermission)

  const soundSupported = useMemo(
    () => Boolean(getAudioContextConstructor()),
    []
  )
  const vibrationSupported = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function",
    []
  )
  const notificationSupported = notificationPermission !== "unsupported"
  const showNotificationRequestButton =
    notificationSupported &&
    notificationEnabled &&
    notificationPermission === "default"
  const notificationHint = useMemo(() => {
    if (!notificationSupported) {
      return messages.notificationUnsupportedLabel
    }

    if (!notificationEnabled) {
      return ""
    }

    if (notificationPermission === "denied") {
      return messages.notificationDeniedLabel
    }

    if (notificationPermission === "default") {
      return messages.notificationDefaultLabel
    }

    return messages.notificationGrantedLabel
  }, [
    messages.notificationDefaultLabel,
    messages.notificationDeniedLabel,
    messages.notificationGrantedLabel,
    messages.notificationUnsupportedLabel,
    notificationEnabled,
    notificationPermission,
    notificationSupported,
  ])

  const unlockAudio = useEffectEvent(async () => {
    if (!soundEnabled) {
      return
    }

    const AudioContextConstructor = getAudioContextConstructor()

    if (!AudioContextConstructor) {
      return
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor()
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume()
    }
  })

  const playBeep = useEffectEvent(async () => {
    if (!soundEnabled) {
      return
    }

    await unlockAudio()

    if (!audioContextRef.current) {
      return
    }

    const context = audioContextRef.current
    const startTime = context.currentTime
    const beepDuration = 0.15
    const gap = 0.08

    for (let index = 0; index < 3; index += 1) {
      const toneStart = startTime + index * (beepDuration + gap)
      const oscillator = context.createOscillator()
      const gain = context.createGain()

      oscillator.type = "sine"
      oscillator.frequency.value = 880
      gain.gain.setValueAtTime(0, toneStart)
      gain.gain.linearRampToValueAtTime(0.2, toneStart + 0.01)
      gain.gain.linearRampToValueAtTime(0, toneStart + beepDuration)

      oscillator.connect(gain)
      gain.connect(context.destination)

      oscillator.start(toneStart)
      oscillator.stop(toneStart + beepDuration + 0.02)
    }
  })

  const triggerVibration = useEffectEvent(() => {
    if (!vibrationEnabled || !vibrationSupported) {
      return
    }

    navigator.vibrate([200, 100, 200, 100, 400])
  })

  const sendNotification = useEffectEvent(() => {
    if (
      !notificationEnabled ||
      !notificationSupported ||
      notificationPermission !== "granted"
    ) {
      return
    }

    try {
      new Notification(messages.notificationTitle, {
        body: messages.notificationBody,
      })
    } catch {
      // Ignore browser notification errors.
    }
  })

  const notifyTimerComplete = useEffectEvent(() => {
    void playBeep()
    triggerVibration()
    sendNotification()
  })

  async function handleRequestNotificationPermission() {
    if (!notificationSupported || notificationPermission !== "default") {
      return
    }

    try {
      const permission = await Notification.requestPermission()

      setNotificationPermission(permission)
    } catch {
      // Ignore permission request failures.
    }
  }

  return {
    soundSupported,
    vibrationSupported,
    notificationSupported,
    notificationHint,
    showNotificationRequestButton,
    unlockAudio,
    notificationPermission,
    requestNotificationPermission: handleRequestNotificationPermission,
    notifyTimerComplete,
  }
}

export { useTimerAlerts }
