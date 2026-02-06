import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'

const decodeMock = vi.fn()

vi.mock('hono/jwt', () => ({
  decode: (...args: unknown[]) => decodeMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

const JWTTokenInputStub = defineComponent({
  name: 'JWTTokenInput',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  template: '<div data-testid="token-input" />',
})

const JWTDecodedSectionStub = defineComponent({
  name: 'JWTDecodedSection',
  props: {
    decodedHeader: {
      type: Object,
      default: null,
    },
    decodedPayload: {
      type: Object,
      default: null,
    },
  },
  template: '<div data-testid="decoded-section" />',
})

const JWTVerifySettingsStub = defineComponent({
  name: 'JWTVerifySettings',
  props: {
    secret: {
      type: String,
      default: '',
    },
    alg: {
      type: String,
      default: 'auto',
    },
  },
  emits: ['update:secret', 'update:alg'],
  template: '<div data-testid="verify-settings" />',
})

const JWTVerificationSectionStub = defineComponent({
  name: 'JWTVerificationSection',
  props: {
    token: {
      type: String,
      default: '',
    },
    secret: {
      type: String,
      default: '',
    },
    alg: {
      type: String,
      default: 'auto',
    },
    decodedHeader: {
      type: Object,
      default: null,
    },
  },
  template: '<div data-testid="verification-section" />',
})

const mountDecoderVerifier = async () => {
  const { default: JWTDecoderVerifier } = await import('./JWTDecoderVerifier.vue')

  return mount(JWTDecoderVerifier, {
    global: {
      stubs: {
        JWTTokenInput: JWTTokenInputStub,
        JWTDecodedSection: JWTDecodedSectionStub,
        JWTVerifySettings: JWTVerifySettingsStub,
        JWTVerificationSection: JWTVerificationSectionStub,
      },
    },
  })
}

describe('JWTDecoderVerifier', () => {
  beforeEach(() => {
    decodeMock.mockReset()
    decodeMock.mockReturnValue({ header: { alg: 'HS256' }, payload: { sub: 'user' } })
  })

  it('decodes JWT parts and wires child props', async () => {
    const wrapper = await mountDecoderVerifier()
    await flushPromises()

    const decodedSection = wrapper.findComponent(JWTDecodedSectionStub)
    expect(decodedSection.props('decodedHeader')).toEqual({ alg: 'HS256' })
    expect(decodedSection.props('decodedPayload')).toEqual({ sub: 'user' })

    const verificationSection = wrapper.findComponent(JWTVerificationSectionStub)
    expect(verificationSection.props('alg')).toBe('auto')
    expect(verificationSection.props('secret')).toBe('')
    expect(typeof verificationSection.props('token')).toBe('string')

    const tokenInput = wrapper.findComponent(JWTTokenInputStub)
    await tokenInput.vm.$emit('update:value', '  next.token  ')
    await flushPromises()

    const lastCall = decodeMock.mock.calls[decodeMock.mock.calls.length - 1]
    expect(lastCall?.[0]).toBe('next.token')
    expect(wrapper.findComponent(JWTVerificationSectionStub).props('token')).toBe('next.token')
  })

  it('propagates verify settings updates and handles empty token input', async () => {
    const wrapper = await mountDecoderVerifier()
    await flushPromises()

    const verifySettings = wrapper.findComponent(JWTVerifySettingsStub)
    await verifySettings.vm.$emit('update:secret', 'top-secret')
    await verifySettings.vm.$emit('update:alg', 'HS512')
    await flushPromises()

    const verificationSection = wrapper.findComponent(JWTVerificationSectionStub)
    expect(verificationSection.props('secret')).toBe('top-secret')
    expect(verificationSection.props('alg')).toBe('HS512')

    decodeMock.mockClear()
    const tokenInput = wrapper.findComponent(JWTTokenInputStub)
    await tokenInput.vm.$emit('update:value', '   ')
    await flushPromises()

    expect(decodeMock).not.toHaveBeenCalled()
    const decodedSection = wrapper.findComponent(JWTDecodedSectionStub)
    expect(decodedSection.props('decodedHeader')).toBeNull()
    expect(decodedSection.props('decodedPayload')).toBeNull()
  })

  it('falls back to null when decoded object has no header or payload', async () => {
    decodeMock.mockReturnValue({})

    const wrapper = await mountDecoderVerifier()
    await flushPromises()

    const decodedSection = wrapper.findComponent(JWTDecodedSectionStub)
    expect(decodedSection.props('decodedHeader')).toBeNull()
    expect(decodedSection.props('decodedPayload')).toBeNull()
  })

  it('returns null decoded values when decode throws', async () => {
    decodeMock.mockImplementation(() => {
      throw new Error('bad token')
    })

    const wrapper = await mountDecoderVerifier()
    await flushPromises()

    const decodedSection = wrapper.findComponent(JWTDecodedSectionStub)
    expect(decodedSection.props('decodedHeader')).toBeNull()
    expect(decodedSection.props('decodedPayload')).toBeNull()
  })
})
