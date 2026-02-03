import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      props: ['label'],
      template: '<div class="desc-item" :data-label="label"><slot /></div>',
    }),
    NTag: defineComponent({
      name: 'NTag',
      props: ['type'],
      template: '<span class="tag" :data-type="type"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      template: '<span class="text"><slot /></span>',
    }),
  }
})

import IBANResultStatus from './IBANResultStatus.vue'

describe('IBANResultStatus', () => {
  it('renders valid status and supported registry', () => {
    const wrapper = mount(IBANResultStatus, {
      props: {
        isValid: true,
        isCountryValid: true,
        countryDisplay: 'Germany (DE)',
      },
    })

    const tags = wrapper.findAll('.tag')
    expect(tags[0]?.attributes('data-type')).toBe('success')
    expect(wrapper.text()).toContain('valid')
    expect(tags[1]?.attributes('data-type')).toBe('success')
    expect(wrapper.text()).toContain('supported')
  })

  it('renders invalid status and unknown registry', () => {
    const wrapper = mount(IBANResultStatus, {
      props: {
        isValid: false,
        isCountryValid: false,
        countryDisplay: 'ZZ',
      },
    })

    const tags = wrapper.findAll('.tag')
    expect(tags[0]?.attributes('data-type')).toBe('error')
    expect(wrapper.text()).toContain('invalid')
    expect(tags[1]?.attributes('data-type')).toBe('warning')
    expect(wrapper.text()).toContain('unknown')
  })
})
