import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TheDeveloperSay from './TheDeveloperSay.vue'

describe('TheDeveloperSay', () => {
  it('renders the section title and description', () => {
    const wrapper = mount(TheDeveloperSay, {
      global: {
        stubs: {
          NH2: { template: '<h2><slot /></h2>' },
          NP: { template: '<p><slot /></p>' },
        },
      },
    })

    expect(wrapper.text()).toContain('The Developer Says')
    expect(wrapper.text()).toContain("I've always wanted simple")
  })
})
