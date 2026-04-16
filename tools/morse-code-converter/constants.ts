import type { ActiveSource } from "./types"

const DEFAULT_TEXT_INPUT = "HELLO WORLD"
const DEFAULT_MORSE_INPUT = ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."

const STORAGE_KEYS = {
  textInput: "tools:morse-code-converter:text-input",
  morseInput: "tools:morse-code-converter:morse-input",
  activeSource: "tools:morse-code-converter:active-source",
} as const

function isActiveSource(value: string): value is ActiveSource {
  return value === "text" || value === "morse"
}

export { DEFAULT_MORSE_INPUT, DEFAULT_TEXT_INPUT, STORAGE_KEYS, isActiveSource }
