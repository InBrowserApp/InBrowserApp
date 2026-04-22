import { startTransition, useDeferredValue, useEffect, useState } from "react"

import FontBrowserPanel from "./components/font-browser-panel"
import FontDetailsPanel from "./components/font-details-panel"
import FontPreviewPanel from "./components/font-preview-panel"
import {
  buildCssSnippet,
  filterAndSortFonts,
  groupFonts,
  normalizeFonts,
  resolveFontLoadError,
} from "./core/local-font-book"

import type {
  DisplayFont,
  FontSort,
  FontStyleFilter,
  LocalFontBookMessages,
  LocalFontLoadError,
  PermissionStateLike,
  RawLocalFontData,
} from "./types"

type LocalFontBookClientProps = Readonly<{
  messages: LocalFontBookMessages
}>

type QueryLocalFonts = () => Promise<RawLocalFontData[]>

const STORAGE_KEYS = {
  searchQuery: "tools:local-font-book:search",
  filterStyle: "tools:local-font-book:style",
  sortBy: "tools:local-font-book:sort",
  groupByFamily: "tools:local-font-book:group",
  sampleText: "tools:local-font-book:sample-text",
  darkBackground: "tools:local-font-book:dark-preview",
  activeFontId: "tools:local-font-book:active-font",
} as const

const DEFAULT_SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog."
const numberFormatter = new Intl.NumberFormat()

