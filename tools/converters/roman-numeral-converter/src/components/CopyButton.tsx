import { useCallback } from 'react'
import { Button } from '@headlessui/react'
import { ClipboardIcon } from '@heroicons/react/24/outline'

interface CopyButtonProps {
  text: string
  disabled?: boolean
  title: string
}

export function CopyButton({ text, disabled, title }: CopyButtonProps) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
  }, [text])

  return (
    <Button
      onClick={handleCopy}
      disabled={disabled}
      className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-200 data-[hover]:bg-blue-500 data-[hover]:text-white data-[hover]:border-blue-500 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed group"
      title={title}
    >
      <ClipboardIcon className="w-5 h-5 text-gray-500 group-data-[hover]:text-white" />
    </Button>
  )
}
