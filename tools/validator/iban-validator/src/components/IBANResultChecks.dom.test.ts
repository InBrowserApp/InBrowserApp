import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NDescriptionsItem: defineComponent({
      name: 'NDescriptionsItem',
      props: ['label'],
      template: '<div class="desc-item" :data-label="label"><slot /></div>',
    }),
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="flex"><slot /></div>',
    }),
    NTag: defineComponent({
      name: 'NTag',
      props: ['type'],
      template: '<span class="tag" :data-type="type"><slot /></span>',
    }),
    NText: defineComponent({
      name: 'NText',
      props: ['depth'],
      template: '<span class="text"><slot /></span>',
    }),
  }
})

import IBANResultChecks from './IBANResultChecks.vue'

describe('IBANResultChecks', () => {
  it('renders expected and actual values with a failed checksum state', () => {
    const wrapper = mount(IBANResultChecks, {
      props: {
        expectedLength: '22',
        actualLength: 21,
        isChecksumValid: false,
        expectedCheckDigits: '89',
        actualCheckDigits: '12',
      },
    })

    expect(wrapper.text()).toContain('Expected: 22')
    expect(wrapper.text()).toContain('Actual: 21')
    expect(wrapper.text()).toContain('Expected: 89')
    expect(wrapper.text()).toContain('Actual: 12')

    const tag = wrapper.get('.tag')
    expect(tag.attributes('data-type')).toBe('error')
    expect(wrapper.text()).toContain('Fail')
  })

  it('renders a success checksum state', () => {
    const wrapper = mount(IBANResultChecks, {
      props: {
        expectedLength: '22',
        actualLength: 22,
        isChecksumValid: true,
        expectedCheckDigits: '29',
        actualCheckDigits: '29',
      },
    })

    const tag = wrapper.get('.tag')
    expect(tag.attributes('data-type')).toBe('success')
    expect(wrapper.text()).toContain('Pass')
  })
})
