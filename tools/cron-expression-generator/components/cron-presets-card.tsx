import { Button } from "@workspace/ui/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Sparkles } from "@workspace/ui/icons"

import { PRESET_EXPRESSIONS, type CronPresetId } from "../core/cron"

import type { CronExpressionGeneratorMessages } from "../types"

type CronPresetsCardProps = Readonly<{
  messages: CronExpressionGeneratorMessages
  onSelect: (expression: string) => void
}>

const PRESET_IDS = Object.keys(PRESET_EXPRESSIONS) as CronPresetId[]

function CronPresetsCard({ messages, onSelect }: CronPresetsCardProps) {
  return (
    <>
      <CardHeader className="border-b">
        <CardTitle>{messages.presets.title}</CardTitle>
        <CardDescription>{messages.presets.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {PRESET_IDS.map((presetId) => (
            <Button
              key={presetId}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onSelect(PRESET_EXPRESSIONS[presetId])
              }}
            >
              <Sparkles data-icon="inline-start" />
              {messages.presets.items[presetId]}
            </Button>
          ))}
        </div>
      </CardContent>
    </>
  )
}

export { CronPresetsCard }
