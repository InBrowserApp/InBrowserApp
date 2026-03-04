import { describe, expect, it, vi } from 'vitest'
import { diffJsonValues, parseJsonWithError, toJsonPatch, type JsonDiffEntry } from './jsonDiff'

describe('jsonDiff utilities', () => {
  it('parses valid JSON and returns data', () => {
    const parsed = parseJsonWithError('{"name":"demo"}')

    expect(parsed.error).toBeUndefined()
    expect(parsed.value).toEqual({ name: 'demo' })
  })

  it('returns an empty result for blank input', () => {
    const parsed = parseJsonWithError('  ')

    expect(parsed).toEqual({})
  })

  it('extracts line and column when parse errors include a position', () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, 'parse')
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === '__position__') {
          throw new SyntaxError('Unexpected token at position 8')
        }

        return originalParse(...args)
      })

    const parsed = parseJsonWithError('__position__')

    expect(parsed.error?.message).toContain('position 8')
    expect(parsed.error?.line).toBe(1)
    expect(parsed.error?.column).toBe(9)

    parseSpy.mockRestore()
  })

  it('handles non-Error parse exceptions', () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, 'parse')
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === '__boom__') {
          throw 'boom'
        }

        return originalParse(...args)
      })

    const parsed = parseJsonWithError('__boom__')

    expect(parsed.error).toEqual({ message: 'boom' })

    parseSpy.mockRestore()
  })

  it('calculates line and column with newline-aware positions', () => {
    const input = 'x\ny'
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, 'parse')
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === input) {
          throw new SyntaxError('Unexpected token at position 2')
        }

        return originalParse(...args)
      })

    const parsed = parseJsonWithError(input)
    expect(parsed.error?.line).toBe(2)
    expect(parsed.error?.column).toBe(1)

    parseSpy.mockRestore()
  })

  it('creates add/remove/replace path entries for nested objects and arrays', () => {
    const original = {
      user: { name: 'Alice', age: 20, 'a/b': 1, 't~s': 2 },
      tags: ['a', 'b'],
    }
    const modified = {
      user: { name: 'Alice Chen', 'a/b': 1, 't~s': 3, 'a.b': 9 },
      tags: ['a'],
      active: true,
    }

    const diffs = diffJsonValues(original, modified)

    expect(diffs).toEqual(
      expect.arrayContaining<JsonDiffEntry>([
        expect.objectContaining({ op: 'add', jsonPath: '$.active', jsonPointer: '/active' }),
        expect.objectContaining({ op: 'remove', jsonPath: '$.tags[1]', jsonPointer: '/tags/1' }),
        expect.objectContaining({
          op: 'replace',
          jsonPath: '$.user.name',
          jsonPointer: '/user/name',
        }),
        expect.objectContaining({ op: 'remove', jsonPath: '$.user.age', jsonPointer: '/user/age' }),
        expect.objectContaining({ op: 'add', jsonPath: '$.user["a.b"]', jsonPointer: '/user/a.b' }),
        expect.objectContaining({
          op: 'replace',
          jsonPath: '$.user["t~s"]',
          jsonPointer: '/user/t~0s',
        }),
      ]),
    )
  })

  it('replaces the root when primitive values differ', () => {
    const diffs = diffJsonValues(1, 2)

    expect(diffs).toEqual([
      {
        op: 'replace',
        jsonPath: '$',
        jsonPointer: '',
        oldValue: 1,
        newValue: 2,
      },
    ])
  })

  it('converts diff entries to RFC 6902 patch operations', () => {
    const patch = toJsonPatch([
      {
        op: 'add',
        jsonPath: '$.a',
        jsonPointer: '/a',
        newValue: 1,
      },
      {
        op: 'remove',
        jsonPath: '$.b',
        jsonPointer: '/b',
        oldValue: 1,
      },
      {
        op: 'replace',
        jsonPath: '$.c',
        jsonPointer: '/c',
        oldValue: 1,
        newValue: 2,
      },
    ])

    expect(patch).toEqual([
      { op: 'add', path: '/a', value: 1 },
      { op: 'remove', path: '/b' },
      { op: 'replace', path: '/c', value: 2 },
    ])
  })

  it('orders array removals from highest to lowest index to keep patch applicable', () => {
    const patch = toJsonPatch(diffJsonValues([1, 2, 3], []))

    expect(patch).toEqual([
      { op: 'remove', path: '/2' },
      { op: 'remove', path: '/1' },
      { op: 'remove', path: '/0' },
    ])
  })

  it('keeps replace operations while reordering following array removals', () => {
    const patch = toJsonPatch(diffJsonValues([1, 2, 3], [4]))

    expect(patch).toEqual([
      { op: 'replace', path: '/0', value: 4 },
      { op: 'remove', path: '/2' },
      { op: 'remove', path: '/1' },
    ])
  })
})
