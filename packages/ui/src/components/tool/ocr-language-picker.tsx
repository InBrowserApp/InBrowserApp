import { useId, useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/ui/dialog"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"
import { Check, ChevronDown } from "@workspace/ui/icons"

import {
  foldLanguageQuery,
  languageOptions,
  type Language,
} from "@workspace/ocr-models/languages"

export function OcrLanguagePicker({
  lang,
  language,
  onChange,
  disabled,
  messages: m,
}: {
  lang: string
  language: Language
  onChange: (language: Language) => void
  disabled: boolean
  messages: {
    language: string
    searchLanguages: string
    noLanguages: string
    verticalLanguage: string
    historicalLanguage: string
    close: string
  }
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const labelId = useId()
  const valueId = useId()
  const options = useMemo(() => languageOptions(lang, m), [lang, m])
  const selected = options.find((option) => option.code === language)!
  const words = foldLanguageQuery(query).split(/\s+/)
  const matches = options.filter((option) =>
    words.every((word) => option.search.includes(word))
  )

  function changeOpen(next: boolean) {
    setOpen(next)
    if (!next) setQuery("")
  }

  function chooseLanguage(code: Language) {
    onChange(code)
    changeOpen(false)
  }

  return (
    <div className="grid min-w-40 flex-1 gap-1.5">
      <Label id={labelId}>{m.language}</Label>
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            aria-labelledby={`${labelId} ${valueId}`}
            className="h-auto min-h-8 min-w-0 justify-between whitespace-normal"
          >
            <span id={valueId} dir="auto" className="min-w-0 break-words">
              {selected.label}
            </span>
            <ChevronDown aria-hidden="true" className="shrink-0 opacity-60" />
          </Button>
        </DialogTrigger>
        <DialogContent
          closeLabel={m.close}
          aria-describedby={undefined}
          className="gap-3 p-4 sm:p-6"
        >
          <DialogHeader>
            <DialogTitle className="pe-6 text-start">{m.language}</DialogTitle>
          </DialogHeader>
          <Input
            type="search"
            aria-label={m.searchLanguages}
            placeholder={m.searchLanguages}
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            onKeyDown={(event) => {
              const only = matches[0]
              if (event.key === "Enter" && matches.length === 1 && only) {
                event.preventDefault()
                chooseLanguage(only.code)
              }
            }}
            className="h-10"
          />
          {matches.length ? (
            <ul className="max-h-[min(22rem,45dvh)] min-w-0 overflow-y-auto overscroll-contain rounded-md border p-1">
              {matches.map((option) => (
                <li key={option.code}>
                  <Button
                    type="button"
                    variant="ghost"
                    aria-pressed={option.code === language}
                    className="h-auto min-h-9 w-full justify-between gap-3 px-2 py-1.5 text-start whitespace-normal"
                    onClick={() => chooseLanguage(option.code)}
                  >
                    <span dir="auto" className="min-w-0 break-words">
                      {option.label}
                    </span>
                    <span className="ms-auto flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <span dir="ltr">{option.code}</span>
                      {option.code === language ? (
                        <Check aria-hidden="true" />
                      ) : null}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p role="status" className="text-sm text-muted-foreground">
              {m.noLanguages}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
