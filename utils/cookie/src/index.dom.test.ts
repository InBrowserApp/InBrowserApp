import { describe, expect, it } from 'vitest'
import { parseCookieHeader, parseSetCookieHeaders } from './index'

describe('parseCookieHeader', () => {
  it('parses cookie header values and quoted values', () => {
    const result = parseCookieHeader('Cookie: session=abc123; theme=light; pref="a=b"; empty=')

    expect(result.type).toBe('cookie')
    expect(result.cookies).toEqual([
      { name: 'session', value: 'abc123' },
      { name: 'theme', value: 'light' },
      { name: 'pref', value: 'a=b' },
      { name: 'empty', value: '' },
    ])
    expect(result.invalid).toEqual([])
  })

  it('parses cookies across lines without header prefixes and collects invalid segments', () => {
    const result = parseCookieHeader('token; a=1\nb=2; =bad')

    expect(result.cookies).toEqual([
      { name: 'a', value: '1' },
      { name: 'b', value: '2' },
    ])
    expect(result.invalid).toEqual(['token', '=bad'])
  })

  it('ignores non-cookie header lines when Cookie prefixes exist', () => {
    const result = parseCookieHeader('Accept-Language: en;q=0.5\nCookie: a=1; b=2')

    expect(result.cookies).toEqual([
      { name: 'a', value: '1' },
      { name: 'b', value: '2' },
    ])
    expect(result.invalid).toEqual([])
  })

  it('skips empty cookie headers and segments', () => {
    const result = parseCookieHeader('Cookie:\nCookie: a=1;; b=2; ')

    expect(result.cookies).toEqual([
      { name: 'a', value: '1' },
      { name: 'b', value: '2' },
    ])
    expect(result.invalid).toEqual([])
  })

  it('returns empty results for empty input', () => {
    const result = parseCookieHeader('')

    expect(result.cookies).toEqual([])
    expect(result.invalid).toEqual([])
  })
})

describe('parseSetCookieHeaders', () => {
  it('parses set-cookie attributes and normalizes keys', () => {
    const result = parseSetCookieHeaders(
      'Set-Cookie: id=1; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=Wed, 21 Oct 2015 07:28:00 GMT',
    )

    expect(result.type).toBe('set-cookie')
    expect(result.cookies).toEqual([
      {
        name: 'id',
        value: '1',
        attributes: {
          path: '/',
          httponly: true,
          secure: true,
          samesite: 'Lax',
          expires: 'Wed, 21 Oct 2015 07:28:00 GMT',
        },
      },
    ])
    expect(result.invalid).toEqual([])
  })

  it('parses multiple set-cookie headers and ignores other lines when prefixed', () => {
    const result = parseSetCookieHeaders(
      'Host: example.com\nSet-Cookie: a=1; Secure\nSet-Cookie: b=2; Max-Age=3600',
    )

    expect(result.cookies).toEqual([
      { name: 'a', value: '1', attributes: { secure: true } },
      { name: 'b', value: '2', attributes: { 'max-age': '3600' } },
    ])
  })

  it('parses set-cookie headers without prefix', () => {
    const result = parseSetCookieHeaders('theme=light; Max-Age=3600')

    expect(result.cookies).toEqual([
      { name: 'theme', value: 'light', attributes: { 'max-age': '3600' } },
    ])
  })

  it('skips empty set-cookie values and attributes', () => {
    const result = parseSetCookieHeaders('Set-Cookie: ; Path=/\nSet-Cookie: a=1;; Secure')

    expect(result.cookies).toEqual([{ name: 'a', value: '1', attributes: { secure: true } }])
    expect(result.invalid).toEqual([])
  })

  it('collects invalid set-cookie entries and attribute errors', () => {
    const result = parseSetCookieHeaders('Set-Cookie: token\nSet-Cookie: a=1; =oops\nSet-Cookie:')

    expect(result.cookies).toEqual([{ name: 'a', value: '1', attributes: {} }])
    expect(result.invalid).toEqual(['token', '=oops'])
  })

  it('returns empty results for empty input', () => {
    const result = parseSetCookieHeaders('')

    expect(result.cookies).toEqual([])
    expect(result.invalid).toEqual([])
  })
})
