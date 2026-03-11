import { describe, expect, it } from 'vitest'
import {
  formatDisplayValue,
  getInputStatus,
  getQuoteLabel,
  getStrategyLabel,
} from './dotenv-display'

describe('dotenv display helpers', () => {
  const t = (key: string) => key

  it('formats values with optional masking', () => {
    expect(formatDisplayValue('secret', false)).toBe('secret')
    expect(formatDisplayValue('secret', true)).toBe('••••••')
  })

  it('returns translated quote labels for every quote style', () => {
    expect(getQuoteLabel(t, 'single')).toBe('quoteSingle')
    expect(getQuoteLabel(t, 'double')).toBe('quoteDouble')
    expect(getQuoteLabel(t, 'none')).toBe('quoteNone')
  })

  it('returns translated strategy labels for duplicate strategies', () => {
    expect(getStrategyLabel(t, 'last-wins')).toBe('strategyLastWins')
    expect(getStrategyLabel(t, 'first-wins')).toBe('strategyFirstWins')
  })

  it('derives input status from input presence and invalid counts', () => {
    expect(getInputStatus(false, 0)).toBeUndefined()
    expect(getInputStatus(true, 0)).toBe('success')
    expect(getInputStatus(true, 2)).toBe('error')
  })
})
