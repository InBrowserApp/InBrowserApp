import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RobotsTxtResultSection from './RobotsTxtResultSection.vue'

const result = {
  outcome: 'allowed' as const,
  normalizedPath: '/public/report.html',
  matchedGroups: [
    { id: 'group-1', startLine: 1, matchedUserAgents: ['Googlebot'], userAgents: ['Googlebot'] },
  ],
  candidates: [
    { groupId: 'group-1', line: 2, directive: 'allow' as const, pattern: '/', matchedLength: 1 },
  ],
  winner: {
    groupId: 'group-1',
    line: 2,
    directive: 'allow' as const,
    pattern: '/',
    matchedLength: 1,
  },
}

describe('RobotsTxtResultSection', () => {
  it('renders target validation errors', () => {
    const wrapper = mount(RobotsTxtResultSection, {
      props: {
        pending: false,
        targetError: 'Enter a valid URL or path.',
        result: null,
        warnings: [],
        metadata: [],
      },
    })

    expect(wrapper.text()).toContain('Enter a valid URL or path.')
  })

  it('renders summary and details when a result exists', () => {
    const wrapper = mount(RobotsTxtResultSection, {
      props: {
        pending: false,
        targetError: '',
        result,
        warnings: [
          { code: 'unsupported-directive', line: 4, message: 'Ignored unsupported directive.' },
        ],
        metadata: [{ directive: 'sitemap', line: 5, value: 'https://example.com/sitemap.xml' }],
      },
      global: {
        stubs: {
          CopyToClipboardButton: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Allowed')
    expect(wrapper.text()).toContain('Candidate rules')
    expect(wrapper.text()).toContain('Warnings')
  })
})
