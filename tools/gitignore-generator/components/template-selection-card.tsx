import { useId } from "react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Checkbox } from "@workspace/ui/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/ui/input-group"
import { Label } from "@workspace/ui/components/ui/label"
import { Search } from "@workspace/ui/icons"
import type { GitignoreGeneratorMessages } from "../client/types"
import type {
  GitignoreTemplate,
  GitignoreTemplateCategory,
} from "../core/gitignore-templates"

type TemplateSelectionCardProps = Readonly<{
  groupedTemplates: Record<GitignoreTemplateCategory, GitignoreTemplate[]>
  messages: GitignoreGeneratorMessages
  popularTemplateNames: readonly string[]
  searchQuery: string
  selectedCountLabel: string
  selectedTemplates: readonly string[]
  onClearSelection: () => void
  onSearchQueryChange: (value: string) => void
  onTemplateToggle: (templateName: string) => void
}>

function TemplateSelectionCard({
  groupedTemplates,
  messages,
  popularTemplateNames,
  searchQuery,
  selectedCountLabel,
  selectedTemplates,
  onClearSelection,
  onSearchQueryChange,
  onTemplateToggle,
}: TemplateSelectionCardProps) {
  const searchInputId = useId()
  const categorySections = [
    {
      category: "language",
      label: messages.languagesLabel,
      templates: groupedTemplates.language,
    },
    {
      category: "global",
      label: messages.globalLabel,
      templates: groupedTemplates.global,
    },
    {
      category: "community",
      label: messages.communityLabel,
      templates: groupedTemplates.community,
    },
  ] as const
  const hasVisibleTemplates = categorySections.some(
    (section) => section.templates.length > 0
  )

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{messages.templatesLabel}</CardTitle>
        <CardDescription>{messages.templatesDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Field>
          <FieldLabel htmlFor={searchInputId}>
            {messages.searchLabel}
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>
                <Search />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id={searchInputId}
              value={searchQuery}
              placeholder={messages.searchPlaceholder}
              aria-label={messages.searchLabel}
              onChange={(event) => {
                onSearchQueryChange(event.target.value)
              }}
            />
          </InputGroup>
          <FieldDescription>{messages.searchDescription}</FieldDescription>
        </Field>

        {popularTemplateNames.length > 0 ? (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-medium">
                {messages.quickSelectLabel}
              </h2>
              <Badge variant="secondary">{popularTemplateNames.length}</Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTemplateNames.map((templateName) => {
                const isSelected = selectedTemplates.includes(templateName)

                return (
                  <Button
                    key={templateName}
                    type="button"
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => {
                      onTemplateToggle(templateName)
                    }}
                  >
                    {templateName}
                  </Button>
                )
              })}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-sm font-medium">
                {messages.selectedTemplatesLabel}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedCountLabel}
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={selectedTemplates.length === 0}
              onClick={onClearSelection}
            >
              {messages.clearSelectionLabel}
            </Button>
          </div>

          {selectedTemplates.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedTemplates.map((templateName) => (
                <Button
                  key={templateName}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-auto px-2.5 py-1 text-xs font-medium"
                  onClick={() => {
                    onTemplateToggle(templateName)
                  }}
                >
                  {templateName}
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {messages.emptySelectionLabel}
            </p>
          )}
        </section>

        <section className="flex flex-col gap-4">
          {hasVisibleTemplates ? (
            <div className="max-h-[40rem] overflow-y-auto pr-1">
              <div className="flex flex-col gap-4">
                {categorySections.map((section) =>
                  section.templates.length > 0 ? (
                    <div
                      key={section.category}
                      className="rounded-xl border bg-card/60 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-medium">{section.label}</h2>
                        <Badge variant="secondary">
                          {section.templates.length}
                        </Badge>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {section.templates.map((template) => {
                          const isSelected = selectedTemplates.includes(
                            template.name
                          )
                          const controlId = `gitignore-template-${template.name.replace(
                            /[^a-z0-9]+/giu,
                            "-"
                          )}`

                          return (
                            <div
                              key={template.path}
                              className={`rounded-lg border px-3 py-2 ${
                                isSelected
                                  ? "border-primary bg-accent/40"
                                  : "border-border"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  id={controlId}
                                  checked={isSelected}
                                  onCheckedChange={() => {
                                    onTemplateToggle(template.name)
                                  }}
                                />
                                <Label
                                  htmlFor={controlId}
                                  title={template.name}
                                  className="min-w-0 flex-1 cursor-pointer items-start"
                                >
                                  <span className="block truncate leading-5">
                                    {template.name}
                                  </span>
                                </Label>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {messages.noTemplatesFoundLabel}
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  )
}

export { TemplateSelectionCard }
