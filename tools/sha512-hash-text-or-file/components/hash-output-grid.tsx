import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { cn } from "@workspace/ui/lib/utils"

import type { Sha512HashTextOrFilePageMessages } from "../client/types"
import type { Sha512Digest } from "../core/sha512"

type HashOutputGridProps = Readonly<{
  messages: Sha512HashTextOrFilePageMessages
  digest: Sha512Digest | null
  loading?: boolean
}>

const DIGEST_FIELDS = [
  { key: "hex", labelKey: "hexLabel" },
  { key: "base64", labelKey: "base64Label" },
  { key: "decimal", labelKey: "decimalLabel" },
  { key: "binary", labelKey: "binaryLabel" },
] as const satisfies ReadonlyArray<{
  key: keyof Sha512Digest
  labelKey: keyof Sha512HashTextOrFilePageMessages
}>

function HashOutputGrid({
  messages,
  digest,
  loading = false,
}: HashOutputGridProps) {
  return (
    <div className="grid gap-3">
      {DIGEST_FIELDS.map(({ key, labelKey }) => (
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

export { HashOutputGrid }
