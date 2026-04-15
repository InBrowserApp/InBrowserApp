import { isValidBase64, isValidHex, type SaltFormat } from "../core/pbkdf2"

function getInvalidSaltFormat(
  saltText: string,
  selectedFile: File | null,
  saltFormat: SaltFormat
) {
  if (selectedFile || saltText.trim().length === 0) {
    return ""
  }

  if (saltFormat === "hex" && !isValidHex(saltText)) {
    return "hex"
  }

  if (saltFormat === "base64" && !isValidBase64(saltText)) {
    return "base64"
  }

  return ""
}

export { getInvalidSaltFormat }
