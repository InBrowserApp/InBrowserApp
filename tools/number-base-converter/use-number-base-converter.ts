import { useEffect, useMemo, useState } from "react"

import {
  isValidBase32,
  isValidBase36,
  isValidBase62,
  isValidBase64,
  isValidBinary,
  isValidDecimal,
  isValidForBase,
  isValidHex,
  isValidOctal,
  normalizeBase,
  parseBase,
  parseBase32,
  parseBase36,
  parseBase62,
  parseBase64Number,
  parseBinary,
  parseDecimal,
  parseHex,
  parseOctal,
  toBase,
  toBase32,
  toBase36,
  toBase62,
  toBase64Number,
  toBinary,
  toDecimal,
  toHex,
  toOctal,
} from "./core/number-base"

type BaseFieldKey =
  | "binary"
  | "octal"
  | "decimal"
  | "hex"
  | "base32"
  | "base36"
  | "base62"
  | "base64"
  | "custom"

type BaseFieldValues = Record<BaseFieldKey, string>

const DEFAULT_DECIMAL_VALUE = "255"
const DEFAULT_CUSTOM_BASE = 58

const STORAGE_KEYS = {
  decimal: "tools:number-base-converter:decimal",
  customBase: "tools:number-base-converter:custom-base",
} as const

function buildFieldValues(value: bigint, customBase: number): BaseFieldValues {
  return {
    binary: toBinary(value),
    octal: toOctal(value),
    decimal: toDecimal(value),
    hex: toHex(value),
    base32: toBase32(value),
    base36: toBase36(value),
    base62: toBase62(value),
    base64: toBase64Number(value),
    custom: toBase(value, customBase),
  }
}

function createEmptyFields(): BaseFieldValues {
  return {
    binary: "",
    octal: "",
    decimal: "",
    hex: "",
    base32: "",
    base36: "",
    base62: "",
    base64: "",
    custom: "",
  }
}

function clearOtherFields(current: BaseFieldValues, source: BaseFieldKey) {
  const next = { ...current }

  for (const key of Object.keys(next) as BaseFieldKey[]) {
    if (key !== source) {
      next[key] = ""
    }
  }

  return next
}

function areFieldValuesEqual(
  left: BaseFieldValues,
  right: BaseFieldValues
): boolean {
  return (
    left.binary === right.binary &&
    left.octal === right.octal &&
    left.decimal === right.decimal &&
    left.hex === right.hex &&
    left.base32 === right.base32 &&
    left.base36 === right.base36 &&
    left.base62 === right.base62 &&
    left.base64 === right.base64 &&
    left.custom === right.custom
  )
}

function getParsedValue(
  source: BaseFieldKey,
  value: string,
  customBase: number
) {
  switch (source) {
    case "binary":
      return parseBinary(value)
    case "octal":
      return parseOctal(value)
    case "decimal":
      return parseDecimal(value)
    case "hex":
      return parseHex(value)
    case "base32":
      return parseBase32(value)
    case "base36":
      return parseBase36(value)
    case "base62":
      return parseBase62(value)
    case "base64":
      return parseBase64Number(value)
    case "custom":
      return parseBase(value, customBase)
  }
}

function readStoredCustomBase() {
  /* v8 ignore next */
  if (typeof window === "undefined") {
    return DEFAULT_CUSTOM_BASE
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEYS.customBase)
  return storedValue === null
    ? DEFAULT_CUSTOM_BASE
    : normalizeBase(Number(storedValue))
}

function readStoredFields(customBase: number) {
  /* v8 ignore next */
  if (typeof window === "undefined") {
    return buildFieldValues(BigInt(DEFAULT_DECIMAL_VALUE), customBase)
  }

  const storedDecimal = window.localStorage.getItem(STORAGE_KEYS.decimal)

  if (storedDecimal === null) {
    return buildFieldValues(BigInt(DEFAULT_DECIMAL_VALUE), customBase)
  }

  if (storedDecimal.length === 0) {
    return createEmptyFields()
  }

  const parsedDecimal = parseDecimal(storedDecimal)
  return parsedDecimal === null
    ? buildFieldValues(BigInt(DEFAULT_DECIMAL_VALUE), customBase)
    : buildFieldValues(parsedDecimal, customBase)
}

