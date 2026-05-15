import { useEffect, useId, useState, type FormEvent } from "react"

import {
  MAX_EXPIRATION_DAYS,
  generatePgpKeyPair,
  type KeyAlgorithm,
  type PgpKeyPair,
  type RsaKeySize,
} from "./core/pgp-keygen"
import { IdentityCard } from "./client/identity-card"
import { ResultCard } from "./client/result-card"
import { SecurityCard } from "./client/security-card"
import type { PgpKeyGeneratorMessages } from "./client/types"

type StoredPreferences = Partial<{
  algorithm: KeyAlgorithm
  expirationDays: string
  rsaKeySize: RsaKeySize
}>

const STORAGE_KEY = "tools:pgp-key-generator:preferences"

function isKeyAlgorithm(value: unknown): value is KeyAlgorithm {
  return value === "ecc" || value === "rsa"
}

function isRsaKeySize(value: unknown): value is RsaKeySize {
  return value === 2048 || value === 3072 || value === 4096
}

function parseStoredPreferences(): StoredPreferences {
  if (typeof window === "undefined") return {}

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as StoredPreferences) : {}
  } catch {
    return {}
  }
}

function getInitialAlgorithm() {
  const stored = parseStoredPreferences()
  return isKeyAlgorithm(stored.algorithm) ? stored.algorithm : "ecc"
}

function getInitialRsaKeySize() {
  const stored = parseStoredPreferences()
  return isRsaKeySize(stored.rsaKeySize) ? stored.rsaKeySize : 4096
}

function getInitialExpirationDays() {
  const stored = parseStoredPreferences()
  return typeof stored.expirationDays === "string" ? stored.expirationDays : "0"
}

function PgpKeyGeneratorClient({
  messages,
}: Readonly<{ messages: PgpKeyGeneratorMessages }>) {
  const nameInputId = useId()
  const emailInputId = useId()
  const commentInputId = useId()
  const passphraseInputId = useId()
  const expirationInputId = useId()

  const [algorithm, setAlgorithm] = useState<KeyAlgorithm>(getInitialAlgorithm)
  const [rsaKeySize, setRsaKeySize] = useState<RsaKeySize>(getInitialRsaKeySize)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [comment, setComment] = useState("")
  const [passphrase, setPassphrase] = useState("")
  const [passphraseVisible, setPassphraseVisible] = useState(false)
  const [expirationDays, setExpirationDays] = useState(getInitialExpirationDays)
  const [keyPair, setKeyPair] = useState<PgpKeyPair | null>(null)
  const [passphraseProtected, setPassphraseProtected] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")

  const hasIdentity = name.trim().length > 0 || email.trim().length > 0
  const expirationNumber = Number(expirationDays)
  const expirationInvalid =
    expirationDays.trim() === "" ||
    !Number.isInteger(expirationNumber) ||
    expirationNumber < 0 ||
    expirationNumber > MAX_EXPIRATION_DAYS
  const canGenerate = hasIdentity && !expirationInvalid && !isGenerating

  useEffect(() => {
    if (typeof window === "undefined") return

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ algorithm, rsaKeySize, expirationDays })
    )
  }, [algorithm, rsaKeySize, expirationDays])

  function clearResultOnEdit(setter: (value: string) => void, value: string) {
    setter(value)
    setKeyPair(null)
    setError("")
  }

  function clearResultOnOptionChange<TValue>(
    setter: (value: TValue) => void,
    value: TValue
  ) {
    setter(value)
    setKeyPair(null)
    setError("")
  }

  function handleReset() {
    setAlgorithm("ecc")
    setRsaKeySize(4096)
    setName("")
    setEmail("")
    setComment("")
    setPassphrase("")
    setPassphraseVisible(false)
    setExpirationDays("0")
    setKeyPair(null)
    setPassphraseProtected(false)
    setError("")
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!hasIdentity) {
      setError(messages.identityRequiredHint)
      return
    }

    if (expirationInvalid) {
      setError(messages.expirationInvalidError)
      return
    }

    setIsGenerating(true)
    setError("")
    setKeyPair(null)

    try {
      const result = await generatePgpKeyPair({
        name,
        email,
        comment,
        passphrase,
        algorithm,
        rsaKeySize,
        expirationDays: expirationNumber,
      })

      setKeyPair(result)
      setPassphraseProtected(passphrase.length > 0)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : String(caughtError)
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]"
      onSubmit={(event) => {
        void handleGenerate(event)
      }}
    >
      <div className="grid gap-6">
        <IdentityCard
          comment={comment}
          email={email}
          ids={{
            comment: commentInputId,
            email: emailInputId,
            name: nameInputId,
            passphrase: passphraseInputId,
          }}
          messages={messages}
          name={name}
          passphrase={passphrase}
          passphraseVisible={passphraseVisible}
          onCommentChange={(value) => clearResultOnEdit(setComment, value)}
          onEmailChange={(value) => clearResultOnEdit(setEmail, value)}
          onNameChange={(value) => clearResultOnEdit(setName, value)}
          onPassphraseChange={(value) => {
            clearResultOnEdit(setPassphrase, value)
          }}
          onTogglePassphrase={() => {
            setPassphraseVisible((currentValue) => !currentValue)
          }}
        />
        <SecurityCard
          algorithm={algorithm}
          canGenerate={canGenerate}
          expirationDays={expirationDays}
          expirationInputId={expirationInputId}
          expirationInvalid={expirationInvalid}
          hasResult={keyPair !== null}
          isGenerating={isGenerating}
          messages={messages}
          rsaKeySize={rsaKeySize}
          onAlgorithmChange={(value) => {
            clearResultOnOptionChange(setAlgorithm, value)
          }}
          onExpirationDaysChange={(value) => {
            clearResultOnEdit(setExpirationDays, value)
          }}
          onReset={handleReset}
          onRsaKeySizeChange={(value) => {
            clearResultOnOptionChange(setRsaKeySize, value)
          }}
        />
      </div>

      <div className="min-w-0 self-start xl:sticky xl:top-6">
        <ResultCard
          error={error}
          isGenerating={isGenerating}
          keyPair={keyPair}
          messages={messages}
          passphraseProtected={passphraseProtected}
        />
      </div>
    </form>
  )
}

export default PgpKeyGeneratorClient
