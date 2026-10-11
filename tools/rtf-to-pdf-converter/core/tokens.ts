import { ConversionError } from "./errors"

type Handlers = {
  open: () => void
  close: () => void
  word: (name: string, value?: number) => void
  text: (bytes: Uint8Array) => void
  character: (code: number) => void
  binary: (bytes: Uint8Array) => void
}
const letter = (value: number) =>
  (value >= 65 && value <= 90) || (value >= 97 && value <= 122)
const digit = (value: number) => value >= 48 && value <= 57
const whitespace = (value: number) => [9, 10, 13, 32].includes(value)

// Scan the original bytes. Binary spans and escaped braces cannot affect
// group balance, and legacy character encodings are left intact for Writer.
export function scan(bytes: Uint8Array, handlers: Handlers) {
  const invalid = () => {
    throw new ConversionError("invalid")
  }
  let cursor = 0
  const decoder = new TextDecoder()
  while (whitespace(bytes[cursor]!)) cursor++
  if (
    !/^\{\\rtf1(?=[\\{}\s])/.test(
      decoder.decode(bytes.subarray(cursor, cursor + 7))
    )
  )
    invalid()
  let depth = 0
  let complete = false
  while (cursor < bytes.length) {
    const value = bytes[cursor++]!
    if (complete) {
      if (!whitespace(value) && value !== 0) invalid()
    } else if (value === 123) {
      depth++
      handlers.open()
    } else if (value === 125) {
      handlers.close()
      if (--depth === 0) complete = true
    } else if (value === 92) {
      if (cursor === bytes.length) invalid()
      const symbol = bytes[cursor++]!
      if (symbol === 39) {
        const hex = decoder.decode(bytes.subarray(cursor, cursor + 2))
        if (!/^[0-9a-f]{2}$/i.test(hex)) invalid()
        handlers.character(Number.parseInt(hex, 16))
        cursor += 2
      } else if (!letter(symbol)) {
        if ([92, 123, 125].includes(symbol)) handlers.character(symbol)
        else if (symbol === 126) handlers.character(160)
        else if (symbol === 45) handlers.character(173)
        else if (symbol === 95) handlers.character(8209)
      } else {
        const start = cursor - 1
        while (letter(bytes[cursor]!)) cursor++
        const name = decoder.decode(bytes.subarray(start, cursor))
        let parameter: number | undefined
        const numberStart = cursor
        if (bytes[cursor] === 45) cursor++
        const digits = cursor
        while (digit(bytes[cursor]!)) cursor++
        if (cursor > digits) {
          parameter = Number(
            decoder.decode(bytes.subarray(numberStart, cursor))
          )
          if (!Number.isSafeInteger(parameter)) invalid()
        } else if (cursor !== numberStart) invalid()
        if (bytes[cursor] === 32) cursor++
        if (name === "bin") {
          if (
            parameter === undefined ||
            parameter < 0 ||
            parameter > bytes.length - cursor
          )
            invalid()
          handlers.binary(bytes.subarray(cursor, cursor + parameter!))
          cursor += parameter!
        } else handlers.word(name, parameter)
      }
    } else {
      const start = cursor - 1
      while (cursor < bytes.length && ![92, 123, 125].includes(bytes[cursor]!))
        cursor++
      handlers.text(bytes.subarray(start, cursor))
    }
  }
  if (!complete) invalid()
}
