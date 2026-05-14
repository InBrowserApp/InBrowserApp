import { useEffect, useId, useState, type FormEvent } from "react"

import {
  DEFAULT_ALGORITHM,
  DEFAULT_HASH_LENGTH,
  DEFAULT_ITERATIONS,
  DEFAULT_MEMORY_SIZE,
  DEFAULT_PARALLELISM,
  MAX_HASH_LENGTH,
  MAX_ITERATIONS,
  MAX_MEMORY_SIZE,
  MAX_PARALLELISM,
  MIN_HASH_LENGTH,
  MIN_ITERATIONS,
  MIN_MEMORY_SIZE,
  MIN_PARALLELISM,
  STORAGE_KEYS,
} from "./client/constants"
import type { Argon2HashPasswordPageMessages } from "./client/types"
import { ConfigurationCard } from "./components/configuration-card"
import { ParametersCard } from "./components/parameters-card"
import { ResultCard, type HashState } from "./components/result-card"
import { SaltCard } from "./components/salt-card"
import {
  formatMemorySize,
  generateArgon2Hash,
  generateRandomSalt,
  parseIntegerRangeInput,
  validateBase64Salt,
  type Argon2Algorithm,
} from "./core/argon2"

type Argon2HashPasswordClientProps = Readonly<{
  messages: Argon2HashPasswordPageMessages
}>

