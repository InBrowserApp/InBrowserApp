import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IPInfoDataLoadingUnknown from './IPInfoDataLoadingUnknown.vue'

describe('IPInfoDataLoadingUnknown', () => {
  it('renders skeleton when data is undefined', () => {
    const wrapper = mount(IPInfoDataLoadingUnknown, {
      props: { data: undefined },
    })

    expect(wrapper.html()).toContain('n-skeleton')
  })

  it('renders unknown tag when data is null', () => {
    const wrapper = mount(IPInfoDataLoadingUnknown, {
      props: { data: null },
    })

    expect(wrapper.html()).toContain('n-tag')
    expect(wrapper.text()).toContain('Unknown')
  })
})
