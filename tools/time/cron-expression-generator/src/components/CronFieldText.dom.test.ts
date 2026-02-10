import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronFieldEveryDescription from './CronFieldEveryDescription.vue'
import CronFieldHeader from './CronFieldHeader.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, args?: Record<string, unknown>) => {
        if (args?.field) return `${key}:${args.field}`
        return key
      },
    }),
  }
})

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

    expect(wrapper.text()).toContain('everyDescription')
  })

  it('renders field header label', () => {
    const wrapper = mount(CronFieldHeader, {
      props: {
        fieldName: 'month',
      },
    })

    expect(wrapper.text()).toContain('month')
  })
})
