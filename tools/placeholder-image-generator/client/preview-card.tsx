import { Badge } from "@workspace/ui/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"

import type { PlaceholderImageGeneratorMessages } from "./types"

type PreviewCardProps = Readonly<{
  currentSizeLabel: string
  messages: PlaceholderImageGeneratorMessages
  previewUrl: string
  resolvedText: string
}>

function PreviewCard({
  currentSizeLabel,
  messages,
  previewUrl,
  resolvedText,
}: PreviewCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <CardTitle>{messages.previewTitle}</CardTitle>
        <CardDescription>{messages.previewDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{currentSizeLabel}</Badge>
          <Badge variant="secondary">{resolvedText}</Badge>
        </div>
        <div className="flex min-h-80 items-center justify-center rounded-xl border bg-[linear-gradient(135deg,rgba(161,161,170,0.08),rgba(228,228,231,0.18))] p-4">
          <img
            alt={messages.meta.name}
            className="max-h-full max-w-full rounded-lg border bg-white/70 object-contain shadow-sm"
            src={previewUrl}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { PreviewCard }
