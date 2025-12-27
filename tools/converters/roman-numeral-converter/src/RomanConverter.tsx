import React, { useState, useCallback } from 'react'
import { arabicToRoman, romanToArabic, isValidRomanNumeral } from './utils/conversion'
import { ConverterField, DirectionIndicator } from './components'

interface Props {
  ui: {
    arabicNumber: string
    romanNumeral: string
    arabicPlaceholder: string
    romanPlaceholder: string
    copy: string
    errorArabicRange: string
    errorInvalidRoman: string
  }
}

export default function RomanConverter({ ui }: Props) {
  const [arabicValue, setArabicValue] = useState<number | ''>(2024)
  const [romanValue, setRomanValue] = useState<string>(arabicToRoman(2024))
  const [arabicError, setArabicError] = useState<string | null>(null)
  const [romanError, setRomanError] = useState<string | null>(null)

  const onArabicChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      if (raw === '') {
        setArabicValue('')
        setArabicError(null)
        return
      }

      const value = parseInt(raw, 10)
      setArabicValue(value)

      if (isNaN(value) || value < 1 || value > 3999) {
        setArabicError(ui.errorArabicRange)
        return
      }

      setArabicError(null)
      try {
        setRomanValue(arabicToRoman(value))
        setRomanError(null)
      } catch {
        // Invalid input
      }
    },
    [ui.errorArabicRange]
  )

  const onRomanChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toUpperCase()
      setRomanValue(value)

      if (value === '') {
        setRomanError(null)
        return
      }

      if (!isValidRomanNumeral(value)) {
        setRomanError(ui.errorInvalidRoman)
        return
      }

      setRomanError(null)
      try {
        const arabic = romanToArabic(value)
        setArabicValue(arabic)
        setArabicError(null)
      } catch {
        setRomanError(ui.errorInvalidRoman)
      }
    },
    [ui.errorInvalidRoman]
  )

  return (
    <div className="flex flex-col gap-6">
      <ConverterField
        label={ui.arabicNumber}
        value={arabicValue}
        onChange={onArabicChange}
        error={arabicError}
        placeholder={ui.arabicPlaceholder}
        copyTitle={ui.copy}
        type="number"
        min={1}
        max={3999}
      />

      <DirectionIndicator />

      <ConverterField
        label={ui.romanNumeral}
        value={romanValue}
        onChange={onRomanChange}
        error={romanError}
        placeholder={ui.romanPlaceholder}
        copyTitle={ui.copy}
        uppercase
      />
    </div>
  )
}
