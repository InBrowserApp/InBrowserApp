import { describe, expect, it } from 'vitest'
import { parseRobotsTxt } from './parseRobotsTxt'

describe('parseRobotsTxt', () => {
  it('parses groups, rules, and metadata', () => {
    const parsed = parseRobotsTxt(`User-agent: Googlebot
Disallow: /private/
Allow: /private/public/

User-agent: *
Disallow: /
Sitemap: https://example.com/sitemap.xml
Host: example.com`)

    expect(parsed.groups).toHaveLength(2)
    expect(parsed.groups[0]?.userAgents).toEqual(['Googlebot'])
    expect(parsed.groups[0]?.rules).toEqual([
      expect.objectContaining({ directive: 'disallow', pattern: '/private/' }),
      expect.objectContaining({ directive: 'allow', pattern: '/private/public/' }),
    ])
    expect(parsed.metadata).toEqual([
      expect.objectContaining({ directive: 'sitemap', value: 'https://example.com/sitemap.xml' }),
      expect.objectContaining({ directive: 'host', value: 'example.com' }),
    ])
    expect(parsed.warnings).toEqual([])
  })

  it('keeps consecutive user-agents in a single group and starts a new group after rules', () => {
    const parsed = parseRobotsTxt(`User-agent: Googlebot
User-agent: Googlebot-Image
Disallow: /tmp/
User-agent: *
Allow: /`)

    expect(parsed.groups).toHaveLength(2)
    expect(parsed.groups[0]?.userAgents).toEqual(['Googlebot', 'Googlebot-Image'])
    expect(parsed.groups[1]?.userAgents).toEqual(['*'])
  })

  it('warns for unsupported directives and rules before any user-agent', () => {
    const parsed = parseRobotsTxt(`Not a directive
Disallow: /oops/
Noindex: /hidden/
User-agent:
User-agent: *
Allow: /`)

    expect(parsed.groups).toHaveLength(1)
    expect(parsed.groups[0]?.rules).toEqual([expect.objectContaining({ directive: 'allow' })])
    expect(parsed.warnings).toEqual([
      expect.objectContaining({ code: 'invalid-line', line: 1 }),
      expect.objectContaining({ code: 'rule-before-user-agent', line: 2 }),
      expect.objectContaining({ code: 'unsupported-directive', line: 3 }),
      expect.objectContaining({ code: 'empty-user-agent', line: 4 }),
    ])
  })

  it('strips comments and keeps crawl-delay metadata associated with the current group', () => {
    const parsed = parseRobotsTxt(`User-agent: Googlebot # comment
Crawl-delay: 5`)

    expect(parsed.groups[0]?.userAgents).toEqual(['Googlebot'])
    expect(parsed.metadata).toEqual([
      expect.objectContaining({
        directive: 'crawl-delay',
        value: '5',
        groupId: 'group-1',
      }),
    ])
  })
})
