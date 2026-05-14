import { useEffect, useId, useRef, useState } from "react"

import {
  DEFAULT_COST,
  MAX_COST,
  MIN_COST,
  STORAGE_KEYS,
} from "./client/constants"
import type { BcryptHashPasswordMessages } from "./client/types"
import {
  HashOutputCard,
  type HashGenerationState,
} from "./components/hash-output-card"
import { PasswordCard } from "./components/password-card"
import { generateBcryptHash, parseCostInput } from "./core/bcrypt"

type BcryptHashPasswordClientProps = Readonly<{
  messages: BcryptHashPasswordMessages
}>

function BcryptHashPasswordClient({ messages }: BcryptHashPasswordClientProps) {
  const passwordId = useId()
  const costId = useId()
  const generationId = useRef(0)

  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [costInput, setCostInput] = useState(String(DEFAULT_COST))
  const [hashState, setHashState] = useState<HashGenerationState>({
    status: "idle",
  })

  const costState = parseCostInput(costInput)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedCost = window.localStorage.getItem(STORAGE_KEYS.cost)

    if (storedCost !== null && parseCostInput(storedCost).isValid) {
      setCostInput(storedCost)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    if (costState.isValid) {
      window.localStorage.setItem(STORAGE_KEYS.cost, String(costState.value))
    }
  }, [costState.isValid, costState.value])

  function resetOutput() {
    generationId.current += 1
    setHashState({ status: "idle" })
  }

  function handlePasswordChange(value: string) {
    setPassword(value)
    resetOutput()
  }

  function handleCostInputChange(value: string) {
    setCostInput(value)
    resetOutput()
  }

  function handleCostSliderChange(value: number) {
    const nextCost = Math.min(MAX_COST, Math.max(MIN_COST, value))
    setCostInput(String(nextCost))
    resetOutput()
  }

  function handleReset() {
    setPassword("")
    setShowPassword(false)
    setCostInput(String(DEFAULT_COST))
    resetOutput()
  }

  async function handleGenerate() {
    const nextGenerationId = generationId.current + 1
    generationId.current = nextGenerationId
    setHashState({ status: "loading" })

    try {
      const result = await generateBcryptHash(password, costState.value)

      if (generationId.current === nextGenerationId) {
        setHashState({ status: "ready", result })
      }
    } catch (error: unknown) {
      if (generationId.current === nextGenerationId) {
        setHashState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : messages.costInvalidMessage,
        })
      }
    }
  }

  return (
    <form
      className="grid gap-6 xl:grid-cols-[minmax(0,25rem)_minmax(0,1fr)]"
      onSubmit={(event) => {
        event.preventDefault()

        if (
          password.length === 0 ||
          !costState.isValid ||
          hashState.status === "loading"
        ) {
          return
        }

        void handleGenerate()
      }}
    >
      <PasswordCard
        passwordId={passwordId}
        costId={costId}
        password={password}
        showPassword={showPassword}
        costInput={costInput}
        costValue={costState.value}
        costValid={costState.isValid}
        generating={hashState.status === "loading"}
        messages={messages}
        onPasswordChange={handlePasswordChange}
        onCostInputChange={handleCostInputChange}
        onCostSliderChange={handleCostSliderChange}
        onTogglePassword={() => {
          setShowPassword((currentValue) => !currentValue)
        }}
        onReset={handleReset}
      />

      <HashOutputCard state={hashState} messages={messages} />
    </form>
  )
}

export default BcryptHashPasswordClient
