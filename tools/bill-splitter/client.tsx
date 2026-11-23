import { useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Card } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

import {
  parseDecimal,
  parsePeople,
  splitBill,
  splitMethods,
} from "./core/split"

import type { SplitMethod } from "./core/split"
import type english from "./messages/en.json"

export type Messages = typeof english

type Person = {
  name?: string
  fixed?: string
  weighted?: string
}

function BillSplitter({
  lang,
  messages,
}: {
  lang: string
  messages: Messages
}) {
  const [total, setTotal] = useState("")
  const [people, setPeople] = useState("3")
  const [method, setMethod] = useState<SplitMethod>("equal")
  const [details, setDetails] = useState<Record<number, Person>>({})

  const amount = parseDecimal(total, 2)
  const count = parsePeople(people)
  const totalError = Boolean(total.trim()) && amount === null
  const peopleError = count === null
  const amountFormat = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  const personNumber = new Intl.NumberFormat(lang)
  const formatAmount = (cents: bigint) =>
    amountFormat.format(Number(cents) / 100)
  const rows = Array.from({ length: count ?? 0 }, (_, index) => {
    const entry = details[index]
    const placeholder = messages.person.replace(
      "{number}",
      personNumber.format(index + 1)
    )
    return {
      index,
      name: entry?.name ?? "",
      placeholder,
      value:
        method === "weighted" ? (entry?.weighted ?? "1") : (entry?.fixed ?? ""),
    }
  })
  const split =
    amount !== null && count !== null
      ? splitBill(
          amount,
          method,
          rows.map(({ value }) => value)
        )
      : null
  const error = split && "error" in split ? split : null
  const breakdown =
    split && "amounts" in split
      ? split.amounts.map((value, index) => {
          const row = rows[index]!
          return {
            name: row.name.trim() || row.placeholder,
            amount: formatAmount(value),
          }
        })
      : null
  const formattedTotal = formatAmount(amount ?? 0n)
  const copyText = breakdown
    ? [
        ...breakdown.map(({ name, amount }) => `${name}\t${amount}`),
        `${messages.total}\t${formattedTotal}`,
      ].join("\n")
    : ""
  const valueLabel =
    method === "weighted" ? messages.weight : messages.fixedAmount
  const methodHint =
    method === "weighted" ? messages.weightHint : messages.fixedHint

  function editPerson(index: number, field: keyof Person, value: string) {
    setDetails((current) => ({
      ...current,
      [index]: { ...current[index], [field]: value },
    }))
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
      <Card className="gap-5 p-4 sm:p-5">
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-4">
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="bill-total">{messages.total}</Label>
            <Input
              id="bill-total"
              className="h-11 tabular-nums"
              inputMode="decimal"
              placeholder={formatAmount(0n)}
              value={total}
              onChange={(event) => setTotal(event.target.value)}
              aria-invalid={totalError}
              aria-describedby={totalError ? "bill-total-error" : undefined}
            />
            {totalError && (
              <p id="bill-total-error" className="text-sm text-destructive">
                {messages.totalError}
              </p>
            )}
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor="bill-people">{messages.people}</Label>
            <Input
              id="bill-people"
              className="h-11 tabular-nums"
              inputMode="numeric"
              value={people}
              onChange={(event) => setPeople(event.target.value)}
              aria-invalid={peopleError}
              aria-describedby={peopleError ? "bill-people-error" : undefined}
            />
            {peopleError && (
              <p id="bill-people-error" className="text-sm text-destructive">
                {messages.peopleError}
              </p>
            )}
          </div>
        </div>

        <fieldset className="min-w-0">
          <legend className="mb-2 text-sm font-medium">
            {messages.method}
          </legend>
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
            {splitMethods.map((option) => (
              <label key={option} className="relative min-w-0">
                <input
                  type="radio"
                  name="bill-split-method"
                  value={option}
                  className="peer sr-only"
                  checked={method === option}
                  onChange={() => setMethod(option)}
                />
                <span className="flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-1.5 py-1.5 text-center text-sm leading-tight font-medium break-words text-muted-foreground peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-xs peer-focus-visible:ring-2 peer-focus-visible:ring-ring sm:px-2">
                  {messages[option]}
                </span>
              </label>
            ))}
          </div>
          {method !== "equal" && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {methodHint}
            </p>
          )}
        </fieldset>

        {rows.length > 0 && (
          <div className="grid gap-2">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] gap-3 text-sm font-medium">
              <span>{messages.names}</span>
              {method !== "equal" && <span>{valueLabel}</span>}
            </div>
            {rows.map(({ index, name, placeholder, value }) => (
              <div
                key={index}
                className={
                  method === "equal"
                    ? undefined
                    : "grid grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] gap-3"
                }
              >
                <Input
                  className="h-10"
                  aria-label={`${messages.names} · ${placeholder}`}
                  dir={name ? "auto" : undefined}
                  value={name}
                  placeholder={placeholder}
                  onChange={(event) =>
                    editPerson(index, "name", event.target.value)
                  }
                />
                {method !== "equal" && (
                  <Input
                    className="h-10 tabular-nums"
                    aria-label={`${valueLabel} · ${placeholder}`}
                    aria-invalid={error?.index === index}
                    aria-describedby={
                      error?.index === index ? "bill-method-error" : undefined
                    }
                    inputMode="decimal"
                    value={value}
                    onChange={(event) =>
                      editPerson(index, method, event.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {error && (
          <p
            id="bill-method-error"
            role="status"
            className="text-sm text-destructive"
          >
            {messages[error.error]}
          </p>
        )}
      </Card>

      <Card className="bg-muted/35 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold">
            {messages.result}
          </h2>
          <ToolCopyButton
            value={copyText}
            copyLabel={messages.copy}
            copiedLabel={messages.copied}
            failedLabel={messages.copyFailed}
            className="h-auto min-h-9 max-w-full min-w-0 whitespace-normal"
          />
        </div>
        {breakdown ? (
          <div className="overflow-hidden rounded-lg border bg-background">
            <ul className="divide-y">
              {breakdown.map(({ name, amount }, index) => (
                <li
                  key={index}
                  className="flex items-baseline justify-between gap-3 px-3 py-2.5 sm:px-4"
                >
                  <bdi className="min-w-0 break-words">{name}</bdi>
                  <bdi className="shrink-0 font-medium tabular-nums">
                    {amount}
                  </bdi>
                </li>
              ))}
            </ul>
            <div className="flex items-baseline justify-between gap-3 border-t bg-muted/50 px-3 py-3 font-semibold sm:px-4">
              <span>{messages.total}</span>
              <bdi className="text-base tabular-nums">{formattedTotal}</bdi>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
            {totalError || peopleError || error
              ? messages.unavailable
              : messages.empty}
          </p>
        )}
      </Card>
    </div>
  )
}

export default BillSplitter
