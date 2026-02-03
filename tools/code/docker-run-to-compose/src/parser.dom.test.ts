import { describe, expect, it } from 'vitest'
import { parseDockerRunTokens } from './parser'

describe('docker run parser', () => {
  it('skips tokens that do not include docker run', () => {
    const result = parseDockerRunTokens(['echo', 'hello'])

    expect(result.error).toBe('Skipped input that does not include "docker run".')
  })

  it('skips tokens without a run command', () => {
    const result = parseDockerRunTokens(['docker', 'ps'])

    expect(result.error).toBe('Skipped input without a docker run command.')
  })

  it('parses options, image, and command', () => {
    const result = parseDockerRunTokens([
      'docker',
      'run',
      '-p',
      '8080:80',
      '-e',
      'NODE_ENV=production',
      'nginx',
      'bash',
      '-c',
      'echo',
      'hi',
    ])

    expect(result.error).toBeUndefined()
    expect(result.data.image).toBe('nginx')
    expect(result.data.ports).toEqual(['8080:80'])
    expect(result.data.environment).toEqual(['NODE_ENV=production'])
    expect(result.data.command).toEqual(['bash', '-c', 'echo', 'hi'])
  })

  it('supports explicit image separator', () => {
    const result = parseDockerRunTokens(['docker', 'run', '--', 'alpine', 'echo', 'hi'])

    expect(result.error).toBeUndefined()
    expect(result.data.image).toBe('alpine')
    expect(result.data.command).toEqual(['echo', 'hi'])
  })

  it('warns when "--" is missing an image', () => {
    const result = parseDockerRunTokens(['docker', 'run', '--'])

    expect(result.error).toBe('Skipped a docker run command without an image.')
    expect(result.warnings).toContain('Found "--" without an image after it.')
  })
})
