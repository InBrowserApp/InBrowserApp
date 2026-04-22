import {
  startTransition,
  useDeferredValue,
  useEffect,
  useId,
  useState,
} from "react"

import {
  DEFAULT_ACTIVE_TAB,
  DEFAULT_WORDLIST,
  DEFAULT_WORD_COUNT,
  STORAGE_KEYS,
  WORDLIST_OPTIONS,
} from "./constants"
import { OptionsCard } from "./components/options-card"
import { ResultsCard } from "./components/results-card"
import {
  countMnemonicWords,
  entropyToMnemonic,
  generateMnemonic,
  isValidEntropyHex,
  mnemonicToEntropy,
  normalizeEntropyHex,
  normalizeMnemonic,
  validateMnemonic,
  wordCountToStrength,
  type Bip39Tab,
  type Bip39WordCount,
  type Bip39WordlistName,
} from "./core/bip39"

import type { Bip39MnemonicGeneratorMessages } from "./types"

type Bip39MnemonicGeneratorClientProps = Readonly<{
  messages: Bip39MnemonicGeneratorMessages
}>

function isBip39Tab(value: string): value is Bip39Tab {
  return value === "generate" || value === "validate" || value === "convert"
}

function isBip39WordCount(value: number): value is Bip39WordCount {
  return (
    value === 12 || value === 15 || value === 18 || value === 21 || value === 24
  )
}

function isBip39WordlistName(value: string): value is Bip39WordlistName {
  return WORDLIST_OPTIONS.some((option) => option.value === value)
}

function buildDownloadValue(mnemonic: string, entropy: string) {
  return [`Mnemonic`, mnemonic, "", `Entropy`, entropy].join("\n")
}

