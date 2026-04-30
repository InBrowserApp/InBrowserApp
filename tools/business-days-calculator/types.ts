import type { ToolMeta } from "@workspace/tool-sdk"

type BusinessDaysCalculatorMessages = Readonly<{
  meta: ToolMeta
  rulesTitle: string
  selectionModeLabel: string
  weekendDaysLabel: string
  workingDaysLabel: string
  weekendHint: string
  workingHint: string
  noWorkingDaysLabel: string
  holidaysLabel: string
  holidayPlaceholder: string
  holidayHint: string
  holidayNote: string
  invalidHolidaysLabel: string
  countTitle: string
  startDateLabel: string
  endDateLabel: string
  includeEndpointsLabel: string
  rangeSwappedLabel: string
  businessDaysLabel: string
  totalDaysLabel: string
  weekendDaysCountLabel: string
  holidayDaysCountLabel: string
  offsetTitle: string
  baseDateLabel: string
  businessDaysOffsetLabel: string
  includeStartLabel: string
  addLabel: string
  subtractLabel: string
  resultDateLabel: string
  copyLabel: string
  copiedLabel: string
  weekdaySunShort: string
  weekdayMonShort: string
  weekdayTueShort: string
  weekdayWedShort: string
  weekdayThuShort: string
  weekdayFriShort: string
  weekdaySatShort: string
}>

export type { BusinessDaysCalculatorMessages }
