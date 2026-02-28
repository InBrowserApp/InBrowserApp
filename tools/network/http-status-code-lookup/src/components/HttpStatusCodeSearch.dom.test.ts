import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import HttpStatusCodeSearch from './HttpStatusCodeSearch.vue'

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

vi.mock('@vicons/fluent/Search20Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'SearchIcon',
      template: '<svg class="search-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/Info12Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'InfoIcon',
      template: '<svg class="info-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/CheckmarkCircle16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'SuccessIcon',
      template: '<svg class="success-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/ArrowForward16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'RedirectionIcon',
      template: '<svg class="redirection-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/ErrorCircle16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ClientErrorIcon',
      template: '<svg class="client-error-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/DismissCircle16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'ServerErrorIcon',
      template: '<svg class="server-error-icon" />',
    }),
  }
})

describe('HttpStatusCodeSearch', () => {
  it('renders the search input and category options', () => {
    const wrapper = mount(HttpStatusCodeSearch, {
      props: {
        search: '',
        category: 'all',
      },
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe(
      'Search by status code, name, or description...',
    )
    expect(wrapper.findAll('.radio-button')).toHaveLength(7)
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Common')
    expect(wrapper.text()).toContain('Informational (1xx)')
    expect(wrapper.text()).toContain('Success (2xx)')
    expect(wrapper.text()).toContain('Redirection (3xx)')
    expect(wrapper.text()).toContain('Client Error (4xx)')
    expect(wrapper.text()).toContain('Server Error (5xx)')
  })

  it('emits updates when the search or category changes', async () => {
    const wrapper = mount(HttpStatusCodeSearch, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', '404')
    await nextTick()

    expect(wrapper.emitted('update:search')?.[0]).toEqual(['404'])

    const radioGroup = wrapper.findComponent({ name: 'NRadioGroup' })
    radioGroup.vm.$emit('update:value', 'client-error')
    await nextTick()

    expect(wrapper.emitted('update:category')?.[0]).toEqual(['client-error'])
  })

  it('falls back to the default icon for unknown categories', () => {
    const wrapper = mount(HttpStatusCodeSearch, {
      props: {
        search: '',
        category: 'all',
      },
    })

    const vm = wrapper.vm as { getCategoryIcon?: (category: string) => unknown; $?: unknown }
    const setupState = (vm.$ as { setupState?: Record<string, unknown> } | undefined)?.setupState
    const getCategoryIcon =
      vm.getCategoryIcon ??
      (setupState?.getCategoryIcon as ((category: string) => unknown) | undefined)

    expect(getCategoryIcon?.('unknown')).toBeTruthy()
  })
})
