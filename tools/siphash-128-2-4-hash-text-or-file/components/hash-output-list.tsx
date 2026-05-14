import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { cn } from "@workspace/ui/lib/utils"

import type { SipHash128HashTextOrFilePageMessages } from "../client/types"
import type { SipHashDigest } from "../core/siphash"

type HashOutputListProps = Readonly<{
  messages: SipHash128HashTextOrFilePageMessages
  digest: SipHashDigest | null
  loading?: boolean
}>

const HASH_FIELDS = [
  { key: "hex", labelKey: "hexLabel" },
  { key: "base64", labelKey: "base64Label" },
  { key: "decimal", labelKey: "decimalLabel" },
  { key: "binary", labelKey: "binaryLabel" },
] as const satisfies ReadonlyArray<{
  key: keyof SipHashDigest
  labelKey: keyof SipHash128HashTextOrFilePageMessages
}>

function HashOutputList({
  messages,
  digest,
  loading = false,
}: HashOutputListProps) {
  return (
    <div className="grid gap-3">
      {HASH_FIELDS.map(({ key, labelKey }) => (
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
              value={digest?.[key] ?? ""}
              copyLabel={messages.copyResultLabel}
              copiedLabel={messages.copiedLabel}
              disabled={loading || !digest}
            />
          </div>

          <code className="block text-xs leading-6 break-all sm:text-sm">
            {digest?.[key] ?? ""}
          </code>
        </section>
      ))}
    </div>
  )
}

export { HashOutputList }
