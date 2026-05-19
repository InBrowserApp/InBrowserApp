const PDF_MIME_TYPE = "application/pdf"
const PDF_EXTENSION_PATTERN = /\.pdf$/i

function isPdfFile(file: File) {
  return file.type === PDF_MIME_TYPE || PDF_EXTENSION_PATTERN.test(file.name)
}

function createOutputFileName(fileName: string) {
  const trimmedName = fileName.trim()

  if (!trimmedName) {
    return "unlocked.pdf"
  }

  return PDF_EXTENSION_PATTERN.test(trimmedName)
    ? trimmedName.replace(PDF_EXTENSION_PATTERN, "-unlocked.pdf")
    : `${trimmedName}-unlocked.pdf`
}

export { createOutputFileName, isPdfFile }
