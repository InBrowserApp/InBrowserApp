import { simpleFaker } from "@faker-js/faker"

export type DateFormat = "iso" | "localized"

type DateOptions = Readonly<{
  start: string
  end: string
  format: DateFormat
  count: number
  lang: string
}>

export function generateDates({
  start,
  end,
  format,
  count,
  lang,
}: DateOptions) {
  const range = {
    from: `${start}T00:00:00.000Z`,
    to: `${end}T23:59:59.999Z`,
  }
  const formatter =
    format === "localized"
      ? new Intl.DateTimeFormat(lang, {
          dateStyle: "medium",
          calendar: "gregory",
          timeZone: "UTC",
        })
      : null

  return Array.from({ length: count }, () => {
    const date = simpleFaker.date.between(range)
    return formatter ? formatter.format(date) : date.toISOString().slice(0, 10)
  })
}
