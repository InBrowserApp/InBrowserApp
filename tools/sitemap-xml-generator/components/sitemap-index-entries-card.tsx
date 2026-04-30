import {
  ToolPanelCard,
  ToolPanelCardContent,
  ToolPanelCardFooter,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { Trash2 } from "@workspace/ui/icons"

import type { SitemapEntryInput } from "../core/sitemap-state"
import type { SitemapXmlGeneratorMessages } from "../client/types"

type SitemapIndexEntriesCardProps = Readonly<{
  messages: SitemapXmlGeneratorMessages
  entries: readonly SitemapEntryInput[]
  onEntryChange: (
    entryId: string,
    key: keyof Omit<SitemapEntryInput, "id">,
    value: string
  ) => void
  onEntryAdd: () => void
  onEntryRemove: (entryId: string) => void
}>

function SitemapIndexEntriesCard({
  messages,
  entries,
  onEntryChange,
  onEntryAdd,
  onEntryRemove,
}: SitemapIndexEntriesCardProps) {
  return (
    <ToolPanelCard>
      <ToolPanelCardContent className="gap-6 p-5">
        <FieldGroup className="gap-6">
          <Field>
            <FieldContent>
              <FieldLabel>{messages.sitemapEntriesLabel}</FieldLabel>
              <FieldDescription>
                {messages.sitemapEntriesDescription}
              </FieldDescription>
            </FieldContent>
          </Field>

          <div className="grid gap-4">
            {entries.map((entry, index) => {
              const entryLabel = messages.sitemapEntryLabel.replace(
                "{index}",
                String(index + 1)
              )

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
                  </div>
                </div>
              )
            })}
          </div>
        </FieldGroup>
      </ToolPanelCardContent>

      <ToolPanelCardFooter className="justify-start border-t px-5 py-4">
        <Button type="button" variant="outline" size="sm" onClick={onEntryAdd}>
          {messages.addSitemapEntryLabel}
        </Button>
      </ToolPanelCardFooter>
    </ToolPanelCard>
  )
}

export { SitemapIndexEntriesCard }
