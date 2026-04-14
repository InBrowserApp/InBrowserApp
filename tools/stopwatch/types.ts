type StopwatchMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  startLabel: string
  resumeLabel: string
  pauseLabel: string
  lapLabel: string
  resetLabel: string
  lapsLabel: string
  clearLabel: string
  exportLabel: string
  noLapsLabel: string
  lapsDescription: string
  statusRunningLabel: string
  statusPausedLabel: string
  lapTimeLabel: string
  totalTimeLabel: string
  lapMillisecondsLabel: string
  totalMillisecondsLabel: string
}>

type StopwatchClientProps = Readonly<{
  messages: StopwatchMessages
}>

export type { StopwatchClientProps, StopwatchMessages }
