import { maskDotenvValue, type DotenvDuplicateStrategy, type DotenvQuoteStyle } from '@utils/dotenv'

type Translate = (key: string) => string

export function formatDisplayValue(value: string, maskValues: boolean): string {
  return maskValues ? maskDotenvValue(value) : value
}

export function getQuoteLabel(t: Translate, quote: DotenvQuoteStyle): string {
  switch (quote) {
    case 'single':
      return t('quoteSingle')
    case 'double':
      return t('quoteDouble')
    default:
      return t('quoteNone')
  }
}

export function getStrategyLabel(t: Translate, strategy: DotenvDuplicateStrategy): string {
  return strategy === 'last-wins' ? t('strategyLastWins') : t('strategyFirstWins')
}

export function getInputStatus(
  hasInput: boolean,
  invalidLineCount: number,
): 'error' | 'success' | undefined {
  if (!hasInput) return undefined
  return invalidLineCount > 0 ? 'error' : 'success'
}
