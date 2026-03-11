import { describe, expect, it } from 'vitest'
import { diagnoseContentSecurityPolicy } from './diagnostics'
import type { CSPPolicy } from './types'

describe('diagnoseContentSecurityPolicy', () => {
  it('flags unsafe and risky source expressions', () => {
    const policy: CSPPolicy = {
      directives: [
        {
          name: 'script-src',
          tokens: [
            { type: 'keyword', value: "'unsafe-inline'" },
            { type: 'scheme', value: 'data:' },
            { type: 'host', value: '*' },
          ],
        },
      ],
    }

    const diagnostics = diagnoseContentSecurityPolicy(policy, {
      delivery: 'header',
      mode: 'enforce',
    })

    expect(diagnostics.map((item) => item.code)).toEqual(
      expect.arrayContaining([
        'directive.unsafe-inline-used',
        'directive.data-scheme-used',
        'directive.wildcard-host-used',
      ]),
    )
  })

  it('flags none mixed with other sources', () => {
    const diagnostics = diagnoseContentSecurityPolicy(
      {
        directives: [
          {
            name: 'img-src',
            tokens: [
              { type: 'keyword', value: "'none'" },
              { type: 'scheme', value: 'https:' },
            ],
          },
        ],
      },
      { delivery: 'header', mode: 'enforce' },
    )

    expect(diagnostics.some((item) => item.code === 'directive.none-with-other-sources')).toBe(true)
  })

  it('reports meta unsupported directives', () => {
    const diagnostics = diagnoseContentSecurityPolicy(
      {
        directives: [{ name: 'frame-ancestors', tokens: [{ type: 'keyword', value: "'none'" }] }],
      },
      { delivery: 'meta', mode: 'enforce' },
    )

    expect(diagnostics.some((item) => item.code === 'directive.meta-unsupported')).toBe(true)
  })

  it('adds general hardening guidance', () => {
    const diagnostics = diagnoseContentSecurityPolicy(
      {
        directives: [{ name: 'default-src', tokens: [{ type: 'keyword', value: "'self'" }] }],
      },
      { delivery: 'header', mode: 'report-only' },
    )

    expect(diagnostics.map((item) => item.code)).toEqual(
      expect.arrayContaining([
        'directive.script-src-missing-while-default-src-present',
        'directive.style-src-missing-while-default-src-present',
        'policy.missing-object-src',
        'policy.missing-base-uri',
        'policy.missing-frame-ancestors',
        'policy.report-only-selected',
      ]),
    )
  })
})
