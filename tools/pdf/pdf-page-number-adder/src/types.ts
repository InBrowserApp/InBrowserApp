export type PageNumberFormat = 'n' | 'n-total'

export type PageNumberPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

export type AddPageNumbersPayload = {
  file: File
  pages: number[]
  startNumber: number
  format: PageNumberFormat
  position: PageNumberPosition
  fontSize: number
  marginX: number
  marginY: number
  outputFileName: string
}

export type AddPageNumbersWorkerSuccess = {
  ok: true
  result: {
    file: {
      name: string
      blob: Blob
    }
  }
}

export type AddPageNumbersWorkerError = {
  ok: false
  code: string
}

export type AddPageNumbersWorkerResponse = AddPageNumbersWorkerSuccess | AddPageNumbersWorkerError
