import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { useTotpGenerator } from './useTotpGenerator'

type UnwrapExposed<T> = {
  [Key in keyof T]: T[Key] extends { value: infer Value } ? Value : T[Key]
}

type TotpGeneratorExposed = UnwrapExposed<ReturnType<typeof useTotpGenerator>>

function mountHarness(
  options: Omit<Parameters<typeof useTotpGenerator>[0], 'getWindowLabels'> = {},
) {
  return mount(
    defineComponent({
      setup(_, { expose }) {
        const state = useTotpGenerator({
          getWindowLabels: () => ({
            previous: 'Previous',
            current: 'Current',
            next: 'Next',
          }),
          ...options,
        })
        expose(state)

        return () => h('div')
      },
    }),
  )
}

function exposed(wrapper: VueWrapper<unknown>): TotpGeneratorExposed {
  return wrapper.vm as unknown as TotpGeneratorExposed
}

describe('useTotpGenerator', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses the current period when the timer is exactly on a boundary', async () => {
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
    const wrapper = mountHarness()

    exposed(wrapper).loadSample()
    await flushPromises()

    expect(exposed(wrapper).remainingSeconds).toBe(30)
    expect(exposed(wrapper).progressPercentage).toBe(0)
  })

  it('falls back to a generic secret validation error for unexpected exceptions', async () => {
    const wrapper = mountHarness({
      validateSecretConfig: () => {
        throw new Error('boom')
      },
    })

    exposed(wrapper).secretInput = 'JBSWY3DPEHPK3PXP'
    await flushPromises()

    expect(exposed(wrapper).secretState).toEqual({
      value: null,
      errorCode: 'invalid_base32',
    })
  })

  it('falls back to a generic uri validation error for unexpected exceptions', async () => {
    const wrapper = mountHarness({
      parseUri: () => {
        throw new Error('boom')
      },
    })

    exposed(wrapper).inputMode = 'uri'
    exposed(wrapper).uriInput = 'otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP'
    await flushPromises()

    expect(exposed(wrapper).uriState).toEqual({
      value: null,
      errorCode: 'invalid_uri',
    })
  })
})
