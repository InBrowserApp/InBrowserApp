const meters = { millimeter: 0.001, meter: 1, inch: 0.0254 }

export type LengthUnit = keyof typeof meters

export function modelLengthFormat(
  lang: string,
  source?: LengthUnit,
  display = source
) {
  const formatter = new Intl.NumberFormat(lang, {
    maximumSignificantDigits: 5,
    ...(display && { style: "unit", unit: display, unitDisplay: "short" }),
  })
  const scale = source && display ? meters[source] / meters[display] : 1
  return (length: number) => formatter.format(length * scale)
}
