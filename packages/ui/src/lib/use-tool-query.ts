import { useEffect, useState } from "react"

/** Read URL state after hydration; write only in response to user actions. */
function useToolQuery<T>(
  parse: (search: string) => T,
  makeHref: (query: T) => string
) {
  const [query, setQuery] = useState(() => parse(""))
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    function readLocation() {
      setQuery(parse(window.location.search))
      setShareUrl(window.location.href)
    }
    readLocation()
    window.addEventListener("popstate", readLocation)
    return () => window.removeEventListener("popstate", readLocation)
  }, [parse])

  function update(next: T) {
    const url = new URL(makeHref(next), window.location.href)
    url.hash = window.location.hash
    window.history.replaceState(window.history.state, "", url)
    setQuery(next)
    setShareUrl(url.href)
  }

  return { query, update, shareUrl }
}

export { useToolQuery }
