import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronFieldEveryDescription from './CronFieldEveryDescription.vue'
import CronFieldHeader from './CronFieldHeader.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
  }
})

describe('CronField text components', () => {
  it('renders every description with field name', () => {
    const wrapper = mount(CronFieldEveryDescription, {
      props: {
        fieldName: 'dayOfWeek',
      },
    })

    expect(wrapper.text()).toContain('Runs on every day of week')
  })

  it('renders field header label', () => {
    const wrapper = mount(CronFieldHeader, {
      props: {
        fieldName: 'month',
      },
    })

    expect(wrapper.text()).toContain('Month')
  })
})
