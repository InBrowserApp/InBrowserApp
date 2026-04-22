import { useId } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Input } from "@workspace/ui/components/ui/input"
import { Label } from "@workspace/ui/components/ui/label"

import type { UrlParserBuilderMessages } from "../types"

type UrlPathCardProps = Readonly<{
  messages: UrlParserBuilderMessages
  pathname: string
  fragment: string
  onFieldChange: (field: "pathname" | "fragment", value: string) => void
}>

function UrlPathCard({
  messages,
  pathname,
  fragment,
  onFieldChange,
}: UrlPathCardProps) {
  const pathId = useId()
  const fragmentId = useId()

  return (
    <Card className="border-border/70">
      <CardHeader className="border-b">
        <CardTitle>{messages.locationTitle}</CardTitle>
        <CardDescription>{messages.locationDescription}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor={pathId}>{messages.pathLabel}</Label>
          <Input
            id={pathId}
            value={pathname}
            placeholder={messages.pathPlaceholder}
            onChange={(event) => {
              onFieldChange("pathname", event.target.value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={fragmentId}>{messages.fragmentLabel}</Label>
          <Input
            id={fragmentId}
            value={fragment}
            placeholder={messages.fragmentPlaceholder}
            onChange={(event) => {
              onFieldChange("fragment", event.target.value)
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { UrlPathCard }
