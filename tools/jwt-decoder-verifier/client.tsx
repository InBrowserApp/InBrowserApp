import { useDeferredValue, useEffect, useMemo, useState } from "react"

import { SAMPLE_SECRET, SAMPLE_TOKEN } from "./client/constants"
import type { JwtDecoderVerifierMessages } from "./client/types"
import { DecodedPanel } from "./components/decoded-panel"
import { TokenCard } from "./components/token-card"
import { VerificationCard } from "./components/verification-card"
import { inspectJwtClaims } from "./core/jwt-claims"
import { decodeJwt } from "./core/jwt-decode"
import { verifyJwtSignature } from "./core/jwt-verify"
import type {
  AlgorithmSelection,
  JwtVerificationResult,
} from "./core/jwt-types"

type JwtDecoderVerifierClientProps = Readonly<{
  messages: JwtDecoderVerifierMessages
}>

function JwtDecoderVerifierClient({ messages }: JwtDecoderVerifierClientProps) {
  const [token, setToken] = useState(SAMPLE_TOKEN)
  const [algorithm, setAlgorithm] = useState<AlgorithmSelection>("auto")
  const [keyInput, setKeyInput] = useState(SAMPLE_SECRET)
  const [verificationResult, setVerificationResult] =
    useState<JwtVerificationResult | null>(null)
  const [verifying, setVerifying] = useState(false)
  const deferredToken = useDeferredValue(token)
  const deferredKeyInput = useDeferredValue(keyInput)
  const decodeResult = useMemo(() => decodeJwt(deferredToken), [deferredToken])
  const claimChecks = useMemo(
    () => (decodeResult.ok ? inspectJwtClaims(decodeResult.value.payload) : []),
    [decodeResult]
  )

  useEffect(() => {
    let cancelled = false

    async function runVerification() {
      if (!decodeResult.ok || deferredKeyInput.trim() === "") {
        setVerificationResult(null)
        setVerifying(false)
        return
      }

      setVerifying(true)
      const result = await verifyJwtSignature({
        algorithm,
        decoded: decodeResult.value,
        key: deferredKeyInput,
      })

      if (!cancelled) {
        setVerificationResult(result)
        setVerifying(false)
      }
    }

    void runVerification()

    return () => {
      cancelled = true
    }
  }, [algorithm, decodeResult, deferredKeyInput])

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="grid gap-6">
          <TokenCard
            messages={messages.token}
            invalid={!decodeResult.ok && decodeResult.code !== "empty-token"}
            value={token}
            onChange={setToken}
            onClear={() => {
              setToken("")
            }}
            onUseSample={() => {
              setToken(SAMPLE_TOKEN)
              setKeyInput(SAMPLE_SECRET)
              setAlgorithm("auto")
            }}
          />
          <VerificationCard
            algorithm={algorithm}
            keyInput={keyInput}
            messages={messages}
            result={verificationResult}
            tokenIsDecoded={decodeResult.ok}
            verifying={verifying}
            onAlgorithmChange={setAlgorithm}
            onKeyInputChange={setKeyInput}
          />
        </div>

        <div className="min-w-0 xl:sticky xl:top-6 xl:self-start">
          <DecodedPanel
            claims={claimChecks}
            decodeResult={decodeResult}
            messages={messages}
          />
        </div>
      </div>
    </div>
  )
}

export default JwtDecoderVerifierClient
