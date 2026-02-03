import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import DecodeResult from './DecodeResult.vue'
import DecodeDetailResult from './DecodeDetailResult.vue'
import VersionDisplay from './VersionDisplay.vue'
import VariantDisplay from './VariantDisplay.vue'

const validateMock = vi.hoisted(() => vi.fn())
const decodeMock = vi.hoisted(() => vi.fn())

vi.mock('uuid', () => ({
  validate: (...args: unknown[]) => validateMock(...args),
}))

vi.mock('@utils/uuid/decode', () => ({
  decode: (...args: unknown[]) => decodeMock(...args),
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="naive-base"><slot /></div>',
  })
  const NText = defineComponent({
    name: 'NText',
    props: {
      code: {
        type: Boolean,
        default: false,
      },
    },
    template: '<span class="n-text"><slot /></span>',
  })
  const NTime = defineComponent({
    name: 'NTime',
    props: {
      time: {
        type: Number,
        default: 0,
      },
      type: {
        type: String,
        default: 'date',
      },
    },
    template: '<time class="n-time" />',
  })
  return {
    NDescriptions: Base,
    NDescriptionsItem: Base,
    NText,
    NTime,
  }
})

describe('DecodeResult', () => {
  it('renders decoded details when valid', () => {
    validateMock.mockReturnValue(true)
    decodeMock.mockReturnValue({
      uuid: 'uuid-1',
      version: 4,
      variant: 1,
      base64: 'b64',
      integer: 1n,
      octal: 'oct',
      binary: 'bin',
    })

    const DecodeDetailResultStub = defineComponent({
      name: 'DecodeDetailResult',
      props: ['result'],
      template: '<div class="decode-detail" :data-uuid="result.uuid" />',
    })

    const wrapper = mount(DecodeResult, {
      props: {
        uuid: 'uuid-1',
      },
      global: {
        stubs: {
          DecodeDetailResult: DecodeDetailResultStub,
        },
      },
    })

    expect(decodeMock).toHaveBeenCalledWith('uuid-1')
    expect(wrapper.find('.decode-detail').attributes('data-uuid')).toBe('uuid-1')
  })

  it('renders an error when invalid', () => {
    validateMock.mockReturnValue(false)
    decodeMock.mockReset()

    const wrapper = mount(DecodeResult, {
      props: {
        uuid: 'bad-uuid',
      },
    })

    expect(wrapper.text()).toContain('decode-error')
    expect(decodeMock).not.toHaveBeenCalled()
  })
})

describe('VersionDisplay', () => {
  it('shows version labels and handles unknowns', () => {
    const wrapper = mount(VersionDisplay, {
      props: {
        version: 4,
      },
    })
    expect(wrapper.text()).toContain('version-4')

    const unknownWrapper = mount(VersionDisplay, {
      props: {
        version: 99,
      },
    })
    expect(unknownWrapper.text()).toBe('')
  })
})

describe('VariantDisplay', () => {
  it('shows variant labels and handles unknowns', () => {
    const wrapper = mount(VariantDisplay, {
      props: {
        variant: 2,
      },
    })
    expect(wrapper.text()).toContain('variant-2')

    const unknownWrapper = mount(VariantDisplay, {
      props: {
        variant: 9,
      },
    })
    expect(unknownWrapper.text()).toBe('')
  })
})

describe('DecodeDetailResult', () => {
  it('renders algorithm and optional fields', () => {
    const wrapper = mount(DecodeDetailResult, {
      props: {
        result: {
          uuid: '11111111-1111-1111-1111-111111111111',
          version: 4,
          variant: 1,
          base64: 'b64',
          integer: 1n,
          octal: 'oct',
          binary: 'bin',
          algorithm: 'sha1',
          macAddress: 'aa:bb:cc:dd:ee:ff',
          timestamp: 1710000000000,
        },
      },
    })

    expect(wrapper.text()).toContain('algorithm.sha1')
    expect(wrapper.text()).toContain('aa:bb:cc:dd:ee:ff')
  })

  it('handles md5 algorithm labels', () => {
    const wrapper = mount(DecodeDetailResult, {
      props: {
        result: {
          uuid: '22222222-2222-2222-2222-222222222222',
          version: 3,
          variant: 1,
          base64: 'b64',
          integer: 2n,
          octal: 'oct',
          binary: 'bin',
          algorithm: 'md5',
        },
      },
    })

    expect(wrapper.text()).toContain('algorithm.md5')
  })
})
