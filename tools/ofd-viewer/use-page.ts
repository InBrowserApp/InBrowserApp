import { useEffect, useState } from "react"
import type { OFDDocument, OFDPage } from "@ofdjs/viewer"

export function usePage(document: OFDDocument, pageNumber: number | null) {
  const [state, setState] = useState<{
    number: number
    page?: OFDPage
    error?: boolean
  }>()
  useEffect(() => {
    if (pageNumber === null) return
    let active = true
    void document.getPage(pageNumber).then(
      (page) => {
        if (active) setState({ number: pageNumber, page })
      },
      () => {
        if (active) setState({ number: pageNumber, error: true })
      }
    )
    return () => {
      active = false
    }
  }, [document, pageNumber])
  return state?.number === pageNumber ? state : undefined
}
