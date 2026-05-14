import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  decryptAesJson,
  parseAesEnvelope,
  validateRawKeyHex,
} from "./core/aes-decryptor"
import { EnvelopeCard } from "./client/envelope-card"
import { InputCard } from "./client/input-card"
import { KeyCard } from "./client/key-card"
import { ResultCard } from "./client/result-card"
import {
  createDownloadName,
  createMimeType,
  getDisplayError,
  getValidationMessage,
} from "./client/validation"

import type {
  AesDecryptorMessages,
  DecryptOutput,
  ParsedEnvelopeState,
} from "./client/types"

type AesDecryptorClientProps = Readonly<{
  messages: AesDecryptorMessages
}>

const TEXT_DECODER = new TextDecoder()

function AesDecryptorClient({ messages }: AesDecryptorClientProps) {
  const jsonInputId = useId()
  const fileInputId = useId()
  const passwordInputId = useId()
  const rawKeyInputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [jsonInput, setJsonInput] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [rawKeyHex, setRawKeyHex] = useState("")
  const [output, setOutput] = useState<DecryptOutput | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)

  const parsedEnvelope = useMemo(
    () => parseInputEnvelope(jsonInput),
    [jsonInput]
  )
  const envelope =
    parsedEnvelope.status === "valid" ? parsedEnvelope.envelope : null
  const rawKeyInvalid =
    envelope?.key.source === "raw" &&
    rawKeyHex.trim() !== "" &&
    !validateRawKeyHex(rawKeyHex, envelope.key.lengthBits)
  const validationMessage = getValidationMessage({
    messages,
    password,
    parsedEnvelope,
    rawKeyHex,
  })
  const canDecrypt = !validationMessage && !isDecrypting

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!output) {
      setDownloadUrl(null)
      return
    }

    const bytes = output.bytes.slice()
    const nextUrl = URL.createObjectURL(
      new Blob([bytes.buffer], { type: output.mimeType })
    )
    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [output])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    event.target.value = ""
    setSelectedFile(file)
    setOutput(null)
    setError("")

    if (!file) return

    try {
      setJsonInput(await file.text())
    } catch (caughtError) {
      setError(getDisplayError(caughtError, messages))
    }
  }

  async function handleDecrypt() {
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setIsDecrypting(true)
    setError("")
    setOutput(null)

    try {
      const result = await decryptAesJson(jsonInput, {
        password: envelope?.key.source === "password" ? password : undefined,
        rawKeyHex: envelope?.key.source === "raw" ? rawKeyHex : undefined,
      })

      setOutput({
        bytes: result.plaintext,
        text: TEXT_DECODER.decode(result.plaintext),
        fileName: createDownloadName(result.envelope),
        mimeType: createMimeType(result.envelope),
        isFile: result.envelope.plaintext.type === "file",
      })
    } catch (caughtError) {
      setError(getDisplayError(caughtError, messages))
    } finally {
      setIsDecrypting(false)
    }
  }

  function handleReset() {
    setJsonInput("")
    setSelectedFile(null)
    setPassword("")
    setRawKeyHex("")
    setOutput(null)
    setError("")
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <div className="grid gap-6">
        <InputCard
          fileInputId={fileInputId}
          fileInputRef={fileInputRef}
          jsonInput={jsonInput}
          jsonInputId={jsonInputId}
          messages={messages}
          selectedFile={selectedFile}
          onFileChange={(event) => void handleFileChange(event)}
          onFileClear={() => {
            setSelectedFile(null)
            setJsonInput("")
            setOutput(null)
            setError("")
          }}
          onJsonInputChange={(value) => {
            setJsonInput(value)
            setOutput(null)
            setError("")
          }}
        />
        <KeyCard
          envelope={envelope}
          messages={messages}
          password={password}
          passwordInputId={passwordInputId}
          rawKeyHex={rawKeyHex}
          rawKeyInputId={rawKeyInputId}
          rawKeyInvalid={rawKeyInvalid}
          onPasswordChange={setPassword}
          onRawKeyHexChange={setRawKeyHex}
        />
        <EnvelopeCard
          canDecrypt={canDecrypt}
          messages={messages}
          parsedEnvelope={parsedEnvelope}
          onDecrypt={() => void handleDecrypt()}
          onReset={handleReset}
        />
      </div>
      <div className="min-w-0 self-start xl:sticky xl:top-6">
        <ResultCard
          downloadUrl={downloadUrl}
          error={error}
          messages={messages}
          output={output}
        />
      </div>
    </div>
  )
}

function parseInputEnvelope(input: string): ParsedEnvelopeState {
  if (input.trim().length === 0) {
    return { status: "empty", envelope: null, error: "" }
  }

  try {
    return { status: "valid", envelope: parseAesEnvelope(input), error: "" }
  } catch (caughtError) {
    return {
      status: "invalid",
      envelope: null,
      error:
        caughtError instanceof Error
          ? caughtError.message
          : String(caughtError),
    }
  }
}

export default AesDecryptorClient
