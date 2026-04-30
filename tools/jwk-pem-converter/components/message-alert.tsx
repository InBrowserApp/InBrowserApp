import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import { TriangleAlert } from "@workspace/ui/icons"

type MessageAlertProps = Readonly<{
  title: string
  messages: readonly string[]
  variant?: "default" | "destructive"
}>

function MessageAlert({
  title,
  messages,
  variant = "default",
}: MessageAlertProps) {
  if (messages.length === 0) {
    return null
  }

  return (
    <Alert variant={variant}>
      <TriangleAlert />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {messages.length === 1 ? (
          <p>{messages[0]}</p>
        ) : (
          <ul className="ml-4 list-disc space-y-1">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}
      </AlertDescription>
    </Alert>
  )
}

export { MessageAlert }
