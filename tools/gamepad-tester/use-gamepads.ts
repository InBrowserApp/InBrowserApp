import { useEffect, useRef, useState } from "react"

import { createRestSampler, REST_CHECK_MS } from "./core/stick-rest"
import type { GamepadInput } from "./types"

type Target = Pick<GamepadInput, "id" | "index">
type RestResult = ReturnType<ReturnType<typeof createRestSampler>["result"]>

type RestCheck =
  | { target: Target; status: "running" | "interrupted" }
  | { target: Target; status: "complete"; result: RestResult }

function sameDevice(before: Target, after: Target) {
  return before.index === after.index && before.id === after.id
}

function sameInput(before: GamepadInput, after: Gamepad) {
  return (
    sameDevice(before, after) &&
    before.mapping === after.mapping &&
    before.axes.length === after.axes.length &&
    before.buttons.length === after.buttons.length &&
    before.axes.every((value, index) => value === after.axes[index]) &&
    before.buttons.every(
      (button, index) =>
        button.value === after.buttons[index]!.value &&
        button.pressed === after.buttons[index]!.pressed
    )
  )
}

function snapshot({
  index,
  id,
  mapping,
  axes,
  buttons,
}: Gamepad): GamepadInput {
  return {
    index,
    id,
    mapping,
    axes: [...axes],
    buttons: buttons.map(({ pressed, value }) => ({ pressed, value })),
  }
}

export function useGamepads() {
  const [gamepads, setGamepads] = useState<GamepadInput[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [check, setCheck] = useState<RestCheck | null>(null)
  const running = useRef<{
    target: Target
    start: number | null
    sampler: ReturnType<typeof createRestSampler>
  } | null>(null)

  useEffect(() => {
    if (typeof navigator.getGamepads !== "function") {
      setUnavailable(true)
      return
    }

    let frame: number
    let previous: GamepadInput[] = []

    function poll(now: number) {
      let pads: Gamepad[]
      try {
        pads = Array.from(navigator.getGamepads()).filter(
          (pad): pad is Gamepad => Boolean(pad?.connected)
        )
      } catch {
        setUnavailable(true)
        setGamepads([])
        running.current = null
        setCheck(null)
        return
      }

      if (
        pads.length !== previous.length ||
        previous.some((pad, index) => !sameInput(pad, pads[index]!))
      ) {
        previous = pads.map(snapshot)
        setGamepads(previous)
        setSelectedIndex((index) =>
          pads.some((pad) => pad.index === index) ? index : null
        )
        setCheck((current) =>
          current && !pads.some((pad) => sameDevice(current.target, pad))
            ? null
            : current
        )
      }

      const test = running.current
      if (test) {
        const pad = pads.find((pad) => sameDevice(test.target, pad))
        if (pad) {
          test.start ??= now
          test.sampler.sample(pad.axes)
          if (now - test.start >= REST_CHECK_MS) {
            setCheck({
              status: "complete",
              target: test.target,
              result: test.sampler.result(),
            })
            running.current = null
          }
        } else {
          running.current = null
        }
      }

      frame = requestAnimationFrame(poll)
    }

    function onVisibilityChange() {
      cancelAnimationFrame(frame)
      if (!document.hidden) {
        frame = requestAnimationFrame(poll)
      } else if (running.current) {
        setCheck({ status: "interrupted", target: running.current.target })
        running.current = null
      }
    }

    onVisibilityChange()
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [])

  const gamepad =
    gamepads.find((pad) => pad.index === selectedIndex) ?? gamepads[0]

  function select(index: number) {
    setSelectedIndex(index)
    running.current = null
    setCheck(null)
  }

  function startCheck(target: Target) {
    running.current = { target, start: null, sampler: createRestSampler() }
    setCheck({ status: "running", target })
  }

  return {
    gamepad,
    gamepads,
    unavailable,
    check: check && gamepad && sameDevice(check.target, gamepad) ? check : null,
    select,
    startCheck,
  }
}
