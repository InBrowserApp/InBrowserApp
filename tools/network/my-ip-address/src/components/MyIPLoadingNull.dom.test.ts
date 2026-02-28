import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MyIPLoadingNull from './MyIPLoadingNull.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NSkeleton: defineComponent({
      name: 'NSkeleton',
      template: '<span class="skeleton" />',
    }),
  }
})

describe('MyIPLoadingNull', () => {
  it('renders a skeleton when the IP is loading', () => {
    const wrapper = mount(MyIPLoadingNull, {
      props: {
        ip: undefined,
      },
    })

    expect(wrapper.find('.skeleton').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Unable to get IP')
  })

  it('renders an error message when the IP is unavailable', () => {
    const wrapper = mount(MyIPLoadingNull, {
      props: {
        ip: null,
      },
    })

    expect(wrapper.find('.skeleton').exists()).toBe(false)
    expect(wrapper.text()).toContain('Unable to get IP')
  })
})
