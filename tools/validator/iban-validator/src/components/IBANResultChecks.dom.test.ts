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
  it('renders expected and actual values with checksum state', () => {
    const wrapper = mount(IBANResultChecks, {
      props: {
        expectedLength: '22',
        actualLength: 21,
        isChecksumValid: false,
        expectedCheckDigits: '89',
        actualCheckDigits: '12',
      },
    })

    expect(wrapper.text()).toContain('expected: 22')
    expect(wrapper.text()).toContain('actual: 21')
    expect(wrapper.text()).toContain('expected: 89')
    expect(wrapper.text()).toContain('actual: 12')

    const tag = wrapper.get('.tag')
    expect(tag.attributes('data-type')).toBe('error')
    expect(wrapper.text()).toContain('fail')
  })
})
