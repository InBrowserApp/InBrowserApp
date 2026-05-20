import type { Dispatch, MutableRefObject, SetStateAction } from "react"

import type { DedicatedSourceKey } from "../core/plan"
import { resolveErrorMessage } from "./errors"
import { disposeImageSource, loadImageSource } from "./load-image-source"
import type {
  FaviconMessages,
  GeneratedBundle,
  GenerationError,
  ImageSource,
} from "./types"

type DedicatedSources = Readonly<{
  desktop: ImageSource | null
  ios: ImageSource | null
  pwa: ImageSource | null
}>

type LoadCallbacks = Readonly<{
  messages: FaviconMessages
  generationIdRef: MutableRefObject<number>
  setError: Dispatch<SetStateAction<GenerationError | null>>
  setBundle: Dispatch<SetStateAction<GeneratedBundle | null>>
  setIsGenerating: Dispatch<SetStateAction<boolean>>
}>

function invalidateInFlight(callbacks: LoadCallbacks): void {
  callbacks.setError(null)
  callbacks.setBundle(null)
  callbacks.generationIdRef.current += 1
  callbacks.setIsGenerating(false)
}

function reportInvalidImage(callbacks: LoadCallbacks): void {
  callbacks.setError({
    code: "invalid-image",
    message: resolveErrorMessage("invalid-image", callbacks.messages),
  })
}

async function loadGlobalSource(
  file: File | null,
  setGlobalSource: Dispatch<SetStateAction<ImageSource | null>>,
  callbacks: LoadCallbacks
): Promise<void> {
  invalidateInFlight(callbacks)

  if (!file) {
    setGlobalSource((previous) => {
      disposeImageSource(previous)
      return null
    })
    return
  }

  try {
    const next = await loadImageSource(file)
    setGlobalSource((previous) => {
      disposeImageSource(previous)
      return next
    })
  } catch {
    reportInvalidImage(callbacks)
  }
}

async function loadDedicatedSource(
  key: DedicatedSourceKey,
  file: File | null,
  setDedicatedSources: Dispatch<SetStateAction<DedicatedSources>>,
  callbacks: LoadCallbacks
): Promise<void> {
  invalidateInFlight(callbacks)

  if (!file) {
    setDedicatedSources((previous) => {
      disposeImageSource(previous[key])
      return { ...previous, [key]: null }
    })
    return
  }

  try {
    const next = await loadImageSource(file)
    setDedicatedSources((previous) => {
      disposeImageSource(previous[key])
      return { ...previous, [key]: next }
    })
  } catch {
    reportInvalidImage(callbacks)
  }
}

export type { DedicatedSources }
export { loadDedicatedSource, loadGlobalSource }
