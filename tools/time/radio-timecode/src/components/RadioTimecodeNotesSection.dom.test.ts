import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div><slot /></div>',
    }),
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
    expect(text).toContain('audioWarning')
    expect(text).toContain('localTimeNote')
    expect(text).toContain('harmonicNote')
    expect(text).toContain('callSignNote')
    expect(wrapper.findAll('[data-testid="text"]')).toHaveLength(4)
  })
})
