import React, { useState, useCallback } from 'react'
import { Field, Label, Input, Button, Description } from '@headlessui/react'
import { ClipboardIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { arabicToRoman, romanToArabic, isValidRomanNumeral } from './utils/conversion'

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

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Arabic Number Input */}
      <Field className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {ui.arabicNumber}
        </Label>
        <div className="flex gap-3">
          <Input
            type="number"
            value={arabicValue}
            onChange={onArabicChange}
            invalid={!!arabicError}
            min={1}
            max={3999}
            placeholder={ui.arabicPlaceholder}
            className="flex-1 px-4 py-3 text-xl font-mono bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg data-[focus]:border-blue-500 data-[invalid]:border-red-500 data-[invalid]:bg-red-50 dark:data-[invalid]:bg-red-900/20 outline-none transition-colors"
          />
          <Button
            onClick={() => copyToClipboard(String(arabicValue))}
            disabled={!!arabicError || arabicValue === ''}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 data-[hover]:bg-blue-500 data-[hover]:text-white data-[hover]:border-blue-500 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed group"
            title={ui.copy}
          >
            <ClipboardIcon className="w-5 h-5 text-gray-500 group-data-[hover]:text-white" />
          </Button>
        </div>
        {arabicError && (
          <Description className="mt-2 text-sm text-red-600 dark:text-red-400">
            {arabicError}
          </Description>
        )}
      </Field>

      {/* Bidirectional Arrow */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          <ArrowsUpDownIcon className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      {/* Roman Numeral Input */}
      <Field className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {ui.romanNumeral}
        </Label>
        <div className="flex gap-3">
          <Input
            type="text"
            value={romanValue}
            onChange={onRomanChange}
            invalid={!!romanError}
            placeholder={ui.romanPlaceholder}
            className="flex-1 px-4 py-3 text-xl font-mono uppercase bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg data-[focus]:border-blue-500 data-[invalid]:border-red-500 data-[invalid]:bg-red-50 dark:data-[invalid]:bg-red-900/20 outline-none transition-colors"
          />
          <Button
            onClick={() => copyToClipboard(romanValue)}
            disabled={!!romanError || romanValue === ''}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 data-[hover]:bg-blue-500 data-[hover]:text-white data-[hover]:border-blue-500 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed group"
            title={ui.copy}
          >
            <ClipboardIcon className="w-5 h-5 text-gray-500 group-data-[hover]:text-white" />
          </Button>
        </div>
        {romanError && (
          <Description className="mt-2 text-sm text-red-600 dark:text-red-400">
            {romanError}
          </Description>
        )}
      </Field>
    </div>
  )
}
