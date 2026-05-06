import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react"

import {
  DEFAULT_PBKDF2_ITERATIONS,
  MAX_PBKDF2_ITERATIONS,
  MIN_PBKDF2_ITERATIONS,
  encryptAes,
  validateRawKeyHex,
  type AesMode,
  type KeyLengthBits,
  type KeySource,
  type Pbkdf2Hash,
} from "./core/aes-encryptor"
import { InputCard } from "./client/input-card"
import { KeyCard } from "./client/key-card"
import { OptionsCard } from "./client/options-card"
import { ResultCard } from "./client/result-card"
import { getValidationMessage } from "./client/validation"

import type { AesEncryptorMessages } from "./client/types"

type AesEncryptorClientProps = Readonly<{
  messages: AesEncryptorMessages
}>

function AesEncryptorClient({ messages }: AesEncryptorClientProps) {
  const textInputId = useId()
  const fileInputId = useId()
  const passwordInputId = useId()
  const rawKeyInputId = useId()
  const iterationsInputId = useId()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const downloadUrlRef = useRef<string | null>(null)

  const [text, setText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [keySource, setKeySource] = useState<KeySource>("password")
  const [password, setPassword] = useState("")
  const [rawKeyHex, setRawKeyHex] = useState("")
  const [mode, setMode] = useState<AesMode>("GCM")
  const [keyLengthBits, setKeyLengthBits] = useState<KeyLengthBits>(256)
  const [pbkdf2Iterations, setPbkdf2Iterations] = useState(
    String(DEFAULT_PBKDF2_ITERATIONS)
  )
  const [pbkdf2Hash, setPbkdf2Hash] = useState<Pbkdf2Hash>("SHA-256")
  const [resultJson, setResultJson] = useState("")
  const [downloadFileName, setDownloadFileName] = useState("aes-encrypted.json")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isEncrypting, setIsEncrypting] = useState(false)

  const iterations = Number(pbkdf2Iterations)
  const rawKeyInvalid =
    keySource === "raw" &&
    rawKeyHex.trim() !== "" &&
    !validateRawKeyHex(rawKeyHex, keyLengthBits)
  const iterationsInvalid =
    keySource === "password" &&
    (!Number.isInteger(iterations) ||
      iterations < MIN_PBKDF2_ITERATIONS ||
      iterations > MAX_PBKDF2_ITERATIONS)
  const validationMessage = getValidationMessage({
    messages,
    keyLengthBits,
    keySource,
    password,
    rawKeyHex,
    selectedFile,
    text,
    iterationsInvalid,
  })
  const canEncrypt = !validationMessage && !isEncrypting
  const securityNote = useMemo(() => {
    if (mode === "GCM") return messages.gcmNote
    return mode === "CBC" ? messages.cbcWarning : messages.ctrWarning
  }, [messages, mode])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!resultJson) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([resultJson], { type: "application/json;charset=utf-8" })
    )
    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [resultJson])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null)
    event.target.value = ""
  }

  async function handleEncrypt() {
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    setIsEncrypting(true)
    setError("")
    setResultJson("")

    try {
      const file = selectedFile
      const result = await encryptAes({
        plaintext: file ? await file.arrayBuffer() : text,
        mode,
        keyLengthBits,
        keySource,
        password: keySource === "password" ? password : undefined,
        rawKeyHex: keySource === "raw" ? rawKeyHex : undefined,
        pbkdf2Hash,
        pbkdf2Iterations: iterations,
        metadata: file
          ? {
              type: "file",
              name: file.name,
              mimeType: file.type || "application/octet-stream",
              size: file.size,
            }
          : { type: "text" },
      })

      setResultJson(result.json)
      setDownloadFileName(file ? `${file.name}.aes.json` : "aes-encrypted.json")
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : String(caughtError)
      )
    } finally {
      setIsEncrypting(false)
    }
  }

  function handleReset() {
    setText("")
    setSelectedFile(null)
    setPassword("")
    setRawKeyHex("")
    setMode("GCM")
    setKeyLengthBits(256)
    setPbkdf2Iterations(String(DEFAULT_PBKDF2_ITERATIONS))
    setPbkdf2Hash("SHA-256")
    setResultJson("")
    setError("")
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
      <div className="grid gap-6">
        <InputCard
          fileInputId={fileInputId}
          fileInputRef={fileInputRef}
          messages={messages}
          selectedFile={selectedFile}
          text={text}
          textInputId={textInputId}
          onFileChange={handleFileChange}
          onFileClear={() => setSelectedFile(null)}
          onTextChange={setText}
        />
        <KeyCard
          keyLengthBits={keyLengthBits}
          keySource={keySource}
          messages={messages}
          password={password}
          passwordInputId={passwordInputId}
          rawKeyHex={rawKeyHex}
          rawKeyInputId={rawKeyInputId}
          rawKeyInvalid={rawKeyInvalid}
          onKeySourceChange={setKeySource}
          onPasswordChange={setPassword}
          onRawKeyHexChange={setRawKeyHex}
        />
        <OptionsCard
          canEncrypt={canEncrypt}
          iterationsInputId={iterationsInputId}
          iterationsInvalid={iterationsInvalid}
          keyLengthBits={keyLengthBits}
          keySource={keySource}
          messages={messages}
          mode={mode}
          pbkdf2Hash={pbkdf2Hash}
          pbkdf2Iterations={pbkdf2Iterations}
          securityNote={securityNote}
          onEncrypt={() => void handleEncrypt()}
          onKeyLengthChange={setKeyLengthBits}
          onModeChange={setMode}
          onPbkdf2HashChange={setPbkdf2Hash}
          onPbkdf2IterationsChange={setPbkdf2Iterations}
          onReset={handleReset}
        />
      </div>
      <div className="min-w-0 self-start xl:sticky xl:top-6">
        <ResultCard
          downloadFileName={downloadFileName}
          downloadUrl={downloadUrl}
          error={error}
          messages={messages}
          resultJson={resultJson}
        />
      </div>
    </div>
  )
}

export default AesEncryptorClient
