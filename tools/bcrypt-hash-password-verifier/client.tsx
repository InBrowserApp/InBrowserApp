import { useState, type FormEvent } from "react"

import { InputCard } from "./components/input-card"
import { ResultCard, type VerificationState } from "./components/result-card"
import { verifyBcryptPassword } from "./core/bcrypt"
import type { BcryptHashPasswordVerifierMessages } from "./client/types"

type BcryptHashPasswordVerifierClientProps = Readonly<{
  messages: BcryptHashPasswordVerifierMessages
}>

const SAMPLE_PASSWORD = "correct horse battery staple"
const SAMPLE_HASH =
  "$2b$10$9goojv/JvRhQvBIMI6yJNu9mziiWggh4.5/rpJAIhx66y28hq4Ybe"

function BcryptHashPasswordVerifierClient({
  messages,
}: BcryptHashPasswordVerifierClientProps) {
  const [password, setPassword] = useState("")
  const [hash, setHash] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [hashVisible, setHashVisible] = useState(false)
  const [verificationState, setVerificationState] = useState<VerificationState>(
    { status: "idle" }
  )

  const isVerifying = verificationState.status === "loading"
  const canVerify = hash.trim().length > 0
  const hashInvalid = verificationState.status === "invalid-hash"

  function clearResultOnEdit(
    nextValue: string,
    setter: (value: string) => void
  ) {
    setter(nextValue)
    setVerificationState({ status: "idle" })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canVerify || isVerifying) return

    setVerificationState({ status: "loading" })
    const result = await verifyBcryptPassword(password, hash)

    if (result.status === "invalid-hash") {
      setVerificationState({ status: "invalid-hash" })
      return
    }

    setVerificationState({
      status: result.status,
      details: result.details,
    })
  }

  function handleReset() {
    setPassword("")
    setHash("")
    setPasswordVisible(false)
    setHashVisible(false)
    setVerificationState({ status: "idle" })
  }

  function handleUseSample() {
    setPassword(SAMPLE_PASSWORD)
    setHash(SAMPLE_HASH)
    setVerificationState({ status: "idle" })
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]"
      onSubmit={handleSubmit}
    >
      <InputCard
        messages={messages}
        password={password}
        hash={hash}
        passwordVisible={passwordVisible}
        hashVisible={hashVisible}
        hashInvalid={hashInvalid}
        isVerifying={isVerifying}
        canVerify={canVerify}
        onPasswordChange={(nextValue) => {
          clearResultOnEdit(nextValue, setPassword)
        }}
        onHashChange={(nextValue) => {
          clearResultOnEdit(nextValue, setHash)
        }}
        onTogglePasswordVisibility={() => {
          setPasswordVisible((currentValue) => !currentValue)
        }}
        onToggleHashVisibility={() => {
          setHashVisible((currentValue) => !currentValue)
        }}
        onReset={handleReset}
        onUseSample={handleUseSample}
      />
      <ResultCard messages={messages} state={verificationState} />
    </form>
  )
}

export default BcryptHashPasswordVerifierClient
