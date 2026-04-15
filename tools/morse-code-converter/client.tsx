import { useEffect, useId, useMemo, useRef, useState } from "react"

import { InputCard } from "./components/input-card"
import { ResultCard } from "./components/result-card"
import {
  DEFAULT_MORSE_INPUT,
  DEFAULT_TEXT_INPUT,
  STORAGE_KEYS,
  isActiveSource,
} from "./constants"
import {
  getUnsupportedTextCharacters,
  morseToText,
  normalizeMorseInput,
  normalizeTextForDisplay,
  textToMorse,
} from "./core/morse"

import type {
  ActiveSource,
  MorseCodeConverterMessages,
  ResultStatus,
} from "./types"

type AudioController = {
  stop: () => void
}

function MorseCodeConverterClient({
  messages,
}: Readonly<{ messages: MorseCodeConverterMessages }>) {
  const textInputId = useId()
  const morseInputId = useId()
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [textInput, setTextInput] = useState(DEFAULT_TEXT_INPUT)
  const [morseInput, setMorseInput] = useState(DEFAULT_MORSE_INPUT)
  const [activeSource, setActiveSource] = useState<ActiveSource>("text")
  const [isPlaying, setIsPlaying] = useState(false)
  const audioControllerRef = useRef<AudioController | null>(null)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      setHasLoadedStorage(true)
      return
    }

    const storedTextInput = window.localStorage.getItem(STORAGE_KEYS.textInput)
    const storedMorseInput = window.localStorage.getItem(
      STORAGE_KEYS.morseInput
    )
    const storedActiveSource = window.localStorage.getItem(
      STORAGE_KEYS.activeSource
    )

    if (storedTextInput !== null) {
      setTextInput(storedTextInput)
    }

    if (storedMorseInput !== null) {
      setMorseInput(storedMorseInput)
    }

    if (storedActiveSource !== null && isActiveSource(storedActiveSource)) {
      setActiveSource(storedActiveSource)
    }

    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.textInput, textInput)
    window.localStorage.setItem(STORAGE_KEYS.morseInput, morseInput)
    window.localStorage.setItem(STORAGE_KEYS.activeSource, activeSource)
  }, [activeSource, hasLoadedStorage, morseInput, textInput])

  useEffect(() => {
    return () => {
      audioControllerRef.current?.stop()
      audioControllerRef.current = null
    }
  }, [])

  const result = useMemo(() => {
    if (activeSource === "morse") {
      if (morseInput.trim().length === 0) {
        return {
          errorMessage: null,
          morseOutput: "",
          status: "idle" as ResultStatus,
          textOutput: "",
        }
      }

      try {
        return {
          errorMessage: null,
          morseOutput: normalizeMorseInput(morseInput),
          status: "valid" as ResultStatus,
          textOutput: morseToText(morseInput),
        }
      } catch {
        return {
          errorMessage: messages.invalidMorseCode,
          morseOutput: morseInput.trim(),
          status: "invalid" as ResultStatus,
          textOutput: "",
        }
      }
    }

    if (textInput.trim().length === 0) {
      return {
        errorMessage: null,
        morseOutput: "",
        status: "idle" as ResultStatus,
        textOutput: "",
      }
    }

    const morseOutput = textToMorse(textInput)

    if (
      morseOutput.length === 0 &&
      getUnsupportedTextCharacters(textInput).length
    ) {
      return {
        errorMessage: messages.unsupportedTextMessage,
        morseOutput: "",
        status: "invalid" as ResultStatus,
        textOutput: normalizeTextForDisplay(textInput),
      }
    }

    return {
      errorMessage: null,
      morseOutput,
      status: "valid" as ResultStatus,
      textOutput: normalizeTextForDisplay(textInput),
    }
  }, [
    activeSource,
    messages.invalidMorseCode,
    messages.unsupportedTextMessage,
    morseInput,
    textInput,
  ])

  function stopPlayback() {
    audioControllerRef.current?.stop()
    audioControllerRef.current = null
    setIsPlaying(false)
  }

  function handleTextInputChange(value: string) {
    stopPlayback()
    setActiveSource("text")
    setTextInput(value)
    setMorseInput(textToMorse(value))
  }

  function handleMorseInputChange(value: string) {
    stopPlayback()
    setActiveSource("morse")
    setMorseInput(value)

    if (value.trim().length === 0) {
      setTextInput("")
      return
    }

    try {
      setTextInput(morseToText(value))
    } catch {
      setTextInput("")
    }
  }

  function handlePlay() {
    if (result.status !== "valid" || result.morseOutput.length === 0) {
      return
    }

    stopPlayback()

    const controller = createMorseAudioController(result.morseOutput, {
      onComplete: () => {
        audioControllerRef.current = null
        setIsPlaying(false)
      },
    })

    if (!controller) {
      return
    }

    audioControllerRef.current = controller
    setIsPlaying(true)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <InputCard
        messages={messages}
        textInput={textInput}
        textInputId={textInputId}
        morseInput={morseInput}
        morseInputId={morseInputId}
        onTextInputChange={handleTextInputChange}
        onMorseInputChange={handleMorseInputChange}
        onLoadSample={() => {
          stopPlayback()
          setActiveSource("text")
          setTextInput(DEFAULT_TEXT_INPUT)
          setMorseInput(DEFAULT_MORSE_INPUT)
        }}
        onClear={() => {
          stopPlayback()
          setActiveSource("text")
          setTextInput("")
          setMorseInput("")
        }}
      />

      <ResultCard
        messages={messages}
        status={result.status}
        errorMessage={result.errorMessage}
        textOutput={result.textOutput}
        morseOutput={result.morseOutput}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={stopPlayback}
      />
    </div>
  )
}

/* v8 ignore start */
function createMorseAudioController(
  morse: string,
  options: {
    onComplete?: () => void
  } = {}
): AudioController | null {
  if (typeof window === "undefined") {
    return null
  }

  const AudioContextClass =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext

  if (!AudioContextClass) {
    return null
  }

  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  const dotDuration = 0.09
  const dashDuration = dotDuration * 3
  const elementGap = dotDuration
  const charGap = dotDuration * 3
  const wordGap = dotDuration * 7

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)
  oscillator.type = "sine"
  oscillator.frequency.value = 700
  gainNode.gain.setValueAtTime(0.0001, context.currentTime)

  let currentTime = context.currentTime

  function scheduleTone(duration: number) {
    gainNode.gain.setValueAtTime(0.0001, currentTime)
    gainNode.gain.linearRampToValueAtTime(0.18, currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.0001, currentTime + duration)
    currentTime += duration + elementGap
  }

  for (const character of morse) {
    if (character === ".") {
      scheduleTone(dotDuration)
      continue
    }

    if (character === "-") {
      scheduleTone(dashDuration)
      continue
    }

    if (character === " ") {
      currentTime += charGap - elementGap
      continue
    }

    if (character === "/") {
      currentTime += wordGap - charGap
    }
  }

  oscillator.start(context.currentTime)
  oscillator.stop(currentTime)

  let completed = false

  function finish() {
    if (completed) {
      return
    }

    completed = true
    options.onComplete?.()
  }

  const timeout = window.setTimeout(
    () => {
      void context.close()
      finish()
    },
    Math.max(0, (currentTime - context.currentTime) * 1000 + 50)
  )

  return {
    stop() {
      window.clearTimeout(timeout)
      void context.close()
      finish()
    },
  }
}
/* v8 ignore stop */

export default MorseCodeConverterClient
