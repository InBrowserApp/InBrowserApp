import { describe, expect, it } from 'vitest'
import { splitCommands, splitInputIntoBlocks, tokenize } from './input'

describe('docker run input helpers', () => {
  it('splits input into blocks and ignores comments', () => {
    const input = `# comment\r\n\n  docker run alpine \\\n      echo hi\n\n  # another\n\n  docker run nginx:latest  `

    const blocks = splitInputIntoBlocks(input)

    expect(blocks).toEqual(['docker run alpine echo hi', 'docker run nginx:latest'])
  })

  it('returns no blocks when input only has comments and whitespace', () => {
    const blocks = splitInputIntoBlocks('\n  # one\n\n# two\n')

    expect(blocks).toEqual([])
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

  it('supports escaped characters and trailing backslashes', () => {
    const escaped = tokenize('docker run hello\\ world')
    expect(escaped.tokens.map((token) => token.value)).toEqual(['docker', 'run', 'hello world'])

    const trailing = tokenize('docker run foo\\\\')
    expect(trailing.tokens.map((token) => token.value)).toEqual(['docker', 'run', 'foo\\'])
  })

  it('keeps a dangling escape character as a literal backslash', () => {
    const result = tokenize('docker run hello ' + '\\')

    expect(result.error).toBeUndefined()
    expect(result.tokens.map((token) => token.value)).toEqual(['docker', 'run', 'hello', '\\'])
  })

  it('handles standalone and trailing shell operators', () => {
    const result = splitCommands([
      { type: 'op', value: '&&' },
      { type: 'word', value: 'docker' },
      { type: 'word', value: 'run' },
      { type: 'word', value: 'alpine' },
      { type: 'op', value: ';' },
    ])

    expect(result.operators).toEqual(['&&', ';'])
    expect(result.commands).toEqual([['docker', 'run', 'alpine']])
  })

  it('returns an error for unclosed quotes', () => {
    const result = tokenize('docker run "nginx')

    expect(result.error).toBe('Unclosed quote detected in docker run input.')
  })
})
