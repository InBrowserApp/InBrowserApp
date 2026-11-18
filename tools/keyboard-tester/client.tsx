import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"

import { ToolPanelCard } from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { Keyboard as KeyboardIcon, RefreshCcw } from "@workspace/ui/icons"

import { Keyboard, keyLabels } from "./keyboard"

import type EnglishMessages from "./messages/en.json"

type KeyInput = Pick<KeyboardEvent, "code" | "key">
type TestState = {
  held: ReadonlyMap<string, string>
  tested: ReadonlySet<string>
  peak: number
  last: KeyInput | null
}

const emptyTest: TestState = {
  held: new Map(),
  tested: new Set(),
  peak: 0,
  last: null,
}

const modifierCode = /^(Control|Alt|Shift|Meta)(Left|Right)$/

function inputId({ code, key }: KeyInput) {
  return code && code !== "Unidentified" ? code : key
}

function press(state: TestState, input: KeyInput, released = false): TestState {
  const id = inputId(input)
  if (state.held.has(id)) return state

  const held = new Map(state.held)
  if (!released) held.set(id, keyLabels.get(id) ?? input.key)
  return {
    held,
    tested: new Set(state.tested).add(id),
    peak: Math.max(state.peak, held.size),
    last: input,
  }
}

function KeyboardTester({
  language,
  messages,
}: {
  language: string
  messages: typeof EnglishMessages
}) {
  const [state, setState] = useState(emptyTest)
  const [focused, setFocused] = useState(false)
  const capture = useRef<HTMLDivElement>(null)
  const start = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const hintId = useId()
  const numbers = new Intl.NumberFormat(language)

  function clearHeld() {
    setState((current) =>
      current.held.size ? { ...current, held: emptyTest.held } : current
    )
  }

  useEffect(() => {
    window.addEventListener("blur", clearHeld)
    return () => window.removeEventListener("blur", clearHeld)
  }, [])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const { code, key, repeat } = event
    // Leave Tab navigation and horizontal scrolling available on the board.
    if (key !== "Tab" && key !== "ArrowLeft" && key !== "ArrowRight") {
      event.preventDefault()
    }
    if (!repeat) setState((current) => press(current, { code, key }))
    if (key === "Escape") start.current?.focus()
  }

  function onKeyUp({ code, key, metaKey }: KeyboardEvent<HTMLDivElement>) {
    const id = inputId({ code, key })
    setState((current) => {
      if (!current.held.has(id)) {
        // On Windows Print Screen can be reported only on keyup.
        return code === "PrintScreen"
          ? press(current, { code, key }, true)
          : current
      }
      const held = new Map(current.held)
      held.delete(id)
      // macOS can swallow keyup for keys released while Command is held.
      if (key === "Meta" && !metaKey && navigator.platform.startsWith("Mac")) {
        for (const code of held.keys()) {
          if (!modifierCode.test(code)) held.delete(code)
        }
      }
      return { ...current, held }
    })
  }

  const counts = [
    [messages.held, state.held.size],
    [messages.tested, state.tested.size],
    [messages.peak, state.peak],
  ] as const
  const combination = [...state.held].sort(
    ([a], [b]) => Number(modifierCode.test(b)) - Number(modifierCode.test(a))
  )

  return (
    <ToolPanelCard className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4">
        <div className="min-w-0 space-y-1">
          <h2
            className="flex items-center gap-2 font-heading text-base font-medium"
            id={titleId}
          >
            <KeyboardIcon aria-hidden="true" className="size-4 shrink-0" />
            {messages.layout}
          </h2>
          <p id={hintId} className="text-sm text-muted-foreground">
            {focused ? messages.capturing : messages.ready}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="lg"
            ref={start}
            onClick={() => capture.current?.focus()}
          >
            {messages.start}
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled={state.tested.size === 0}
            onClick={() => {
              setState(emptyTest)
              capture.current?.focus()
            }}
          >
            <RefreshCcw aria-hidden="true" data-icon="inline-start" />
            {messages.reset}
          </Button>
        </div>
      </div>

      <div className="@container min-w-0 px-4">
        <div
          ref={capture}
          role="group"
          aria-labelledby={titleId}
          aria-describedby={hintId}
          // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Focus scopes key capture and enables native horizontal scrolling.
          tabIndex={0}
          dir="ltr"
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            clearHeld()
          }}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-2.5 outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
        >
          <Keyboard held={state.held} tested={state.tested} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground @[882px]:hidden">
          {messages.scroll}
        </p>
      </div>

      <dl className="grid gap-x-4 gap-y-3 p-4 sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-sm font-medium">{messages.combination}</dt>
          <dd className="mt-1 min-h-6">
            {combination.length ? (
              <div className="flex flex-wrap items-center gap-1" dir="ltr">
                {combination.map(([id, label], index) => (
                  <span className="inline-flex items-center gap-1" key={id}>
                    {index > 0 ? (
                      <span className="text-muted-foreground">+</span>
                    ) : null}
                    <kbd
                      className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs"
                      title={id}
                    >
                      {label}
                    </kbd>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-muted-foreground">{messages.noneHeld}</span>
            )}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="text-sm font-medium">{messages.lastKey}</dt>
          <dd className="mt-1 min-h-6" aria-live="polite" aria-atomic="true">
            {state.last ? (
              <div
                className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs"
                dir="ltr"
              >
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5">
                  {state.last.key === " " ? "Space" : state.last.key}
                </kbd>
                <code className="text-muted-foreground">
                  {state.last.code || "—"}
                </code>
              </div>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </dd>
        </div>
      </dl>
      <dl className="flex flex-wrap gap-x-5 gap-y-2 border-t px-4 py-3">
        {counts.map(([label, value]) => (
          <div key={label} className="flex items-baseline gap-1.5">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-mono font-semibold tabular-nums">
              {numbers.format(value)}
            </dd>
          </div>
        ))}
      </dl>
      <p className="border-t px-4 py-3 text-sm text-muted-foreground">
        {messages.note}
      </p>
    </ToolPanelCard>
  )
}

export default KeyboardTester
