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
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Search, TriangleAlert } from "@workspace/ui/icons"

import type { ColorPickerMessages } from "./types"

type ScreenCardProps = Readonly<{
  isSupported: boolean
  messages: ColorPickerMessages
  onPick: () => void
}>

function ScreenCard({ isSupported, messages, onPick }: ScreenCardProps) {
  return (
    <ToolPanelCard>
      <CardHeader className="border-b">
        <CardTitle>{messages.screenTitle}</CardTitle>
        <CardDescription>{messages.screenDescription}</CardDescription>
      </CardHeader>
      <ToolPanelCardContent className="gap-4">
        {!isSupported ? (
          <Alert>
            <TriangleAlert className="size-4" />
            <AlertTitle>{messages.screenTitle}</AlertTitle>
            <AlertDescription>{messages.screenUnsupported}</AlertDescription>
          </Alert>
        ) : null}
        <Button
          className="w-full sm:w-auto"
          data-testid="screen-pick-button"
          disabled={!isSupported}
          onClick={onPick}
          type="button"
        >
          <Search data-icon="inline-start" />
          {messages.screenButton}
        </Button>
      </ToolPanelCardContent>
    </ToolPanelCard>
  )
}

export { ScreenCard }
