import {
  ToolPanelCard,
  ToolPanelCardContent,
} from "@workspace/ui/components/tool/tool-panel-card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { Button } from "@workspace/ui/components/ui/button"
import { CardHeader, CardTitle } from "@workspace/ui/components/ui/card"
import { TriangleAlert } from "@workspace/ui/icons"

import type { RobotsTxtGeneratorMessages } from "../client/types"
import type { RobotsPresetKey } from "../core/robots"

type PresetsCardProps = Readonly<{
  messages: RobotsTxtGeneratorMessages
  onApplyPreset: (preset: RobotsPresetKey) => void
}>

function PresetsCard({ messages, onApplyPreset }: PresetsCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.presets}</CardTitle>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        <Alert>
          <TriangleAlert />
          <AlertTitle>{messages.securityNoticeTitle}</AlertTitle>
          <AlertDescription>{messages.securityNotice}</AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-2">
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
