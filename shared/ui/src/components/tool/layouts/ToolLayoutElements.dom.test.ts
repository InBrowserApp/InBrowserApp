import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ToolTitle from './ToolTitle.vue'
import ToolDescription from './ToolDescription.vue'
import ToolSectionHeader from './ToolSectionHeader.vue'
import ToolSection from './ToolSection.vue'
import ToolConfigHeader from './ToolConfigHeader.vue'

describe('Tool layout text components', () => {
  it('should render ToolTitle slot content', () => {
    const wrapper = mount(ToolTitle, {
      slots: { default: 'Tool Title' },
    })
    expect(wrapper.text()).toContain('Tool Title')
  })

  it('should render ToolDescription slot content', () => {
    const wrapper = mount(ToolDescription, {
      slots: { default: 'Description text' },
    })
    expect(wrapper.text()).toContain('Description text')
  })

  it('should render ToolSectionHeader slot content', () => {
    const wrapper = mount(ToolSectionHeader, {
      slots: { default: 'Section Header' },
    })
    expect(wrapper.text()).toContain('Section Header')
  })

  it('should render ToolSection slot content', () => {
    const wrapper = mount(ToolSection, {
      slots: { default: 'Section body' },
    })
    expect(wrapper.text()).toContain('Section body')
  })

  it('should render ToolConfigHeader localized text', () => {
    const wrapper = mount(ToolConfigHeader)
    expect(wrapper.text()).toContain('Configuration')
  })
})
