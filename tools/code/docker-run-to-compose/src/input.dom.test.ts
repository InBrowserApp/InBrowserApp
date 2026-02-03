import { describe, expect, it } from 'vitest'
import { splitCommands, splitInputIntoBlocks, tokenize } from './input'

describe('docker run input helpers', () => {
  it('splits input into blocks and ignores comments', () => {
    const input = `# comment\r\n\n  docker run alpine \\\n      echo hi\n\n  # another\n\n  docker run nginx:latest  `

    const blocks = splitInputIntoBlocks(input)

    expect(blocks).toEqual(['docker run alpine echo hi', 'docker run nginx:latest'])
  })

  it('tokenizes quotes and shell operators', () => {
    const result = tokenize('docker run "nginx:latest" echo \'hello world\' && echo done')

    expect(result.error).toBeUndefined()
    const values = result.tokens.map((token) => `${token.type}:${token.value}`)
    expect(values).toEqual([
      'word:docker',
      'word:run',
      'word:nginx:latest',
      'word:echo',
      'word:hello world',
      'op:&&',
      'word:echo',
      'word:done',
    ])

    const { commands, operators } = splitCommands(result.tokens)
    expect(operators).toEqual(['&&'])
    expect(commands).toEqual([
      ['docker', 'run', 'nginx:latest', 'echo', 'hello world'],
      ['echo', 'done'],
    ])
  })

  it('returns an error for unclosed quotes', () => {
    const result = tokenize('docker run "nginx')

    expect(result.error).toBe('Unclosed quote detected in docker run input.')
  })
})
