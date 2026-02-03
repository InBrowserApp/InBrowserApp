import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CronFieldIntervalControl from './CronFieldIntervalControl.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="n-text"><slot /></span>',
    }),
    NInputNumber: defineComponent({
      name: 'NInputNumber',
      props: ['value', 'min', 'max', 'size'],
      emits: ['update:value'],
      template: '<input class="n-input-number" />',
    }),
  }
})

describe('CronFieldIntervalControl', () => {
  it('computes unit labels and max interval', () => {
    const wrapper = mount(CronFieldIntervalControl, {
      props: {
        fieldConfig: {
          min: 0,
          max: 59,
          unit: 'minutes',
        },
        intervalValue: 5,
      },
    })

    const input = wrapper.findComponent({ name: 'NInputNumber' })
    expect(input.props('max')).toBe(60)
    expect(wrapper.text()).toContain('minutes')
  })
})
