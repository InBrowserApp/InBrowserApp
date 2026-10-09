import { useCallback, useEffect, useRef, useState } from "react"
import type { RtfDocument } from "rtf-viewer"
import { findMatches } from "./page-text"
import type { Match } from "./page-text"
import { failure } from "./failure"
import type { Messages } from "./types"

export function useSearch(
  document: RtfDocument,
  onPage: (page: number) => void,
  messages: Messages
) {
  const [state, setState] = useState({
    query: "",
    matches: [] as Match[],
    current: 0,
    searching: false,
    error: "",
  })
  const pending = useRef<AbortController | null>(null)
  useEffect(() => () => pending.current?.abort(), [])
  const find = useCallback(
    (query: string, previous = false) => {
      if (query && query === state.query && !state.searching) {
        if (state.matches.length) {
          const current =
            (state.current + (previous ? -1 : 1) + state.matches.length) %
            state.matches.length
          setState({ ...state, current })
          onPage(state.matches[current]!.page)
        }
        return
      }
      pending.current?.abort()
      const controller = new AbortController()
      pending.current = controller
      setState({
        query,
        matches: [],
        current: 0,
        searching: Boolean(query),
        error: "",
      })
      if (!query) return
      void findMatches(document, query, controller.signal)
        .then((matches) => {
          if (controller.signal.aborted) return
          const current = previous && matches.length ? matches.length - 1 : 0
          setState({ query, matches, current, searching: false, error: "" })
          if (matches.length) onPage(matches[current]!.page)
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted)
            setState({
              query: "",
              matches: [],
              current: 0,
              searching: false,
              error: failure(error, messages),
            })
        })
    },
    [document, onPage, state, messages]
  )
  return { ...state, find, match: state.matches[state.current] }
}
