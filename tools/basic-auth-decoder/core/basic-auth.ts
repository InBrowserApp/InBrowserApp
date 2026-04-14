type DecodeBasicAuthHeaderResult =
  | {
      ok: true
      username: string
      password: string
    }
  | {
      ok: false
      code: "empty" | "invalid-header" | "invalid-base64"
    }

function extractBasicToken(value: string) {
  const withoutHeaderName = value.trim().replace(/^authorization\s*:\s*/i, "")
  const match = withoutHeaderName.match(/^basic\s+(.+)$/i)

  return match ? match[1].trim() : null
}

function decodeBase64Utf8(value: string) {
  const binary = atob(value)
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function splitCredentials(value: string) {
  const separatorIndex = value.indexOf(":")

  if (separatorIndex === -1) {
    return {
      username: value,
      password: "",
    }
  }

  return {
    username: value.slice(0, separatorIndex),
    password: value.slice(separatorIndex + 1),
  }
}

function decodeBasicAuthHeader(value: string): DecodeBasicAuthHeaderResult {
  if (value.trim() === "") {
    return {
      ok: false,
      code: "empty",
    }
  }

  const token = extractBasicToken(value)

  if (!token) {
    return {
      ok: false,
      code: "invalid-header",
    }
  }

  try {
    return {
      ok: true,
      ...splitCredentials(decodeBase64Utf8(token)),
    }
  } catch {
    return {
      ok: false,
      code: "invalid-base64",
    }
  }
}

export { decodeBasicAuthHeader }
