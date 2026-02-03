import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ArabicNumberInput from './ArabicNumberInput.vue'

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
    template: '<div class="form-item"><slot /></div>',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: 0,
      },
      min: {
        type: Number,
        default: 1,
      },
      max: {
        type: Number,
        default: 3999,
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
      '<input data-testid="arabic-input" type="number" :value="value" :min="min" :max="max" :placeholder="placeholder" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  return {
    NFormItem,
    NInputNumber,
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

describe('ArabicNumberInput', () => {
  it('renders labels and input constraints', () => {
    const wrapper = mount(ArabicNumberInput, {
      props: {
        value: 1,
      },
      global: {
        stubs,
      },
    })

    expect(wrapper.find('.section-header').text()).toBe('arabicNumber')

    const input = wrapper.get('[data-testid="arabic-input"]')
    expect(input.attributes('min')).toBe('1')
    expect(input.attributes('max')).toBe('3999')
    expect(input.attributes('placeholder')).toBe('arabicPlaceholder')

    expect(wrapper.get('.copy').attributes('data-content')).toBe('1')
  })

  it('emits updates when number changes', async () => {
    const wrapper = mount(ArabicNumberInput, {
      props: {
        value: 12,
      },
      global: {
        stubs,
      },
    })

    const input = wrapper.get('[data-testid="arabic-input"]')
    await input.setValue('42')

    expect(wrapper.emitted('update:value')).toEqual([[42]])
  })
})
