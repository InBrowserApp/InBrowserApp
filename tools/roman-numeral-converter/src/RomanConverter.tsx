import { useState, useCallback } from 'react'
import { ClipboardIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { arabicToRoman, romanToArabic, isValidRomanNumeral } from './utils/conversion'

interface Props {
  ui: {
    arabicNumber: string
    romanNumeral: string
    arabicPlaceholder: string
    romanPlaceholder: string
    copy: string
  }
}

export default function RomanConverter({ ui }: Props) {
  const [arabicValue, setArabicValue] = useState<number>(2024)
  const [romanValue, setRomanValue] = useState<string>(arabicToRoman(2024))

  const onArabicChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setArabicValue(value)
    if (value && value >= 1 && value <= 3999) {
      try {
        setRomanValue(arabicToRoman(value))
      } catch {
        // Invalid input, keep previous value
      }
    }
  }, [])

  const onRomanChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setRomanValue(value)
    if (value && isValidRomanNumeral(value)) {
      try {
        setArabicValue(romanToArabic(value))
      } catch {
        // Invalid input, keep previous value
      }
    }
  }, [])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Arabic Number Input */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {ui.arabicNumber}
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={arabicValue}
            onChange={onArabicChange}
            min={1}
            max={3999}
            placeholder={ui.arabicPlaceholder}
            className="flex-1 px-4 py-3 text-xl font-mono bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
          <button
            onClick={() => copyToClipboard(String(arabicValue))}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 group"
            title={ui.copy}
          >
            <ClipboardIcon className="w-5 h-5 text-gray-500 group-hover:text-white" />
          </button>
        </div>
      </div>

      {/* Bidirectional Arrow */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
          <ArrowsUpDownIcon className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      {/* Roman Numeral Input */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {ui.romanNumeral}
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={romanValue}
            onChange={onRomanChange}
            placeholder={ui.romanPlaceholder}
            className="flex-1 px-4 py-3 text-xl font-mono uppercase bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
          />
          <button
            onClick={() => copyToClipboard(romanValue)}
            className="px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 group"
            title={ui.copy}
          >
            <ClipboardIcon className="w-5 h-5 text-gray-500 group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
