import React from 'react'
import { Field, Label, Input, Description } from '@headlessui/react'
import { CopyButton } from './CopyButton'

interface ConverterFieldProps {
  label: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error: string | null
  placeholder: string
  copyTitle: string
  copiedMessage: string
  copyFailedMessage: string
  type?: 'text' | 'number'
  min?: number
  max?: number
  uppercase?: boolean
}

export function ConverterField({
  label,
  value,
  onChange,
  error,
  placeholder,
  copyTitle,
  copiedMessage,
  copyFailedMessage,
  type = 'text',
  min,
  max,
  uppercase,
}: ConverterFieldProps) {
  return (
    <Field className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </Label>
      <div className="flex gap-3">
        <Input
          type={type}
          value={value}
          onChange={onChange}
          invalid={!!error}
          min={min}
          max={max}
          placeholder={placeholder}
          className={`flex-1 px-4 py-3 text-xl font-mono bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg data-[focus]:border-blue-500 data-[invalid]:border-red-500 data-[invalid]:bg-red-50 dark:data-[invalid]:bg-red-900/20 outline-none transition-colors ${uppercase ? 'uppercase' : ''}`}
        />
        <CopyButton text={String(value)} disabled={!!error || value === ''} title={copyTitle} copiedMessage={copiedMessage} copyFailedMessage={copyFailedMessage} />
      </div>
      {error && (
        <Description className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</Description>
      )}
    </Field>
  )
}