function Argon2HashPasswordClient({ messages }: Argon2HashPasswordClientProps) {
  const passwordId = useId()
  const secretId = useId()
  const saltId = useId()
  const iterationsId = useId()
  const memorySizeId = useId()
  const parallelismId = useId()
  const hashLengthId = useId()

  const [password, setPassword] = useState("")
  const [secret, setSecret] = useState("")
  const [salt, setSalt] = useState("")
  const [algorithm, setAlgorithm] = useState<Argon2Algorithm>(DEFAULT_ALGORITHM)
  const [iterationsInput, setIterationsInput] = useState(DEFAULT_ITERATIONS)
  const [memorySizeInput, setMemorySizeInput] = useState(DEFAULT_MEMORY_SIZE)
  const [parallelismInput, setParallelismInput] = useState(DEFAULT_PARALLELISM)
  const [hashLengthInput, setHashLengthInput] = useState(DEFAULT_HASH_LENGTH)
  const [hashState, setHashState] = useState<HashState>({ status: "idle" })

  const iterationsState = parseIntegerRangeInput(
    iterationsInput,
    MIN_ITERATIONS,
    MAX_ITERATIONS,
    Number.parseInt(DEFAULT_ITERATIONS, 10)
  )
  const memorySizeState = parseIntegerRangeInput(
    memorySizeInput,
    MIN_MEMORY_SIZE,
    MAX_MEMORY_SIZE,
    Number.parseInt(DEFAULT_MEMORY_SIZE, 10)
  )
  const parallelismState = parseIntegerRangeInput(
    parallelismInput,
    MIN_PARALLELISM,
    MAX_PARALLELISM,
    Number.parseInt(DEFAULT_PARALLELISM, 10)
  )
  const hashLengthState = parseIntegerRangeInput(
    hashLengthInput,
    MIN_HASH_LENGTH,
    MAX_HASH_LENGTH,
    Number.parseInt(DEFAULT_HASH_LENGTH, 10)
  )
  const saltValidation = salt.trim() ? validateBase64Salt(salt) : "tooShort"
  const memoryDependencyValid =
    memorySizeState.value >= parallelismState.value * 8
  const memoryEstimate = formatMemorySize(memorySizeState.value)
  const canGenerate =
    password.length > 0 &&
    saltValidation === "" &&
    iterationsState.isValid &&
    memorySizeState.isValid &&
    parallelismState.isValid &&
    hashLengthState.isValid &&
    memoryDependencyValid

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedAlgorithm = window.localStorage.getItem(STORAGE_KEYS.algorithm)
    const storedIterations = window.localStorage.getItem(
      STORAGE_KEYS.iterations
    )
    const storedMemorySize = window.localStorage.getItem(
      STORAGE_KEYS.memorySize
    )
    const storedParallelism = window.localStorage.getItem(
      STORAGE_KEYS.parallelism
    )
    const storedHashLength = window.localStorage.getItem(
      STORAGE_KEYS.hashLength
    )

    if (
      storedAlgorithm === "argon2id" ||
      storedAlgorithm === "argon2i" ||
      storedAlgorithm === "argon2d"
    ) {
      setAlgorithm(storedAlgorithm)
    }

    if (storedIterations !== null) setIterationsInput(storedIterations)
    if (storedMemorySize !== null) setMemorySizeInput(storedMemorySize)
    if (storedParallelism !== null) setParallelismInput(storedParallelism)
    if (storedHashLength !== null) setHashLengthInput(storedHashLength)

    setSalt(generateRandomSalt())
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.algorithm, algorithm)
  }, [algorithm])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.iterations, iterationsInput)
  }, [iterationsInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.memorySize, memorySizeInput)
  }, [memorySizeInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.parallelism, parallelismInput)
  }, [parallelismInput])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.hashLength, hashLengthInput)
  }, [hashLengthInput])

  useEffect(() => {
    setHashState({ status: "idle" })
  }, [
    algorithm,
    hashLengthInput,
    iterationsInput,
    memorySizeInput,
    parallelismInput,
    password,
    salt,
    secret,
  ])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canGenerate) {
      setHashState({
        status: "error",
        message: messages.invalidConfigurationMessage,
      })
      return
    }

    setHashState((currentState) => ({
      status: "loading",
      hash:
        currentState.status === "ready" || currentState.status === "loading"
          ? currentState.hash
          : null,
    }))

    try {
      const hash = await generateArgon2Hash({
        algorithm,
        password,
        salt,
        secret,
        iterations: iterationsState.value,
        memorySize: memorySizeState.value,
        parallelism: parallelismState.value,
        hashLength: hashLengthState.value,
      })

      setHashState({ status: "ready", hash })
    } catch (error) {
      setHashState({
        status: "error",
        message:
          error instanceof Error ? error.message : messages.hashErrorMessage,
      })
    }
  }

  function handleGenerateSalt() {
    try {
      setSalt(generateRandomSalt())
    } catch (error) {
      setHashState({
        status: "error",
        message:
          error instanceof Error ? error.message : messages.hashErrorMessage,
      })
    }
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.85fr)]"
      onSubmit={(event) => {
        void handleSubmit(event)
      }}
    >
      <div className="grid gap-6">
        <ConfigurationCard
          passwordId={passwordId}
          secretId={secretId}
          algorithm={algorithm}
          password={password}
          secret={secret}
          messages={messages}
          onAlgorithmChange={setAlgorithm}
          onPasswordChange={setPassword}
          onSecretChange={setSecret}
        />

        <ParametersCard
          iterationsId={iterationsId}
          memorySizeId={memorySizeId}
          parallelismId={parallelismId}
          hashLengthId={hashLengthId}
          iterationsInput={iterationsInput}
          memorySizeInput={memorySizeInput}
          parallelismInput={parallelismInput}
          hashLengthInput={hashLengthInput}
          iterationsValid={iterationsState.isValid}
          memorySizeValid={memorySizeState.isValid}
          parallelismValid={parallelismState.isValid}
          hashLengthValid={hashLengthState.isValid}
          memoryDependencyValid={memoryDependencyValid}
          memoryEstimate={memoryEstimate}
          messages={messages}
          onIterationsChange={setIterationsInput}
          onMemorySizeChange={setMemorySizeInput}
          onParallelismChange={setParallelismInput}
          onHashLengthChange={setHashLengthInput}
        />

        <SaltCard
          saltId={saltId}
          salt={salt}
          saltValidation={saltValidation}
          messages={messages}
          onSaltChange={setSalt}
          onGenerateSalt={handleGenerateSalt}
        />
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <ResultCard
          state={hashState}
          canGenerate={canGenerate}
          messages={messages}
        />
      </div>
    </form>
  )
}

export default Argon2HashPasswordClient
