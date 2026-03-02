import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import MimeTypeSearch from './MimeTypeSearch.vue'

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
      clearable: {
        type: Boolean,
        default: false,
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
    template: '<span class="n-icon" />',
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

describe('MimeTypeSearch', () => {
  it('renders the search input and category options', () => {
    const wrapper = mount(MimeTypeSearch, {
      props: {
        search: '',
        category: 'all',
      },
      global: {
        stubs: {
          CategoryIcon: {
            props: ['category'],
            template: '<span class="category-icon" :data-category="category" />',
          },
          CategoryI18n: {
            props: ['category'],
            template: '<span class="category-label">{{ category }}</span>',
          },
        },
      },
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe('Search MIME types, extensions...')
    expect(wrapper.findAll('.radio-button')).toHaveLength(10)
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('application')
  })

  it('emits updates when the search or category changes', async () => {
    const wrapper = mount(MimeTypeSearch, {
      props: {
        search: '',
        category: 'all',
      },
      global: {
        stubs: {
          CategoryIcon: {
            template: '<span class="category-icon" />',
          },
          CategoryI18n: {
            props: ['category'],
            template: '<span class="category-label">{{ category }}</span>',
          },
        },
      },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', 'json')
    await nextTick()

    expect(wrapper.emitted('update:search')?.[0]).toEqual(['json'])

    const radioGroup = wrapper.findComponent({ name: 'NRadioGroup' })
    radioGroup.vm.$emit('update:value', 'image')
    await nextTick()

    expect(wrapper.emitted('update:category')?.[0]).toEqual(['image'])
  })
})
