import { useId, useState } from "react"
import type { FormEvent } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { ChevronDown, Eye, EyeOff, Plus } from "@workspace/ui/icons"

import { algorithms, readSetup } from "../accounts"
import { parseImportLink } from "../import"
import type { Setup } from "../accounts"
import type { Messages } from "../types"

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

type Props = {
  messages: Messages
  setup?: Setup
  onSave: (setups: Setup[]) => string | undefined
}

function AccountForm({ messages, setup, onSave }: Props) {
  const id = useId()
  const [key, setKey] = useState(setup?.secret ?? "")
  const [name, setName] = useState(setup?.label ?? "")
  const [issuer, setIssuer] = useState(setup?.issuer ?? "")
  const [type, setType] = useState(setup?.type ?? "totp")
  const [algorithm, setAlgorithm] = useState(setup?.algorithm ?? "SHA1")
  const [digits, setDigits] = useState(String(setup?.digits ?? 6))
  const [period, setPeriod] = useState(
    String(setup?.type === "totp" ? setup.period : 30)
  )
  const [counter, setCounter] = useState(
    String(setup?.type === "hotp" ? setup.counter : 0)
  )
  const [showKey, setShowKey] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError("")

    try {
      const input = key.trim()
      const settings = {
        label: name.trim(),
        issuer: issuer.trim(),
        secret: input,
        algorithm,
        digits: Number(digits),
      }
      const setups =
        /^otpauth(?:-migration)?:\/\//i.test(input) &&
        (!setup || /^otpauth:\/\//i.test(input))
          ? await parseImportLink(input)
          : [
              readSetup(
                type === "totp"
                  ? { ...settings, type, period: Number(period) }
                  : { ...settings, type, counter: Number(counter) }
              ),
            ]
      const first = setups[0]
      if (
        first &&
        setups.length === 1 &&
        name.trim() &&
        name !== setup?.label
      ) {
        first.label = name.trim()
      }
      setError(onSave(setups) ?? "")
    } catch {
      setError(messages.invalidKey)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      className="grid min-w-0 gap-3 sm:gap-4"
      autoComplete="off"
      onSubmit={(event) => void submit(event)}
    >
      <div className="grid gap-2">
        <Label htmlFor={`${id}-key`}>{messages.setupKey}</Label>
        <div className="relative">
          <Input
            id={`${id}-key`}
            type={showKey ? "text" : "password"}
            className="h-10 pe-11 font-mono placeholder:font-sans"
            placeholder={messages.setupPlaceholder}
            value={key}
            onChange={(event) => setKey(event.target.value)}
            dir="ltr"
            autoCapitalize="none"
            spellCheck={false}
            required
            aria-describedby={error ? `${id}-error` : undefined}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute end-1 top-1"
            aria-label={showKey ? messages.hideKey : messages.showKey}
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? (
              <EyeOff aria-hidden="true" />
            ) : (
              <Eye aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${id}-name`}>{messages.accountName}</Label>
        <Input
          id={`${id}-name`}
          className="h-10"
          placeholder={messages.accountPlaceholder}
          value={name}
          onChange={(event) => setName(event.target.value)}
          dir="auto"
        />
      </div>
      <details
        className="group"
        onInvalidCapture={(event) => {
          event.currentTarget.open = true
        }}
      >
        <summary className="flex min-h-9 w-fit cursor-pointer list-none items-center gap-1.5 rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform group-open:rotate-180"
          />
          {messages.advanced}
        </summary>
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="col-span-2 grid gap-2">
            <Label htmlFor={`${id}-service`}>{messages.service}</Label>
            <Input
              id={`${id}-service`}
              value={issuer}
              onChange={(event) => setIssuer(event.target.value)}
              dir="auto"
            />
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor={`${id}-type`}>{messages.type}</Label>
            <select
              id={`${id}-type`}
              className={selectClassName}
              value={type}
              onChange={(event) =>
                setType(event.target.value === "hotp" ? "hotp" : "totp")
              }
            >
              <option value="totp">TOTP</option>
              <option value="hotp">HOTP</option>
            </select>
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor={`${id}-algorithm`}>{messages.algorithm}</Label>
            <select
              id={`${id}-algorithm`}
              className={selectClassName}
              value={algorithm}
              onChange={(event) =>
                setAlgorithm(algorithms[event.target.selectedIndex]!)
              }
            >
              {algorithms.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="grid min-w-0 gap-2">
            <Label htmlFor={`${id}-digits`}>{messages.digits}</Label>
            <Input
              id={`${id}-digits`}
              type="number"
              dir="ltr"
              min={1}
              max={10}
              required
              value={digits}
              onChange={(event) => setDigits(event.target.value)}
            />
          </div>
          <div className="grid min-w-0 gap-2">
            {type === "totp" ? (
              <>
                <Label htmlFor={`${id}-period`}>{messages.period}</Label>
                <Input
                  id={`${id}-period`}
                  type="number"
                  dir="ltr"
                  min={1}
                  required
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                />
              </>
            ) : (
              <>
                <Label htmlFor={`${id}-counter`}>{messages.counter}</Label>
                <Input
                  id={`${id}-counter`}
                  type="number"
                  dir="ltr"
                  min={0}
                  required
                  value={counter}
                  onChange={(event) => setCounter(event.target.value)}
                />
              </>
            )}
          </div>
        </div>
      </details>
      {error && (
        <p role="alert" id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" className="h-10 w-fit px-4" disabled={busy}>
        {!setup && <Plus data-icon="inline-start" aria-hidden="true" />}
        {setup ? messages.save : messages.add}
      </Button>
    </form>
  )
}

export { AccountForm }
