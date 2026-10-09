import { useEffect, useRef, useState } from "react"
import { DEFAULT_MARKDOWN, STORAGE_KEYS } from "./constants"
import type { MarkdownPreviewerMessages } from "./types"

export function useDocument(m: MarkdownPreviewerMessages) {
  const [draft, setDraft] = useState(DEFAULT_MARKDOWN)
  const [file, setFile] = useState<File | null>(null)
  const [imported, setImported] = useState("")
  const [original, setOriginal] = useState("")
  const [reading, setReading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [storageFailed, setStorageFailed] = useState(false)
  const [restored, setRestored] = useState(false)
  const reader = useRef<FileReader | null>(null)
  const generation = useRef(0)
  const markdown = file ? imported : draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.markdown)
      if (saved !== null) setDraft(saved)
    } catch {
      setStorageFailed(true)
    }
    setRestored(true)
    const currentGeneration = generation
    return () => {
      currentGeneration.current++
      reader.current?.abort()
    }
  }, [])
  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem(STORAGE_KEYS.markdown, draft)
    } catch {
      setStorageFailed(true)
    }
  }, [draft, restored])
  function cancel() {
    generation.current++
    reader.current?.abort()
    reader.current = null
    setLoading(false)
  }
  function open(next: File | null) {
    if (
      file &&
      imported !== original &&
      !window.confirm(m.replaceEditedConfirm)
    )
      return
    cancel()
    setError("")
    if (!next) {
      setFile(null)
      setImported("")
      setOriginal("")
      setReading(false)
      return
    }
    if (
      !/\.(md|markdown|mdown|txt)$/i.test(next.name) &&
      !/^(text\/markdown|text\/plain)$/.test(next.type)
    ) {
      setError(m.unsupported)
      return
    }
    const current = generation.current
    const pending = new FileReader()
    reader.current = pending
    setLoading(true)
    pending.onerror = () => {
      if (generation.current !== current) return
      if (reader.current === pending) reader.current = null
      setLoading(false)
      setError(m.openFailed)
    }
    pending.onload = () => {
      if (generation.current !== current) return
      if (reader.current === pending) reader.current = null
      try {
        const bytes = new Uint8Array(pending.result as ArrayBuffer)
        const encoding =
          bytes[0] === 0xff && bytes[1] === 0xfe
            ? "utf-16le"
            : bytes[0] === 0xfe && bytes[1] === 0xff
              ? "utf-16be"
              : "utf-8"
        const text = new TextDecoder(encoding, { fatal: true }).decode(bytes)
        if (text.includes("\0")) throw new TypeError("BINARY")
        setFile(next)
        setImported(text)
        setOriginal(text)
        setReading(true)
      } catch (error) {
        setError(error instanceof TypeError ? m.encodingFailed : m.openFailed)
      }
      setLoading(false)
    }
    try {
      pending.readAsArrayBuffer(next)
    } catch {
      if (reader.current === pending) reader.current = null
      setLoading(false)
      setError(m.openFailed)
    }
  }
  function change(value: string) {
    cancel()
    if (file) setImported(value)
    else setDraft(value)
  }
  function sample() {
    if (
      markdown !== DEFAULT_MARKDOWN &&
      !window.confirm(m.loadSampleConfirmMessage)
    )
      return
    change(DEFAULT_MARKDOWN)
  }
  function clear() {
    if (markdown && window.confirm(m.clearConfirmMessage)) change("")
  }
  return {
    markdown,
    file,
    reading,
    setReading,
    loading,
    error,
    storageFailed,
    open,
    change,
    sample,
    clear,
    cancel,
  }
}
