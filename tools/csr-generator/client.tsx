import { useEffect, useRef, useState } from "react"

import { DEFAULT_SUBJECT, STORAGE_KEYS } from "./client/constants"
import type { CsrGenerationState, CsrGeneratorMessages } from "./client/types"
import { CsrOptionsCard } from "./components/csr-options-card"
import { CsrOutputCard } from "./components/csr-output-card"
import {
  CsrGeneratorError,
  EC_CURVES,
  RSA_HASHES,
  RSA_KEY_SIZES,
  generateCsr,
  type CsrErrorCode,
  type EcCurve,
  type HashAlgorithm,
  type KeyAlgorithm,
  type KeySource,
  type RsaKeySize,
  type SubjectInput,
} from "./core/csr"

type CsrGeneratorClientProps = Readonly<{
  messages: CsrGeneratorMessages
}>

const KEY_SOURCES: readonly KeySource[] = ["generate", "import"] as const
const ALGORITHMS: readonly KeyAlgorithm[] = ["rsa", "ecdsa"] as const

function readStored<T extends string>(
  key: string,
  allowed: readonly T[],
  fallback: T
): T {
  /* v8 ignore next */
  if (typeof window === "undefined") return fallback
  const value = window.localStorage.getItem(key) as T | null
  return value && allowed.includes(value) ? value : fallback
}

function readStoredNumber<T extends number>(
  key: string,
  allowed: readonly T[],
  fallback: T
): T {
  /* v8 ignore next */
  if (typeof window === "undefined") return fallback
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback
  const value = Number(raw) as T
  return allowed.includes(value) ? value : fallback
}

