import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { NSelect } from 'naive-ui'
import CSPPresetsSection from './CSPPresetsSection.vue'

describe('CSPPresetsSection', () => {
  it('emits preset selections', async () => {
    const wrapper = mount(CSPPresetsSection, {
      props: {
        delivery: 'header',
        mode: 'enforce',
      },
    })

    const reportOnlyAuditButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Report-Only Audit'))

    if (!reportOnlyAuditButton) {
      throw new Error('Missing report-only preset button')
    }

    await reportOnlyAuditButton.trigger('click')

    expect(wrapper.emitted('apply-preset')).toEqual([['report-only-audit']])
  })

  it('emits delivery and mode changes', async () => {
    const wrapper = mount(CSPPresetsSection, {
      props: {
        delivery: 'header',
        mode: 'enforce',
      },
    })

    const selects = wrapper.findAllComponents(NSelect)
    await selects[0]?.vm.$emit('update:value', 'meta')
    await selects[1]?.vm.$emit('update:value', 'report-only')

    expect(wrapper.emitted('update:delivery')).toEqual([['meta']])
    expect(wrapper.emitted('update:mode')).toEqual([['report-only']])
  })
})
