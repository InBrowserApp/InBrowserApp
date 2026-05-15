import { useEffect, useId, useRef, useState } from "react"

import { DEFAULT_RSA_KEY_SIZE, STORAGE_KEYS } from "./client/constants"
import type {
  KeyGenerationState,
  SshKeyGeneratorMessages,
} from "./client/types"
import { KeyOptionsCard } from "./components/key-options-card"
import { KeyOutputCard } from "./components/key-output-card"
import {
  generateSshKeyPair,
  isRsaKeySize,
  type RsaKeySize,
  type SshKeyAlgorithm,
} from "./core/ssh-keygen"

type SshKeyGeneratorClientProps = Readonly<{
  messages: SshKeyGeneratorMessages
}>

function SshKeyGeneratorClient({ messages }: SshKeyGeneratorClientProps) {
  const algorithmId = useId()
  const rsaSizeId = useId()
  const commentId = useId()
  const generationId = useRef(0)
  const [algorithm, setAlgorithm] = useState<SshKeyAlgorithm>("ed25519")
  const [rsaKeySize, setRsaKeySize] = useState<RsaKeySize>(DEFAULT_RSA_KEY_SIZE)
  const [comment, setComment] = useState("")
  const [generationState, setGenerationState] = useState<KeyGenerationState>({
    status: "idle",
  })

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedAlgorithm = window.localStorage.getItem(STORAGE_KEYS.algorithm)
    const storedRsaKeySize = Number(
      window.localStorage.getItem(STORAGE_KEYS.rsaKeySize)
    )

    if (storedAlgorithm === "ed25519" || storedAlgorithm === "rsa") {
      setAlgorithm(storedAlgorithm)
    }

    if (isRsaKeySize(storedRsaKeySize)) {
      setRsaKeySize(storedRsaKeySize)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.algorithm, algorithm)
  }, [algorithm])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.rsaKeySize, String(rsaKeySize))
  }, [rsaKeySize])

  function resetOutput() {
    generationId.current += 1
    setGenerationState({ status: "idle" })
  }

  function handleAlgorithmChange(nextAlgorithm: SshKeyAlgorithm) {
    setAlgorithm(nextAlgorithm)
    resetOutput()
  }

  function handleRsaKeySizeChange(size: RsaKeySize) {
    setRsaKeySize(size)
    resetOutput()
  }

  function handleCommentChange(value: string) {
    setComment(value)
    resetOutput()
  }

  function handleReset() {
    setAlgorithm("ed25519")
    setRsaKeySize(DEFAULT_RSA_KEY_SIZE)
    setComment("")
    resetOutput()
  }

  async function handleGenerate() {
    const nextGenerationId = generationId.current + 1
    generationId.current = nextGenerationId
    setGenerationState({ status: "loading" })

    try {
      const result = await generateSshKeyPair({
        algorithm,
        comment,
        rsaKeySize,
      })

      if (generationId.current === nextGenerationId) {
        setGenerationState({ status: "ready", result })
      }
    } catch (error) {
      if (generationId.current === nextGenerationId) {
        setGenerationState({
          status: "error",
          message: resolveErrorMessage(error, messages),
        })
      }
    }
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]"
      onSubmit={(event) => {
        event.preventDefault()

        if (generationState.status !== "loading") {
          void handleGenerate()
        }
      }}
    >
      <KeyOptionsCard
        algorithm={algorithm}
        algorithmId={algorithmId}
        comment={comment}
        commentId={commentId}
        generating={generationState.status === "loading"}
        messages={messages}
        onAlgorithmChange={handleAlgorithmChange}
        onCommentChange={handleCommentChange}
        onReset={handleReset}
        onRsaKeySizeChange={handleRsaKeySizeChange}
        rsaKeySize={rsaKeySize}
        rsaSizeId={rsaSizeId}
      />

      <KeyOutputCard messages={messages} state={generationState} />
    </form>
  )
}

function resolveErrorMessage(
  error: unknown,
  messages: SshKeyGeneratorMessages
) {
  if (error instanceof Error && error.message === "WEB_CRYPTO_UNAVAILABLE") {
    return messages.errorWebCryptoUnavailable
  }

  return messages.errorGenerationFailed
}

export default SshKeyGeneratorClient
