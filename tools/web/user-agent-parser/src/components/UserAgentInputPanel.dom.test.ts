import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import UserAgentInputPanel from './UserAgentInputPanel.vue'

vi.mock('naive-ui', async () => {
  const NFormItemGi = defineComponent({
    name: 'NFormItemGi',
    setup(_, { slots }) {
      return () => h('div', [slots.label?.(), slots.default?.(), slots.feedback?.()])
    },
  })

  const NGrid = defineComponent({
    name: 'NGrid',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  })

  const NInput = defineComponent({
    name: 'NInput',
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
    setup(props, { emit }) {
      return () =>
        h('textarea', {
          value: props.value,
          placeholder: props.placeholder,
          onInput: (event: Event) => {
            emit('update:value', (event.target as HTMLTextAreaElement).value)
          },
        })
    },
  })

  const NButton = defineComponent({
    name: 'NButton',
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    setup(props, { emit, slots }) {
      return () =>
        h(
          'button',
          {
            disabled: props.disabled,
            onClick: () => {
              if (!props.disabled) emit('click')
            },
          },
          slots.default?.(),
        )
    },
  })

  const NEmpty = defineComponent({
    name: 'NEmpty',
    props: {
      description: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      return () => h('div', props.description)
    },
  })

  const NText = defineComponent({
    name: 'NText',
    setup(_, { slots }) {
      return () => h('span', slots.default?.())
    },
  })

  const NCard = defineComponent({
    name: 'NCard',
    setup(_, { slots }) {
      return () => h('div', slots.default?.())
    },
  })

  const NCode = defineComponent({
    name: 'NCode',
    props: {
      code: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      return () => h('pre', props.code)
    },
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    setup() {
      return () => h('span')
    },
  })

  return {
    NFormItemGi,
    NGrid,
    NInput,
    NButton,
    NEmpty,
    NText,
    NCard,
    NCode,
    NIcon,
  }
})

const baseProps = {
  userAgent: '',
  inputStatus: undefined,
  inputError: false,
  canUseCurrent: true,
  hasOutput: false,
  renderedJson: '',
  labels: {
    inputLabel: 'User Agent',
    useCurrent: 'Use my user agent',
    inputPlaceholder: 'Paste a user agent string here...',
    inputError: 'Enter a user agent string to parse.',
    jsonOutput: 'JSON Output',
    emptyState: 'Paste a user agent string to see parsed details.',
  },
}

const mountPanel = (props = {}) =>
  mount(UserAgentInputPanel, {
    props: { ...baseProps, ...props },
    global: {
      stubs: {
        ToolSection: { template: '<section><slot /></section>' },
        CopyToClipboardButton: { template: '<button data-test="copy" />' },
      },
    },
  })

describe('UserAgentInputPanel', () => {
  it('renders labels and empty state', () => {
    const wrapper = mountPanel({ inputError: true })

    expect(wrapper.text()).toContain('User Agent')
    expect(wrapper.text()).toContain('JSON Output')
    expect(wrapper.text()).toContain('Enter a user agent string to parse.')
    expect(wrapper.text()).toContain('Paste a user agent string to see parsed details.')
  })

  it('emits updates and use-current events', async () => {
    const wrapper = mountPanel({ hasOutput: false })
    const textarea = wrapper.get('textarea')

    await textarea.setValue('Test UA')
    expect(wrapper.emitted('update:userAgent')?.[0]).toEqual(['Test UA'])

    const button = wrapper.get('button')
    await button.trigger('click')
    expect(wrapper.emitted('use-current')).toBeTruthy()
  })

  it('shows copy button when output is available', () => {
    const wrapper = mountPanel({
      hasOutput: true,
      renderedJson: '{ "ok": true }',
    })

    expect(wrapper.find('[data-test="copy"]').exists()).toBe(true)
  })
})
