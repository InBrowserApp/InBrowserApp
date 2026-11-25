import { Alert, AlertDescription } from "@workspace/ui/components/ui/alert"
import { Spinner } from "@workspace/ui/components/ui/spinner"

export function MailboxStatus({
  children,
  error = false,
}: {
  children: string
  error?: boolean
}) {
  if (error)
    return (
      <Alert variant="destructive" className="m-4 w-auto">
        <AlertDescription role="alert">{children}</AlertDescription>
      </Alert>
    )
  return (
    <p
      role="status"
      className="m-auto flex items-center gap-2 p-6 text-sm text-muted-foreground"
    >
      <Spinner />
      {children}
    </p>
  )
}
