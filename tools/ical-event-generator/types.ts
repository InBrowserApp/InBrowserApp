export type IcalEventGeneratorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  actions: {
    useSample: string
    reset: string
    copy: string
    copied: string
    download: string
    regenerateUid: string
    addReminder: string
    removeReminder: string
  }
  sample: {
    title: string
    location: string
    description: string
  }
  details: {
    title: string
    description: string
    summaryLabel: string
    summaryPlaceholder: string
    locationLabel: string
    urlLabel: string
    notesLabel: string
    notesPlaceholder: string
    uidLabel: string
  }
  schedule: {
    title: string
    description: string
    allDayLabel: string
    timeZoneLabel: string
    outputModeLabel: string
    outputUtcLabel: string
    outputTzidLabel: string
    startDateLabel: string
    startTimeLabel: string
    endDateLabel: string
    endTimeLabel: string
    allDayHint: string
  }
  recurrence: {
    title: string
    description: string
    frequencyLabel: string
    noneLabel: string
    dailyLabel: string
    weeklyLabel: string
    monthlyLabel: string
    yearlyLabel: string
    intervalLabel: string
    weekdaysLabel: string
    monthDayLabel: string
    monthLabel: string
    endsLabel: string
    neverLabel: string
    afterCountLabel: string
    onDateLabel: string
    countLabel: string
    untilDateLabel: string
    untilTimeLabel: string
  }
  reminders: {
    title: string
    description: string
    enabledLabel: string
    leadTimeLabel: string
    minutesLabel: string
    hoursLabel: string
    daysLabel: string
    weeksLabel: string
  }
  output: {
    title: string
    description: string
    validation: {
      invalidStartDate: string
      invalidEndDate: string
      invalidStartTime: string
      invalidEndTime: string
      endBeforeStart: string
      invalidUntilDate: string
      invalidUntilTime: string
    }
  }
}>
