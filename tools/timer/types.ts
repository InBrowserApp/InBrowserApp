type NotificationPermissionState = NotificationPermission | "unsupported"

type TimerMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  startLabel: string
  resumeLabel: string
  pauseLabel: string
  resetLabel: string
  fullscreenEnterLabel: string
  fullscreenExitLabel: string
  durationLabel: string
  durationHintLabel: string
  hoursLabel: string
  minutesLabel: string
  secondsLabel: string
  quickPresetsLabel: string
  presetMinutesLabel: string
  alertsLabel: string
  soundLabel: string
  vibrationLabel: string
  notificationsLabel: string
  notificationUnsupportedLabel: string
  notificationDeniedLabel: string
  notificationDefaultLabel: string
  notificationGrantedLabel: string
  notificationRequestLabel: string
  notificationTitle: string
  notificationBody: string
  errorNoDurationLabel: string
}>

type TimerClientProps = Readonly<{
  messages: TimerMessages
}>

export type { NotificationPermissionState, TimerClientProps, TimerMessages }
