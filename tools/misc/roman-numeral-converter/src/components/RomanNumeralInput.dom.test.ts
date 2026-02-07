import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import RomanNumeralInput from './RomanNumeralInput.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NFormItem = defineComponent({
    name: 'NFormItem',
    props: {
      rule: {
        type: Object,
        default: null,
      },
      showLabel: {
        type: Boolean,
        default: true,
      },
    },
    template: '<div class="form-item"><slot /></div>',
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
      size: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<input data-testid="roman-input" :value="value" :placeholder="placeholder" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  return {
    NFormItem,
    NInput,
  }
})

const CopyStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: [String, Number],
      default: '',
    },
  },
  template: '<button class="copy" :data-content="content" />',
})

const stubs = {
  ToolSectionHeader: {
    template: '<header class="section-header"><slot /></header>',
  },
  ToolSection: {
    template: '<section class="section"><slot /></section>',
  },
  CopyToClipboardButton: CopyStub,
}

describe('RomanNumeralInput', () => {
  it('renders input and copy content', () => {
    const wrapper = mount(RomanNumeralInput, {
      props: {
        value: 'I',
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('romanNumeral')

    const input = wrapper.get('[data-testid="roman-input"]')
    expect(input.attributes('placeholder')).toBe('romanPlaceholder')
    expect(wrapper.get('.copy').attributes('data-content')).toBe('I')
  })

  it('emits updates only for valid numerals and validates', async () => {
    const wrapper = mount(RomanNumeralInput, {
      props: {
        value: 'I',
      },
      global: {
        stubs,
      },
    })

    const input = wrapper.get('[data-testid="roman-input"]')
    await input.setValue('X')

    expect(wrapper.emitted('update:value')).toEqual([['X']])

    const formItem = wrapper.getComponent({ name: 'NFormItem' })
    const rule = formItem.props('rule') as { validator: () => true | Error }

    expect(rule.validator()).toBe(true)

    await input.setValue('   ')
    await nextTick()

    expect(rule.validator()).toBe(true)
    expect(wrapper.emitted('update:value')?.length).toBe(1)

    await input.setValue('ABC')
    await nextTick()

    expect(wrapper.emitted('update:value')?.length).toBe(1)
    expect(rule.validator()).toBeInstanceOf(Error)
  })

  it('syncs internal value when props change', async () => {
    const wrapper = mount(RomanNumeralInput, {
      props: {
        value: 'I',
      },
      global: {
        stubs,
      },
    })

    await wrapper.setProps({ value: 'IV' })
    await nextTick()

    const input = wrapper.get('[data-testid="roman-input"]').element as HTMLInputElement
    expect(input.value).toBe('IV')
  })
})
