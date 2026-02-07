import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ISBNValidatorView from './ISBNValidatorView.vue'
import * as toolInfo from './info'

const storageState = vi.hoisted(() => ({
  value: '978-0-306-40615-7',
}))

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(storageState.value ?? initialValue),
  }
})

const LayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div data-layout :data-tool-id="info.toolID"><slot /></div>',
})

const ISBNInputStub = defineComponent({
  name: 'ISBNInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    validationResult: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div data-testid="isbn-input" :data-value="modelValue" />',
})

const ISBNResultStub = defineComponent({
  name: 'ISBNResult',
  props: {
    validationResult: {
      type: Object,
      default: () => ({}),
    },
  },
  template: '<div data-testid="isbn-result" />',
})

const WhatIsStub = defineComponent({
  name: 'WhatIsISBNValidator',
  template: '<div data-testid="isbn-what-is" />',
})

describe('ISBNValidatorView', () => {
  it('renders the layout and sections with the stored ISBN', () => {
    storageState.value = '978-0-306-40615-7'

    const wrapper = mount(ISBNValidatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          ISBNInput: ISBNInputStub,
          ISBNResult: ISBNResultStub,
          WhatIsISBNValidator: WhatIsStub,
        },
      },
    })

    const layout = wrapper.get('[data-layout]')
    expect(layout.attributes('data-tool-id')).toBe(toolInfo.toolID)

    const input = wrapper.get('[data-testid="isbn-input"]')
    expect(input.attributes('data-value')).toBe('978-0-306-40615-7')

    expect(wrapper.find('[data-testid="isbn-result"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="isbn-what-is"]').exists()).toBe(true)
  })

  it('hides the result panel when the stored ISBN is empty', () => {
    storageState.value = ''

    const wrapper = mount(ISBNValidatorView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: LayoutStub,
          ISBNInput: ISBNInputStub,
          ISBNResult: ISBNResultStub,
          WhatIsISBNValidator: WhatIsStub,
        },
      },
    })

    expect(wrapper.get('[data-testid="isbn-input"]').attributes('data-value')).toBe('')
    expect(wrapper.find('[data-testid="isbn-result"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="isbn-what-is"]').exists()).toBe(true)
  })
})
