import { useEffect, useId, useRef, useState, type FormEvent } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Card, CardContent } from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Plus, Trash2 } from "@workspace/ui/icons"

import { planSubnets, type Requirement, type SubnetType } from "./core/plan"
import { PlanResults } from "./plan-results"
import type english from "./messages/en.json"

export type Messages = typeof english
type Row = Requirement & { id: number }
type FormResult = ReturnType<typeof planSubnets>

const EMPTY_ROW: Requirement = { name: "", hosts: "", type: "standard" }
const EXAMPLE_PARENT = "192.168.10.0/24"
const EXAMPLE_ROWS: Requirement[] = [
  { name: "VLAN 10", hosts: "100", type: "standard" },
  { name: "VLAN 20", hosts: "50", type: "standard" },
  { name: "VLAN 30", hosts: "20", type: "standard" },
  { name: "R1–R2", hosts: "", type: "pointToPoint" },
]

export default function Client({
  messages,
  language,
}: {
  messages: Messages
  language: string
}) {
  const id = useId()
  const nextId = useRef(1)
  const form = useRef<HTMLFormElement>(null)
  const nextFocus = useRef<number>(null)
  const [parent, setParent] = useState("")
  const [rows, setRows] = useState<Row[]>([{ id: 0, ...EMPTY_ROW }])
  const [result, setResult] = useState<FormResult>()
  const parentError = result?.status === "invalidParent"

  useEffect(() => {
    if (nextFocus.current === null) return
    form.current
      ?.querySelector<HTMLInputElement>(
        `[data-subnet-name="${nextFocus.current}"]`
      )
      ?.focus()
    nextFocus.current = null
  }, [rows])

  function editRows(update: (current: Row[]) => Row[]) {
    setRows(update)
    setResult(undefined)
  }

  function updateRow(rowId: number, change: Partial<Requirement>) {
    editRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, ...change } : row))
    )
  }

  function addRow() {
    const row = { ...EMPTY_ROW, id: nextId.current++ }
    nextFocus.current = row.id
    editRows((current) => [...current, row])
  }

  function removeRow(index: number) {
    const row = rows[index]!
    nextFocus.current = (rows[index + 1] ?? rows[index - 1])!.id
    editRows((current) => current.filter((entry) => entry.id !== row.id))
  }

  function subnetName(index: number) {
    return `${messages.subnet} ${index + 1}`
  }

  function loadExample() {
    setParent(EXAMPLE_PARENT)
    setRows(EXAMPLE_ROWS.map((row) => ({ ...row, id: nextId.current++ })))
    setResult(planSubnets(EXAMPLE_PARENT, EXAMPLE_ROWS, language))
  }

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const requirements = rows.map((row, index) => ({
      ...row,
      name: row.name.trim() || subnetName(index),
    }))
    const response = planSubnets(parent, requirements, language)
    setResult(response)
    if (response.status === "invalidParent") {
      event.currentTarget.querySelector<HTMLElement>('[name="parent"]')?.focus()
    }
    if (response.status === "invalidHosts") {
      event.currentTarget
        .querySelectorAll<HTMLElement>('[name="hosts"]')
        [response.index]?.focus()
    }
  }

  return (
    <div className="grid min-w-0 gap-5">
      <Card>
        <CardContent>
          <form
            ref={form}
            noValidate
            onSubmit={calculate}
            className="grid gap-5"
          >
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="grid w-full max-w-sm gap-1.5">
                <label htmlFor={`${id}-parent`} className="text-sm font-medium">
                  {messages.parent}
                </label>
                <Input
                  id={`${id}-parent`}
                  name="parent"
                  type="text"
                  dir="ltr"
                  value={parent}
                  placeholder={EXAMPLE_PARENT}
                  className="font-mono"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={parentError}
                  aria-describedby={
                    parentError ? `${id}-parent-error` : undefined
                  }
                  onChange={(event) => {
                    setParent(event.target.value)
                    setResult(undefined)
                  }}
                />
                {parentError && (
                  <p
                    id={`${id}-parent-error`}
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {messages.invalidParent}
                  </p>
                )}
              </div>
              <Button type="button" variant="outline" onClick={loadExample}>
                {messages.example}
              </Button>
            </div>

            <fieldset className="grid min-w-0 gap-2">
              <legend className="mb-2 text-sm font-medium">
                {messages.requirements}
              </legend>
              {rows.map((row, index) => {
                const hostsError =
                  result?.status === "invalidHosts" && result.index === index
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] items-start gap-2 rounded-md border bg-muted/30 p-3 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,0.75fr)_auto]"
                  >
                    <label className="col-span-2 grid min-w-0 gap-1 text-xs font-medium sm:col-span-1">
                      {messages.name}
                      <Input
                        data-subnet-name={row.id}
                        placeholder={subnetName(index)}
                        value={row.name}
                        onChange={(event) =>
                          updateRow(row.id, { name: event.target.value })
                        }
                      />
                    </label>
                    <label className="col-start-1 row-start-2 grid min-w-0 gap-1 text-xs font-medium sm:col-start-auto sm:row-start-auto">
                      {messages.type}
                      <select
                        value={row.type}
                        className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        onChange={(event) =>
                          updateRow(row.id, {
                            type: event.target.value as SubnetType,
                          })
                        }
                      >
                        <option value="standard">{messages.standard}</option>
                        <option value="pointToPoint">
                          {messages.pointToPoint}
                        </option>
                        <option value="singleHost">
                          {messages.singleHost}
                        </option>
                      </select>
                    </label>
                    <label className="col-start-2 row-start-2 grid min-w-0 gap-1 text-xs font-medium sm:col-start-auto sm:row-start-auto">
                      {messages.hosts}
                      <Input
                        name="hosts"
                        inputMode="numeric"
                        dir="ltr"
                        placeholder="50"
                        value={
                          row.type === "standard"
                            ? row.hosts
                            : row.type === "pointToPoint"
                              ? "2"
                              : "1"
                        }
                        readOnly={row.type !== "standard"}
                        className="read-only:bg-muted"
                        aria-invalid={hostsError}
                        aria-describedby={
                          hostsError ? `${id}-hosts-error` : undefined
                        }
                        onChange={(event) =>
                          updateRow(row.id, { hosts: event.target.value })
                        }
                      />
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="col-start-3 row-start-1 self-end sm:col-start-auto sm:row-start-auto"
                      disabled={rows.length === 1}
                      aria-label={`${messages.remove} ${index + 1}`}
                      title={messages.remove}
                      onClick={() => removeRow(index)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                    {hostsError && (
                      <p
                        id={`${id}-hosts-error`}
                        role="alert"
                        className="col-span-full text-sm text-destructive"
                      >
                        {messages.invalidHosts}
                      </p>
                    )}
                  </div>
                )
              })}
            </fieldset>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={addRow}>
                <Plus data-icon="inline-start" aria-hidden="true" />
                {messages.add}
              </Button>
              <Button type="submit">{messages.calculate}</Button>
            </div>
            {result?.status === "doesNotFit" && (
              <p role="alert" className="text-sm text-destructive">
                {messages.doesNotFit}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
      <div aria-live="polite" className="sr-only">
        {result?.status === "success" ? messages.result : ""}
      </div>
      {result?.status === "success" && (
        <PlanResults
          plan={result.plan}
          messages={messages}
          language={language}
        />
      )}
    </div>
  )
}
