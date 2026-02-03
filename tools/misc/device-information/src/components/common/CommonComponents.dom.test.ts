import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InfosGrid from './InfosGrid.vue'
import InfoWrapper from './InfoWrapper.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NCard: defineComponent({
      name: 'NCard',
      template: '<div class="n-card"><slot /></div>',
    }),
  }
})

describe('common components', () => {
  it('renders the infos grid slot', () => {
    const wrapper = mount(InfosGrid, {
      slots: {
        default: '<span class="grid-item">grid</span>',
      },
    })

    expect(wrapper.find('.info-grid').exists()).toBe(true)
    expect(wrapper.find('.grid-item').text()).toBe('grid')
  })

  it('wraps content in a card', () => {
    const wrapper = mount(InfoWrapper, {
      slots: {
        default: '<span class="card-content">content</span>',
      },
    })

    expect(wrapper.find('.n-card').exists()).toBe(true)
    expect(wrapper.find('.card-content').text()).toBe('content')
  })
})
