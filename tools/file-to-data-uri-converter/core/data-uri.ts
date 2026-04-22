type ParsedDataUri = Readonly<{
  mimeType: string | null
  isBase64: boolean
  payload: string
}>

type FileLike = Readonly<{
  name: string
  size: number
  type: string
}>

type FileToDataUriAnalysis = Readonly<{
  fileName: string
  fileSize: number
  mimeType: string | null
  dataUri: string
  isBase64: boolean
  payloadLength: number
}>

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function parseDataUri(dataUri: string): ParsedDataUri {
  if (!dataUri.startsWith("data:")) {
    return { mimeType: null, isBase64: false, payload: "" }
  }

  const commaIndex = dataUri.indexOf(",")
  if (commaIndex === -1) {
    return { mimeType: null, isBase64: false, payload: "" }
  }

  const metadata = dataUri.slice(5, commaIndex)
  const payload = dataUri.slice(commaIndex + 1)
  const segments = metadata.split(";").filter(Boolean)
  const mimeType =
    segments[0] && !segments[0].includes("=") && segments[0] !== "base64"
      ? segments[0]
      : null

  return {
    mimeType,
    isBase64: segments.includes("base64"),
    payload,
  }
}

function analyzeFileToDataUri(
  file: FileLike,
  dataUri: string
): FileToDataUriAnalysis {
  const parsed = parseDataUri(dataUri)

  return {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || parsed.mimeType,
    dataUri,
    isBase64: parsed.isBase64,
    payloadLength: parsed.payload.length,
  }
}

function readFileAsDataUri(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(String(reader.result ?? ""))
    }

    reader.onerror = () => {
      reject(new Error("read-failed"))
    }

    reader.readAsDataURL(file)
  })
}

export {
  analyzeFileToDataUri,
  formatBytes,
  parseDataUri,
  readFileAsDataUri,
  type FileToDataUriAnalysis,
}
