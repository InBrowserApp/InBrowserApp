import { formatOffsetLabel, getSupportedTimeZones, getTimeZoneOffsetMs } from './timeZone'

export type TimeZoneOption = {
  label: string
  value: string
}

export function buildTimeZoneOptions(referenceTimestamp: number): TimeZoneOption[] {
  const timeZones = getSupportedTimeZones()
  return timeZones.map((timeZone) => {
    try {
      const offsetLabel = formatOffsetLabel(getTimeZoneOffsetMs(referenceTimestamp, timeZone))
      return {
        label: `${timeZone} (${offsetLabel})`,
        value: timeZone,
      }
    } catch {
      return {
        label: timeZone,
        value: timeZone,
      }
    }
  })
}
