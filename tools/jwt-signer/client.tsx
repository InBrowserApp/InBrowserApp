import { useId } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

import { PayloadCard } from "./components/payload-card"
import { ResultCard } from "./components/result-card"
import { SigningOptionsCard } from "./components/signing-options-card"
import { useJwtSignerState } from "./client/use-jwt-signer-state"

import type { JwtSignerMessages } from "./client/types"

type JwtSignerClientProps = Readonly<{
  messages: JwtSignerMessages
}>

function JwtSignerClient({ messages }: JwtSignerClientProps) {
  const payloadId = useId()
  const headerId = useId()
  const iatId = useId()
  const expId = useId()
  const algorithmId = useId()
  const keyFormatId = useId()
  const keyId = useId()
  const state = useJwtSignerState(messages)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
      <div className="grid gap-6">
        <PayloadCard
          messages={messages}
          payloadId={payloadId}
          headerId={headerId}
          iatId={iatId}
          expId={expId}
          payloadText={state.payloadText}
          headerText={state.headerText}
          useCurrentIat={state.useCurrentIat}
          iatValue={state.iatValue}
          iatSigningValue={state.iatSigningValue}
          expValue={state.expValue}
          expSigningValue={state.expSigningValue}
          expInputValue={state.expInputValue}
          relativeExpOffset={state.relativeExpOffset}
          payloadInvalid={Boolean(state.payloadError)}
          headerInvalid={Boolean(state.headerError)}
          payloadError={state.payloadError}
          headerError={state.headerError}
          onPayloadChange={state.setPayloadText}
          onHeaderChange={state.setHeaderText}
          onUseCurrentIatChange={state.handleUseCurrentIatChange}
          onExpInputChange={state.handleExpirationInputChange}
          onExpOffsetClick={state.handleExpirationOffsetClick}
          onClearExp={state.handleClearExpiration}
        />
        <SigningOptionsCard
          messages={messages}
          algorithm={state.algorithm}
          keyFormat={state.keyFormat}
          signingKey={state.key}
          algorithmId={algorithmId}
          keyFormatId={keyFormatId}
          keyId={keyId}
          canSign={state.canSign}
          isSigning={state.isSigning}
          onAlgorithmChange={state.handleAlgorithmChange}
          onKeyFormatChange={state.setKeyFormat}
          onKeyChange={state.setKey}
          onLoadSample={state.handleLoadSample}
          onReset={state.handleReset}
          onSign={() => {
            void state.handleSign()
          }}
        />
        <Alert>
          <TriangleAlert />
          <AlertTitle>{messages.securityNoteTitle}</AlertTitle>
          <AlertDescription>
            {messages.securityNoteDescription}
          </AlertDescription>
        </Alert>
      </div>
      <div className="min-w-0 self-start xl:sticky xl:top-6">
        <ResultCard
          messages={messages}
          result={state.result}
          error={state.error}
          downloadUrl={state.downloadUrl}
        />
      </div>
    </div>
  )
}

export default JwtSignerClient
