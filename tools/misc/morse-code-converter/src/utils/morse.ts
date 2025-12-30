/**
 * International Morse Code mapping
 */
export const CHAR_TO_MORSE: Record<string, string> = {
  // Letters
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  // Numbers
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  // Punctuation
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  _: '..--.-',
  '"': '.-..-.',
  $: '...-..-',
  '@': '.--.-.',
}

/**
 * Reverse mapping: Morse code to character
 */
export const MORSE_TO_CHAR: Record<string, string> = Object.fromEntries(
  Object.entries(CHAR_TO_MORSE).map(([char, morse]) => [morse, char]),
)

/**
 * Convert text to Morse code
 * @param text - Plain text input
 * @returns Morse code with spaces between characters and / between words
 */
export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map((char) => {
      if (char === ' ') return '/'
      return CHAR_TO_MORSE[char] || ''
    })
    .filter((code) => code !== '')
    .join(' ')
}

/**
 * Convert Morse code to text
 * @param morse - Morse code input (dots, dashes, spaces, and /)
 * @returns Plain text
 */
export function morseToText(morse: string): string {
  return morse
    .trim()
    .split(/\s*\/\s*|\s{3,}/)
    .map((word) =>
      word
        .split(/\s+/)
        .map((code) => MORSE_TO_CHAR[code] || '')
        .join(''),
    )
    .join(' ')
}

/**
 * Validate if a string is valid Morse code
 * @param morse - Morse code input
 * @returns true if valid, false otherwise
 */
export function isValidMorse(morse: string): boolean {
  if (!morse.trim()) return true

  const codes = morse
    .trim()
    .split(/\s*\/\s*|\s+/)
    .filter((c) => c !== '')

  return codes.every((code) => code === '' || MORSE_TO_CHAR[code] !== undefined)
}

/**
 * Play Morse code as audio using Web Audio API
 */
export function playMorseAudio(
  morse: string,
  options: {
    frequency?: number
    dotDuration?: number
    onComplete?: () => void
  } = {},
): { stop: () => void } {
  const { frequency = 700, dotDuration = 100, onComplete } = options

  const dashDuration = dotDuration * 3
  const elementGap = dotDuration
  const charGap = dotDuration * 3
  const wordGap = dotDuration * 7

  let audioContext: AudioContext | null = null
  let stopped = false

  const play = async () => {
    audioContext = new AudioContext()

    const elements = morse.split('')
    let time = audioContext.currentTime

    for (const element of elements) {
      if (stopped) break

      if (element === '.') {
        await playTone(audioContext, frequency, time, dotDuration / 1000)
        time += (dotDuration + elementGap) / 1000
      } else if (element === '-') {
        await playTone(audioContext, frequency, time, dashDuration / 1000)
        time += (dashDuration + elementGap) / 1000
      } else if (element === ' ') {
        time += (charGap - elementGap) / 1000
      } else if (element === '/') {
        time += (wordGap - charGap) / 1000
      }
    }

    // Wait for audio to finish
    const remainingTime = (time - audioContext.currentTime) * 1000
    if (remainingTime > 0 && !stopped) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime))
    }

    if (!stopped) {
      onComplete?.()
    }
  }

  const playTone = (
    ctx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
  ): Promise<void> => {
    return new Promise((resolve) => {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = freq
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.5, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)

      setTimeout(resolve, duration * 1000)
    })
  }

  play()

  return {
    stop: () => {
      stopped = true
      audioContext?.close()
    },
  }
}
