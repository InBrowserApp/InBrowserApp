import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CategoryIcon from './CategoryIcon.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NIcon: defineComponent({
      name: 'NIcon',
      props: {
        component: {
          type: Object,
          default: null,
        },
      },
      template: '<span class="n-icon" />',
    }),
  }
})

const categories = [
  'application',
  'audio',
  'font',
  'image',
  'message',
  'model',
  'multipart',
  'text',
  'video',
]

describe('CategoryIcon', () => {
  it.each(categories)('renders an icon for %s', (category) => {
    const wrapper = mount(CategoryIcon, {
      props: {
        category,
      },
    })

    expect(wrapper.find('.n-icon').exists()).toBe(true)
  })

  it('does not render an icon for unknown categories', () => {
    const wrapper = mount(CategoryIcon, {
      props: {
        category: 'unknown',
      },
    })

    expect(wrapper.find('.n-icon').exists()).toBe(false)
  })
})
