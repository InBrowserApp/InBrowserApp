import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/ui/select"

import { targetGroups } from "../core/targets"
import type { CurlConverterMessages } from "../types"

type TargetSelectCardProps = Readonly<{
  messages: Pick<
    CurlConverterMessages,
    "languagePlaceholder" | "meta" | "targetLanguageLabel"
  >
  targetId: string
  onTargetChange: (value: string) => void
}>

export function TargetSelectCard({
  messages,
  targetId,
  onTargetChange,
}: TargetSelectCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.targetLanguageLabel}</CardTitle>
        <CardDescription>{messages.meta.description}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Select value={targetId} onValueChange={onTargetChange}>
          <SelectTrigger
            aria-label={messages.targetLanguageLabel}
            className="w-full justify-between sm:max-w-sm"
          >
            <SelectValue placeholder={messages.languagePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {targetGroups.map((group) => (
              <SelectGroup key={group.label}>
                <SelectLabel>{group.label}</SelectLabel>
                {group.options.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}
