import type { CronFieldId, CronPresetId } from "./core/cron"

type CronExpressionParserMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  input: {
    title: string
    description: string
    label: string
    placeholder: string
    valid: string
    empty: string
    invalid: string
    timezoneNote: string
    copy: string
    copied: string
    reset: string
  }
  presets: {
    title: string
    description: string
    items: Record<CronPresetId, string>
  }
  breakdown: {
    title: string
    description: string
    field: string
    value: string
    allowedRange: string
    fields: Record<CronFieldId, string>
  }
  schedule: {
    title: string
    description: string
    summaryLabel: string
    dateTimeLabel: string
    relativeLabel: string
    emptyTitle: string
    emptyDescription: string
  }
  relative: {
    now: string
    inSeconds: string
    inMinutes: string
    inHours: string
    inDays: string
  }
}>

type CronExpressionParserClientProps = Readonly<{
  language: string
  messages: CronExpressionParserMessages
}>

export type { CronExpressionParserClientProps, CronExpressionParserMessages }
