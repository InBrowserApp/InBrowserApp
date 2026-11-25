import { useId, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Input } from "@workspace/ui/components/ui/input"
import { ArrowLeftRight } from "@workspace/ui/icons"

import { convertAddress, type Network } from "./core/address"
import type EnglishMessages from "./messages/en.json"

const example = "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed"
const networkLabels = { f: "mainnet", t: "testnet" } as const

export default function FilecoinAddressConverter({
  messages,
}: {
  messages: typeof EnglishMessages
}) {
  const inputId = useId()
  const [input, setInput] = useState("")
  const [network, setNetwork] = useState<Network>("f")
  const [submitted, setSubmitted] = useState(false)
  const result = submitted ? convertAddress(input, network) : null
  const problem = result && "problem" in result ? result.problem : null
  const output = result && "address" in result ? result : null
  const outputLabel =
    output?.format === "ethereum"
      ? messages.ethereumAddress
      : messages.filecoinAddress

  return (
    <div className="grid min-w-0 gap-4">
      <ToolPanelCard>
        <ToolPanelCardContent>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitted(true)
            }}
          >
            <Field data-invalid={problem !== null} className="max-w-xl">
              <FieldLabel htmlFor={inputId}>{messages.address}</FieldLabel>
              <Input
                id={inputId}
                dir="ltr"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="f410… / t410… / 0x…"
                className="h-10 font-mono text-base sm:text-sm"
                value={input}
                aria-invalid={problem !== null}
                aria-describedby={problem ? `${inputId}-error` : undefined}
                onChange={(event) => {
                  setInput(event.target.value)
                  setSubmitted(false)
                }}
              />
              {problem && (
                <FieldError id={`${inputId}-error`}>
                  {messages[problem]}
                </FieldError>
              )}
            </Field>
            {/^0x/i.test(input.trimStart()) && (
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-medium">
                  {messages.network}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {(["f", "t"] as const).map((value) => (
                    <label
                      key={value}
                      className="flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm has-checked:border-foreground/40 has-checked:bg-muted"
                    >
                      <input
                        type="radio"
                        name={`${inputId}-network`}
                        value={value}
                        checked={network === value}
                        onChange={() => setNetwork(value)}
                        className="size-3.5 shrink-0 accent-primary"
                      />
                      {messages[networkLabels[value]]}{" "}
                      <bdi className="font-mono text-xs text-muted-foreground">
                        {`${value}410`}
                      </bdi>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="submit">
                <ArrowLeftRight data-icon="inline-start" aria-hidden="true" />
                {messages.convert}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setInput(example)
                  setSubmitted(true)
                }}
              >
                {messages.sample}
              </Button>
            </div>
          </form>
        </ToolPanelCardContent>
      </ToolPanelCard>
      {output && (
        <ToolPanelCard>
          <ToolPanelCardContent className="gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-medium">{outputLabel}</h2>
              <ToolCopyButton
                key={output.address}
                value={output.address}
                copyLabel={messages.copy}
                copiedLabel={messages.copied}
                ariaLabel={`${messages.copy} · ${outputLabel}`}
              />
            </div>
            <output
              dir="ltr"
              aria-label={outputLabel}
              className="rounded-lg bg-muted p-2.5 font-mono text-sm wrap-anywhere select-all"
            >
              {output.address}
            </output>
            {output.format === "ethereum" && (
              <p className="text-xs text-muted-foreground">
                {messages.network} · {messages[networkLabels[output.network]]}
              </p>
            )}
          </ToolPanelCardContent>
        </ToolPanelCard>
      )}
    </div>
  )
}
