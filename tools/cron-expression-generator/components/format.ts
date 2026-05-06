import {
  CRON_FIELD_NAMES,
  formatCronField,
  getCronFieldConfig,
  normalizeCronFieldState,
  type CronFieldName,
  type CronFieldState,
  type CronFormState,
} from "../core/cron"

import type { CronExpressionGeneratorMessages } from "../types"

function formatMessage(
  template: string,
  values: Record<string, string | number>
) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    values[key] === undefined ? match : String(values[key])
  )
}

function getFieldLabel(
  messages: CronExpressionGeneratorMessages,
  fieldName: CronFieldName
) {
  return messages.fields.labels[fieldName]
}

function getFieldOptions(
  messages: CronExpressionGeneratorMessages,
  fieldName: CronFieldName
) {
  const config = getCronFieldConfig(fieldName)
  const options: Array<{ value: number; label: string }> = []

  for (let value = config.min; value <= config.max; value += 1) {
    options.push({
      value,
      label: formatFieldValue(messages, fieldName, value),
    })
  }

  return options
}

function formatFieldValue(
  messages: CronExpressionGeneratorMessages,
  fieldName: CronFieldName,
  value: number
) {
  if (fieldName === "month") {
    return messages.values.months[value - 1] ?? String(value)
  }

  if (fieldName === "dayOfWeek") {
    return messages.values.weekdays[value] ?? String(value)
  }

  return String(value)
}

function formatSpecificValues(
  messages: CronExpressionGeneratorMessages,
  fieldName: CronFieldName,
  values: readonly number[]
) {
  return values
    .map((value) => formatFieldValue(messages, fieldName, value))
    .join(", ")
}

function formatCronFieldSummary(
  messages: CronExpressionGeneratorMessages,
  fieldName: CronFieldName,
  state: CronFieldState
) {
  const normalized = normalizeCronFieldState(fieldName, state)
  const field = getFieldLabel(messages, fieldName)
  const config = getCronFieldConfig(fieldName)

  if (normalized.mode === "interval") {
    return formatMessage(messages.fields.intervalSummary, {
      interval: normalized.interval,
      unit: messages.fields.units[config.unit],
    })
  }

  if (normalized.mode === "specific") {
    if (normalized.specificValues.length === 0) {
      return formatMessage(messages.fields.everySummary, { field })
    }

    return formatMessage(messages.fields.specificSummary, {
      field,
      values: formatSpecificValues(
        messages,
        fieldName,
        normalized.specificValues
      ),
    })
  }

  if (normalized.mode === "range") {
    return formatMessage(messages.fields.rangeSummary, {
      field,
      start: formatFieldValue(messages, fieldName, normalized.rangeStart),
      end: formatFieldValue(messages, fieldName, normalized.rangeEnd),
    })
  }

  return formatMessage(messages.fields.everySummary, { field })
}

function summarizeCronForm(
  messages: CronExpressionGeneratorMessages,
  state: CronFormState
) {
  return CRON_FIELD_NAMES.map((fieldName) => ({
    fieldName,
    label: getFieldLabel(messages, fieldName),
    expression: formatCronField(fieldName, state[fieldName]),
    summary: formatCronFieldSummary(messages, fieldName, state[fieldName]),
  }))
}

export {
  formatCronFieldSummary,
  formatFieldValue,
  formatMessage,
  getFieldLabel,
  getFieldOptions,
  summarizeCronForm,
}
