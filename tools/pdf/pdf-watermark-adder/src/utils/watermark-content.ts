export const normalizeTextLines = (value: string): string[] => {
  const normalized = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n').map((line) => line.trim())

  return lines.some((line) => line.length > 0) ? lines : []
}

export const isSupportedWatermarkImageFile = (file: File): boolean => {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  return (
    type === 'image/png' ||
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg')
  )
}
