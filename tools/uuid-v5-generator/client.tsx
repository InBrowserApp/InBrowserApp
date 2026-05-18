import { startTransition, useEffect, useId, useState } from "react"

import { UuidV5OptionsCard } from "./components/options-card"
import { UuidV5ResultCard } from "./components/result-card"
import {
  DEFAULT_UUID_V5_NAMESPACE,
  UUID_V5_DEFAULT_NAME,
  generateUuidV5,
  isValidNamespaceUuid,
  resolveNamespacePresetId,
} from "./core/uuid-v5"

import type { UuidV5Messages } from "./types"

type UuidV5GeneratorClientProps = Readonly<{
  messages: UuidV5Messages
}>

const STORAGE_KEYS = {
  namespace: "tools:uuid-v5-generator:namespace",
  name: "tools:uuid-v5-generator:name",
} as const

function UuidV5GeneratorClient({ messages }: UuidV5GeneratorClientProps) {
  const namespaceId = useId()
  const nameId = useId()
  const resultId = useId()

  const [namespace, setNamespace] = useState(DEFAULT_UUID_V5_NAMESPACE)
  const [name, setName] = useState(UUID_V5_DEFAULT_NAME)
  const [uuid, setUuid] = useState("")

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

  useEffect(() => {
    let cancelled = false

    setUuid("")

    if (!isValidNamespaceUuid(namespace)) {
      return () => {
        cancelled = true
      }
    }

    void generateUuidV5(namespace, name).then((nextResult) => {
      if (cancelled) {
        return
      }

      startTransition(() => {
        setUuid(nextResult.ok ? nextResult.uuid : "")
      })
    })

    return () => {
      cancelled = true
    }
  }, [namespace, name])

  const namespaceError = isValidNamespaceUuid(namespace)
    ? ""
    : messages.namespaceInvalid
  const selectedPresetId = resolveNamespacePresetId(namespace)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <UuidV5OptionsCard
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

      <UuidV5ResultCard
        messages={messages}
        resultId={resultId}
        uuid={uuid}
        hasNamespaceError={Boolean(namespaceError)}
      />
    </div>
  )
}

export default UuidV5GeneratorClient
