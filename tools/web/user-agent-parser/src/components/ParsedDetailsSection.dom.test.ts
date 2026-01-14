import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ParsedDetailsSection from './ParsedDetailsSection.vue'

describe('ParsedDetailsSection', () => {
  it('renders the empty state when there is no output', () => {
    const wrapper = mount(ParsedDetailsSection, {
      props: {
        title: 'Parsed Details',
        emptyState: 'No data',
        hasOutput: false,
        sections: [],
      },
    })

    expect(wrapper.text()).toContain('Parsed Details')
    expect(wrapper.text()).toContain('No data')
  })

  it('renders parsed sections when output is available', () => {
    const wrapper = mount(ParsedDetailsSection, {
      props: {
        title: 'Parsed Details',
        emptyState: 'No data',
        hasOutput: true,
        sections: [
          {
            title: 'Browser',
            items: [
              { label: 'Name', value: 'Chrome' },
              { label: 'Version', value: '115.0.0.0' },
            ],
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('Browser')
    expect(wrapper.text()).toContain('Chrome')
    expect(wrapper.text()).toContain('Version')
  })
})
