import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'

export function DirectionIndicator() {
  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-full">
        <ArrowsUpDownIcon className="w-6 h-6 text-blue-500" />
      </div>
    </div>
  )
}
