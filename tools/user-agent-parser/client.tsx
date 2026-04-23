import { useMemo, useState } from "react"

import { UserAgentDetailsCard } from "./components/user-agent-details-card"
import { UserAgentInputCard } from "./components/user-agent-input-card"
import { UserAgentJsonCard } from "./components/user-agent-json-card"
import {
  parseUserAgent,
  stringifyUserAgentResult,
  type ParsedDetailsSection,
} from "./core/user-agent"
import type { UserAgentParserMessages } from "./client/types"

function UserAgentParserClient({
  messages,
}: Readonly<{ messages: UserAgentParserMessages }>) {
  const [userAgent, setUserAgent] = useState("")
  const [hasInteracted, setHasInteracted] = useState(false)

  const parsedResult = useMemo(() => parseUserAgent(userAgent), [userAgent])
  const hasOutput = parsedResult !== null
  const jsonOutput = parsedResult ? stringifyUserAgentResult(parsedResult) : ""
  const sections = useMemo(
    () => createSections(parsedResult, messages),
    [messages, parsedResult]
  )

  function useCurrentUserAgent() {
    if (typeof navigator === "undefined") {
      return
    }

    setHasInteracted(true)
    setUserAgent(navigator.userAgent)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <UserAgentInputCard
        canUseCurrent={typeof navigator !== "undefined"}
        messages={messages}
        showInputError={hasInteracted && userAgent.trim() === ""}
        userAgent={userAgent}
        onUseCurrent={useCurrentUserAgent}
        onUserAgentChange={(value) => {
          setHasInteracted(true)
          setUserAgent(value)
        }}
      />

      <div className="grid min-h-0 gap-6 xl:grid-rows-[minmax(0,1fr)_minmax(0,22rem)]">
        <UserAgentDetailsCard
          hasOutput={hasOutput}
          messages={messages}
          sections={sections}
        />
        <UserAgentJsonCard jsonOutput={jsonOutput} messages={messages} />
      </div>
    </div>
  )
}

function createSections(
  parsedResult: ReturnType<typeof parseUserAgent>,
  messages: UserAgentParserMessages
): readonly ParsedDetailsSection[] {
  if (!parsedResult) {
    return []
  }

  const formatValue = (value?: string) => value || messages.unknown

  return [
    {
      title: messages.browser,
      items: [
        { label: messages.name, value: formatValue(parsedResult.browser.name) },
        {
          label: messages.version,
          value: formatValue(parsedResult.browser.version),
        },
        {
          label: messages.major,
          value: formatValue(parsedResult.browser.major),
        },
      ],
    },
    {
      title: messages.os,
      items: [
        { label: messages.name, value: formatValue(parsedResult.os.name) },
        {
          label: messages.version,
          value: formatValue(parsedResult.os.version),
        },
      ],
    },
    {
      title: messages.engine,
      items: [
        { label: messages.name, value: formatValue(parsedResult.engine.name) },
        {
          label: messages.version,
          value: formatValue(parsedResult.engine.version),
        },
      ],
    },
    {
      title: messages.device,
      items: [
        { label: messages.type, value: formatValue(parsedResult.device.type) },
        {
          label: messages.vendor,
          value: formatValue(parsedResult.device.vendor),
        },
        {
          label: messages.model,
          value: formatValue(parsedResult.device.model),
        },
      ],
    },
    {
      title: messages.cpu,
      items: [
        {
          label: messages.architecture,
          value: formatValue(parsedResult.cpu.architecture),
        },
      ],
    },
  ]
}

export default UserAgentParserClient
