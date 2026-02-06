import { describe, it, expect, vi } from 'vitest'
import {
  luhnValidate,
  detectCardBrand,
  validateCardLength,
  formatCardNumber,
  validateCardNumber,
} from './cardBrands'

vi.mock('vue3-simple-icons', async () => {
  const { defineComponent } = await import('vue')
  const makeIcon = (name: string) =>
    defineComponent({
      name,
      template: `<svg class="${name}" />`,
    })

  return {
    VisaIcon: makeIcon('VisaIcon'),
    MasterCardIcon: makeIcon('MasterCardIcon'),
    AmericanExpressIcon: makeIcon('AmericanExpressIcon'),
    DiscoverIcon: makeIcon('DiscoverIcon'),
    JcbIcon: makeIcon('JcbIcon'),
    DinersClubIcon: makeIcon('DinersClubIcon'),
  }
})

describe('card brand utilities', () => {
  it('validates card numbers with the Luhn algorithm', () => {
    expect(luhnValidate('4111111111111111')).toBe(true)
    expect(luhnValidate('4111111111111112')).toBe(false)
    expect(luhnValidate('')).toBe(false)
  })

  it('detects card brands and validates lengths', () => {
    const visa = detectCardBrand('4111111111111111')
    const amex = detectCardBrand('378282246310005')
    const mastercard = detectCardBrand('2223000048400011')
    const unionpay = detectCardBrand('6212345678901234')

    expect(visa?.id).toBe('visa')
    expect(amex?.id).toBe('amex')
    expect(mastercard?.id).toBe('mastercard')
    expect(unionpay?.id).toBe('unionpay')
    expect(detectCardBrand('')).toBeNull()

    expect(validateCardLength('4111111111111111', visa)).toBe(true)
    expect(validateCardLength('4111', visa)).toBe(false)
  })

  it('formats card numbers based on brand patterns', () => {
    const visa = detectCardBrand('4111111111111111')
    const amex = detectCardBrand('378282246310005')

    expect(formatCardNumber('4111111111111111', visa)).toBe('4111 1111 1111 1111')
    expect(formatCardNumber('378282246310005', amex)).toBe('3782 822463 10005')
    expect(formatCardNumber('', visa)).toBe('')
  })

  it('builds validation results for card numbers', () => {
    const valid = validateCardNumber('4111 1111 1111 1111')

    expect(valid.isValid).toBe(true)
    expect(valid.brand?.id).toBe('visa')
    expect(valid.formattedNumber).toBe('4111 1111 1111 1111')
    expect(valid.digits).toBe('4111111111111111')

    const invalid = validateCardNumber('1234')

    expect(invalid.isValid).toBe(false)
    expect(invalid.brand).toBeNull()
    expect(invalid.isLuhnValid).toBe(false)
    expect(invalid.isLengthValid).toBe(false)
  })
})
