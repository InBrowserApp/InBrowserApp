import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { POPULAR_TEMPLATE_NAMES, STORAGE_KEYS } from "./client/constants"
import type { GitignoreGeneratorMessages } from "./client/types"
import { PreviewCard } from "./components/preview-card"
import { TemplateSelectionCard } from "./components/template-selection-card"
import {
  buildGitignoreContent,
  filterTemplates,
  getPopularTemplateNames,
  groupTemplatesByCategory,
  normalizeSelectedTemplateNames,
} from "./core/gitignore-templates"
import { templateCatalog } from "./template-catalog"

type GitignoreGeneratorClientProps = Readonly<{
  messages: GitignoreGeneratorMessages
}>

function GitignoreGeneratorClient({ messages }: GitignoreGeneratorClientProps) {
  const downloadUrlRef = useRef<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  const deferredSearchQuery = useDeferredValue(searchQuery)
  const filteredTemplates = useMemo(
    () => filterTemplates(templateCatalog, deferredSearchQuery),
    [deferredSearchQuery]
  )
  const groupedTemplates = useMemo(
    () => groupTemplatesByCategory(filteredTemplates),
    [filteredTemplates]
  )
  const popularTemplateNames = useMemo(
    () => getPopularTemplateNames(templateCatalog, POPULAR_TEMPLATE_NAMES),
    []
  )
  const generatedContent = useMemo(
    () => buildGitignoreContent(templateCatalog, selectedTemplates),
    [selectedTemplates]
  )
  const selectedCountLabel = messages.selectedCountLabel.replace(
    "{count}",
    String(selectedTemplates.length)
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    const storedValue = window.localStorage.getItem(
      STORAGE_KEYS.selectedTemplates
    )

    if (storedValue === null) {
      return
    }

    try {
      const parsedValue = JSON.parse(storedValue)

      if (Array.isArray(parsedValue)) {
        setSelectedTemplates(
          normalizeSelectedTemplateNames(parsedValue, templateCatalog)
        )
      }
    } catch {
      setSelectedTemplates([])
    }
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") return

    window.localStorage.setItem(
      STORAGE_KEYS.selectedTemplates,
      JSON.stringify(selectedTemplates)
    )
  }, [selectedTemplates])

  useEffect(() => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current)
      downloadUrlRef.current = null
    }

    if (!generatedContent) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([generatedContent], {
        type: "text/plain;charset=utf-8",
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
  }, [generatedContent])

  function toggleTemplate(templateName: string) {
    startTransition(() => {
      setSelectedTemplates((currentSelectedTemplates) =>
        currentSelectedTemplates.includes(templateName)
          ? currentSelectedTemplates.filter((name) => name !== templateName)
          : normalizeSelectedTemplateNames(
              [...currentSelectedTemplates, templateName],
              templateCatalog
            )
      )
    })
  }

  function clearSelection() {
    startTransition(() => {
      setSelectedTemplates([])
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <TemplateSelectionCard
        groupedTemplates={groupedTemplates}
        messages={messages}
        popularTemplateNames={popularTemplateNames}
        searchQuery={searchQuery}
        selectedCountLabel={selectedCountLabel}
        selectedTemplates={selectedTemplates}
        onClearSelection={clearSelection}
        onSearchQueryChange={setSearchQuery}
        onTemplateToggle={toggleTemplate}
      />

      <PreviewCard
        downloadUrl={downloadUrl}
        generatedContent={generatedContent}
        messages={messages}
      />
    </div>
  )
}

export default GitignoreGeneratorClient
