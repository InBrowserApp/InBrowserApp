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

          <code className="block text-xs leading-6 break-all sm:text-sm">
            {derivedKey?.[key] ?? ""}
          </code>
        </section>
      ))}
    </div>
  )
}

export { DerivedKeyOutputList }
