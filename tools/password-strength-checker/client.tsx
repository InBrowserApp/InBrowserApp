import { useMemo, useState } from "react"

import { PasswordInputCard } from "./components/password-input-card"
import { PasswordResultsCard } from "./components/password-results-card"
import { analyzePassword, type StrengthReport } from "./core/password-strength"
import type { PasswordStrengthCheckerMessages } from "./client/types"

function PasswordStrengthCheckerClient({
  messages,
}: Readonly<{ messages: PasswordStrengthCheckerMessages }>) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

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
