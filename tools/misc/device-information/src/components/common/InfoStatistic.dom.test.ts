import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InfoStatistic from './InfoStatistic.vue'
import InfoWrapper from './InfoWrapper.vue'
import InfosGrid from './InfosGrid.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent, h } = await import('vue')

  const NCard = defineComponent({
    name: 'NCard',
    setup(_props, { slots }) {
      return () => h('div', { class: 'n-card' }, slots.default?.())
    },
  })

  const NStatistic = defineComponent({
    name: 'NStatistic',
    props: {
      label: {
        type: String,
        default: '',
      },
    },
    setup(props, { slots }) {
      return () => h('div', { class: 'n-statistic', 'data-label': props.label }, slots.default?.())
    },
  })

  const NEllipsis = defineComponent({
    name: 'NEllipsis',
    setup(_props, { slots }) {
      return () => h('span', { class: 'n-ellipsis' }, slots.default?.())
    },
  })

  return {
    NCard,
    NStatistic,
    NEllipsis,
  }
})

describe('InfoWrapper', () => {
  it('renders slot content inside the card', () => {
    const wrapper = mount(InfoWrapper, {
      slots: {
        default: 'Slot Content',
      },
    })

    expect(wrapper.find('.n-card').exists()).toBe(true)
    expect(wrapper.text()).toContain('Slot Content')
  })
})

describe('InfoStatistic', () => {
  it('renders label and value when provided', () => {
    const wrapper = mount(InfoStatistic, {
      props: {
        label: 'Label',
        value: 'Value',
      },
    })

    const statistic = wrapper.find('.n-statistic')
    expect(statistic.exists()).toBe(true)
    expect(statistic.attributes('data-label')).toBe('Label')
    expect(wrapper.text()).toContain('Value')
  })

  it('renders nothing when value is empty', () => {
    const wrapper = mount(InfoStatistic, {
      props: {
        label: 'Label',
        value: null,
      },
    })

    expect(wrapper.find('.n-card').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })
})

describe('InfosGrid', () => {
  it('wraps content in the grid container', () => {
    const wrapper = mount(InfosGrid, {
      slots: {
        default: '<div class="grid-item" />',
      },
    })

    expect(wrapper.find('.info-grid').exists()).toBe(true)
    expect(wrapper.find('.grid-item').exists()).toBe(true)
  })
})
