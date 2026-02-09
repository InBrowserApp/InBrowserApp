import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DNSRCODEDescription from './DNSRCODEDescription.vue'
import DNSRCODEDescriptionPrimary from './DNSRCODEDescriptionPrimary.vue'
import DNSRCODEDescriptionExtended from './DNSRCODEDescriptionExtended.vue'
import DNSRCODEDescriptionLow from './DNSRCODEDescriptionLow.vue'
import DNSRCODEDescriptionMid from './DNSRCODEDescriptionMid.vue'

describe('DNSRCODEDescription family', () => {
  it('switches between primary and extended descriptions', async () => {
    const wrapper = mount(DNSRCODEDescription, {
      props: { rcode: 16 },
      global: {
        stubs: {
          DNSRCODEDescriptionExtended: {
            template: '<div class="extended" />',
          },
          DNSRCODEDescriptionPrimary: {
            template: '<div class="primary" />',
          },
        },
      },
    })

    expect(wrapper.find('.extended').exists()).toBe(true)
    expect(wrapper.find('.primary').exists()).toBe(false)

    await wrapper.setProps({ rcode: 15 })
    expect(wrapper.find('.extended').exists()).toBe(false)
    expect(wrapper.find('.primary').exists()).toBe(true)
  })

  it('switches between low and mid primary descriptions', async () => {
    const wrapper = mount(DNSRCODEDescriptionPrimary, {
      props: { rcode: 2 },
      global: {
        stubs: {
          DNSRCODEDescriptionLow: {
            template: '<div class="low" />',
          },
          DNSRCODEDescriptionMid: {
            template: '<div class="mid" />',
          },
        },
      },
    })

    expect(wrapper.find('.low').exists()).toBe(true)
    expect(wrapper.find('.mid').exists()).toBe(false)

    await wrapper.setProps({ rcode: 6 })
    expect(wrapper.find('.mid').exists()).toBe(true)
  })

  it('returns known and unknown descriptions for low/mid/extended ranges', () => {
    expect(mount(DNSRCODEDescriptionLow, { props: { rcode: 0 } }).text()).toContain('No Error')
    expect(mount(DNSRCODEDescriptionLow, { props: { rcode: 99 } }).text()).toContain('Unknown')

    expect(mount(DNSRCODEDescriptionMid, { props: { rcode: 7 } }).text()).toContain('RR Set Exists')
    expect(mount(DNSRCODEDescriptionMid, { props: { rcode: 199 } }).text()).toContain('Unknown')

    expect(mount(DNSRCODEDescriptionExtended, { props: { rcode: 16 } }).text()).toContain(
      'Bad OPT Version',
    )
    expect(mount(DNSRCODEDescriptionExtended, { props: { rcode: 999 } }).text()).toContain(
      'Unknown',
    )
  })
})
