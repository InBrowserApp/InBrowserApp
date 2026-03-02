import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import GeneralInfoHeader from './GeneralInfoHeader.vue'

describe('GeneralInfoHeader', () => {
  it('renders the header and manifest reference link', () => {
    const wrapper = mount(GeneralInfoHeader, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<header class="section-header"><slot /></header>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          NIcon: {
            template: '<span class="icon" />',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('General Info')
    expect(wrapper.text()).toContain('Check out Web app manifests reference for more information.')
    expect(wrapper.find('a').attributes('href')).toContain('developer.mozilla.org')
  })
})
