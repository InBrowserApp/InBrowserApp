import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RobotsTxtResultSummary from './RobotsTxtResultSummary.vue'

describe('RobotsTxtResultSummary', () => {
  it('renders the default-allow state without matched groups or a winning rule', () => {
    const wrapper = mount(RobotsTxtResultSummary, {
      props: {
        result: {
          outcome: 'allowed-by-default',
          normalizedPath: '/public/report.html',
          matchedGroups: [],
          candidates: [],
          winner: null,
        },
      },
      global: {
        stubs: {
          CopyToClipboardButton: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Allowed by default')
    expect(wrapper.text()).toContain('No matching group')
    expect(wrapper.text()).toContain('No matching rule')
  })

  it('renders the winning disallow rule details', () => {
    const wrapper = mount(RobotsTxtResultSummary, {
      props: {
        result: {
          outcome: 'blocked',
          normalizedPath: '/private/report.html',
          matchedGroups: [
            {
              id: 'group-1',
              startLine: 1,
              matchedUserAgents: ['Googlebot'],
              userAgents: ['Googlebot'],
            },
          ],
          candidates: [
            {
              groupId: 'group-1',
              line: 2,
              directive: 'disallow',
              pattern: '',
              matchedLength: 0,
            },
          ],
          winner: {
            groupId: 'group-1',
            line: 2,
            directive: 'disallow',
            pattern: '',
            matchedLength: 0,
          },
        },
      },
      global: {
        stubs: {
          CopyToClipboardButton: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Disallow: / (line 2)')
    expect(wrapper.text()).toContain('blocked for the selected crawler')
  })
})
