import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseLabel from './BaseLabel.vue'

describe('BaseLabel', () => {
  it('renders translated base labels', async () => {
    const wrapper = mount(BaseLabel, {
      props: { base: 'hex' },
    })

    expect(wrapper.text()).toContain('Hexadecimal')

    await wrapper.setProps({ base: 'decimal' })
    expect(wrapper.text()).toContain('Decimal')
  })
})
