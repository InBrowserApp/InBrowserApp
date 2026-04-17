import { useEffect, useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import { Field, FieldLabel } from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { cn } from "@workspace/ui/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/ui/table"

import type {
  ChmodCalculatorPageMessages,
  PermissionKey,
  PermissionRole,
} from "./client/types"
import { isValidNumeric, isValidSymbolic } from "./core/chmod"
import {
  createStateFromNumeric,
  deriveNumericState,
  deriveSymbolicState,
  updateMatrixState,
  type ChmodState,
} from "./client/state"

const DEFAULT_NUMERIC = "755"
const STORAGE_KEY = "tools:chmod-calculator:numeric"

function ChmodCalculatorClient({
  messages,
}: Readonly<{
  messages: ChmodCalculatorPageMessages
}>) {
  const numericInputId = useId()
  const symbolicInputId = useId()
  const [state, setState] = useState<ChmodState>(() =>
    createStateFromNumeric(DEFAULT_NUMERIC)
  )

  const numericInputValid =
    state.numericInput === "" || isValidNumeric(state.numericInput)
  const symbolicInputValid =
    state.symbolicInput === "" || isValidSymbolic(state.symbolicInput)
  const chmodCommand = `chmod ${state.numericInput || "000"} <filename>`
  const presets = [
    { value: "755", label: messages.executablePresetLabel },
    { value: "644", label: messages.readOnlyPresetLabel },
    { value: "777", label: messages.fullAccessPresetLabel },
    { value: "700", label: messages.ownerOnlyPresetLabel },
    { value: "600", label: messages.privateFilePresetLabel },
    { value: "775", label: messages.sharedDirPresetLabel },
  ] as const
  const roles = [
    { key: "owner", label: messages.ownerLabel },
    { key: "group", label: messages.groupLabel },
    { key: "others", label: messages.othersLabel },
  ] as const satisfies ReadonlyArray<{
    key: PermissionRole
    label: string
  }>
  const permissions = [
    { key: "read", label: messages.readLabel, short: "r" },
    { key: "write", label: messages.writeLabel, short: "w" },
    { key: "execute", label: messages.executeLabel, short: "x" },
  ] as const satisfies ReadonlyArray<{
    key: PermissionKey
    label: string
    short: string
  }>

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedNumeric = window.localStorage.getItem(STORAGE_KEY)

    if (storedNumeric !== null) {
      setState((previousState) =>
        deriveNumericState(storedNumeric, previousState)
      )
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, state.numericInput)
  }, [state.numericInput])

  function updateFromNumeric(nextNumeric: string) {
    setState((previousState) => deriveNumericState(nextNumeric, previousState))
  }

  function updateFromSymbolic(nextSymbolic: string) {
    setState((previousState) =>
      deriveSymbolicState(nextSymbolic, previousState)
    )
  }

  function updateFromMatrix(
    role: PermissionRole,
    permission: PermissionKey,
    checked: boolean
  ) {
    setState((previousState) =>
      updateMatrixState(previousState, role, permission, checked)
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>{messages.permissionMatrixLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                {permissions.map((permission) => (
                  <TableHead
                    key={permission.key}
                    className="text-center whitespace-normal"
                  >
                    {permission.label} ({permission.short})
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.key}>
                  <TableCell className="font-medium">{role.label}</TableCell>
                  {permissions.map((permission) => (
                    <TableCell key={permission.key} className="text-center">
                      <Checkbox
                        aria-label={`${role.label} ${permission.label}`}
                        checked={state.permissions[role.key][permission.key]}
                        onCheckedChange={(checked) => {
                          updateFromMatrix(
                            role.key,
                            permission.key,
                            checked === true
                          )
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader className="border-b">
            <CardTitle>{messages.presetsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {presets.map((preset) => (
              <Button
                key={preset.value}
                type="button"
                variant="outline"
                aria-pressed={state.numericInput === preset.value}
                className={cn(
                  "h-auto min-h-16 flex-col items-start justify-center gap-1 px-3 py-3 text-left whitespace-normal",
                  state.numericInput === preset.value &&
                    "border-primary/50 bg-primary/10 text-foreground ring-1 ring-primary/20 hover:bg-primary/12"
                )}
                onClick={() => {
                  updateFromNumeric(preset.value)
                }}
              >
                <span className="font-mono text-sm font-semibold">
                  {preset.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {preset.label}
                </span>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <CardTitle>{messages.numericPermissionLabel}</CardTitle>
            <CardAction>
              <ToolCopyButton
                value={state.numericInput}
                copyLabel={messages.copyResultLabel}
                copiedLabel={messages.copiedLabel}
              />
            </CardAction>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor={numericInputId}>
                {messages.numericPermissionLabel}
              </FieldLabel>
              <Input
                id={numericInputId}
                aria-invalid={!numericInputValid}
                inputMode="numeric"
                maxLength={3}
                placeholder={messages.numericPermissionPlaceholder}
                spellCheck={false}
                value={state.numericInput}
                onChange={(event) => {
                  updateFromNumeric(event.target.value)
                }}
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <CardTitle>{messages.symbolicPermissionLabel}</CardTitle>
            <CardAction>
              <ToolCopyButton
                value={state.symbolicInput}
                copyLabel={messages.copyResultLabel}
                copiedLabel={messages.copiedLabel}
              />
            </CardAction>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor={symbolicInputId}>
                {messages.symbolicPermissionLabel}
              </FieldLabel>
              <Input
                id={symbolicInputId}
                aria-invalid={!symbolicInputValid}
                maxLength={9}
                placeholder={messages.symbolicPermissionPlaceholder}
                spellCheck={false}
                value={state.symbolicInput}
                onChange={(event) => {
                  updateFromSymbolic(event.target.value)
                }}
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <CardTitle>{messages.chmodCommandLabel}</CardTitle>
            <CardAction>
              <ToolCopyButton
                value={chmodCommand}
                copyLabel={messages.copyResultLabel}
                copiedLabel={messages.copiedLabel}
              />
            </CardAction>
          </CardHeader>
          <CardContent>
            <code className="block rounded-xl border bg-muted/20 px-4 py-3 text-sm break-all">
              {chmodCommand}
            </code>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ChmodCalculatorClient
