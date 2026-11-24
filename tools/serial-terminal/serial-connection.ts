export type SerialPort = {
  readable: ReadableStream<Uint8Array> | null
  writable: WritableStream<Uint8Array> | null
  open(options: { baudRate: number }): Promise<void>
  close(): Promise<void>
}

type Serial = {
  requestPort(): Promise<SerialPort>
}

export function getSerial() {
  return (navigator as Navigator & { serial?: Serial }).serial
}

export function createConnection(
  port: SerialPort,
  onData: (bytes: Uint8Array, text: string) => void,
  onEnd: (failed: boolean) => void
) {
  const decoder = new TextDecoder()
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
  let writer: WritableStreamDefaultWriter<Uint8Array> | undefined
  let writing: Promise<void> | undefined
  let closing = false
  let closePromise: Promise<void> | undefined

  async function read() {
    while (port.readable && !closing) {
      const stream = port.readable
      reader = stream.getReader()
      try {
        while (!closing) {
          const { value, done } = await reader.read()
          if (done) return false
          // Limit the size of individual rows while preserving split UTF-8 characters.
          for (let start = 0; start < value.length; start += 4096) {
            const bytes = value.slice(start, start + 4096)
            onData(bytes, decoder.decode(bytes, { stream: true }))
          }
        }
      } catch {
        // Web Serial replaces the readable stream after a recoverable framing error.
        if (port.readable === stream || !port.readable) return true
      } finally {
        reader.releaseLock()
        reader = undefined
      }
    }
    return false
  }

  const reading = read().then((failed) => {
    const tail = decoder.decode()
    if (tail) onData(new Uint8Array(), tail)
    if (!closing) onEnd(failed)
  })

  return {
    async send(bytes: Uint8Array) {
      if (closing || !port.writable) throw new Error("Port is closed")
      const activeWriter = port.writable.getWriter()
      writer = activeWriter
      writing = activeWriter.write(bytes).finally(() => {
        activeWriter.releaseLock()
        writer = undefined
        writing = undefined
      })
      await writing
    },
    close() {
      closing = true
      return (closePromise ??= (async () => {
        await Promise.allSettled([reader?.cancel(), writer?.abort(), writing])
        await reading
        await port.close()
      })())
    },
  }
}

export type Connection = ReturnType<typeof createConnection>
