import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RobotsTxtResultDetails from './RobotsTxtResultDetails.vue'
import RobotsTxtResultSection from './RobotsTxtResultSection.vue'
import RobotsTxtResultSummary from './RobotsTxtResultSummary.vue'
import type { MatchResult } from '../utils/types'

const copyButtonStub = {
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  template: '<div data-test-id="copied">{{ content }}</div>',
}

const matchedResult: MatchResult = {
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
    { groupId: 'group-1', line: 2, directive: 'disallow', pattern: '/private/', matchedLength: 9 },
  ],
  winner: {
    groupId: 'group-1',
    line: 2,
    directive: 'disallow',
    pattern: '/private/',
    matchedLength: 9,
  },
}

describe('RobotsTxtResultSection', () => {
  it('renders the target validation error state', () => {
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
})

describe('RobotsTxtResultSummary', () => {
  it('renders fallback text when no groups or rules matched', () => {
    const wrapper = mount(RobotsTxtResultSummary, {
      props: {
        result: {
          outcome: 'allowed-by-default',
          normalizedPath: '/public/index.html',
          matchedGroups: [],
          candidates: [],
          winner: null,
        } satisfies MatchResult,
      },
      global: {
        stubs: {
          CopyToClipboardButton: copyButtonStub,
        },
      },
    })

    expect(wrapper.text()).toContain('No matching group')
    expect(wrapper.text()).toContain('No matching rule')
    expect(wrapper.text()).toContain('allowed by default')
  })

  it('renders allow winners and exposes the copied summary text', () => {
    const wrapper = mount(RobotsTxtResultSummary, {
      props: {
        result: {
          outcome: 'allowed',
          normalizedPath: '/private/public/report.html',
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
              line: 3,
              directive: 'allow',
              pattern: '/private/public/',
              matchedLength: 16,
            },
          ],
          winner: {
            groupId: 'group-1',
            line: 3,
            directive: 'allow',
            pattern: '/private/public/',
            matchedLength: 16,
          },
        } satisfies MatchResult,
      },
      global: {
        stubs: {
          CopyToClipboardButton: copyButtonStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Allow: /private/public/ (line 3)')
    expect(wrapper.text()).toContain('Status: Allowed')
    expect(wrapper.text()).toContain('Winner: ALLOW: /private/public/ (line 3)')
  })
})

describe('RobotsTxtResultDetails', () => {
  it('renders candidates, warnings, and metadata details', () => {
    const wrapper = mount(RobotsTxtResultDetails, {
      props: {
        result: {
          ...matchedResult,
          candidates: [
            {
              groupId: 'group-1',
              line: 2,
              directive: 'allow',
              pattern: '/private/public/',
              matchedLength: 16,
            },
          ],
          winner: {
            groupId: 'group-1',
            line: 2,
            directive: 'allow',
            pattern: '/private/public/',
            matchedLength: 16,
          },
        },
        warnings: [
          {
            code: 'unsupported-directive',
            line: 4,
            message: 'Ignored unsupported directive "noindex" at line 4.',
          },
        ],
        metadata: [
          { directive: 'sitemap', line: 5, value: 'https://example.com/sitemap.xml' },
          { directive: 'crawl-delay', line: 6, value: '5', groupId: 'group-1' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Candidate rules')
    expect(wrapper.text()).toContain('Ignored unsupported directive "noindex" at line 4.')
    expect(wrapper.text()).toContain('https://example.com/sitemap.xml')
    expect(wrapper.text()).toContain('group-1')
  })
})
