type HarObject = Record<string, unknown>

export type RedactionOptions = {
  parameters: boolean
  bodies: boolean
}

export type Summary = {
  requests: number
  removedCredentials: number
  maskedParameters: number
  removedBodies: number
}

const masked = "REDACTED"

const credentialHeader =
  /^(?:authorization|proxy-authorization|cookie2?|set-cookie2?|www-authenticate|proxy-authenticate)$|(?:^|[-_])(?:auth(?:[-_]?token)?|authorization|session|token|secret|password|(?:api|subscription)[-_]?key|csrf|xsrf)(?:$|[-_])/i
const urlHeaders = /^(?:location|content-location|referer|referrer)$/i
const urlPrefix = /^(?:[a-z][a-z\d+.-]*:)?\/\//i

function isObject(value: unknown): value is HarObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function objects(value: unknown) {
  return Array.isArray(value) ? value.filter(isObject) : []
}

function redactUrl(url: string, options: RedactionOptions, summary: Summary) {
  // Edit the recorded string so the host, path, and parameter names keep
  // their original spelling, including in relative redirect URLs.
  const withoutCredentials = url.replace(
    /^(\s*(?:[a-z][a-z\d+.-]*:)?\/\/)[^/?#]*@/i,
    (_, prefix: string) => {
      summary.removedCredentials++
      return prefix
    }
  )
  if (!options.parameters) return withoutCredentials

  function maskParameters(value: string) {
    return value.replace(
      /(^|&)([^&=]*=)([^&]+)/g,
      (match, start, key, original) => {
        if (original === masked) return match
        summary.maskedParameters++
        return start + key + masked
      }
    )
  }

  const fragmentStart = withoutCredentials.indexOf("#")
  const address =
    fragmentStart === -1
      ? withoutCredentials
      : withoutCredentials.slice(0, fragmentStart)
  const queryStart = address.indexOf("?")
  const maskedAddress =
    queryStart === -1
      ? address
      : address.slice(0, queryStart + 1) +
        maskParameters(address.slice(queryStart + 1))
  if (fragmentStart === -1) return maskedAddress

  const fragment = withoutCredentials.slice(fragmentStart + 1)
  const fragmentQueryStart = fragment.indexOf("?")
  const fragmentValueStart = fragment.indexOf("=")
  const maskedFragment =
    fragmentQueryStart === -1 ||
    (fragmentValueStart !== -1 && fragmentValueStart < fragmentQueryStart)
      ? maskParameters(fragment)
      : fragment.slice(0, fragmentQueryStart + 1) +
        maskParameters(fragment.slice(fragmentQueryStart + 1))
  return maskedAddress + "#" + maskedFragment
}

function redactUrlField(
  object: HarObject,
  field: string,
  options: RedactionOptions,
  summary: Summary
) {
  const value = object[field]
  if (typeof value === "string")
    object[field] = redactUrl(value, options, summary)
}

function redactMessage(
  message: HarObject,
  options: RedactionOptions,
  summary: Summary
) {
  if (Array.isArray(message.cookies)) {
    summary.removedCredentials += message.cookies.length
    message.cookies = []
  }

  if (Array.isArray(message.headers)) {
    message.headers = objects(message.headers).filter((header) => {
      const name = header.name
      if (typeof name !== "string") return false
      if (credentialHeader.test(name.trim())) {
        summary.removedCredentials++
        return false
      }
      if (urlHeaders.test(name.trim()))
        redactUrlField(header, "value", options, summary)
      return true
    })
  }
}

export function sanitizeHar(text: string, options: RedactionOptions) {
  let archive: unknown
  try {
    archive = JSON.parse(text.replace(/^\uFEFF/, ""))
  } catch {
    return null
  }
  if (
    !isObject(archive) ||
    !isObject(archive.log) ||
    !Array.isArray(archive.log.entries)
  ) {
    return null
  }

  const entries: unknown[] = archive.log.entries
  const summary: Summary = {
    requests: entries.length,
    removedCredentials: 0,
    maskedParameters: 0,
    removedBodies: 0,
  }

  for (const page of objects(archive.log.pages)) {
    // Chromium and Firefox can store the navigation URL as the page title.
    if (typeof page.title === "string" && urlPrefix.test(page.title)) {
      page.title = redactUrl(page.title, options, summary)
    }
  }

  for (const entry of entries) {
    if (
      !isObject(entry) ||
      !isObject(entry.request) ||
      !isObject(entry.response)
    ) {
      return null
    }
    const { request, response } = entry
    redactMessage(request, options, summary)
    redactMessage(response, options, summary)
    redactUrlField(request, "url", options, summary)
    redactUrlField(response, "redirectURL", options, summary)

    if (isObject(entry._initiator)) {
      redactUrlField(entry._initiator, "url", options, summary)
      let stack = entry._initiator.stack
      while (isObject(stack)) {
        for (const frame of objects(stack.callFrames)) {
          redactUrlField(frame, "url", options, summary)
        }
        stack = stack.parent
      }
    }

    if (options.parameters) {
      for (const parameter of objects(request.queryString)) {
        if (
          typeof parameter.value === "string" &&
          parameter.value !== "" &&
          parameter.value !== masked
        ) {
          parameter.value = masked
          summary.maskedParameters++
        }
      }
    }

    if (options.bodies) {
      if (Object.hasOwn(request, "postData")) {
        delete request.postData
        summary.removedBodies++
      }

      if (
        isObject(response.content) &&
        Object.hasOwn(response.content, "text")
      ) {
        delete response.content.text
        delete response.content.encoding
        summary.removedBodies++
      }

      for (const field of ["_webSocketMessages", "_eventSourceMessages"]) {
        for (const message of objects(entry[field])) {
          if (Object.hasOwn(message, "data")) {
            delete message.data
            summary.removedBodies++
          }
        }
      }
    }
  }

  return {
    summary,
    output: new Blob([JSON.stringify(archive, null, 2)], {
      type: "application/json",
    }),
  }
}
