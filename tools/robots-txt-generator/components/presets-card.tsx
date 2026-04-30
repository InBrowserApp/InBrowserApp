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
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/ui/toggle-group"

import type { RobotsTxtGeneratorPageMessages } from "../client/types"
import type { RobotsPreset } from "../core/robots"

type PresetsCardProps = Readonly<{
  messages: RobotsTxtGeneratorPageMessages
  activePreset: RobotsPreset | null
  onApplyPreset: (preset: RobotsPreset) => void
}>

function PresetsCard({
  messages,
  activePreset,
  onApplyPreset,
}: PresetsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.presets}</CardTitle>
        <CardDescription>{messages.presetsDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <ToggleGroup
          type="single"
          value={activePreset ?? ""}
          variant="outline"
          size="sm"
          spacing={8}
          className="w-full flex-col items-stretch sm:flex-row"
          onValueChange={(value) => {
            if (
              value === "allowAll" ||
              value === "disallowAll" ||
              value === "blockAdmin"
            ) {
              onApplyPreset(value)
            }
          }}
        >
          <ToggleGroupItem value="allowAll" className="w-full sm:flex-1">
            {messages.presetAllowAll}
          </ToggleGroupItem>
          <ToggleGroupItem value="disallowAll" className="w-full sm:flex-1">
            {messages.presetDisallowAll}
          </ToggleGroupItem>
          <ToggleGroupItem value="blockAdmin" className="w-full sm:flex-1">
            {messages.presetBlockAdmin}
          </ToggleGroupItem>
        </ToggleGroup>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { PresetsCard }
