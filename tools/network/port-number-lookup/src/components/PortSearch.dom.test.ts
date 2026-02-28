import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PortSearch from './PortSearch.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NFlex = defineComponent({
    name: 'NFlex',
    template: '<div class="n-flex"><slot /></div>',
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
    setup(props, { emit, slots }) {
      return () =>
        h('div', { class: 'input-wrapper' }, [
          h('input', {
            class: 'input',
            value: props.value,
            placeholder: props.placeholder,
            onInput: (event: Event) =>
              emit('update:value', (event.target as HTMLInputElement).value),
          }),
          slots.prefix?.(),
        ])
    },
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    props: {
      component: {
        type: Object,
        default: () => ({}),
      },
    },
    template: '<span class="icon" />',
  })

  const NRadioGroup = defineComponent({
    name: 'NRadioGroup',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<div class="radio-group"><slot /></div>',
  })

  const NRadioButton = defineComponent({
    name: 'NRadioButton',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    template: '<button class="radio-button" :data-value="value"><slot /></button>',
  })

  return {
    NFlex,
    NInput,
    NIcon,
    NRadioGroup,
    NRadioButton,
  }
})

vi.mock('@vicons/fluent/Search20Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'SearchIcon',
      template: '<svg class="search-icon" />',
    }),
  }
})

describe('PortSearch', () => {
  it('renders the search input and category labels', () => {
    const wrapper = mount(PortSearch, {
      props: {
        search: '',
        category: 'all',
      },
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe(
      'Search by port number or service name...',
    )
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Common')
    expect(wrapper.text()).toContain('System (0-1023)')
    expect(wrapper.text()).toContain('Registered (1024+)')
  })

  it('emits updates when the search or category changes', async () => {
    const wrapper = mount(PortSearch, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', 'ssh')
    await nextTick()

    expect(wrapper.emitted('update:search')?.[0]).toEqual(['ssh'])

    const radioGroup = wrapper.findComponent({ name: 'NRadioGroup' })
    radioGroup.vm.$emit('update:value', 'system')
    await nextTick()

    expect(wrapper.emitted('update:category')?.[0]).toEqual(['system'])
  })
})
