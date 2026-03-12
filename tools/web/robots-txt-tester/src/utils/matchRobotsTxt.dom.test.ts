import { describe, expect, it } from 'vitest'
import { matchRobotsTxt, normalizeRobotsTarget } from './matchRobotsTxt'
import { parseRobotsTxt } from './parseRobotsTxt'

describe('normalizeRobotsTarget', () => {
  it('normalizes absolute urls and relative paths', () => {
    expect(normalizeRobotsTarget('https://example.com/private/index.html?x=1')).toEqual({
      ok: true,
      normalizedPath: '/private/index.html?x=1',
    })
    expect(normalizeRobotsTarget('private/index.html')).toEqual({
      ok: true,
      normalizedPath: '/private/index.html',
    })
  })

  it('returns an error for empty input', () => {
    expect(normalizeRobotsTarget('   ')).toEqual({
      ok: false,
      message: 'Enter a URL or path.',
    })
  })

  it('returns an error for invalid absolute urls', () => {
    expect(normalizeRobotsTarget('https://exa mple.com')).toEqual({
      ok: false,
      message: 'Enter a valid URL or path.',
    })
  })
})

describe('matchRobotsTxt', () => {
  it('prefers the most specific matching user-agent groups', () => {
    const parsed = parseRobotsTxt(`User-agent: *
Disallow: /

User-agent: Googlebot
Allow: /`)

    const result = matchRobotsTxt(parsed, 'Googlebot', '/anything')

    expect(result.outcome).toBe('allowed')
    expect(result.matchedGroups).toHaveLength(1)
    expect(result.matchedGroups[0]?.userAgents).toEqual(['Googlebot'])
  })

  it('merges groups with the same matching user-agent and picks the longest rule', () => {
    const parsed = parseRobotsTxt(`User-agent: Googlebot
Disallow: /private/

User-agent: *
Disallow: /

User-agent: Googlebot
Allow: /private/public/`)

    const result = matchRobotsTxt(parsed, 'Googlebot', '/private/public/report.html')

    expect(result.outcome).toBe('allowed')
    expect(result.matchedGroups).toHaveLength(2)
    expect(result.winner).toEqual(
      expect.objectContaining({
        directive: 'allow',
        pattern: '/private/public/',
      }),
    )
  })

  it('lets allow win when two matching rules have the same specificity', () => {
    const parsed = parseRobotsTxt(`User-agent: *
Disallow: /folder
Allow: /folder`)

    const result = matchRobotsTxt(parsed, 'Googlebot', '/folder/file.txt')

    expect(result.outcome).toBe('allowed')
    expect(result.winner).toEqual(expect.objectContaining({ directive: 'allow' }))
  })

  it('supports wildcards and end anchors', () => {
    const parsed = parseRobotsTxt(`User-agent: *
Disallow: /*.pdf$
Allow: /public/*.pdf$`)

    expect(matchRobotsTxt(parsed, 'Googlebot', '/docs/file.pdf').outcome).toBe('blocked')
    expect(matchRobotsTxt(parsed, 'Googlebot', '/public/file.pdf').outcome).toBe('allowed')
    expect(matchRobotsTxt(parsed, 'Googlebot', '/docs/file.pdfx').outcome).toBe(
      'allowed-by-default',
    )
  })

  it('allows by default when no rule matches', () => {
    const parsed = parseRobotsTxt(`User-agent: *
Disallow: /private/`)

    const result = matchRobotsTxt(parsed, 'Googlebot', '/public/')

    expect(result.outcome).toBe('allowed-by-default')
    expect(result.winner).toBeNull()
  })

  it('uses the earliest line when candidates have the same specificity and directive', () => {
    const parsed = parseRobotsTxt(`User-agent: *
Disallow: /private/
Disallow: /private/`)

    const result = matchRobotsTxt(parsed, 'Googlebot', '/private/report.html')

    expect(result.outcome).toBe('blocked')
    expect(result.winner).toEqual(expect.objectContaining({ line: 2, pattern: '/private/' }))
  })

  it('treats an empty rule as a catch-all match', () => {
    const parsed = parseRobotsTxt(`User-agent: *
Disallow:`)

    const result = matchRobotsTxt(parsed, 'Googlebot', '/anything')

    expect(result.outcome).toBe('blocked')
    expect(result.winner).toEqual(expect.objectContaining({ pattern: '', matchedLength: 0 }))
  })

  it('ignores empty user-agent entries in matched groups', () => {
    const result = matchRobotsTxt(
      {
        groups: [
          {
            id: 'group-1',
            startLine: 1,
            userAgents: ['   '],
            rules: [{ id: 'group-1-rule-1', line: 2, directive: 'disallow', pattern: '/' }],
          },
          {
            id: 'group-2',
            startLine: 4,
            userAgents: ['*'],
            rules: [{ id: 'group-2-rule-1', line: 5, directive: 'allow', pattern: '/' }],
          },
        ],
        metadata: [],
        warnings: [],
      },
      'Googlebot/2.1',
      '/',
    )

    expect(result.outcome).toBe('allowed')
    expect(result.matchedGroups).toEqual([
      expect.objectContaining({ id: 'group-2', matchedUserAgents: ['*'] }),
    ])
  })

  it('leaves non-matching user-agent groups out of the result', () => {
    const parsed = parseRobotsTxt(`User-agent: Bingbot
Disallow: /

User-agent: *
Allow: /public/`)

    const result = matchRobotsTxt(parsed, 'Googlebot', '/private/')

    expect(result.outcome).toBe('allowed-by-default')
    expect(result.matchedGroups).toEqual([
      expect.objectContaining({ id: 'group-2', matchedUserAgents: ['*'] }),
    ])
    expect(result.candidates).toEqual([])
  })

  it('uses wildcard groups when the input user-agent is empty', () => {
    const parsed = parseRobotsTxt(`User-agent: *
Disallow: /private/`)

    expect(matchRobotsTxt(parsed, '   ', '/private/report.html').outcome).toBe('blocked')
  })
})
