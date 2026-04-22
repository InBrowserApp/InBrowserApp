import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { TriangleAlert } from "@workspace/ui/icons"

import type { CidrParserMessages } from "../types"

type ResultPlaceholderCardProps = Readonly<{
  status: "empty" | "invalid"
  messages: CidrParserMessages
}>

function ResultPlaceholderCard({
  status,
  messages,
}: ResultPlaceholderCardProps) {
  const isInvalid = status === "invalid"

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="border-b">
        <CardTitle>
          {isInvalid ? messages.invalidTitle : messages.emptyTitle}
        </CardTitle>
        <CardDescription>
          {isInvalid ? messages.invalidDescription : messages.emptyDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        {isInvalid ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>{messages.invalidTitle}</AlertTitle>
            <AlertDescription>{messages.invalidDescription}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border/70 bg-transparent p-6 text-center text-sm text-muted-foreground">
            {messages.resultDescription}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { ResultPlaceholderCard }
