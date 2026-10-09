import { useEffect, useState } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/ui/tabs"
import { DocumentIconButton } from "@workspace/ui/components/tool/document-icon-button"
import { Minus, Plus } from "@workspace/ui/icons"
import { MessageDetails } from "./message-details"
import { MessageFrame } from "./message-frame"
import type { Email, Messages } from "./types"

export function MessageView({
  email,
  preview,
  messages: m,
}: {
  email: Email
  preview: { html: string; plainHtml: string; limited: boolean }
  messages: Messages
}) {
  const [size, setSize] = useState(16)
  const [direction, setDirection] = useState<"ltr" | "rtl">("ltr")
  useEffect(
    () => setDirection(document.documentElement.dir === "rtl" ? "rtl" : "ltr"),
    []
  )
  return (
    <>
      <MessageDetails email={email} messages={m} />
      <Tabs
        dir={direction}
        defaultValue={email.html ? "html" : "plain"}
        className="min-h-0 flex-1 gap-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-3 py-1">
          <TabsList aria-label={m.messageBody}>
            {email.html ? (
              <TabsTrigger value="html">{m.html}</TabsTrigger>
            ) : null}
            {email.text || !email.html ? (
              <TabsTrigger value="plain">{m.plain}</TabsTrigger>
            ) : null}
          </TabsList>
          <div className="flex items-center gap-1">
            <DocumentIconButton
              label={m.zoomOut}
              disabled={size <= 12}
              onClick={() => setSize((value) => value - 2)}
            >
              <Minus aria-hidden="true" />
            </DocumentIconButton>
            <span
              className="min-w-8 text-center text-xs tabular-nums"
              aria-label={m.textSize}
            >
              {Math.round((size / 16) * 100)}%
            </span>
            <DocumentIconButton
              label={m.zoomIn}
              disabled={size >= 32}
              onClick={() => setSize((value) => value + 2)}
            >
              <Plus aria-hidden="true" />
            </DocumentIconButton>
          </div>
        </div>
        {email.html ? (
          <TabsContent value="html" className="min-h-0 overflow-hidden">
            <MessageFrame html={preview.html} title={m.html} size={size} />
          </TabsContent>
        ) : null}
        <TabsContent value="plain" className="min-h-0 overflow-hidden">
          {email.text ? (
            <MessageFrame
              html={preview.plainHtml}
              title={m.plain}
              size={size}
            />
          ) : (
            <p className="mx-auto max-w-[90ch] p-4 text-muted-foreground sm:p-6">
              {email.notices.includes("rtfOnly") ? m.rtfOnly : m.noBody}
            </p>
          )}
        </TabsContent>
      </Tabs>
      <details className="shrink-0 border-t px-3 py-2 text-xs text-muted-foreground">
        <summary className="cursor-pointer">
          {preview.limited ? m.compatibility : m.privacy}
        </summary>
        <p className="mt-1">{m.safePreview}</p>
        {preview.limited ? <p className="mt-1">{m.limited}</p> : null}
      </details>
    </>
  )
}
