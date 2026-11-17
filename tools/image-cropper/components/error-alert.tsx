import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"
import type { Messages } from "../client/types"

export function CropperError({
  message,
  m,
}: {
  message: string | null
  m: Messages
}) {
  if (!message) return null
  return (
    <Alert variant="destructive" role="alert">
      <TriangleAlert aria-hidden="true" />
      <AlertTitle>{m.errorTitle}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
