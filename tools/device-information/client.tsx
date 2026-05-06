import { useCallback, useEffect, useState } from "react"

import { ToolCopyButton } from "@workspace/ui/components/tool/tool-copy-button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card"
import { Spinner } from "@workspace/ui/components/ui/spinner"
import { cn } from "@workspace/ui/lib/utils"
import { RefreshCcw } from "@workspace/ui/icons"

import { captureDeviceSnapshot, serializeSnapshot } from "./snapshot"

import type {
  DeviceInformationMessages,
  DeviceSnapshot,
  InfoEntry,
  InfoSection,
} from "./types"

type DeviceInformationClientProps = Readonly<{
  language: string
  messages: DeviceInformationMessages
}>

function DeviceInformationClient({
  language,
  messages,
}: DeviceInformationClientProps) {
  const [snapshot, setSnapshot] = useState<DeviceSnapshot | null>(null)
  const [refreshing, setRefreshing] = useState(true)

  const loadSnapshot = useCallback(async () => {
    setRefreshing(true)

    try {
      setSnapshot(await captureDeviceSnapshot(messages, language))
    } finally {
      setRefreshing(false)
    }
  }, [language, messages])

  useEffect(() => {
    void loadSnapshot()
  }, [loadSnapshot])

  if (snapshot === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{messages.loadingTitle}</CardTitle>
          <CardDescription>{messages.loadingDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex min-h-32 items-center justify-center"
            aria-live="polite"
          >
            <Spinner />
          </div>
        </CardContent>
      </Card>
    )
  }

  const snapshotJson = serializeSnapshot(snapshot)

  return (
    <div className="grid gap-6">
      <Card className="gap-0">
        <CardHeader className="border-b sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="grid gap-1.5">
            <CardTitle>{messages.snapshotTitle}</CardTitle>
            <CardDescription>{messages.snapshotDescription}</CardDescription>
            <p className="text-xs text-muted-foreground">
              {messages.capturedAt}: {snapshot.capturedAtLabel}
            </p>
          </div>
          <CardAction>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={refreshing}
                onClick={() => {
                  void loadSnapshot()
                }}
              >
                {refreshing ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <RefreshCcw data-icon="inline-start" />
                )}
                {refreshing ? messages.refreshing : messages.refresh}
              </Button>
              <ToolCopyButton
                value={snapshotJson}
                copyLabel={messages.copyJson}
                copiedLabel={messages.copied}
              />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="pt-4">
          <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {snapshot.summary.map((item) => (
              <div
                key={item.id}
                className="grid min-h-24 content-start gap-2 rounded-md border bg-background p-4"
              >
                <dt className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </dt>
                <dd
                  className={cn(
                    "text-lg leading-snug font-semibold break-words",
                    item.unavailable && "text-muted-foreground"
                  )}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {snapshot.sections.map((section) => (
          <InfoSectionCard
            key={section.id}
            section={section}
            unavailableLabel={messages.unavailable}
          />
        ))}
      </div>
    </div>
  )
}

function InfoSectionCard({
  section,
  unavailableLabel,
}: Readonly<{
  section: InfoSection
  unavailableLabel: string
}>) {
  return (
    <Card className="gap-0">
      <CardHeader className="border-b">
        <CardTitle>{section.title}</CardTitle>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <dl className="divide-y">
          {section.entries.map((entry) => (
            <InfoRow
              key={entry.id}
              entry={entry}
              unavailableLabel={unavailableLabel}
            />
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}

function InfoRow({
  entry,
  unavailableLabel,
}: Readonly<{
  entry: InfoEntry
  unavailableLabel: string
}>) {
  return (
    <div className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-sm font-medium text-muted-foreground">
        {entry.label}
      </dt>
      <dd className="min-w-0">
        {entry.unavailable ? (
          <Badge variant="secondary">{unavailableLabel}</Badge>
        ) : (
          <span
            className={cn(
              "block text-sm break-words",
              entry.code && "font-mono text-xs break-all"
            )}
          >
            {entry.value}
          </span>
        )}
      </dd>
    </div>
  )
}

export default DeviceInformationClient
export type { DeviceInformationLocaleMessages } from "./types"
