import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import JWTJsonCard from './JWTJsonCard.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NCode = defineComponent({
    name: 'NCode',
    props: {
      code: {
        type: String,
        default: '',
      },
      language: {
        type: String,
        default: '',
      },
      hljs: {
        type: Object,
        default: null,
      },
    },
    template: '<pre data-testid="code">{{ code }}</pre>',
  })

  return { NCode }
})

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  template: '<button data-testid="copy" :data-content="content" />',
})

describe('JWTJsonCard', () => {
  it('formats JSON and forwards content to copy button', () => {
    const wrapper = mount(JWTJsonCard, {
      props: {
        json: { sub: 'user' },
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    const formatted = '{\n  "sub": "user"\n}'
    const code = wrapper.findComponent({ name: 'NCode' })
    expect(code.props('code')).toBe(formatted)
    const copy = wrapper.find('[data-testid="copy"]')
    expect(copy.attributes('data-content')).toBe(formatted)
  })

  it('falls back to empty content when stringify throws', () => {
    const circular: { self?: unknown } = {}
    circular.self = circular

    const wrapper = mount(JWTJsonCard, {
      props: {
        json: circular as unknown as object,
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    const code = wrapper.findComponent({ name: 'NCode' })
    expect(code.props('code')).toBe('')
    const copy = wrapper.find('[data-testid="copy"]')
    expect(copy.attributes('data-content')).toBe('')
  })

  it('renders empty content when JSON is null', () => {
    const wrapper = mount(JWTJsonCard, {
      props: {
        json: null,
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    const code = wrapper.findComponent({ name: 'NCode' })
    expect(code.props('code')).toBe('')
    const copy = wrapper.find('[data-testid="copy"]')
    expect(copy.attributes('data-content')).toBe('')
  })
})
