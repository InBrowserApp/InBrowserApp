import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordStrengthCheckerView from './PasswordStrengthCheckerView.vue'
import PasswordStrengthChecker from './components/PasswordStrengthChecker.vue'
import WhatIsPasswordStrength from './components/WhatIsPasswordStrength.vue'

describe('PasswordStrengthCheckerView', () => {
  it('renders the checker and explanation components', () => {
    const wrapper = mount(PasswordStrengthCheckerView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div><slot /></div>',
          },
        },
      },
    })

    expect(wrapper.findComponent(PasswordStrengthChecker).exists()).toBe(true)
    expect(wrapper.findComponent(WhatIsPasswordStrength).exists()).toBe(true)
  })
})