function readStoredJson<T>(key: string, fallback: T): T {
  /* v8 ignore next */
  if (typeof window === "undefined") return fallback
  const raw = window.localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function splitLines(value: string): string[] {
  return value
    .split(/[\n,]+/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
}

function CsrGeneratorClient({ messages }: CsrGeneratorClientProps) {
  const generationId = useRef(0)

  const [keySource, setKeySource] = useState<KeySource>("generate")
  const [algorithm, setAlgorithm] = useState<KeyAlgorithm>("rsa")
  const [rsaKeySize, setRsaKeySize] = useState<RsaKeySize>(2048)
  const [rsaHash, setRsaHash] = useState<HashAlgorithm>("SHA-256")
  const [ecCurve, setEcCurve] = useState<EcCurve>("P-256")
  const [keyPem, setKeyPem] = useState("")
  const [subject, setSubject] = useState<SubjectInput>(DEFAULT_SUBJECT)
  const [sanDns, setSanDns] = useState("")
  const [sanIp, setSanIp] = useState("")
  const [sanEmail, setSanEmail] = useState("")
  const [sanUri, setSanUri] = useState("")
  const [state, setState] = useState<CsrGenerationState>({ status: "idle" })

  useEffect(() => {
    setKeySource(readStored(STORAGE_KEYS.keySource, KEY_SOURCES, "generate"))
    setAlgorithm(readStored(STORAGE_KEYS.algorithm, ALGORITHMS, "rsa"))
    setRsaKeySize(
      readStoredNumber(STORAGE_KEYS.rsaKeySize, RSA_KEY_SIZES, 2048)
    )
    setRsaHash(readStored(STORAGE_KEYS.rsaHash, RSA_HASHES, "SHA-256"))
    setEcCurve(readStored(STORAGE_KEYS.ecCurve, EC_CURVES, "P-256"))
    setSubject(readStoredJson(STORAGE_KEYS.subject, DEFAULT_SUBJECT))
    setSanDns(readStoredJson(STORAGE_KEYS.sanDns, ""))
    setSanIp(readStoredJson(STORAGE_KEYS.sanIp, ""))
    setSanEmail(readStoredJson(STORAGE_KEYS.sanEmail, ""))
    setSanUri(readStoredJson(STORAGE_KEYS.sanUri, ""))
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.keySource, keySource)
  }, [keySource])

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

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.rsaHash, rsaHash)
  }, [rsaHash])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.ecCurve, ecCurve)
  }, [ecCurve])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.subject, JSON.stringify(subject))
  }, [subject])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.sanDns, JSON.stringify(sanDns))
  }, [sanDns])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.sanIp, JSON.stringify(sanIp))
  }, [sanIp])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.sanEmail, JSON.stringify(sanEmail))
  }, [sanEmail])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEYS.sanUri, JSON.stringify(sanUri))
  }, [sanUri])

  function resetOutput() {
    generationId.current += 1
    setState({ status: "idle" })
  }

  function handleReset() {
    setKeySource("generate")
    setAlgorithm("rsa")
    setRsaKeySize(2048)
    setRsaHash("SHA-256")
    setEcCurve("P-256")
    setKeyPem("")
    setSubject(DEFAULT_SUBJECT)
    setSanDns("")
    setSanIp("")
    setSanEmail("")
    setSanUri("")
    resetOutput()
  }

  async function handleGenerate() {
    const nextId = generationId.current + 1
    generationId.current = nextId
    setState({ status: "loading" })

    try {
      const result = await generateCsr({
        keySource,
        algorithm,
        rsaKeySize,
        rsaHash,
        ecCurve,
        keyPem,
        subject,
        san: {
          dns: splitLines(sanDns),
          ip: splitLines(sanIp),
          email: splitLines(sanEmail),
          uri: splitLines(sanUri),
        },
      })

      if (generationId.current === nextId) {
        setState({ status: "ready", result })
      }
    } catch (error) {
      if (generationId.current === nextId) {
        setState({
          status: "error",
          message: resolveErrorMessage(error, messages),
        })
      }
    }
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]"
      onSubmit={(event) => {
        event.preventDefault()
        if (state.status !== "loading") {
          void handleGenerate()
        }
      }}
    >
      <CsrOptionsCard
        keySource={keySource}
        algorithm={algorithm}
        rsaKeySize={rsaKeySize}
        rsaHash={rsaHash}
        ecCurve={ecCurve}
        keyPem={keyPem}
        subject={subject}
        sanDns={sanDns}
        sanIp={sanIp}
        sanEmail={sanEmail}
        sanUri={sanUri}
        generating={state.status === "loading"}
        messages={messages}
        onKeySourceChange={(value) => {
          setKeySource(value)
          resetOutput()
        }}
        onAlgorithmChange={(value) => {
          setAlgorithm(value)
          resetOutput()
        }}
        onRsaKeySizeChange={(value) => {
          setRsaKeySize(value)
          resetOutput()
        }}
        onRsaHashChange={(value) => {
          setRsaHash(value)
          resetOutput()
        }}
        onEcCurveChange={(value) => {
          setEcCurve(value)
          resetOutput()
        }}
        onKeyPemChange={(value) => {
          setKeyPem(value)
          resetOutput()
        }}
        onSubjectChange={(value) => {
          setSubject(value)
          resetOutput()
        }}
        onSanDnsChange={(value) => {
          setSanDns(value)
          resetOutput()
        }}
        onSanIpChange={(value) => {
          setSanIp(value)
          resetOutput()
        }}
        onSanEmailChange={(value) => {
          setSanEmail(value)
          resetOutput()
        }}
        onSanUriChange={(value) => {
          setSanUri(value)
          resetOutput()
        }}
        onReset={handleReset}
      />

      <CsrOutputCard messages={messages} state={state} />
    </form>
  )
}

const ERROR_MESSAGES: Readonly<
  Record<CsrErrorCode, keyof CsrGeneratorMessages>
> = {
  MISSING_SUBJECT_OR_SAN: "errorMissingSubjectOrSan",
  MISSING_PRIVATE_KEY: "errorMissingPrivateKey",
  INVALID_PEM: "errorInvalidPem",
  UNSUPPORTED_PEM: "errorUnsupportedPem",
  LEGACY_PEM: "errorLegacyPem",
  ENCRYPTED_KEY: "errorEncryptedKey",
  UNSUPPORTED_KEY_TYPE: "errorUnsupportedKeyType",
  UNSUPPORTED_CURVE: "errorUnsupportedCurve",
  INVALID_SAN_IP: "errorInvalidSanIp",
  WEB_CRYPTO_UNAVAILABLE: "errorWebCryptoUnavailable",
  IMPORT_FAILED: "errorImportFailed",
  GENERATION_FAILED: "errorGenerationFailed",
}

function resolveErrorMessage(
  error: unknown,
  messages: CsrGeneratorMessages
): string {
  if (error instanceof CsrGeneratorError) {
    const messageKey = ERROR_MESSAGES[error.code]
    const template = messages[messageKey]
    if (error.detail) {
      return template.replace("{detail}", error.detail)
    }
    return template
  }
  /* v8 ignore next 3 */
  if (error instanceof Error) {
    return error.message
  }
  /* v8 ignore next */
  return String(error)
}

export default CsrGeneratorClient
