import { useEffect, useMemo, useState } from "react"

import { PasswordInputCard } from "./components/password-input-card"
import { PasswordResultsCard } from "./components/password-results-card"
import { analyzePassword, type StrengthReport } from "./core/password-strength"
import type { PasswordStrengthCheckerMessages } from "./client/types"

const STORAGE_KEY = "tools:password-strength-checker:password"

function PasswordStrengthCheckerClient({
  messages,
}: Readonly<{ messages: PasswordStrengthCheckerMessages }>) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (storedValue !== null) {
      setPassword(storedValue)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEY, password)
  }, [password])

  const analysis = useMemo<StrengthReport | null>(
    () => analyzePassword(password),
    [password]
  )

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <PasswordInputCard
        messages={messages}
        password={password}
        showPassword={showPassword}
        onPasswordChange={setPassword}
        onToggleVisibility={() => {
          setShowPassword((currentValue) => !currentValue)
        }}
      />

      <PasswordResultsCard analysis={analysis} messages={messages} />
    </div>
  )
}

export default PasswordStrengthCheckerClient
