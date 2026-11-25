import { useEffect, useId, useRef, useState } from "react"

import { Button } from "@workspace/ui/components/ui/button"
import {
  ChevronRight,
  ChevronLeft,
  EyeOff,
  Maximize2,
  Minimize2,
} from "@workspace/ui/icons"

import type English from "./messages/en.json"

const colors = [
  { name: "white", hex: "#ffffff" },
  { name: "black", hex: "#000000" },
  { name: "red", hex: "#ff0000" },
  { name: "green", hex: "#00ff00" },
  { name: "blue", hex: "#0000ff" },
] as const

export default function DeadPixelTest({
  messages,
}: {
  messages: typeof English
}) {
  const [position, setPosition] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const dialog = useRef<HTMLDialogElement>(null)
  const surface = useRef<HTMLDivElement>(null)
  const canvasButton = useRef<HTMLButtonElement>(null)
  const helpId = useId()
  const color = colors[position]!

  useEffect(() => {
    let wasFullscreen = false
    function onFullscreenChange() {
      const isFullscreen = document.fullscreenElement === surface.current
      if (wasFullscreen && !isFullscreen) dialog.current?.close()
      wasFullscreen = isFullscreen
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  function step(offset: number) {
    setPosition(
      (previous) => (previous + offset + colors.length) % colors.length
    )
  }

  function startFullscreen() {
    setControlsVisible(true)
    dialog.current?.showModal()
    // The dialog also works when the browser does not offer native fullscreen.
    void surface.current?.requestFullscreen?.().catch(() => {})
  }

  function exitNativeFullscreen() {
    if (document.fullscreenElement === surface.current) {
      void document.exitFullscreen()
    }
  }

  return (
    <section className="space-y-3">
      <div
        aria-hidden="true"
        className="min-h-56 rounded-xl border border-border sm:min-h-72"
        style={{ backgroundColor: color.hex }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label={messages.testColors}
          className="flex flex-wrap gap-2"
        >
          {colors.map((item, index) => (
            <Button
              key={item.name}
              type="button"
              variant={position === index ? "default" : "outline"}
              aria-pressed={position === index}
              className="min-h-10"
              onClick={() => setPosition(index)}
            >
              <span
                aria-hidden="true"
                className="size-3.5 shrink-0 rounded-full border border-neutral-400"
                style={{ backgroundColor: item.hex }}
              />
              {messages[item.name]}
            </Button>
          ))}
        </div>
        <Button type="button" className="min-h-10" onClick={startFullscreen}>
          <Maximize2 aria-hidden="true" />
          {messages.fullscreen}
        </Button>
      </div>
      <p id={helpId} className="text-sm text-muted-foreground">
        {messages.controlsHelp}
      </p>

      <dialog
        ref={dialog}
        aria-label={messages.fullscreenLabel}
        aria-describedby={helpId}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden border-0 p-0"
        onClose={exitNativeFullscreen}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault()
            step(-1)
          } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault()
            step(1)
          }
        }}
      >
        <div
          ref={surface}
          className="relative size-full"
          style={{ backgroundColor: color.hex }}
        >
          {controlsVisible && (
            <div className="absolute inset-x-0 top-0 z-10 flex justify-center p-3">
              <div className="flex max-w-full flex-wrap items-center justify-center gap-1 rounded-xl bg-neutral-950 p-1 text-white shadow-lg">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-11 hover:bg-white/20 hover:text-white"
                  aria-label={messages.previous}
                  title={messages.previous}
                  onClick={() => step(-1)}
                >
                  <ChevronLeft aria-hidden="true" className="rtl:rotate-180" />
                </Button>
                <span className="px-2 text-sm font-medium" aria-live="polite">
                  {messages[color.name]}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-11 hover:bg-white/20 hover:text-white"
                  aria-label={messages.next}
                  title={messages.next}
                  onClick={() => step(1)}
                >
                  <ChevronRight aria-hidden="true" className="rtl:rotate-180" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-11 hover:bg-white/20 hover:text-white"
                  aria-label={messages.hideControls}
                  title={messages.hideControls}
                  onClick={() => {
                    setControlsVisible(false)
                    canvasButton.current?.focus()
                  }}
                >
                  <EyeOff aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="size-11 hover:bg-white/20 hover:text-white"
                  aria-label={messages.exit}
                  title={messages.exit}
                  onClick={() => dialog.current?.close()}
                >
                  <Minimize2 aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
          <button
            ref={canvasButton}
            type="button"
            className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
            aria-label={controlsVisible ? messages.next : messages.showControls}
            onClick={() => {
              if (controlsVisible) step(1)
              else setControlsVisible(true)
            }}
          />
        </div>
      </dialog>
    </section>
  )
}