function useNumberBaseConverter() {
  const [customBase, setCustomBase] = useState(readStoredCustomBase)
  const [editSource, setEditSource] = useState<BaseFieldKey | null>("decimal")
  const [fields, setFields] = useState<BaseFieldValues>(() =>
    readStoredFields(readStoredCustomBase())
  )

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.decimal, fields.decimal)
  }, [fields.decimal])

  useEffect(() => {
    /* v8 ignore next */
    if (typeof window === "undefined") {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.customBase, String(customBase))
  }, [customBase])

  useEffect(() => {
    if (!editSource) {
      return
    }

    const rawValue = fields[editSource]

    if (rawValue.length === 0) {
      setFields((current) => {
        const next = clearOtherFields(current, editSource)
        return areFieldValuesEqual(current, next) ? current : next
      })
      return
    }

    const parsedValue = getParsedValue(editSource, rawValue, customBase)

    if (parsedValue === null) {
      return
    }

    setFields((current) => {
      const next = buildFieldValues(parsedValue, customBase)
      next[editSource] = rawValue
      return areFieldValuesEqual(current, next) ? current : next
    })
  }, [customBase, editSource, fields])

  const invalidStates = useMemo(
    () => ({
      binary: fields.binary.length > 0 && !isValidBinary(fields.binary),
      octal: fields.octal.length > 0 && !isValidOctal(fields.octal),
      decimal: fields.decimal.length > 0 && !isValidDecimal(fields.decimal),
      hex: fields.hex.length > 0 && !isValidHex(fields.hex),
      base32: fields.base32.length > 0 && !isValidBase32(fields.base32),
      base36: fields.base36.length > 0 && !isValidBase36(fields.base36),
      base62: fields.base62.length > 0 && !isValidBase62(fields.base62),
      base64: fields.base64.length > 0 && !isValidBase64(fields.base64),
      custom:
        fields.custom.length > 0 && !isValidForBase(fields.custom, customBase),
    }),
    [customBase, fields]
  )

  function handleFieldChange(source: BaseFieldKey, value: string) {
    setEditSource(source)
    setFields((current) => ({
      ...current,
      [source]: value,
    }))
  }

  function handleCustomBaseChange(value: number) {
    const nextCustomBase = normalizeBase(value)
    const currentDecimal = parseDecimal(fields.decimal)

    setCustomBase(nextCustomBase)
    setEditSource(currentDecimal === null ? null : "decimal")
  }

  function reset() {
    setCustomBase(DEFAULT_CUSTOM_BASE)
    setEditSource("decimal")
    setFields(
      buildFieldValues(BigInt(DEFAULT_DECIMAL_VALUE), DEFAULT_CUSTOM_BASE)
    )
  }

  return {
    customBase,
    fields,
    invalidStates,
    setBinary: (value: string) => {
      handleFieldChange("binary", value)
    },
    setOctal: (value: string) => {
      handleFieldChange("octal", value)
    },
    setDecimal: (value: string) => {
      handleFieldChange("decimal", value)
    },
    setHex: (value: string) => {
      handleFieldChange("hex", value)
    },
    setBase32: (value: string) => {
      handleFieldChange("base32", value)
    },
    setBase36: (value: string) => {
      handleFieldChange("base36", value)
    },
    setBase62: (value: string) => {
      handleFieldChange("base62", value)
    },
    setBase64: (value: string) => {
      handleFieldChange("base64", value)
    },
    setCustom: (value: string) => {
      handleFieldChange("custom", value)
    },
    setCustomBase: handleCustomBaseChange,
    reset,
  }
}

export { useNumberBaseConverter }
