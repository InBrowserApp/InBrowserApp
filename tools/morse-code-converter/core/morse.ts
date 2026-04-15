const CHAR_TO_MORSE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
}

const MORSE_TO_CHAR: Record<string, string> = Object.fromEntries(
  Object.entries(CHAR_TO_MORSE).map(([char, morse]) => [morse, char])
)

function normalizeTextForDisplay(input: string) {
  return input.trim().toUpperCase().replace(/\s+/gu, " ")
}

function textToMorse(input: string) {
  const normalized = input.toUpperCase()
  const tokens: string[] = []
  let lastWasWordBreak = true

  for (const char of normalized) {
    if (/\s/u.test(char)) {
      if (!lastWasWordBreak && tokens.length > 0) {
        tokens.push("/")
        lastWasWordBreak = true
      }
      continue
    }

    const code = CHAR_TO_MORSE[char]

    if (!code) {
      continue
    }

    tokens.push(code)
    lastWasWordBreak = false
  }

  if (tokens.at(-1) === "/") {
    tokens.pop()
  }

  return tokens.join(" ")
}

function getUnsupportedTextCharacters(input: string) {
  const unsupported = new Set<string>()

  for (const char of input.toUpperCase()) {
    if (!/\s/u.test(char) && !CHAR_TO_MORSE[char]) {
      unsupported.add(char)
    }
  }

  return [...unsupported]
}

function normalizeMorseInput(input: string) {
  const normalized = input.trim()

  if (!normalized) {
    throw new Error("Morse code is empty")
  }

  if (/[^./\-\s]/u.test(normalized)) {
    throw new Error("Invalid Morse code")
  }

  const words = normalized
    .split(/\s*\/\s*|\s{3,}/u)
    .map((word) => word.trim())
    .filter(Boolean)

  if (words.length === 0) {
    throw new Error("Invalid Morse code")
  }

  return words
    .map((word) => {
      const letters = word.split(/\s+/u).filter(Boolean)

      for (const letter of letters) {
        if (!MORSE_TO_CHAR[letter]) {
          throw new Error("Invalid Morse code")
        }
      }

      return letters.join(" ")
    })
    .join(" / ")
}

function morseToText(input: string) {
  const normalized = normalizeMorseInput(input)

  return normalized
    .split(" / ")
    .map((word) =>
      word
        .split(" ")
        .map((code) => MORSE_TO_CHAR[code]!)
        .join("")
    )
    .join(" ")
}

function isValidMorse(input: string) {
  try {
    normalizeMorseInput(input)
    return true
  } catch {
    return false
  }
}

export {
  CHAR_TO_MORSE,
  MORSE_TO_CHAR,
  getUnsupportedTextCharacters,
  isValidMorse,
  morseToText,
  normalizeMorseInput,
  normalizeTextForDisplay,
  textToMorse,
}
