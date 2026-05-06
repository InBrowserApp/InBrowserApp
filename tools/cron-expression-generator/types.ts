type CronExpressionGeneratorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  actions: {
    copy: string
    copied: string
    reset: string
  }
  output: {
    title: string
    description: string
    expressionLabel: string
    summaryLabel: string
    noteTitle: string
    noteDescription: string
  }
  presets: {
    title: string
    description: string
    items: {
      everyMinute: string
      everyFiveMinutes: string
      everyFifteenMinutes: string
      hourly: string
      dailyMidnight: string
      dailyNoon: string
      weekdayMorning: string
      weeklySunday: string
      monthlyFirstDay: string
    }
  }
  fields: {
    title: string
    description: string
    modeLabel: string
    every: string
    interval: string
    specific: string
    range: string
    intervalPrefix: string
    rangeStartLabel: string
    rangeEndLabel: string
    specificEmpty: string
    everySummary: string
    intervalSummary: string
    specificSummary: string
    rangeSummary: string
    labels: {
      minute: string
      hour: string
      dayOfMonth: string
      month: string
      dayOfWeek: string
    }
    descriptions: {
      minute: string
      hour: string
      dayOfMonth: string
      month: string
      dayOfWeek: string
    }
    units: {
      minute: string
      hour: string
      day: string
      month: string
      weekday: string
    }
  }
  nextRuns: {
    title: string
    description: string
    emptyTitle: string
    emptyDescription: string
    indexHeader: string
    dateHeader: string
    relativeHeader: string
    inMinutes: string
    inHours: string
    inDays: string
    soon: string
  }
  values: {
    months: string[]
    weekdays: string[]
  }
}>

export type { CronExpressionGeneratorMessages }
