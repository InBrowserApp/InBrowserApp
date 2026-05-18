import { useEffect, useId, useMemo, useState } from "react"

import { UuidV3OptionsCard } from "./components/options-card"
import { UuidV3ResultCard } from "./components/result-card"
import {
  DEFAULT_UUID_V3_NAME,
  DEFAULT_UUID_V3_NAMESPACE,
  generateUuidV3,
  isValidNamespaceUuid,
  resolveNamespacePresetId,
} from "./core/uuid-v3"

import type { UuidV3Messages } from "./types"

type UuidV3GeneratorClientProps = Readonly<{
  messages: UuidV3Messages
}>

const STORAGE_KEYS = {
  namespace: "tools:uuid-v3-generator:namespace",
  name: "tools:uuid-v3-generator:name",
} as const

function UuidV3GeneratorClient({ messages }: UuidV3GeneratorClientProps) {
  const namespaceId = useId()
  const nameId = useId()
  const resultId = useId()

  const [namespace, setNamespace] = useState(DEFAULT_UUID_V3_NAMESPACE)
  const [name, setName] = useState(DEFAULT_UUID_V3_NAME)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    const storedNamespace = window.localStorage.getItem(STORAGE_KEYS.namespace)
    const storedName = window.localStorage.getItem(STORAGE_KEYS.name)

    if (storedNamespace !== null) {
      setNamespace(storedNamespace)
    }

    if (storedName !== null) {
      setName(storedName)
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.namespace, namespace)
  }, [namespace])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.name, name)
  }, [name])

  const namespaceError = isValidNamespaceUuid(namespace)
    ? ""
    : messages.namespaceInvalid
  const uuid = useMemo(
    () => (namespaceError ? "" : generateUuidV3(namespace, name)),
    [name, namespace, namespaceError]
  )
  const selectedPresetId = resolveNamespacePresetId(namespace)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <UuidV3OptionsCard
        messages={messages}
        namespaceId={namespaceId}
        nameId={nameId}
        namespace={namespace}
        name={name}
        namespaceError={namespaceError}
        selectedPresetId={selectedPresetId}
        onNamespaceChange={setNamespace}
        onNameChange={setName}
      />

      <UuidV3ResultCard
        messages={messages}
        resultId={resultId}
        uuid={uuid}
        hasNamespaceError={Boolean(namespaceError)}
      />
    </div>
  )
}

export default UuidV3GeneratorClient
