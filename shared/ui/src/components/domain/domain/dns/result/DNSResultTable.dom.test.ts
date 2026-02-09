import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DNSResultTable from './DNSResultTable.vue'

describe('DNSResultTable', () => {
  it('renders mapped DNS answer rows and unknown record types', async () => {
    const wrapper = mount(DNSResultTable, {
      props: {
        result: {
          Status: 0,
          TC: false,
          RD: true,
          RA: true,
          AD: false,
          CD: false,
          Question: [{ name: 'example.com', type: 1 }],
          Answer: [
            { name: 'example.com', type: 1, TTL: 300, data: '1.1.1.1' },
            { name: 'alias.example.com', type: 999, TTL: 600, data: 'target.example.com' },
          ],
        },
      },
    })

    await Promise.resolve()

    const text = wrapper.text()
    expect(text).toContain('example.com')
    expect(text).toContain('alias.example.com')
    expect(text).toContain('A')
    expect(text).toContain('Unknown')
    expect(text).toContain('target.example.com')
  })

  it('shows empty state when no answers are available', async () => {
    const wrapper = mount(DNSResultTable, {
      props: {
        result: {
          Status: 0,
          TC: false,
          RD: true,
          RA: true,
          AD: false,
          CD: false,
          Question: [{ name: 'example.com', type: 1 }],
        },
      },
    })

    await Promise.resolve()

    expect(wrapper.text()).toContain('No Data')
  })
})
