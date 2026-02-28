import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TimestampInputSection from './TimestampInputSection.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

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
      status: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      return () =>
        h('input', {
          class: 'input',
          value: props.value,
          placeholder: props.placeholder,
          'data-status': props.status,
          onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
        })
    },
  })

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
  })

  const NText = defineComponent({
    name: 'NText',
    props: {
      type: {
        type: String,
        default: '',
      },
    },
    template: '<span class="n-text" :data-type="type"><slot /></span>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button class="n-button" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    props: {
      component: {
        type: Object,
        default: null,
      },
    },
    template: '<span class="n-icon" />',
  })

  return {
    NInput,
    NFlex,
    NText,
    NButton,
    NIcon,
  }
})

vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    CopyToClipboardButton: defineComponent({
      name: 'CopyToClipboardButton',
      props: {
        content: {
          type: String,
          default: '',
        },
      },
      template: '<button class="copy" :data-content="content" />',
    }),
  }
})

vi.mock('@vicons/fluent/Clock16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ClockIcon',
      template: '<svg class="clock-icon" />',
    }),
  }
})

describe('TimestampInputSection', () => {
  it('renders input state and validation message', () => {
    const wrapper = mount(TimestampInputSection, {
      props: {
        timestamp: '123',
        isValid: false,
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Unix Timestamp')
    expect(wrapper.text()).toContain('Invalid timestamp')
    expect(wrapper.text()).toContain('Now')
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter Unix timestamp...')
    expect(wrapper.find('input').attributes('data-status')).toBe('error')
  })

  it('emits updates for timestamp and now', async () => {
    const wrapper = mount(TimestampInputSection, {
      props: {
        timestamp: '123',
        isValid: true,
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })

    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', '456')
    await nextTick()

    expect(wrapper.emitted('update:timestamp')?.[0]).toEqual(['456'])

    await wrapper.find('.n-button').trigger('click')
    expect(wrapper.emitted('set-now')).toHaveLength(1)
  })
})
