import { Button } from "@workspace/ui/components/ui/button"
import { Download, Trash2 } from "@workspace/ui/icons"
import { downloadBlob } from "@workspace/ui/lib/download-blob"

import type english from "./messages/en.json"
import type { Notification } from "./use-explorer"

export function NotificationLog({
  notifications,
  messages,
  clear,
}: {
  notifications: Notification[]
  messages: typeof english
  clear: () => void
}) {
  function download() {
    const data = notifications.map(({ time, uuid, hex, text }) => ({
      time,
      uuid,
      hex,
      text,
    }))
    downloadBlob(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      "bluetooth-notifications.json"
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        <h2 className="text-sm font-semibold">{messages.notifications}</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            disabled={!notifications.length}
            aria-label={messages.download}
            title={messages.download}
            onClick={download}
          >
            <Download aria-hidden="true" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={!notifications.length}
            aria-label={messages.clear}
            title={messages.clear}
            onClick={clear}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      </div>
      {notifications.length === 0 ? (
        <p className="border-t bg-muted/35 p-4 text-sm text-muted-foreground">
          {messages.noNotifications}
        </p>
      ) : (
        <>
          <ol
            aria-label={messages.notifications}
            className="max-h-64 divide-y overflow-auto border-t bg-muted/35"
          >
            {notifications
              .slice()
              .reverse()
              .map((entry) => (
                <li
                  key={entry.id}
                  className="space-y-1 px-4 py-2 text-xs sm:text-sm"
                >
                  <div
                    dir="ltr"
                    className="flex flex-wrap gap-x-3 font-mono text-muted-foreground"
                  >
                    <time dateTime={entry.time}>
                      {entry.time.slice(11, 23)} UTC
                    </time>
                    <span className="wrap-anywhere">{entry.uuid}</span>
                  </div>
                  <code
                    dir={entry.hex ? "ltr" : "auto"}
                    className="block wrap-anywhere"
                  >
                    {entry.hex || messages.emptyValue}
                  </code>
                </li>
              ))}
          </ol>
          <p className="border-t px-4 py-2 text-xs text-muted-foreground">
            {messages.recentOnly}
          </p>
        </>
      )}
    </div>
  )
}
