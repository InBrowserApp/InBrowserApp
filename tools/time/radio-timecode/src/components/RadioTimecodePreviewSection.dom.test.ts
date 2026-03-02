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
import RadioTimecodePreviewSection from './RadioTimecodePreviewSection.vue'
describe('RadioTimecodePreviewSection', () => {
  it('renders labels and values', () => {
    const wrapper = mount(RadioTimecodePreviewSection, {
      props: {
        stationTime: '12:34:56',
        timeZone: 'UTC',
        currentSymbol: 'M',
      },
    })
    const text = wrapper.text()
    expect(text).toContain('Station time')
    expect(text).toContain('Time zone')
    expect(text).toContain('Current symbol')
    expect(text).toContain('12:34:56')
    expect(text).toContain('UTC')
    expect(text).toContain('M')
    expect(wrapper.findAll('[data-testid="text"]')).toHaveLength(6)
  })
})
