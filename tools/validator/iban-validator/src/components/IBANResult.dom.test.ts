import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h3><slot /></h3>',
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDescriptions: defineComponent({
      name: 'NDescriptions',
      template: '<div class="descriptions"><slot /></div>',
    }),
  }
})

vi.mock('./IBANResultStatus.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'IBANResultStatus',
      props: ['isValid', 'isCountryValid', 'countryDisplay'],
      template: '<div class="status" />',
    }),
  }
})

vi.mock('./IBANResultChecks.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'IBANResultChecks',
      props: [
        'expectedLength',
        'actualLength',
        'isChecksumValid',
        'expectedCheckDigits',
        'actualCheckDigits',
      ],
      template: '<div class="checks" />',
    }),
  }
})

vi.mock('./IBANResultFormats.vue', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'IBANResultFormats',
      props: ['normalized', 'normalizedRaw', 'formatted', 'formattedRaw', 'bban', 'bbanRaw'],
      template: '<div class="formats" />',
    }),
  }
})

import IBANResult from './IBANResult.vue'

const baseResult = {
  input: '',
  normalized: '',
  formatted: '',
  countryCode: null,
  expectedLength: null,
  length: 0,
  checkDigits: null,
  expectedCheckDigits: null,
  bban: null,
  isCountryValid: false,
  isLengthValid: false,
  isFormatValid: false,
  isStructureValid: false,
  isChecksumValid: false,
  isValid: false,
}

let originalDisplayNames: typeof Intl.DisplayNames | undefined

beforeEach(() => {
  originalDisplayNames = Intl.DisplayNames
  Object.defineProperty(Intl, 'DisplayNames', {
    value: class {
      of(code: string) {
        if (code === 'DE') return 'Germany'
        return undefined
      }
    },
    configurable: true,
  })
})

afterEach(() => {
  Object.defineProperty(Intl, 'DisplayNames', {
    value: originalDisplayNames,
    configurable: true,
  })
})

describe('IBANResult', () => {
  it('derives display values for valid data', () => {
    const wrapper = mount(IBANResult, {
      props: {
        validationResult: {
          ...baseResult,
          input: 'DE89',
          normalized: 'DE89370400440532013000',
          formatted: 'DE89 3704 0044 0532 0130 00',
          countryCode: 'DE',
          expectedLength: 22,
          length: 22,
          checkDigits: '89',
          expectedCheckDigits: '89',
          bban: '370400440532013000',
          isCountryValid: true,
          isLengthValid: true,
          isFormatValid: true,
          isStructureValid: true,
          isChecksumValid: true,
          isValid: true,
        },
      },
    })

    const status = wrapper.findComponent({ name: 'IBANResultStatus' })
    expect(status.props('countryDisplay')).toBe('Germany (DE)')

    const checks = wrapper.findComponent({ name: 'IBANResultChecks' })
    expect(checks.props('expectedLength')).toBe('22')
    expect(checks.props('expectedCheckDigits')).toBe('89')
    expect(checks.props('actualCheckDigits')).toBe('89')

    const formats = wrapper.findComponent({ name: 'IBANResultFormats' })
    expect(formats.props('normalized')).toBe('DE89370400440532013000')
    expect(formats.props('formatted')).toBe('DE89 3704 0044 0532 0130 00')
    expect(formats.props('bban')).toBe('370400440532013000')
  })

  it('falls back when values are missing', () => {
    const wrapper = mount(IBANResult, {
      props: {
        validationResult: {
          ...baseResult,
        },
      },
    })

    const status = wrapper.findComponent({ name: 'IBANResultStatus' })
    expect(status.props('countryDisplay')).toBe('Not available')

    const checks = wrapper.findComponent({ name: 'IBANResultChecks' })
    expect(checks.props('expectedLength')).toBe('Unknown')
    expect(checks.props('expectedCheckDigits')).toBe('Not available')
    expect(checks.props('actualCheckDigits')).toBe('Not available')

    const formats = wrapper.findComponent({ name: 'IBANResultFormats' })
    expect(formats.props('normalized')).toBe('Not available')
    expect(formats.props('formatted')).toBe('Not available')
    expect(formats.props('bban')).toBe('Not available')
  })

  it('uses fallback locale display names when constructor fails', () => {
    let constructorCallCount = 0
    Object.defineProperty(Intl, 'DisplayNames', {
      value: class {
        constructor() {
          constructorCallCount += 1
          if (constructorCallCount === 1) {
            throw new Error('unsupported locale')
          }
        }
        of(code: string) {
          return code === 'DE' ? 'Fallback Germany' : undefined
        }
      },
      configurable: true,
    })

    const wrapper = mount(IBANResult, {
      props: {
        validationResult: {
          ...baseResult,
          countryCode: 'DE',
          isCountryValid: true,
        },
      },
    })

    const status = wrapper.findComponent({ name: 'IBANResultStatus' })
    expect(status.props('countryDisplay')).toBe('Fallback Germany (DE)')
    expect(constructorCallCount).toBe(2)
  })

  it('returns country code when display names are unavailable or unknown', () => {
    Object.defineProperty(Intl, 'DisplayNames', {
      value: undefined,
      configurable: true,
    })

    const withoutDisplayNames = mount(IBANResult, {
      props: {
        validationResult: {
          ...baseResult,
          countryCode: 'DE',
          isCountryValid: true,
        },
      },
    })
    expect(
      withoutDisplayNames.findComponent({ name: 'IBANResultStatus' }).props('countryDisplay'),
    ).toBe('DE')

    Object.defineProperty(Intl, 'DisplayNames', {
      value: class {
        of() {
          return undefined
        }
      },
      configurable: true,
    })

    const unknownName = mount(IBANResult, {
      props: {
        validationResult: {
          ...baseResult,
          countryCode: 'ZZ',
          isCountryValid: true,
        },
      },
    })
    expect(unknownName.findComponent({ name: 'IBANResultStatus' }).props('countryDisplay')).toBe(
      'ZZ',
    )

    const invalidCountry = mount(IBANResult, {
      props: {
        validationResult: {
          ...baseResult,
          countryCode: 'ZZ',
          isCountryValid: false,
        },
      },
    })
    expect(invalidCountry.findComponent({ name: 'IBANResultStatus' }).props('countryDisplay')).toBe(
      'ZZ',
    )
  })
})
