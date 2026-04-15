import { describe, expect, test } from "vitest"

import {
  CHAR_TO_MORSE,
  MORSE_TO_CHAR,
  getUnsupportedTextCharacters,
  isValidMorse,
  morseToText,
  normalizeMorseInput,
  normalizeTextForDisplay,
  textToMorse,
} from "./morse"

describe("morse core", () => {
  test("exports matching forward and reverse maps", () => {
    expect(CHAR_TO_MORSE.S).toBe("...")
    expect(MORSE_TO_CHAR["..."]).toBe("S")
    expect(MORSE_TO_CHAR[".----."]).toBe("'")
  })

  test("encodes plain text into morse code", () => {
    expect(textToMorse("SOS")).toBe("... --- ...")
    expect(textToMorse("Hello world")).toBe(
      ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
    )
    expect(textToMorse("A   B")).toBe(".- / -...")
    expect(textToMorse("A   ")).toBe(".-")
  })

  test("drops unsupported characters during encoding", () => {
    expect(textToMorse("Hi 🙂!")).toBe(".... .. / -.-.--")
    expect(textToMorse("🙂")).toBe("")
  })

  test("collects unsupported characters from text input", () => {
    expect(getUnsupportedTextCharacters("Café 🙂")).toEqual(["É", "🙂"])
    expect(getUnsupportedTextCharacters("SOS 123")).toEqual([])
  })

  test("normalizes text output for display", () => {
    expect(normalizeTextForDisplay(" hello   world ")).toBe("HELLO WORLD")
    expect(normalizeTextForDisplay("")).toBe("")
  })

  test("normalizes valid morse input", () => {
    expect(normalizeMorseInput("... --- ...")).toBe("... --- ...")
    expect(normalizeMorseInput("...   ---")).toBe("... / ---")
    expect(normalizeMorseInput("... / ---")).toBe("... / ---")
  })

  test("throws on invalid morse input", () => {
    expect(() => normalizeMorseInput("")).toThrow("Morse code is empty")
    expect(() => normalizeMorseInput(" / ")).toThrow("Invalid Morse code")
    expect(() => normalizeMorseInput("... x ---")).toThrow("Invalid Morse code")
    expect(() => normalizeMorseInput("... --- ......")).toThrow(
      "Invalid Morse code"
    )
  })

  test("decodes valid morse input into text", () => {
    expect(morseToText("... --- ...")).toBe("SOS")
    expect(morseToText(".... . .-.. .-.. --- / .-- --- .-. .-.. -..")).toBe(
      "HELLO WORLD"
    )
    expect(morseToText(".... . .-.. .-.. ---   .-- --- .-. .-.. -..")).toBe(
      "HELLO WORLD"
    )
  })

  test("validates morse input", () => {
    expect(isValidMorse("")).toBe(false)
    expect(isValidMorse("... --- ...")).toBe(true)
    expect(isValidMorse("... --- ......")).toBe(false)
  })
})
