import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, h } from 'vue'
import HmacForm from './HmacForm.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

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
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      return () =>
        h('input', {
          class: 'input',
          value: props.value,
          placeholder: props.placeholder,
          onInput: (event: Event) => emit('update:value', (event.target as HTMLInputElement).value),
        })
    },
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    setup(props, { emit }) {
      return () =>
        h('select', {
          class: 'select',
          value: props.value,
          onChange: (event: Event) =>
            emit('update:value', (event.target as HTMLSelectElement).value),
        })
    },
  })

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    setup(props, { slots }) {
      return () =>
        h('label', { class: 'form-item', 'data-label': props.label }, [
          h('span', { class: 'form-item-label' }, props.label),
          slots.default?.(),
        ])
    },
  })

  return {
    NInput,
    NSelect,
    NFormItem,
  }
})

const TextOrFileInputStub = defineComponent({
  name: 'TextOrFileInput',
  props: {
    value: {
      type: [String, Object],
      default: '',
    },
  },
  emits: ['update:value'],
  template: '<div class="text-or-file" />',
})

describe('HmacForm', () => {
  it('renders labels and algorithm options', () => {
    const wrapper = mount(HmacForm, {
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
          TextOrFileInput: TextOrFileInputStub,
        },
      },
    })

    expect(wrapper.text()).toContain('input-header')
    expect(wrapper.text()).toContain('secret-key')
    expect(wrapper.text()).toContain('algorithm')
    expect(wrapper.text()).toContain('message-header')

    expect(wrapper.find('input').attributes('placeholder')).toBe('secret-key-placeholder')

    const options = wrapper.findComponent({ name: 'NSelect' }).props('options') as Array<{
      label: string
      value: string
    }>
    expect(options).toHaveLength(10)
    expect(options[0]?.value).toBe('SHA-256')
  })

  it('emits updates from inputs', async () => {
    const wrapper = mount(HmacForm, {
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
          TextOrFileInput: TextOrFileInputStub,
        },
      },
    })

    wrapper.findComponent({ name: 'NInput' }).vm.$emit('update:value', 'secret')
    await nextTick()

    expect(wrapper.emitted('update:secretKey')?.[0]).toEqual(['secret'])

    wrapper.findComponent({ name: 'NSelect' }).vm.$emit('update:value', 'SHA-512')
    await nextTick()

    expect(wrapper.emitted('update:algorithm')?.[0]).toEqual(['SHA-512'])

    wrapper.findComponent(TextOrFileInputStub).vm.$emit('update:value', 'hello')
    await nextTick()

    expect(wrapper.emitted('update:message')?.[0]).toEqual(['hello'])
  })
})
