import { Alert, AlertTitle } from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { TriangleAlert } from "@workspace/ui/icons"

import { ClaimsCard } from "./claims-card"
import { JsonOutputCard } from "./json-output-card"
import type { ClaimCheck } from "../core/jwt-claims"
import type { DecodeJwtResult } from "../core/jwt-types"
import type { JwtDecoderVerifierMessages } from "../client/types"

type DecodedPanelProps = Readonly<{
  claims: readonly ClaimCheck[]
  decodeResult: DecodeJwtResult
  messages: JwtDecoderVerifierMessages
}>

function DecodedPanel({ claims, decodeResult, messages }: DecodedPanelProps) {
  if (!decodeResult.ok && decodeResult.code === "empty-token") {
    return (
      <Empty className="min-h-64">
        <EmptyHeader>
          <EmptyTitle>{messages.decoded.emptyTitle}</EmptyTitle>
          <EmptyDescription>
            {messages.decoded.emptyDescription}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (!decodeResult.ok) {
    return (
      <Alert variant="destructive" aria-live="polite">
        <TriangleAlert />
        <AlertTitle>{messages.decodeErrors[decodeResult.code]}</AlertTitle>
      </Alert>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <JsonOutputCard
          title={messages.decoded.headerTitle}
          description={messages.decoded.description}
          value={decodeResult.value.headerJson}
          copyLabel={messages.decoded.copyJson}
          copiedLabel={messages.decoded.copied}
          textareaClassName="min-h-36"
        />
        <JsonOutputCard
          title={messages.decoded.payloadTitle}
          description={messages.decoded.description}
          value={decodeResult.value.payloadJson}
          copyLabel={messages.decoded.copyJson}
          copiedLabel={messages.decoded.copied}
          textareaClassName="min-h-64"
        />
      </div>
      <ClaimsCard checks={claims} messages={messages.claims} />
    </div>
  )
}

export { DecodedPanel }
