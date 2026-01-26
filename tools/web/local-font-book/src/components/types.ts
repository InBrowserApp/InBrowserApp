export type LocalFontData = {
  family: string
  fullName: string
  postscriptName: string
  style: string
}

export type DisplayFont = LocalFontData & {
  id: string
  displayName: string
  displayFamily: string
  displayStyle: string
  searchKey: string
}

export type FontGroup = {
  id: string
  label: string
  items: DisplayFont[]
}

export type AlertStatusType = 'info' | 'success' | 'warning' | 'error'
