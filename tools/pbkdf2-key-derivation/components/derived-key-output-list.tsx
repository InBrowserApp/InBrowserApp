import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { cn } from "@workspace/ui/lib/utils"

import type { Pbkdf2KeyDerivationPageMessages } from "../client/types"
import type { DerivedKey } from "../core/pbkdf2"

type DerivedKeyOutputListProps = Readonly<{
  messages: Pbkdf2KeyDerivationPageMessages
  derivedKey: DerivedKey | null
  loading?: boolean
}>

const DERIVED_KEY_FIELDS = [
  { key: "hex", labelKey: "hexLabel" },
  { key: "base64", labelKey: "base64Label" },
] as const satisfies ReadonlyArray<{
  key: keyof DerivedKey
  labelKey: keyof Pbkdf2KeyDerivationPageMessages
}>

function DerivedKeyOutputList({
  messages,
  derivedKey,
  loading = false,
}: DerivedKeyOutputListProps) {
  return (
    <div className="grid gap-3">
      {DERIVED_KEY_FIELDS.map(({ key, labelKey }) => (
        <section
          key={key}
          className={cn(
            "grid gap-3 rounded-xl border bg-muted/20 p-4",
            loading && "opacity-75"
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-sm font-medium">{messages[labelKey]}</h3>
            <ToolCopyButton
              value={derivedKey?.[key] ?? ""}
              copyLabel={messages.copyResultLabel}
              copiedLabel={messages.copiedLabel}
              disabled={loading || !derivedKey}
            />
          </div>

          <OutputValue value={derivedKey?.[key] ?? ""} loading={loading} />
        </section>
      ))}
    </div>
  )
}

function OutputValue({
  value,
  loading,
}: Readonly<{
  value: string
  loading: boolean
}>) {
  return (
    <div className="relative min-h-[4.5rem]">
      {value ? (
        <code
          className={cn(
            "block text-xs leading-6 break-all transition-opacity sm:text-sm",
            loading && "opacity-30"
          )}
        >
          {value}
        </code>
      ) : null}

      {loading ? (
        <div
          className={cn(
            "grid gap-2",
            value ? "absolute inset-0" : "min-h-[4.5rem] content-start"
          )}
          aria-hidden="true"
        >
          <div className="h-3 w-full animate-pulse rounded bg-foreground/10" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-foreground/10" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-foreground/10" />
        </div>
      ) : null}
    </div>
  )
}

export { DerivedKeyOutputList }
