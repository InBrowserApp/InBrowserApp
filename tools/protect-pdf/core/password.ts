export function encodePdfPassword(password: string) {
  if (password.includes("\0")) return "passwordInvalid"
  const bytes = new TextEncoder().encode(password)
  return bytes.length > 127 ? "passwordTooLong" : bytes
}
