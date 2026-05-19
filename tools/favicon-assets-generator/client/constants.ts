function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B"
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const DOWNLOAD_ZIP_NAME = "Favicon Assets.zip"
const DEMO_IMAGE_FILENAME = "inbrowser-demo-icon.svg"

export { DEMO_IMAGE_FILENAME, DOWNLOAD_ZIP_NAME, formatFileSize }
