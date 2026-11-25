import type English from "./messages/en.json"

const ramps = [
  { label: "red", end: "#ff0000" },
  { label: "green", end: "#00ff00" },
  { label: "blue", end: "#0000ff" },
] as const

const graySteps = Array.from({ length: 16 }, (_, index) => index * 17)
const blackLevels = [0, 4, 8, 12, 16, 20, 24, 32]
const whiteLevels = [223, 231, 235, 239, 243, 247, 251, 255]

export const patterns = ["grayscale", "rgb", "black", "white"] as const
export type PatternName = (typeof patterns)[number]

function gray(level: number) {
  return `rgb(${level} ${level} ${level})`
}

function ramp(end: string) {
  return `linear-gradient(90deg, #000000, ${end})`
}

export function Pattern({
  selected,
  messages,
  number,
}: {
  selected: PatternName
  messages: typeof English
  number: Intl.NumberFormat
}) {
  if (selected === "grayscale") {
    return (
      <div className="grid h-full grid-rows-[auto_minmax(0,2fr)_auto_minmax(0,1fr)] gap-2 bg-card p-4">
        <div className="text-sm font-medium">{messages.smoothGrayscale}</div>
        <div
          role="img"
          aria-label={messages.smoothGrayscale}
          className="forced-color-adjust-none"
          style={{ backgroundImage: ramp("#ffffff") }}
        />
        <div className="pt-2 text-sm font-medium">
          {messages.grayscaleSteps}
        </div>
        <div
          dir="ltr"
          role="img"
          aria-label={messages.grayscaleSteps}
          className="grid grid-cols-16 forced-color-adjust-none"
        >
          {graySteps.map((level) => (
            <span key={level} style={{ backgroundColor: gray(level) }} />
          ))}
        </div>
      </div>
    )
  }

  if (selected === "rgb") {
    return (
      <div className="flex h-full flex-col gap-3 bg-card p-4">
        {ramps.map(({ label, end }) => (
          <div key={label} className="flex min-h-0 flex-1 flex-col gap-1.5">
            <div className="text-sm font-medium">{messages[label]}</div>
            <div
              role="img"
              aria-label={messages[label]}
              className="flex-1 forced-color-adjust-none"
              style={{ backgroundImage: ramp(end) }}
            />
          </div>
        ))}
      </div>
    )
  }

  const isBlack = selected === "black"
  const values = isBlack ? blackLevels : whiteLevels
  return (
    <div
      role="group"
      aria-label={messages[selected]}
      className="flex h-full flex-col justify-center gap-3 p-4 forced-color-adjust-none"
      style={{
        backgroundColor: isBlack ? "#000000" : "#ffffff",
        color: isBlack ? "#ffffff" : "#000000",
      }}
    >
      <div
        dir="ltr"
        className="grid h-[55%] min-h-16 grid-cols-8"
        aria-hidden="true"
      >
        {values.map((level) => (
          <span key={level} style={{ backgroundColor: gray(level) }} />
        ))}
      </div>
      <div
        dir="ltr"
        className="grid grid-cols-8 text-center text-xs tabular-nums"
      >
        {values.map((level) => (
          <span key={level}>{number.format(level)}</span>
        ))}
      </div>
    </div>
  )
}
