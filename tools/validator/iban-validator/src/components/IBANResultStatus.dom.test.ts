import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
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
    expect(wrapper.text()).toContain('Valid')
    expect(tags[1]?.attributes('data-type')).toBe('success')
    expect(wrapper.text()).toContain('Supported')
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
    expect(wrapper.text()).toContain('Invalid')
    expect(tags[1]?.attributes('data-type')).toBe('warning')
    expect(wrapper.text()).toContain('Unknown')
  })
})
