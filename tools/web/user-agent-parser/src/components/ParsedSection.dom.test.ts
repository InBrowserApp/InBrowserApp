import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ParsedSection from './ParsedSection.vue'

describe('ParsedSection', () => {
  it('renders the title and items', () => {
    const wrapper = mount(ParsedSection, {
      props: {
        title: 'Browser',
        items: [
          { label: 'Name', value: 'Chrome' },
          { label: 'Version', value: '115.0.0.0' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Browser')
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Chrome')
    expect(wrapper.text()).toContain('Version')
    expect(wrapper.text()).toContain('115.0.0.0')
  })
})
