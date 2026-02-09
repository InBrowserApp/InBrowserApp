import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DNSResultMetadata from './DNSResultMetadata.vue'

describe('DNSResultMetadata', () => {
  it('shows DNS status and flag tags', () => {
    const wrapper = mount(DNSResultMetadata, {
      props: {
        result: {
          Status: 0,
          TC: true,
          RD: false,
          RA: true,
          AD: false,
          CD: true,
          Question: [{ name: 'example.com', type: 1 }],
        },
      },
    })

    const text = wrapper.text()
    expect(text).toContain('NoError')
    expect(text).toContain('TC')
    expect(text).toContain('RD')
    expect(text).toContain('RA')
    expect(text).toContain('AD')
    expect(text).toContain('CD')
  })

  it('falls back to unknown status labels', () => {
    const wrapper = mount(DNSResultMetadata, {
      props: {
        result: {
          Status: 999,
          TC: false,
          RD: false,
          RA: false,
          AD: false,
          CD: false,
          Question: [],
        },
      },
    })

    expect(wrapper.text()).toContain('Unknown')
  })
})
