import React, { useState, useCallback } from 'react'
import { arabicToRoman, romanToArabic, isValidRomanNumeral } from './utils/conversion'
import { ConverterField, DirectionIndicator } from './components'
import { Toaster } from 'sonner'
import type { metadata } from './meta'

export type I18n = (typeof metadata.i18n)[keyof typeof metadata.i18n]
export interface Props {
  i18n: I18n
}

export default function RomanConverter({ i18n }: Props) {
  const currentYear = new Date().getFullYear()
  const [arabicValue, setArabicValue] = useState<number | ''>(currentYear)
  const [romanValue, setRomanValue] = useState<string>(arabicToRoman(currentYear))
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
        setArabicError(i18n.errorArabicRange)
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
    [i18n.errorArabicRange]
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
        setRomanError(i18n.errorInvalidRoman)
        return
      }

      setRomanError(null)
      try {
        const arabic = romanToArabic(value)
        setArabicValue(arabic)
        setArabicError(null)
      } catch {
        setRomanError(i18n.errorInvalidRoman)
      }
    },
    [i18n.errorInvalidRoman]
  )

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="flex flex-col gap-6">
        <ConverterField
          label={i18n.arabicNumber}
          value={arabicValue}
          onChange={onArabicChange}
          error={arabicError}
          placeholder={i18n.arabicPlaceholder}
          copyTitle={i18n.copy}
          copiedMessage={i18n.copied}
          type="number"
          min={1}
          max={3999}
        />

        <DirectionIndicator />

        <ConverterField
          label={i18n.romanNumeral}
          value={romanValue}
          onChange={onRomanChange}
          error={romanError}
          placeholder={i18n.romanPlaceholder}
          copyTitle={i18n.copy}
          copiedMessage={i18n.copied}
          uppercase
        />
      </div>
    </>
  )
}
