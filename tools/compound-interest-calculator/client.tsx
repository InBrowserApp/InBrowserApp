import { parseNumber } from "@workspace/localized-number"
import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/ui/input-group"
import { RotateCcw } from "@workspace/ui/icons"
import { useId, useState } from "react"

import { Projection } from "./components/projection"
import { projectCompoundInterest } from "./core/compound-interest"

import type { ContributionTiming, Frequency } from "./core/compound-interest"
import type { CalculatorMessages } from "./types"

const example = {
  initialAmount: 10_000,
  monthlyContribution: 100,
  annualRate: 5,
  years: 10,
}

const exampleFrequency: Frequency = "monthly"
const exampleTiming: ContributionTiming = "end"

type FieldName = keyof typeof example

function exampleFields(lang: string) {
  const integer = new Intl.NumberFormat(lang, { useGrouping: false })
  return Object.fromEntries(
    Object.entries(example).map(([key, value]) => [key, integer.format(value)])
  ) as Record<FieldName, string>
}

function readNumber(raw: string, lang: string, empty = NaN) {
  const result = parseNumber(raw, lang)
  if (result.kind === "empty") return empty
  return result.kind === "valid" ? result.value : NaN
}

function ChoiceField<Value extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: Value
  options: Record<Value, string>
  onChange: (value: Value) => void
}) {
  return (
    <Field className="col-span-2 gap-2">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value}
        className="min-h-10 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        onChange={(event) => onChange(event.currentTarget.value as Value)}
      >
        {Object.entries(options).map(([key, text]) => (
          <option key={key} value={key} className="bg-background">
            {text as string}
          </option>
        ))}
      </select>
    </Field>
  )
}

export default function Calculator({
  lang,
  messages,
}: {
  lang: string
  messages: CalculatorMessages
}) {
  const id = useId()
  const [fields, setFields] = useState(() => exampleFields(lang))
  const [frequency, setFrequency] = useState<Frequency>(exampleFrequency)
  const [timing, setTiming] = useState<ContributionTiming>(exampleTiming)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const initialAmount = readNumber(fields.initialAmount, lang, 0)
  const monthlyContribution = readNumber(fields.monthlyContribution, lang, 0)
  const annualRate = readNumber(fields.annualRate, lang)
  const years = readNumber(fields.years, lang)
  const errors = {
    initialAmount: initialAmount >= 0 ? undefined : messages.amountError,
    monthlyContribution:
      monthlyContribution >= 0 ? undefined : messages.amountError,
    annualRate:
      annualRate >= -100 && annualRate <= 100 ? undefined : messages.rateError,
    years:
      Number.isInteger(years) && years >= 1 && years <= 100
        ? undefined
        : messages.yearsError,
  }
  const valid = !Object.values(errors).some(Boolean)
  const projection = valid
    ? projectCompoundInterest({
        initialAmount,
        monthlyContribution,
        annualRate,
        years,
        frequency,
        timing,
      })
    : undefined
  const last = projection?.at(-1)
  const percentSign = new Intl.NumberFormat(lang, { style: "percent" })
    .formatToParts(1)
    .find((part) => part.type === "percentSign")!.value
  const suffixes: Partial<Record<FieldName, string>> = {
    annualRate: percentSign,
    years: messages.yearsUnit,
  }

  function reset() {
    setFields(exampleFields(lang))
    setFrequency(exampleFrequency)
    setTiming(exampleTiming)
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <Card>
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{messages.assumptions}</CardTitle>
          <Button type="button" variant="ghost" size="sm" onClick={reset}>
            <RotateCcw aria-hidden="true" data-icon="inline-start" />
            {messages.reset}
          </Button>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid grid-cols-2 gap-x-3 gap-y-4">
            {(Object.keys(example) as FieldName[]).map((name) => {
              const fieldId = id + name
              const error = errors[name]
              const suffix = suffixes[name]
              const description = [
                suffix && fieldId + "-unit",
                error && fieldId + "-error",
              ]
                .filter(Boolean)
                .join(" ")
              return (
                <Field
                  key={name}
                  className={cn("min-w-0 gap-2", !suffix && "col-span-2")}
                  data-invalid={Boolean(error)}
                >
                  <FieldLabel htmlFor={fieldId}>{messages[name]}</FieldLabel>
                  <InputGroup className="h-10">
                    <InputGroupInput
                      id={fieldId}
                      dir="ltr"
                      inputMode={name === "years" ? "numeric" : "decimal"}
                      value={fields[name]}
                      aria-invalid={Boolean(error)}
                      aria-describedby={description || undefined}
                      autoComplete="off"
                      spellCheck={false}
                      onChange={(event) => {
                        const value = event.currentTarget.value
                        setFields((current) => ({ ...current, [name]: value }))
                      }}
                    />
                    {suffix && (
                      <InputGroupAddon
                        align="inline-end"
                        className="rtl:pr-0 rtl:pl-2"
                      >
                        <InputGroupText id={fieldId + "-unit"}>
                          {suffix}
                        </InputGroupText>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                  {error && (
                    <FieldError role="status" id={fieldId + "-error"}>
                      {error}
                    </FieldError>
                  )}
                </Field>
              )
            })}
            <ChoiceField
              id={id + "-frequency"}
              label={messages.frequency}
              value={frequency}
              options={messages.frequencies}
              onChange={setFrequency}
            />
            <ChoiceField
              id={id + "-timing"}
              label={messages.timing}
              value={timing}
              options={messages.timings}
              onChange={setTiming}
            />
          </FieldGroup>
        </CardContent>
      </Card>
      {projection &&
      last &&
      Number.isFinite(last.balance) &&
      Number.isFinite(last.contributed) ? (
        <Projection
          lang={lang}
          messages={messages}
          rows={projection}
          final={last}
          showBreakdown={showBreakdown}
          onToggleBreakdown={setShowBreakdown}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{messages.endingBalance}</CardTitle>
          </CardHeader>
          <CardContent>
            <p role="status" className="text-sm text-muted-foreground">
              {valid ? messages.resultError : messages.resultPending}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
