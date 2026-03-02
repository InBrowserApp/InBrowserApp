import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorDisplay from './ErrorDisplay.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const NAlert = defineComponent({
    name: 'NAlert',
    props: {
      type: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
    },
    template: '<div><slot /></div>',
  })

  return { NAlert }
})

describe('ErrorDisplay', () => {
  it('renders an error message when present', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: 'failed',
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
        },
      },
    })

    const alert = wrapper.findComponent({ name: 'NAlert' })
    expect(alert.exists()).toBe(true)
    expect(wrapper.text()).toContain('failed')
  })

  it('renders nothing when there is no error', () => {
    const wrapper = mount(ErrorDisplay, {
      props: {
        error: '',
      },
      global: {
        stubs: {
          ToolSection: {
            template: '<section><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'NAlert' }).exists()).toBe(false)
  })
})
