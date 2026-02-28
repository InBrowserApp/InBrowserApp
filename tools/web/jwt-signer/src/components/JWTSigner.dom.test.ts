import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'

const signMock = vi.fn()

vi.mock('hono/jwt', () => ({
  sign: (...args: unknown[]) => signMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref } = await import('vue')

  return {
    ...actual,
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NText: defineComponent({
      name: 'NText',
      inheritAttrs: false,
      emits: ['click'],
      template: '<span data-testid="token-text" @click="$emit(\'click\')"><slot /></span>',
    }),
  }
})

const JSONInputStub = defineComponent({
  name: 'JSONInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  template: '<textarea data-testid="payload-input" />',
})

const JWTOptionsInputStub = defineComponent({
  name: 'JWTOptionsInput',
  props: {
    secret: {
      type: String,
      default: '',
    },
    alg: {
      type: String,
      default: '',
    },
  },
  emits: ['update:secret', 'update:alg'],
  template: '<div data-testid="options-input" />',
})

const copySpy = vi.fn()

const CopyToClipboardTooltipStub = defineComponent({
  name: 'CopyToClipboardTooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots }) {
    return () => h('div', slots.default?.({ copy: copySpy }))
  },
})

const mountSigner = async () => {
  const { default: JWTSigner } = await import('./JWTSigner.vue')

  return mount(JWTSigner, {
    global: {
      stubs: {
        ToolSectionHeader: {
          template: '<h2><slot /></h2>',
        },
        ToolSection: {
          template: '<section><slot /></section>',
        },
        JSONInput: JSONInputStub,
        JWTOptionsInput: JWTOptionsInputStub,
        CopyToClipboardTooltip: CopyToClipboardTooltipStub,
      },
    },
  })
}

describe('JWTSigner', () => {
  beforeAll(() => {
    vi.stubGlobal('crypto', { randomUUID: () => 'uuid-1234' })
  })

  beforeEach(() => {
    signMock.mockReset()
    copySpy.mockReset()
  })

  it('signs payloads and supports copying the token', async () => {
    signMock.mockResolvedValueOnce('token-1')

    const wrapper = await mountSigner()
    await flushPromises()

    expect(signMock).toHaveBeenCalledWith({ sub: 'user', role: 'admin' }, 'uuid-1234', 'HS256')

    const tooltip = wrapper.findComponent(CopyToClipboardTooltipStub)
    expect(tooltip.props('content')).toBe('token-1')

    await wrapper.find('[data-testid="token-text"]').trigger('click')
    expect(copySpy).toHaveBeenCalled()

    signMock.mockResolvedValue('token-2')

    await wrapper.findComponent(JSONInputStub).vm.$emit('update:value', '{"sub":"editor"}')
    await flushPromises()

    const lastCallAfterPayload = signMock.mock.calls[signMock.mock.calls.length - 1]
    expect(lastCallAfterPayload).toEqual([{ sub: 'editor' }, 'uuid-1234', 'HS256'])

    await wrapper.findComponent(JWTOptionsInputStub).vm.$emit('update:secret', 'next-secret')
    await wrapper.findComponent(JWTOptionsInputStub).vm.$emit('update:alg', 'HS512')
    await flushPromises()

    const lastCallAfterOptions = signMock.mock.calls[signMock.mock.calls.length - 1]
    expect(lastCallAfterOptions).toEqual([{ sub: 'editor' }, 'next-secret', 'HS512'])
  })
})
