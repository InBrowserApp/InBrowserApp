import type { ReactNode } from "react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/ui/alert"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/ui/empty"
import { TriangleAlert } from "@workspace/ui/icons"

function ResultAlert({
  title,
  description,
}: Readonly<{
  title: string
  description: string
}>) {
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <TriangleAlert />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    </div>
  )
}

function StatusEmpty({
  icon,
  title,
  description,
}: Readonly<{
  icon: ReactNode
  title: string
  description: string
}>) {
  return (
    <Empty className="rounded-none border-0 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export { ResultAlert, StatusEmpty }
