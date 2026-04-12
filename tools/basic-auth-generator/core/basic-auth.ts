function toBinaryString(bytes: Uint8Array) {
  let result = ""

  for (const byte of bytes) {
    result += String.fromCharCode(byte)
  }

  return result
}

function encodeBase64(value: string) {
  if (value === "") {
    return ""
  }

  const bytes = new TextEncoder().encode(value)
  return btoa(toBinaryString(bytes))
}

function hasAnyCredential(username: string, password: string) {
  return username !== "" || password !== ""
}

function createBasicAuthToken(username: string, password: string) {
  if (!hasAnyCredential(username, password)) {
    return ""
  }

  return encodeBase64(`${username}:${password}`)
}

function createBasicAuthHeader(username: string, password: string) {
  const token = createBasicAuthToken(username, password)
  return token === "" ? "" : `Basic ${token}`
}

function createBasicAuthCurlCommand(
  url: string,
  username: string,
  password: string
) {
  const header = createBasicAuthHeader(username, password)
  return header === "" ? "" : `curl -H "Authorization: ${header}" ${url}`
}

export {
  createBasicAuthCurlCommand,
  createBasicAuthHeader,
  createBasicAuthToken,
}
