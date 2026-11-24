import { useId, useState } from "react"
import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Sparkles } from "@workspace/ui/icons"
import {
  emptyDms,
  formatDms,
  fromDecimal,
  normalizeDecimal,
  toDecimal,
  type Dms,
} from "./core/coordinates"
import type english from "./messages/en.json"

export type Messages = { readonly [Key in keyof typeof english]: string }

const axes = [
  {
    label: "latitude",
    limit: 90,
    positive: "north",
    negative: "south",
    letters: ["N", "S"],
    example: "35.68124",
  },
  {
    label: "longitude",
    limit: 180,
    positive: "east",
    negative: "west",
    letters: ["E", "W"],
    example: "139.76709",
  },
] as const
const parts = ["degrees", "minutes", "seconds"] as const

type Coordinate = { decimal: string; dms: Dms; invalid: boolean }

function updateDecimal(decimal: string, limit: number): Coordinate {
  const dms = fromDecimal(decimal, limit)
  return {
    decimal,
    dms: dms ?? emptyDms,
    invalid: decimal.trim() !== "" && !dms,
  }
}

function updateDms(dms: Dms, limit: number): Coordinate {
  const decimal = toDecimal(dms, limit)
  return {
    dms,
    decimal: decimal ?? "",
    invalid: dms.degrees.trim() !== "" && decimal === undefined,
  }
}

function initialCoordinates(example = false): [Coordinate, Coordinate] {
  const [latitude, longitude] = axes
  return [
    updateDecimal(example ? latitude.example : "", latitude.limit),
    updateDecimal(example ? longitude.example : "", longitude.limit),
  ]
}

export default function Client({ messages }: Readonly<{ messages: Messages }>) {
  const id = useId()
  const [coords, setCoords] = useState(() => initialCoordinates())
  const bothValid = coords.every(
    ({ decimal, invalid }) => decimal !== "" && !invalid
  )
  const copyProps = { copyLabel: messages.copy, copiedLabel: messages.copied }

  function update(index: number, value: Coordinate) {
    setCoords((current) =>
      index === 0 ? [value, current[1]] : [current[0], value]
    )
  }

  return (
    <div className="grid gap-4">
      <Button
        variant="outline"
        size="sm"
        className="justify-self-start"
        onClick={() => setCoords(initialCoordinates(true))}
      >
        <Sparkles aria-hidden="true" />
        {messages.example}
      </Button>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{messages.decimal}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {axes.map(({ label, limit, example }, index) => (
              <label key={label} className="grid gap-1.5 text-sm font-medium">
                {messages[label]}
                <Input
                  dir="ltr"
                  inputMode="decimal"
                  className="font-mono"
                  placeholder={example}
                  value={coords[index]!.decimal}
                  aria-invalid={
                    coords[index]!.invalid && coords[index]!.decimal !== ""
                  }
                  aria-describedby={coords[index]!.invalid ? id : undefined}
                  onChange={(event) =>
                    update(index, updateDecimal(event.target.value, limit))
                  }
                />
              </label>
            ))}
            <ToolCopyButton
              className="justify-self-start"
              {...copyProps}
              ariaLabel={`${messages.copy} (${messages.decimal})`}
              value={
                bothValid
                  ? coords
                      .map(({ decimal }) => normalizeDecimal(decimal))
                      .join(", ")
                  : ""
              }
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{messages.dms}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {axes.map(({ label, limit, positive, negative }, index) => {
              const { dms, invalid } = coords[index]!
              return (
                <fieldset
                  key={label}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  <legend className="mb-1.5 text-sm font-medium">
                    {messages[label]}
                  </legend>
                  {parts.map((part) => (
                    <label
                      key={part}
                      className="grid gap-1 text-xs text-muted-foreground"
                    >
                      {messages[part]}
                      <Input
                        dir="ltr"
                        inputMode="decimal"
                        className="font-mono text-foreground"
                        placeholder="0"
                        value={dms[part]}
                        aria-invalid={invalid && dms.degrees !== ""}
                        aria-describedby={invalid ? id : undefined}
                        onChange={(event) =>
                          update(
                            index,
                            updateDms(
                              { ...dms, [part]: event.target.value },
                              limit
                            )
                          )
                        }
                      />
                    </label>
                  ))}
                  <label className="grid gap-1 text-xs text-muted-foreground">
                    {messages.hemisphere}
                    <select
                      value={dms.negative ? "negative" : "positive"}
                      onChange={(event) =>
                        update(
                          index,
                          updateDms(
                            {
                              ...dms,
                              negative: event.target.value === "negative",
                            },
                            limit
                          )
                        )
                      }
                      className="h-9 min-w-0 rounded-md border border-input bg-background px-1.5 text-sm text-foreground"
                    >
                      <option value="positive">{messages[positive]}</option>
                      <option value="negative">{messages[negative]}</option>
                    </select>
                  </label>
                </fieldset>
              )
            })}
            <ToolCopyButton
              className="justify-self-start"
              {...copyProps}
              ariaLabel={`${messages.copy} (${messages.dms})`}
              value={
                bothValid
                  ? axes
                      .map(({ letters: [positive, negative] }, index) =>
                        formatDms(coords[index]!.dms, positive, negative)
                      )
                      .join(", ")
                  : ""
              }
            />
          </CardContent>
        </Card>
      </div>
      {coords.some(({ invalid }) => invalid) && (
        <p role="status" id={id} className="text-sm text-destructive">
          {messages.invalid}
        </p>
      )}
    </div>
  )
}
