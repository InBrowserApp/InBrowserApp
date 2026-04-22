import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import type { SitemapXmlGeneratorMessages } from "./client/types"
import { STORAGE_KEY } from "./client/constants"
import { parseStoredGeneratorState } from "./client/storage"
import {
  DEFAULT_SITEMAP_GENERATOR_STATE,
  createPresetState,
  createSitemapEntryInput,
  createUrlEntryInput,
  type SitemapEntryInput,
  type SitemapGeneratorState,
  type SitemapMode,
  type SitemapPresetKey,
  type UrlEntryInput,
} from "./core/sitemap-state"
import { buildSitemapXml } from "./core/sitemap-xml"
import { OutputCard } from "./components/output-card"
import { SettingsCard } from "./components/settings-card"
import { SitemapIndexEntriesCard } from "./components/sitemap-index-entries-card"
import { UrlsetEntriesCard } from "./components/urlset-entries-card"

type SitemapXmlGeneratorClientProps = Readonly<{
  messages: SitemapXmlGeneratorMessages
}>

function SitemapXmlGeneratorClient({
  messages,
}: SitemapXmlGeneratorClientProps) {
  const downloadUrlRef = useRef<string | null>(null)

  const [state, setState] = useState<SitemapGeneratorState>(
    DEFAULT_SITEMAP_GENERATOR_STATE
  )
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredState = useDeferredValue(state)
  const result = useMemo(() => buildSitemapXml(deferredState), [deferredState])
  const generatedXml = result.state === "success" ? result.xml : ""

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    setState(
      parseStoredGeneratorState(window.localStorage.getItem(STORAGE_KEY))
    )
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (result.state !== "success") {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([generatedXml], {
        type: "application/xml;charset=utf-8",
      })
    )

    downloadUrlRef.current = nextUrl
    setDownloadUrl(nextUrl)

    return () => {
      if (downloadUrlRef.current === nextUrl) {
        URL.revokeObjectURL(nextUrl)
        downloadUrlRef.current = null
      }
    }
  }, [generatedXml, result.state])

  function updateUrlEntry(
    entryId: string,
    key: keyof Omit<UrlEntryInput, "id">,
    value: string
  ) {
    setState((currentState) => ({
      ...currentState,
      urlEntries: currentState.urlEntries.map((entry) =>
        entry.id === entryId ? { ...entry, [key]: value } : entry
      ),
    }))
  }

  function updateSitemapEntry(
    entryId: string,
    key: keyof Omit<SitemapEntryInput, "id">,
    value: string
  ) {
    setState((currentState) => ({
      ...currentState,
      sitemapEntries: currentState.sitemapEntries.map((entry) =>
        entry.id === entryId ? { ...entry, [key]: value } : entry
      ),
    }))
  }

  function applyPreset(preset: SitemapPresetKey) {
    startTransition(() => {
      setState(createPresetState(preset))
    })
  }

  function resetState() {
    startTransition(() => {
      setState(DEFAULT_SITEMAP_GENERATOR_STATE)
    })
  }

  const errorDescription =
    result.state !== "error"
      ? ""
      : result.errorCode === "invalid-base-url"
        ? messages.invalidBaseUrlMessage
        : result.errorCode === "invalid-priority"
          ? messages.invalidPriorityMessage.replace(
              "{index}",
              String((result.index ?? 0) + 1)
            )
          : result.errorCode === "invalid-sitemap-location"
            ? messages.invalidSitemapLocationMessage.replace(
                "{index}",
                String((result.index ?? 0) + 1)
              )
            : messages.invalidUrlLocationMessage.replace(
                "{index}",
                String((result.index ?? 0) + 1)
              )

  return (
    <div className="grid gap-6">
      <SettingsCard
        autoJoin={state.autoJoin}
        baseUrl={state.baseUrl}
        messages={messages}
        mode={state.mode}
        onAutoJoinChange={(autoJoin) => {
          setState((currentState) => ({
            ...currentState,
            autoJoin,
          }))
        }}
        onBaseUrlChange={(baseUrl) => {
          setState((currentState) => ({
            ...currentState,
            baseUrl,
          }))
        }}
        onModeChange={(mode: SitemapMode) => {
          setState((currentState) => ({
            ...currentState,
            mode,
          }))
        }}
        onPresetApply={applyPreset}
        onReset={resetState}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {state.mode === "urlset" ? (
          <UrlsetEntriesCard
            entries={state.urlEntries}
            messages={messages}
            onEntryAdd={() => {
              startTransition(() => {
                setState((currentState) => ({
                  ...currentState,
                  urlEntries: [
                    ...currentState.urlEntries,
                    createUrlEntryInput(),
                  ],
                }))
              })
            }}
            onEntryChange={updateUrlEntry}
            onEntryRemove={(entryId) => {
              startTransition(() => {
                setState((currentState) => ({
                  ...currentState,
                  urlEntries: currentState.urlEntries.filter(
                    (entry) => entry.id !== entryId
                  ),
                }))
              })
            }}
          />
        ) : (
          <SitemapIndexEntriesCard
            entries={state.sitemapEntries}
            messages={messages}
            onEntryAdd={() => {
              startTransition(() => {
                setState((currentState) => ({
                  ...currentState,
                  sitemapEntries: [
                    ...currentState.sitemapEntries,
                    createSitemapEntryInput(),
                  ],
                }))
              })
            }}
            onEntryChange={updateSitemapEntry}
            onEntryRemove={(entryId) => {
              startTransition(() => {
                setState((currentState) => ({
                  ...currentState,
                  sitemapEntries: currentState.sitemapEntries.filter(
                    (entry) => entry.id !== entryId
                  ),
                }))
              })
            }}
          />
        )}

        <OutputCard
          downloadUrl={downloadUrl}
          errorDescription={errorDescription}
          messages={messages}
          mode={state.mode}
          result={result}
        />
      </div>
    </div>
  )
}

export default SitemapXmlGeneratorClient
