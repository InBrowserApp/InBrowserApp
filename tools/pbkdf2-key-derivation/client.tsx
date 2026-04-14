import {
  useDeferredValue,
  useEffect,
  useId,
  useState,
  type ChangeEvent,
} from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { LoaderCircle } from "@workspace/ui/icons"

import {
  DEFAULT_ALGORITHM,
  DEFAULT_ITERATIONS,
  DEFAULT_LENGTH,
  DEFAULT_SALT_FORMAT,
  MAX_ITERATIONS,
  MAX_LENGTH,
  MIN_ITERATIONS,
  MIN_LENGTH,
  PBKDF2_ALGORITHM_OPTIONS,
  SALT_FORMAT_OPTIONS,
  STORAGE_KEYS,
} from "./client/constants"
import type { Pbkdf2KeyDerivationPageMessages } from "./client/types"
import { getInvalidSaltFormat } from "./client/utils"
import { ConfigurationCard } from "./components/configuration-card"
import {
  DerivedKeySection,
  type DerivedKeyState,
} from "./components/derived-key-section"
import { InputCard, formatFileSize } from "./components/input-card"
import {
  derivePbkdf2,
  parseIntegerRangeInput,
  type Pbkdf2Algorithm,
  type SaltFormat,
} from "./core/pbkdf2"

type Pbkdf2KeyDerivationClientProps = Readonly<{
  messages: Pbkdf2KeyDerivationPageMessages
}>

function Pbkdf2KeyDerivationClient({
  messages,
}: Pbkdf2KeyDerivationClientProps) {
  const passwordId = useId()
  const saltId = useId()
  const iterationsId = useId()
  const lengthId = useId()

  const [password, setPassword] = useState("")
  const [saltText, setSaltText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [algorithm, setAlgorithm] = useState<Pbkdf2Algorithm>(DEFAULT_ALGORITHM)
  const [saltFormat, setSaltFormat] = useState<SaltFormat>(DEFAULT_SALT_FORMAT)
  const [iterationsInput, setIterationsInput] = useState(DEFAULT_ITERATIONS)
  const [lengthInput, setLengthInput] = useState(DEFAULT_LENGTH)
  const [derivedKeyState, setDerivedKeyState] = useState<DerivedKeyState>({
    status: "idle",
  })

  const deferredPassword = useDeferredValue(password)
  const deferredSaltText = useDeferredValue(saltText)
  const iterationsState = parseIntegerRangeInput(
    iterationsInput,
    MIN_ITERATIONS,
    MAX_ITERATIONS,
    Number.parseInt(DEFAULT_ITERATIONS, 10)
  )
  const lengthState = parseIntegerRangeInput(
    lengthInput,
    MIN_LENGTH,
    MAX_LENGTH,
    Number.parseInt(DEFAULT_LENGTH, 10)
  )
  const invalidSaltFormat = getInvalidSaltFormat(
    deferredSaltText,
    selectedFile,
    saltFormat
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedAlgorithm = window.localStorage.getItem(STORAGE_KEYS.algorithm)
    const storedSaltFormat = window.localStorage.getItem(
      STORAGE_KEYS.saltFormat
    )
    const storedIterations = window.localStorage.getItem(
      STORAGE_KEYS.iterations
    )
    const storedLength = window.localStorage.getItem(STORAGE_KEYS.length)

    const nextAlgorithm = PBKDF2_ALGORITHM_OPTIONS.find(
      (option) => option.value === storedAlgorithm
    )?.value
    const nextSaltFormat = SALT_FORMAT_OPTIONS.find(
      (option) => option.value === storedSaltFormat
    )?.value

    if (nextAlgorithm) {
      setAlgorithm(nextAlgorithm)
    }

    if (nextSaltFormat) {
      setSaltFormat(nextSaltFormat)
    }

    if (storedIterations !== null) {
      setIterationsInput(storedIterations)
    }

    if (storedLength !== null) {
      setLengthInput(storedLength)
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

    window.localStorage.setItem(STORAGE_KEYS.saltFormat, saltFormat)
  }, [saltFormat])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.iterations, iterationsInput)
  }, [iterationsInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.length, lengthInput)
  }, [lengthInput])

  useEffect(() => {
    let cancelled = false

    const saltSource = selectedFile
      ? selectedFile
      : deferredSaltText.trim().length > 0
        ? deferredSaltText
        : null

    if (
      !deferredPassword ||
      !saltSource ||
      invalidSaltFormat ||
      !iterationsState.isValid ||
      !lengthState.isValid
    ) {
      setDerivedKeyState({ status: "idle" })
      return
    }

    setDerivedKeyState({ status: "loading" })

    void derivePbkdf2({
      password: deferredPassword,
      salt: saltSource,
      saltFormat,
      iterations: iterationsState.value,
      lengthBytes: lengthState.value,
      hash: algorithm,
    })
      .then((derivedKey) => {
        if (!cancelled) {
          setDerivedKeyState({ status: "ready", derivedKey })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDerivedKeyState({
            status: "error",
            message:
              error instanceof Error
                ? error.message
                : "Failed to derive the key from the provided input.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    algorithm,
    deferredPassword,
    deferredSaltText,
    invalidSaltFormat,
    iterationsState.isValid,
    iterationsState.value,
    lengthState.isValid,
    lengthState.value,
    saltFormat,
    selectedFile,
  ])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) {
      return
    }

    setSelectedFile(nextFile)
  }

  return (
    <div className="grid gap-6">
      <ConfigurationCard
        passwordId={passwordId}
        iterationsId={iterationsId}
        lengthId={lengthId}
        password={password}
        algorithm={algorithm}
        saltFormat={saltFormat}
        iterationsInput={iterationsInput}
        lengthInput={lengthInput}
        iterationsValid={iterationsState.isValid}
        lengthValid={lengthState.isValid}
        messages={messages}
        onPasswordChange={setPassword}
        onAlgorithmChange={setAlgorithm}
        onSaltFormatChange={setSaltFormat}
        onIterationsChange={setIterationsInput}
        onLengthChange={setLengthInput}
      />

      <InputCard
        saltId={saltId}
        saltText={saltText}
        selectedFile={selectedFile}
        invalidSaltFormat={invalidSaltFormat}
        messages={messages}
        onSaltTextChange={setSaltText}
        onFileChange={handleFileChange}
        onSwitchToText={() => {
          setSelectedFile(null)
        }}
      />

      <Card>
        <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="grid gap-1">
            <CardTitle>{messages.derivedKeyLabel}</CardTitle>
            <CardDescription>
              {selectedFile
                ? `${selectedFile.name} • ${formatFileSize(selectedFile.size)}`
                : messages.derivedKeyDescription}
            </CardDescription>
          </div>
          {derivedKeyState.status === "loading" ? (
            <CardAction>
              <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-1 flex-col">
          <DerivedKeySection state={derivedKeyState} messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Pbkdf2KeyDerivationClient
