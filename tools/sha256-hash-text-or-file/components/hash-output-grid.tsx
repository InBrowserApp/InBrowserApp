import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { Sha256HashTextOrFilePageMessages } from "../client/types"
import type { Sha256Digest } from "../core/sha256"

type HashOutputGridProps = Readonly<{
  messages: Sha256HashTextOrFilePageMessages
  digest: Sha256Digest | null
  loading?: boolean
}>

const DIGEST_FIELDS = [
  { key: "hex", labelKey: "hexLabel" },
  { key: "base64", labelKey: "base64Label" },
  { key: "decimal", labelKey: "decimalLabel" },
  { key: "binary", labelKey: "binaryLabel" },
] as const satisfies ReadonlyArray<{
  key: keyof Sha256Digest
  labelKey: keyof Sha256HashTextOrFilePageMessages
}>

function HashOutputGrid({
  messages,
  digest,
  loading = false,
}: HashOutputGridProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {DIGEST_FIELDS.map(({ key, labelKey }) => (
        <Card key={key} size="sm">
          <CardHeader className="gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <CardTitle>{messages[labelKey]}</CardTitle>
            <CardAction>
              <ToolCopyButton
                value={digest?.[key] ?? ""}
                copyLabel={messages.copyResultLabel}
                copiedLabel={messages.copiedLabel}
                disabled={loading || !digest}
              />
            </CardAction>
          </CardHeader>
          <CardContent>
            <code className="block text-xs leading-6 break-all sm:text-sm">
              {digest?.[key] ?? ""}
            </code>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { HashOutputGrid }
