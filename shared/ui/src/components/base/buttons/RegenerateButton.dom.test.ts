import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RegenerateButton from './RegenerateButton.vue'

describe('RegenerateButton', () => {
  it('should render button with default label', () => {
    const wrapper = mount(RegenerateButton)
    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Regenerate')
  })

  it('should emit click event on click', async () => {
    const wrapper = mount(RegenerateButton)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('should render custom label and icon slots', () => {
    const wrapper = mount(RegenerateButton, {
      slots: {
        label: 'Custom Label',
        icon: '<span class="custom-icon">Icon</span>',
      },
    })
    expect(wrapper.text()).toContain('Custom Label')
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })
})