function Bip39MnemonicGeneratorClient({
  messages,
}: Bip39MnemonicGeneratorClientProps) {
  const validationMnemonicId = useId()
  const conversionMnemonicId = useId()
  const entropyInputId = useId()

  const [hasLoadedStorage, setHasLoadedStorage] = useState(false)
  const [activeTab, setActiveTab] = useState<Bip39Tab>(DEFAULT_ACTIVE_TAB)
  const [wordlist, setWordlist] = useState<Bip39WordlistName>(DEFAULT_WORDLIST)
  const [wordCount, setWordCount] = useState<Bip39WordCount>(DEFAULT_WORD_COUNT)
  const [validationMnemonic, setValidationMnemonic] = useState("")
  const [entropyInput, setEntropyInput] = useState("")
  const [conversionMnemonic, setConversionMnemonic] = useState("")
  const [generatedMnemonic, setGeneratedMnemonic] = useState("")
  const [generatedEntropy, setGeneratedEntropy] = useState("")
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const deferredValidationMnemonic = useDeferredValue(validationMnemonic)
  const deferredEntropyInput = useDeferredValue(entropyInput)
  const deferredConversionMnemonic = useDeferredValue(conversionMnemonic)

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      setHasLoadedStorage(true)
      return
    }

    const storedTab = window.localStorage.getItem(STORAGE_KEYS.activeTab)
    const storedWordlist = window.localStorage.getItem(STORAGE_KEYS.wordlist)
    const storedWordCount = Number(
      window.localStorage.getItem(STORAGE_KEYS.wordCount)
    )

    if (storedTab && isBip39Tab(storedTab)) {
      setActiveTab(storedTab)
    }

    if (storedWordlist && isBip39WordlistName(storedWordlist)) {
      setWordlist(storedWordlist)
    }

    if (isBip39WordCount(storedWordCount)) {
      setWordCount(storedWordCount)
    }

    setValidationMnemonic(
      window.localStorage.getItem(STORAGE_KEYS.validationMnemonic) ?? ""
    )
    setEntropyInput(
      window.localStorage.getItem(STORAGE_KEYS.entropyInput) ?? ""
    )
    setConversionMnemonic(
      window.localStorage.getItem(STORAGE_KEYS.conversionMnemonic) ?? ""
    )
    setHasLoadedStorage(true)
  }, [])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined" || !hasLoadedStorage) {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.activeTab, activeTab)
    window.localStorage.setItem(STORAGE_KEYS.wordlist, wordlist)
    window.localStorage.setItem(STORAGE_KEYS.wordCount, String(wordCount))
    window.localStorage.setItem(
      STORAGE_KEYS.validationMnemonic,
      validationMnemonic
    )
    window.localStorage.setItem(STORAGE_KEYS.entropyInput, entropyInput)
    window.localStorage.setItem(
      STORAGE_KEYS.conversionMnemonic,
      conversionMnemonic
    )
  }, [
    activeTab,
    conversionMnemonic,
    entropyInput,
    hasLoadedStorage,
    validationMnemonic,
    wordCount,
    wordlist,
  ])

  useEffect(() => {
    if (!hasLoadedStorage) {
      return
    }

    const result = generateMnemonic({ wordCount, wordlist })

    startTransition(() => {
      setGeneratedMnemonic(result.mnemonic)
      setGeneratedEntropy(result.entropy)
    })
  }, [hasLoadedStorage, nonce, wordCount, wordlist])

  useEffect(() => {
    if (!generatedMnemonic || !generatedEntropy) {
      setDownloadUrl(null)
      return
    }

    const nextUrl = URL.createObjectURL(
      new Blob([buildDownloadValue(generatedMnemonic, generatedEntropy)], {
        type: "text/plain;charset=utf-8",
      })
    )

    setDownloadUrl(nextUrl)

    return () => {
      URL.revokeObjectURL(nextUrl)
    }
  }, [generatedEntropy, generatedMnemonic])

  const strengthBits = wordCountToStrength(wordCount)
  const normalizedValidationMnemonic = normalizeMnemonic(
    deferredValidationMnemonic
  )
  const validationWordCount = countMnemonicWords(normalizedValidationMnemonic)
  const validationState =
    normalizedValidationMnemonic.length === 0
      ? "empty"
      : validateMnemonic(normalizedValidationMnemonic, wordlist)
        ? "valid"
        : "invalid"
  const validationEntropy =
    validationState === "valid"
      ? mnemonicToEntropy(normalizedValidationMnemonic, wordlist)
      : ""

  const normalizedEntropyInput = normalizeEntropyHex(deferredEntropyInput)
  const entropyHasError =
    normalizedEntropyInput.length > 0 &&
    !isValidEntropyHex(normalizedEntropyInput)
  const entropyMnemonic =
    normalizedEntropyInput.length > 0 && !entropyHasError
      ? entropyToMnemonic(normalizedEntropyInput, wordlist)
      : ""

  const normalizedConversionMnemonic = normalizeMnemonic(
    deferredConversionMnemonic
  )
  const mnemonicHasError =
    normalizedConversionMnemonic.length > 0 &&
    !validateMnemonic(normalizedConversionMnemonic, wordlist)
  const mnemonicEntropy =
    normalizedConversionMnemonic.length > 0 && !mnemonicHasError
      ? mnemonicToEntropy(normalizedConversionMnemonic, wordlist)
      : ""

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <OptionsCard
        activeTab={activeTab}
        conversionMnemonic={conversionMnemonic}
        conversionMnemonicId={conversionMnemonicId}
        entropyInput={entropyInput}
        entropyInputId={entropyInputId}
        messages={messages}
        strengthBits={strengthBits}
        validationMnemonic={validationMnemonic}
        validationMnemonicId={validationMnemonicId}
        wordCount={wordCount}
        wordlist={wordlist}
        wordlistOptions={WORDLIST_OPTIONS}
        onActiveTabChange={setActiveTab}
        onConversionMnemonicChange={setConversionMnemonic}
        onEntropyInputChange={setEntropyInput}
        onValidationMnemonicChange={setValidationMnemonic}
        onWordCountChange={(value) => {
          const parsed = Number(value)

          if (isBip39WordCount(parsed)) {
            setWordCount(parsed)
          }
        }}
        onWordlistChange={(value) => {
          if (isBip39WordlistName(value)) {
            setWordlist(value)
          }
        }}
      />

      <ResultsCard
        activeTab={activeTab}
        downloadUrl={downloadUrl}
        generatedEntropy={generatedEntropy}
        generatedMnemonic={generatedMnemonic}
        messages={messages}
        strengthBits={strengthBits}
        validationEntropy={validationEntropy}
        validationState={validationState}
        validationWordCount={validationWordCount}
        wordCount={wordCount}
        entropyHasError={entropyHasError}
        entropyMnemonic={entropyMnemonic}
        mnemonicEntropy={mnemonicEntropy}
        mnemonicHasError={mnemonicHasError}
        onRegenerate={() => {
          startTransition(() => {
            setNonce((value) => value + 1)
          })
        }}
      />
    </div>
  )
}

export default Bip39MnemonicGeneratorClient
