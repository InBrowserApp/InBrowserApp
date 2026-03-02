import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NText: defineComponent({
      name: 'NText',
      template: '<span data-testid="text"><slot /></span>',
    }),
  }
})
import RadioTimecodeNotesSection from './RadioTimecodeNotesSection.vue'
describe('RadioTimecodeNotesSection', () => {
  it('renders the warning notes', () => {
    const wrapper = mount(RadioTimecodeNotesSection)
    const text = wrapper.text()
    expect(text).toContain('Keep volume low; high-frequency audio can be uncomfortable.')
    expect(text).toContain('Uses local system time only (offline).')
    expect(text).toContain(
      'Output uses a lower-frequency harmonic approximation; results depend on device and placement.',
    )
    expect(text).toContain('JJY call sign minutes (15/45) are not simulated.')
    expect(wrapper.findAll('[data-testid="text"]')).toHaveLength(4)
  })
})
