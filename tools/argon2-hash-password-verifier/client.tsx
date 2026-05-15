import { useEffect, useId, useRef, useState, type FormEvent } from "react"

import { VerificationFormCard } from "./components/verification-form-card"
import {
  VerificationResultCard,
  type VerificationState,
} from "./components/verification-result-card"
import type { Argon2HashPasswordVerifierPageMessages } from "./client/types"
import { verifyArgon2Password } from "./core/argon2"

type Argon2HashPasswordVerifierClientProps = Readonly<{
  messages: Argon2HashPasswordVerifierPageMessages
}>

function Argon2HashPasswordVerifierClient({
  messages,
}: Argon2HashPasswordVerifierClientProps) {
  const passwordId = useId()
  const hashId = useId()
  const secretId = useId()
  const requestIdRef = useRef(0)

  const [password, setPassword] = useState("")
  const [hash, setHash] = useState("")
  const [secret, setSecret] = useState("")
  const [state, setState] = useState<VerificationState>({ status: "idle" })

  const canVerify = hash.trim().length > 0 && state.status !== "loading"

  useEffect(() => {
    requestIdRef.current += 1
    setState({ status: "idle" })
  }, [hash, password, secret])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canVerify) {
      return
    }

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    setState({ status: "loading" })

    try {
      const result = await verifyArgon2Password({
        password,
        hash,
        secret,
      })

      if (requestIdRef.current !== requestId) {
        return
      }

      setState({
        status: result.verified ? "verified" : "mismatch",
        info: result.info,
      })
    } catch {
      if (requestIdRef.current === requestId) {
        setState({ status: "invalid" })
      }
    }
  }

  function handleReset() {
    requestIdRef.current += 1
    setPassword("")
    setHash("")
    setSecret("")
    setState({ status: "idle" })
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <VerificationFormCard
        passwordId={passwordId}
        hashId={hashId}
        secretId={secretId}
        password={password}
        hash={hash}
        secret={secret}
        canVerify={canVerify}
        loading={state.status === "loading"}
        messages={messages}
        onPasswordChange={setPassword}
        onHashChange={setHash}
        onSecretChange={setSecret}
        onReset={handleReset}
      />

      <VerificationResultCard state={state} messages={messages} />
    </form>
  )
}

export default Argon2HashPasswordVerifierClient
