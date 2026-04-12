function encodeUrlComponent(value: string) {
  return encodeURIComponent(value)
}

function decodeUrlComponent(value: string) {
  return decodeURIComponent(value)
}

function isValidUrlComponentEncoding(value: string) {
  try {
    decodeUrlComponent(value)
    return true
  } catch {
    return false
  }
}

export { decodeUrlComponent, encodeUrlComponent, isValidUrlComponentEncoding }
