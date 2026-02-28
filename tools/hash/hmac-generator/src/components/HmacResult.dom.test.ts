import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import HmacResult from './HmacResult.vue'

const generateHmacMock = vi.fn()

vi.mock('../hmac', () => ({
  generateHmac: (...args: unknown[]) => generateHmacMock(...args),
}))

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { ref, watchEffect } = await import('vue')

  return {
    ...actual,
    computedAsync: (
      getter: () => Promise<unknown>,
      initialValue?: unknown,
      evaluating?: { value: boolean },
    ) => {
      const state = ref(initialValue)
      watchEffect(() => {
        if (evaluating) evaluating.value = true
        void Promise.resolve(getter()).then((value) => {
          state.value = value
          if (evaluating) evaluating.value = false
        })
      })
      return state
    },
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    CopyToClipboardTooltip: defineComponent({
      name: 'CopyToClipboardTooltip',
      props: {
        content: {
          type: String,
          default: '',
        },
      },
      setup(props, { slots }) {
        return () =>
          h('span', { class: 'copy', 'data-content': props.content }, [
            slots.default?.({ copy: () => {} }),
          ])
      },
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
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      template: '<div class="description-item"><slot name="label" /><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
  }
})

describe('HmacResult', () => {
  beforeEach(() => {
    generateHmacMock.mockReset()
  })

  it('renders nothing without inputs', () => {
    const wrapper = mount(HmacResult, {
      props: {
        secretKey: '',
        algorithm: 'SHA-256',
        message: '',
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
        },
      },
    })

    expect(wrapper.text()).toBe('')
  })

  it('shows computed hex and base64 output', async () => {
    generateHmacMock.mockResolvedValue(new Uint8Array([1, 2, 3]).buffer)

    const wrapper = mount(HmacResult, {
      props: {
        secretKey: 'secret',
        algorithm: 'SHA-256',
        message: 'hello',
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
        },
      },
    })

    await flushPromises()

    expect(generateHmacMock).toHaveBeenCalledWith('hello', 'secret', 'SHA-256')
    expect(wrapper.text()).toContain('Hexadecimal')
    expect(wrapper.text()).toContain('Base64')
    expect(wrapper.text()).toContain('010203')
    expect(wrapper.text()).toContain('AQID')
  })
})
