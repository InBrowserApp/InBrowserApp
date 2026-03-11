import { mount } from '@vue/test-utils'
import { NSelect, NSwitch } from 'naive-ui'
import { describe, expect, it, vi } from 'vitest'
import DotenvOptionsSection from './DotenvOptionsSection.vue'

describe('DotenvOptionsSection', () => {
  it('renders current option labels and reacts to mask value changes', async () => {
    const onUpdateMode = vi.fn()
    const onUpdateDuplicateStrategy = vi.fn()
    const onUpdateMaskValues = vi.fn()

    const wrapper = mount(DotenvOptionsSection, {
      props: {
        mode: 'strict',
        duplicateStrategy: 'first-wins',
        maskValues: true,
        'onUpdate:mode': onUpdateMode,
        'onUpdate:duplicateStrategy': onUpdateDuplicateStrategy,
        'onUpdate:maskValues': onUpdateMaskValues,
      },
    })

    expect(wrapper.text()).toContain('Strict')
    expect(wrapper.text()).toContain('Masked')

    const selects = wrapper.findAllComponents(NSelect)
    await selects[0]!.vm.$emit('update:value', 'compatible')
    await selects[1]!.vm.$emit('update:value', 'last-wins')
    await wrapper.findComponent(NSwitch).vm.$emit('update:value', false)

    expect(onUpdateMode).toHaveBeenCalledWith('compatible')
    expect(onUpdateDuplicateStrategy).toHaveBeenCalledWith('last-wins')
    expect(onUpdateMaskValues).toHaveBeenCalledWith(false)

    await wrapper.setProps({ maskValues: false })
    expect(wrapper.text()).toContain('Visible')
  })
})
