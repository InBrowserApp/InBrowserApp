import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"
import { Trash2 } from "@workspace/ui/icons"

import {
  CHANGE_FREQUENCIES,
  type ChangeFrequency,
  type UrlEntryInput,
} from "../core/sitemap-state"
import type { SitemapXmlGeneratorMessages } from "../client/types"

type UrlsetEntriesCardProps = Readonly<{
  messages: SitemapXmlGeneratorMessages
  entries: readonly UrlEntryInput[]
  onEntryChange: (
    entryId: string,
    key: keyof Omit<UrlEntryInput, "id">,
    value: string
  ) => void
  onEntryAdd: () => void
  onEntryRemove: (entryId: string) => void
}>

function UrlsetEntriesCard({
  messages,
  entries,
  onEntryChange,
  onEntryAdd,
  onEntryRemove,
}: UrlsetEntriesCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.urlEntriesLabel}</CardTitle>
        <CardDescription>{messages.urlEntriesDescription}</CardDescription>
      </CardHeader>

      <ToolPanelCardContent className="gap-4">
        <FieldGroup className="gap-4">
          <div className="grid gap-4">
            {entries.map((entry, index) => {
              const entryLabel = messages.urlEntryLabel.replace(
                "{index}",
                String(index + 1)
              )
              const changeFrequencyLabelId = `${entry.id}-changefreq-label`

              return (
                <div
                  key={entry.id}
                  className="rounded-lg border border-border/70 bg-muted/20 p-4"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="min-w-0 font-medium">{entryLabel}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`${messages.removeEntryLabel} ${entryLabel}`}
                      onClick={() => {
                        onEntryRemove(entry.id)
                      }}
                    >
                      <Trash2 data-icon="inline-start" />
                      {messages.removeEntryLabel}
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor={`${entry.id}-loc`}>
                        {messages.locationLabel}
                      </FieldLabel>
                      <Input
                        id={`${entry.id}-loc`}
                        name={`${entry.id}-loc`}
                        autoComplete="off"
                        dir="ltr"
                        spellCheck={false}
                        className="text-left"
                        value={entry.loc}
                        placeholder={messages.pathPlaceholder}
                        onChange={(event) => {
                          onEntryChange(entry.id, "loc", event.target.value)
                        }}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`${entry.id}-lastmod`}>
                        {messages.lastModifiedLabel}
                      </FieldLabel>
                      <Input
                        id={`${entry.id}-lastmod`}
                        name={`${entry.id}-lastmod`}
                        autoComplete="off"
                        dir="ltr"
                        spellCheck={false}
                        className="text-left"
                        value={entry.lastmod}
                        placeholder={messages.lastModifiedPlaceholder}
                        onChange={(event) => {
                          onEntryChange(entry.id, "lastmod", event.target.value)
                        }}
                      />
                    </Field>

                    <Field>
                      <FieldLabel id={changeFrequencyLabelId}>
                        {messages.changeFrequencyLabel}
                      </FieldLabel>
                      <Select
                        value={entry.changefreq || "__empty__"}
                        onValueChange={(value) => {
                          onEntryChange(
                            entry.id,
                            "changefreq",
                            value === "__empty__"
                              ? ""
                              : (value as ChangeFrequency)
                          )
                        }}
                      >
                        <SelectTrigger
                          aria-labelledby={changeFrequencyLabelId}
                          className="w-full text-left"
                          dir="ltr"
                        >
                          <SelectValue
                            placeholder={messages.changeFrequencyPlaceholder}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="__empty__">
                              {messages.changeFrequencyPlaceholder}
                            </SelectItem>
                            {CHANGE_FREQUENCIES.map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`${entry.id}-priority`}>
                        {messages.priorityLabel}
                      </FieldLabel>
                      <Input
                        id={`${entry.id}-priority`}
                        name={`${entry.id}-priority`}
                        type="number"
                        inputMode="decimal"
                        autoComplete="off"
                        dir="ltr"
                        min="0"
                        max="1"
                        step="0.1"
                        className="text-left"
                        value={entry.priority}
                        placeholder={messages.priorityPlaceholder}
                        onChange={(event) => {
                          onEntryChange(
                            entry.id,
                            "priority",
                            event.target.value
                          )
                        }}
                      />
                    </Field>
                  </div>
                </div>
              )
            })}
          </div>
        </FieldGroup>
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-start border-t">
        <Button type="button" variant="outline" size="sm" onClick={onEntryAdd}>
          {messages.addUrlEntryLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { UrlsetEntriesCard }
