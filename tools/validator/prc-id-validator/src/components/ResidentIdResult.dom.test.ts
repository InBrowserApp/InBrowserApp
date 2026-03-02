import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateResidentId } from '../data/residentId'
import ResidentIdResult from './ResidentIdResult.vue'

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h2 class="tool-header"><slot /></h2>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NDescriptions = defineComponent({
    name: 'NDescriptions',
    template: '<div class="descriptions"><slot /></div>',
  })

  return { NDescriptions }
})

vi.mock('./ResidentIdIdentityItems.vue', () => ({
  default: {
    props: ['validationResult'],
    template: '<div class="identity-items" :data-input="validationResult.input" />',
  },
}))

vi.mock('./ResidentIdRegionItems.vue', () => ({
  default: {
    props: ['validationResult'],
    template: '<div class="region-items" :data-input="validationResult.input" />',
  },
}))

describe('ResidentIdResult', () => {
  it('renders the result sections with validation data', () => {
    const validationResult = validateResidentId('11010519491231002X')
    const wrapper = mount(ResidentIdResult, {
      props: { validationResult },
    })

    expect(wrapper.get('.tool-header').text()).toBe('Validation Result')
    expect(wrapper.get('.region-items').attributes('data-input')).toBe('11010519491231002X')
    expect(wrapper.get('.identity-items').attributes('data-input')).toBe('11010519491231002X')
  })
})
