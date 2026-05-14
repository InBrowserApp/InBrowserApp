import {
  useDeferredValue,
  useEffect,
  useId,
  useState,
  type ChangeEvent,
} from "react"
import {
  DEFAULT_BLOCK_SIZE,
  DEFAULT_COST_FACTOR,
  DEFAULT_LENGTH,
  DEFAULT_PARALLELISM,
  DEFAULT_SALT_FORMAT,
  MAX_BLOCK_SIZE,
  MAX_COST_FACTOR,
  MAX_LENGTH,
  MAX_PARALLELISM,
  MIN_BLOCK_SIZE,
  MIN_COST_FACTOR,
  MIN_LENGTH,
  MIN_PARALLELISM,
  SALT_FORMAT_OPTIONS,
  STORAGE_KEYS,
} from "./client/constants"
import type { ScryptKeyDerivationPageMessages } from "./client/types"
import {
  formatMemoryUsage,
  getInvalidSaltFormat,
  persistSetting,
} from "./client/utils"
import { ConfigurationCard } from "./components/configuration-card"
import type { DerivedKeyState } from "./components/derived-key-section"
import { InputCard } from "./components/input-card"
import { ResultCard } from "./components/result-card"
import {
  deriveScrypt,
  estimateScryptMemoryBytes,
  generateRandomSalt,
  parseCostFactorInput,
  parseIntegerRangeInput,
  type SaltFormat,
} from "./core/scrypt"

type ScryptKeyDerivationClientProps = Readonly<{
  messages: ScryptKeyDerivationPageMessages
}>

