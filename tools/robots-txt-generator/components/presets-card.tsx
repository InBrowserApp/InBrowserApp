import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"

import type { RobotsTxtGeneratorPageMessages } from "../client/types"
import type { RobotsPreset } from "../core/robots"

type PresetsCardProps = Readonly<{
  messages: RobotsTxtGeneratorPageMessages
  onApplyPreset: (preset: RobotsPreset) => void
}>

function PresetsCard({ messages, onApplyPreset }: PresetsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.presets}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onApplyPreset("allowAll")
            }}
          >
            {messages.presetAllowAll}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onApplyPreset("disallowAll")
            }}
          >
            {messages.presetDisallowAll}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onApplyPreset("blockAdmin")
            }}
          >
            {messages.presetBlockAdmin}
          </Button>
        </div>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { PresetsCard }
