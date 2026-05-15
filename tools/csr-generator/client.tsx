import { useEffect, useId, useState, type FormEvent } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import { LoaderCircle, RefreshCcw } from "@workspace/ui/icons"

import {
  createCsr,
  splitSanInput,
  type EcCurve,
  type HashAlgorithm,
  type KeyAlgorithm,
  type KeySource,
  type RsaKeySize,
  type SubjectInput,
} from "./core/csr"
import { KeySettingsCard } from "./client/key-settings-card"
import { ResultCard, type CsrGenerationResult } from "./client/result-card"
import { SanCard, type SanTextFields } from "./client/san-card"
import {
  defaultSan,
  defaultSubject,
  formatError,
  getInitialPreferences,
  persistPreferences,
  toGenerationResult,
} from "./client/state"
import { SubjectCard } from "./client/subject-card"
import type { CsrGeneratorMessages } from "./client/types"

function CsrGeneratorClient({
  messages,
}: Readonly<{ messages: CsrGeneratorMessages }>) {
  const privateKeyInputId = useId()
  const privateKeyFileInputId = useId()
  const subjectIds = {
    commonName: useId(),
    organization: useId(),
    organizationalUnit: useId(),
    country: useId(),
    state: useId(),
    locality: useId(),
    emailAddress: useId(),
  }
  const sanIds = {
    dns: useId(),
    ip: useId(),
    email: useId(),
    uri: useId(),
  }

  const initialPreferences = getInitialPreferences()
  const [keySource, setKeySource] = useState<KeySource>(
    initialPreferences.keySource
  )
  const [algorithm, setAlgorithm] = useState<KeyAlgorithm>(
    initialPreferences.algorithm
  )
  const [rsaKeySize, setRsaKeySize] = useState<RsaKeySize>(
    initialPreferences.rsaKeySize
  )
  const [rsaHash, setRsaHash] = useState<HashAlgorithm>(
    initialPreferences.rsaHash
  )
  const [ecCurve, setEcCurve] = useState<EcCurve>(initialPreferences.ecCurve)
  const [subject, setSubject] = useState<SubjectInput>(defaultSubject)
  const [san, setSan] = useState<SanTextFields>(defaultSan)
  const [privateKeyText, setPrivateKeyText] = useState("")
  const [result, setResult] = useState<CsrGenerationResult | null>(null)
  const [error, setError] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    persistPreferences({ keySource, algorithm, rsaKeySize, rsaHash, ecCurve })
  }, [algorithm, ecCurve, keySource, rsaHash, rsaKeySize])

  function clearResult() {
    setResult(null)
    setError("")
  }

  function handleSubjectChange(field: keyof SubjectInput, value: string) {
    setSubject((current) => ({ ...current, [field]: value }))
    clearResult()
  }

  function handleSanChange(field: keyof SanTextFields, value: string) {
    setSan((current) => ({ ...current, [field]: value }))
    clearResult()
  }

  function handleReset() {
    setKeySource("generate")
    setAlgorithm("rsa")
    setRsaKeySize(2048)
    setRsaHash("SHA-256")
    setEcCurve("P-256")
    setSubject(defaultSubject)
    setSan(defaultSan)
    setPrivateKeyText("")
    setResult(null)
    setError("")
  }

  async function handlePrivateKeyFileChange(file: File | null) {
    if (!file) return

    try {
      setPrivateKeyText(await file.text())
      clearResult()
    } catch {
      setError(messages.readFileError)
    }
  }

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsGenerating(true)
    setError("")
    setResult(null)

    try {
      const output = await createCsr({
        keySource,
        algorithm,
        rsaKeySize,
        rsaHash,
        ecCurve,
        keyPem: privateKeyText,
        subject,
        san: {
          dns: splitSanInput(san.dns),
          ip: splitSanInput(san.ip),
          email: splitSanInput(san.email),
          uri: splitSanInput(san.uri),
        },
      })
      setResult(toGenerationResult(output, subject, san, messages))
    } catch (caughtError) {
      setError(formatError(caughtError, messages))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,32rem)_minmax(0,1fr)]"
      onSubmit={(event) => {
        void handleGenerate(event)
      }}
    >
      <div className="grid gap-6">
        <KeySettingsCard
          algorithm={algorithm}
          ecCurve={ecCurve}
          ids={{
            privateKey: privateKeyInputId,
            privateKeyFile: privateKeyFileInputId,
          }}
          keySource={keySource}
          messages={messages}
          privateKeyText={privateKeyText}
          rsaHash={rsaHash}
          rsaKeySize={rsaKeySize}
          onAlgorithmChange={(value) => {
            setAlgorithm(value)
            clearResult()
          }}
          onEcCurveChange={(value) => {
            setEcCurve(value)
            clearResult()
          }}
          onKeySourceChange={(value) => {
            setKeySource(value)
            clearResult()
          }}
          onPrivateKeyFileChange={(file) => {
            void handlePrivateKeyFileChange(file)
          }}
          onPrivateKeyTextChange={(value) => {
            setPrivateKeyText(value)
            clearResult()
          }}
          onRsaHashChange={(value) => {
            setRsaHash(value)
            clearResult()
          }}
          onRsaKeySizeChange={(value) => {
            setRsaKeySize(value)
            clearResult()
          }}
        />

        <SubjectCard
          ids={subjectIds}
          messages={messages}
          subject={subject}
          onSubjectChange={handleSubjectChange}
        />

        <SanCard
          ids={sanIds}
          messages={messages}
          san={san}
          onSanChange={handleSanChange}
        />

        <div className="flex flex-wrap justify-between gap-3">
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCcw data-icon="inline-start" aria-hidden="true" />
            {messages.resetLabel}
          </Button>
          <Button type="submit" size="sm" aria-busy={isGenerating}>
            {isGenerating ? (
              <LoaderCircle
                data-icon="inline-start"
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
            {isGenerating
              ? messages.generatingLabel
              : result
                ? messages.regenerateLabel
                : messages.generateLabel}
          </Button>
        </div>
      </div>

      <div className="min-w-0 self-start xl:sticky xl:top-6">
        <ResultCard
          error={error}
          isGenerating={isGenerating}
          messages={messages}
          result={result}
        />
      </div>
    </form>
  )
}

export default CsrGeneratorClient