function ScryptKeyDerivationClient({
  messages,
}: ScryptKeyDerivationClientProps) {
  const passwordId = useId()
  const saltId = useId()
  const costFactorId = useId()
  const blockSizeId = useId()
  const parallelismId = useId()
  const lengthId = useId()

  const [password, setPassword] = useState("")
  const [saltText, setSaltText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [saltFormat, setSaltFormat] = useState<SaltFormat>(DEFAULT_SALT_FORMAT)
  const [costFactorInput, setCostFactorInput] = useState(DEFAULT_COST_FACTOR)
  const [blockSizeInput, setBlockSizeInput] = useState(DEFAULT_BLOCK_SIZE)
  const [parallelismInput, setParallelismInput] = useState(DEFAULT_PARALLELISM)
  const [lengthInput, setLengthInput] = useState(DEFAULT_LENGTH)
  const [derivedKeyState, setDerivedKeyState] = useState<DerivedKeyState>({
    status: "idle",
  })

  const deferredPassword = useDeferredValue(password)
  const deferredSaltText = useDeferredValue(saltText)
  const blockSizeState = parseIntegerRangeInput(
    blockSizeInput,
    MIN_BLOCK_SIZE,
    MAX_BLOCK_SIZE,
    Number.parseInt(DEFAULT_BLOCK_SIZE, 10)
  )
  const costFactorState = parseCostFactorInput(
    costFactorInput,
    MIN_COST_FACTOR,
    MAX_COST_FACTOR,
    Number.parseInt(DEFAULT_COST_FACTOR, 10),
    blockSizeState.value
  )
  const parallelismState = parseIntegerRangeInput(
    parallelismInput,
    MIN_PARALLELISM,
    MAX_PARALLELISM,
    Number.parseInt(DEFAULT_PARALLELISM, 10)
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
  const memoryEstimate = formatMemoryUsage(
    estimateScryptMemoryBytes(costFactorState.value, blockSizeState.value)
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedSaltFormat = window.localStorage.getItem(
      STORAGE_KEYS.saltFormat
    )
    const storedCostFactor = window.localStorage.getItem(
      STORAGE_KEYS.costFactor
    )
    const storedBlockSize = window.localStorage.getItem(STORAGE_KEYS.blockSize)
    const storedParallelism = window.localStorage.getItem(
      STORAGE_KEYS.parallelism
    )
    const storedLength = window.localStorage.getItem(STORAGE_KEYS.length)
    const nextSaltFormat = SALT_FORMAT_OPTIONS.find(
      (option) => option.value === storedSaltFormat
    )?.value

    if (nextSaltFormat) setSaltFormat(nextSaltFormat)
    if (storedCostFactor !== null) setCostFactorInput(storedCostFactor)
    if (storedBlockSize !== null) setBlockSizeInput(storedBlockSize)
    if (storedParallelism !== null) setParallelismInput(storedParallelism)
    if (storedLength !== null) setLengthInput(storedLength)
  }, [])

  useEffect(() => {
    persistSetting(STORAGE_KEYS.saltFormat, saltFormat)
  }, [saltFormat])

  useEffect(() => {
    persistSetting(STORAGE_KEYS.costFactor, costFactorInput)
  }, [costFactorInput])

  useEffect(() => {
    persistSetting(STORAGE_KEYS.blockSize, blockSizeInput)
  }, [blockSizeInput])

  useEffect(() => {
    persistSetting(STORAGE_KEYS.parallelism, parallelismInput)
  }, [parallelismInput])

  useEffect(() => {
    persistSetting(STORAGE_KEYS.length, lengthInput)
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
      !costFactorState.isValid ||
      !blockSizeState.isValid ||
      !parallelismState.isValid ||
      !lengthState.isValid
    ) {
      setDerivedKeyState({ status: "idle" })
      return
    }

    setDerivedKeyState((currentState) => ({
      status: "loading",
      derivedKey:
        currentState.status === "ready" || currentState.status === "loading"
          ? currentState.derivedKey
          : null,
    }))

    void deriveScrypt({
      password: deferredPassword,
      salt: saltSource,
      saltFormat,
      costFactor: costFactorState.value,
      blockSize: blockSizeState.value,
      parallelism: parallelismState.value,
      lengthBytes: lengthState.value,
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
              error instanceof Error ? error.message : messages.deriveError,
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [
    blockSizeState.isValid,
    blockSizeState.value,
    costFactorState.isValid,
    costFactorState.value,
    deferredPassword,
    deferredSaltText,
    invalidSaltFormat,
    lengthState.isValid,
    lengthState.value,
    messages.deriveError,
    parallelismState.isValid,
    parallelismState.value,
    saltFormat,
    selectedFile,
  ])

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0]
    event.target.value = ""

    if (!nextFile) return

    setSelectedFile(nextFile)
  }

  function handleGenerateSalt() {
    try {
      setSelectedFile(null)
      setSaltText(generateRandomSalt(saltFormat))
    } catch (error) {
      setDerivedKeyState({
        status: "error",
        message: error instanceof Error ? error.message : messages.deriveError,
      })
    }
  }

  return (
    <div className="grid gap-6">
      <ConfigurationCard
        passwordId={passwordId}
        costFactorId={costFactorId}
        blockSizeId={blockSizeId}
        parallelismId={parallelismId}
        lengthId={lengthId}
        password={password}
        saltFormat={saltFormat}
        costFactorInput={costFactorInput}
        blockSizeInput={blockSizeInput}
        parallelismInput={parallelismInput}
        lengthInput={lengthInput}
        costFactorState={costFactorState}
        blockSizeValid={blockSizeState.isValid}
        parallelismValid={parallelismState.isValid}
        lengthValid={lengthState.isValid}
        memoryEstimate={memoryEstimate}
        messages={messages}
        onPasswordChange={setPassword}
        onSaltFormatChange={setSaltFormat}
        onCostFactorChange={setCostFactorInput}
        onBlockSizeChange={setBlockSizeInput}
        onParallelismChange={setParallelismInput}
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
        onGenerateSalt={handleGenerateSalt}
      />

      <ResultCard
        state={derivedKeyState}
        selectedFile={selectedFile}
        messages={messages}
      />
    </div>
  )
}

export default ScryptKeyDerivationClient
