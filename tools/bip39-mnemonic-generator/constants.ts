import { WORD_COUNTS, type Bip39Tab } from "./core/bip39"

import type { Bip39WordlistOption } from "./types"

const DEFAULT_ACTIVE_TAB: Bip39Tab = "generate"
const DEFAULT_WORDLIST = "english" as const
const DEFAULT_WORD_COUNT = WORD_COUNTS[0]

const STORAGE_KEYS = {
  activeTab: "tools:bip39-mnemonic-generator:tab",
  wordlist: "tools:bip39-mnemonic-generator:wordlist",
  wordCount: "tools:bip39-mnemonic-generator:word-count",
  validationMnemonic: "tools:bip39-mnemonic-generator:validate:mnemonic",
  entropyInput: "tools:bip39-mnemonic-generator:convert:entropy",
  conversionMnemonic: "tools:bip39-mnemonic-generator:convert:mnemonic",
} as const

const WORDLIST_OPTIONS: readonly Bip39WordlistOption[] = [
  { label: "English", value: "english" },
  { label: "中文 (简体)", value: "chinese_simplified" },
  { label: "中文 (繁體)", value: "chinese_traditional" },
  { label: "Čeština", value: "czech" },
  { label: "Français", value: "french" },
  { label: "Italiano", value: "italian" },
  { label: "日本語", value: "japanese" },
  { label: "한국어", value: "korean" },
  { label: "Português", value: "portuguese" },
  { label: "Español", value: "spanish" },
] as const

export {
  DEFAULT_ACTIVE_TAB,
  DEFAULT_WORDLIST,
  DEFAULT_WORD_COUNT,
  STORAGE_KEYS,
  WORDLIST_OPTIONS,
}