function LocalFontBookClient({ messages }: LocalFontBookClientProps) {
  const [fonts, setFonts] = useState<DisplayFont[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<LocalFontLoadError>(null)
  const [permissionState, setPermissionState] =
    useState<PermissionStateLike>("unknown")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStyle, setFilterStyle] = useState<FontStyleFilter>("all")
  const [sortBy, setSortBy] = useState<FontSort>("family")
  const [groupByFamily, setGroupByFamily] = useState(true)
  const [sampleText, setSampleText] = useState(DEFAULT_SAMPLE_TEXT)
  const [darkBackground, setDarkBackground] = useState(false)
  const [activeFontId, setActiveFontId] = useState("")

  const deferredSearchQuery = useDeferredValue(searchQuery)
  const isSupported =
    typeof window !== "undefined" && "queryLocalFonts" in window

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedFilterStyle = window.localStorage.getItem(
      STORAGE_KEYS.filterStyle
    )
    const storedSortBy = window.localStorage.getItem(STORAGE_KEYS.sortBy)

    setSearchQuery(window.localStorage.getItem(STORAGE_KEYS.searchQuery) ?? "")
    setFilterStyle(
      storedFilterStyle === "regular" || storedFilterStyle === "italic"
        ? storedFilterStyle
        : "all"
    )
    setSortBy(
      storedSortBy === "name" || storedSortBy === "style"
        ? storedSortBy
        : "family"
    )
    setGroupByFamily(
      window.localStorage.getItem(STORAGE_KEYS.groupByFamily) !== "false"
    )
    setSampleText(
      window.localStorage.getItem(STORAGE_KEYS.sampleText) ??
        DEFAULT_SAMPLE_TEXT
    )
    setDarkBackground(
      window.localStorage.getItem(STORAGE_KEYS.darkBackground) === "true"
    )
    setActiveFontId(
      window.localStorage.getItem(STORAGE_KEYS.activeFontId) ?? ""
    )
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(STORAGE_KEYS.searchQuery, searchQuery)
    window.localStorage.setItem(STORAGE_KEYS.filterStyle, filterStyle)
    window.localStorage.setItem(STORAGE_KEYS.sortBy, sortBy)
    window.localStorage.setItem(
      STORAGE_KEYS.groupByFamily,
      String(groupByFamily)
    )
    window.localStorage.setItem(STORAGE_KEYS.sampleText, sampleText)
    window.localStorage.setItem(
      STORAGE_KEYS.darkBackground,
      String(darkBackground)
    )
    window.localStorage.setItem(STORAGE_KEYS.activeFontId, activeFontId)
  }, [
    activeFontId,
    darkBackground,
    filterStyle,
    groupByFamily,
    sampleText,
    searchQuery,
    sortBy,
  ])

  useEffect(() => {
    if (!navigator.permissions?.query) return

    let cancelled = false

    void navigator.permissions
      .query({ name: "local-fonts" as PermissionName })
      .then((status) => {
        if (!cancelled) {
          setPermissionState(status.state)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPermissionState("unknown")
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (fonts.length === 0) {
      if (activeFontId) {
        setActiveFontId("")
      }

      return
    }

    if (!fonts.some((font) => font.id === activeFontId)) {
      setActiveFontId(fonts[0]?.id ?? "")
    }
  }, [activeFontId, fonts])

  const visibleFonts = filterAndSortFonts(fonts, {
    query: deferredSearchQuery,
    filterStyle,
    sortBy,
  })
  const displayGroups = groupFonts(visibleFonts, groupByFamily)
  const activeFont = fonts.find((font) => font.id === activeFontId) ?? null
  const cssSnippet = buildCssSnippet(activeFont)
  const fontCountLabel =
    fonts.length > 0
      ? messages.fontCount.replace(
          "{count}",
          numberFormatter.format(fonts.length)
        )
      : ""

  const statusMessage = resolveStatusMessage({
    isSupported,
    loadError,
    permissionState,
    messages,
  })

  async function handleLoadFonts() {
    setLoadError(null)

    if (!isSupported) {
      return
    }

    const queryLocalFonts = (
      window as Window & {
        queryLocalFonts?: QueryLocalFonts
      }
    ).queryLocalFonts

    if (!queryLocalFonts) {
      setLoadError("security")
      return
    }

    setIsLoading(true)

    try {
      const availableFonts = await queryLocalFonts()
      const normalizedFonts = normalizeFonts(availableFonts)

      startTransition(() => {
        setFonts(normalizedFonts)
        setActiveFontId((currentId) => {
          if (normalizedFonts.some((font) => font.id === currentId)) {
            return currentId
          }

          return normalizedFonts[0]?.id ?? ""
        })
      })
    } catch (error) {
      setLoadError(resolveFontLoadError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.92fr)] xl:items-start xl:gap-6">
      <FontBrowserPanel
        messages={messages}
        isSupported={isSupported}
        isLoading={isLoading}
        statusMessage={statusMessage}
        fontCountLabel={fontCountLabel}
        hasFonts={fonts.length > 0}
        searchQuery={searchQuery}
        filterStyle={filterStyle}
        sortBy={sortBy}
        groupByFamily={groupByFamily}
        displayGroups={displayGroups}
        activeFontId={activeFontId}
        onLoadFonts={handleLoadFonts}
        onSearchQueryChange={setSearchQuery}
        onFilterStyleChange={setFilterStyle}
        onSortByChange={setSortBy}
        onGroupByFamilyChange={setGroupByFamily}
        onSelectFont={(fontId) => {
          startTransition(() => {
            setActiveFontId(fontId)
          })
        }}
      />

      <div className="flex flex-col gap-5 xl:gap-6">
        <FontPreviewPanel
          messages={messages}
          activeFont={activeFont}
          sampleText={sampleText}
          darkBackground={darkBackground}
          onSampleTextChange={setSampleText}
          onDarkBackgroundChange={setDarkBackground}
        />
        <FontDetailsPanel
          messages={messages}
          activeFont={activeFont}
          cssSnippet={cssSnippet}
        />
      </div>
    </div>
  )
}

function resolveStatusMessage({
  isSupported,
  loadError,
  permissionState,
  messages,
}: Readonly<{
  isSupported: boolean
  loadError: LocalFontLoadError
  permissionState: PermissionStateLike
  messages: LocalFontBookMessages
}>) {
  if (!isSupported) {
    return messages.statusUnsupported
  }

  if (loadError === "security") {
    return messages.statusBlocked
  }

  if (loadError === "not-allowed" || permissionState === "denied") {
    return messages.statusDenied
  }

  if (loadError === "unknown") {
    return messages.statusError
  }

  return ""
}

export default LocalFontBookClient
