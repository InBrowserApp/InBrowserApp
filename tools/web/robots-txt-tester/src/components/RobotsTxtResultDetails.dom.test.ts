import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RobotsTxtResultDetails from './RobotsTxtResultDetails.vue'

describe('RobotsTxtResultDetails', () => {
  it('renders candidate rules, warnings, and metadata details', () => {
    const wrapper = mount(RobotsTxtResultDetails, {
      props: {
        result: {
          outcome: 'blocked',
          normalizedPath: '/private/report.html',
          matchedGroups: [],
          candidates: [
            {
              groupId: 'group-1',
              line: 2,
              directive: 'disallow',
              pattern: '/private/',
              matchedLength: 9,
            },
            {
              groupId: 'group-1',
              line: 3,
              directive: 'allow',
              pattern: '',
              matchedLength: 0,
            },
          ],
          winner: {
            groupId: 'group-1',
            line: 2,
            directive: 'disallow',
            pattern: '/private/',
            matchedLength: 9,
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
          {
            directive: 'sitemap',
            line: 5,
            value: 'https://example.com/sitemap.xml',
          },
          {
            directive: 'crawl-delay',
            line: 6,
            value: '5',
            groupId: 'group-1',
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('Disallow: /private/')
    expect(wrapper.text()).toContain('Allow: / | matched length: 0 | line 3')
    expect(wrapper.text()).toContain('line 4: Ignored unsupported directive "noindex" at line 4.')
    expect(wrapper.text()).toContain('crawl-delay: 5 | group group-1')
  })
})
