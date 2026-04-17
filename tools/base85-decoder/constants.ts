import type { Base85Variant } from "./core/base85"
import type { Base85DecoderMessages } from "./types"

const STORAGE_KEYS = {
  alphabet: "tools:base85-decoder:alphabet",
  text: "tools:base85-decoder:text",
} as const
const DEFAULT_INPUTS = {
  ascii85: "BOu!rD]j7BEbo7",
  z85: "nm=QNz=Z<$y?aXj",
} as const satisfies Record<Base85Variant, string>
const BASE85_VARIANTS = ["ascii85", "z85"] as const
const FILE_ACCEPT =
  "text/*,.txt,.log,.md,.json,.csv,.yaml,.yml,.b85,.a85,.ascii85,.z85"

function getAlphabetLabel(
  messages: Base85DecoderMessages,
  variant: Base85Variant
) {
  return variant === "z85" ? messages.alphabetZ85 : messages.alphabetAscii85
}

function isDefaultInputForVariant(value: string, variant: Base85Variant) {
  return value === DEFAULT_INPUTS[variant]
}

export {
  BASE85_VARIANTS,
  DEFAULT_INPUTS,
  FILE_ACCEPT,
  STORAGE_KEYS,
  getAlphabetLabel,
  isDefaultInputForVariant,
}
