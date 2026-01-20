import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { createI18n } from 'vue-i18n'
import { NMessageProvider } from 'naive-ui'
import { TextOrFileInput } from '@shared/ui/base'
import SshPublicKeyFingerprint from './SshPublicKeyFingerprint.vue'
import SshPublicKeyFingerprintView from '../SshPublicKeyFingerprintView.vue'
import { parseSshPublicKeys } from '../ssh-public-key-fingerprint'
import * as toolInfo from '../info'
import * as toolIndex from '../index'
import { routes } from '../routes'

const encoder = new TextEncoder()
const BufferRef = Buffer

function encodeString(value: string | Uint8Array): Uint8Array {
  const data = typeof value === 'string' ? encoder.encode(value) : value
  const result = new Uint8Array(4 + data.length)
  const view = new DataView(result.buffer)
  view.setUint32(0, data.length, false)
  result.set(data, 4)
  return result
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

function encodeMpint(bytes: Uint8Array): Uint8Array {
  let start = 0
  while (start < bytes.length - 1 && bytes[start] === 0) {
    start += 1
  }
  let trimmed = bytes.slice(start)
  if (trimmed[0]! & 0x80) {
    const padded = new Uint8Array(trimmed.length + 1)
    padded[0] = 0
    padded.set(trimmed, 1)
    trimmed = padded
  }
  return encodeString(trimmed)
}

function buildKeyBlob(keyType: string, fields: Uint8Array[]): Uint8Array {
  return concatBytes(encodeString(keyType), ...fields)
}

function toBase64(bytes: Uint8Array): string {
  return BufferRef.from(bytes).toString('base64')
}

function buildOpenSshLine(keyType: string, fields: Uint8Array[], comment?: string): string {
  const blob = buildKeyBlob(keyType, fields)
  const base64 = toBase64(blob)
  return `${keyType} ${base64}${comment ? ` ${comment}` : ''}`
}

function buildRawLine(keyType: string, blob: Uint8Array, comment?: string): string {
  const base64 = toBase64(blob)
  return `${keyType} ${base64}${comment ? ` ${comment}` : ''}`
}

const ed25519PublicKey = new Uint8Array(32).fill(1)
const rsaExponent = new Uint8Array([0x01, 0x00, 0x01])
const rsaModulus = new Uint8Array(32).fill(0x80)
const dsaP = new Uint8Array(16).fill(0x80)
const dsaQ = new Uint8Array(2).fill(0x11)
const dsaG = new Uint8Array(16).fill(0x22)
const dsaY = new Uint8Array(16).fill(0x33)
const ecdsaPoint = new Uint8Array(65).fill(0x04)
const skApplication = encoder.encode('ssh:application')

const ed25519Line = buildOpenSshLine('ssh-ed25519', [encodeString(ed25519PublicKey)], 'user@host')
const rsaLine = buildOpenSshLine(
  'ssh-rsa',
  [encodeMpint(rsaExponent), encodeMpint(rsaModulus)],
  'user@host',
)
const dsaLine = buildOpenSshLine(
  'ssh-dss',
  [encodeMpint(dsaP), encodeMpint(dsaQ), encodeMpint(dsaG), encodeMpint(dsaY)],
  'user@host',
)
const ecdsaLine = buildOpenSshLine(
  'ecdsa-sha2-nistp256',
  [encodeString('nistp256'), encodeString(ecdsaPoint)],
  'user@host',
)
const skEcdsaLine = buildOpenSshLine(
  'sk-ecdsa-sha2-nistp256@openssh.com',
  [encodeString('nistp256'), encodeString(ecdsaPoint), encodeString(skApplication)],
  'user@host',
)
const skEd25519Line = buildOpenSshLine(
  'sk-ssh-ed25519@openssh.com',
  [encodeString(ed25519PublicKey), encodeString(skApplication)],
  'user@host',
)
const emptyKeyTypeBlob = concatBytes(encodeString(''), new Uint8Array(8).fill(7))
const emptyKeyTypeLine = buildRawLine('ssh-ed25519', emptyKeyTypeBlob)
const emptyKeyTypeRfcBlock = `---- BEGIN SSH2 PUBLIC KEY ----
${toBase64(emptyKeyTypeBlob)}
---- END SSH2 PUBLIC KEY ----`
const unknownKeyLine = buildOpenSshLine(
  'ssh-unknown',
  [encodeString(ed25519PublicKey)],
  'mystery@host',
)
const rsaZeroModulusLine = buildOpenSshLine(
  'ssh-rsa',
  [encodeMpint(rsaExponent), encodeMpint(new Uint8Array([0]))],
  'zero@host',
)

const rfcBlock = `---- BEGIN SSH2 PUBLIC KEY ----
Subject: example
Comment: "rfc@example.com"
${toBase64(buildKeyBlob('ssh-ed25519', [encodeString(ed25519PublicKey)]))}
---- END SSH2 PUBLIC KEY ----`

const rfcBlockNoQuotes = `---- BEGIN SSH2 PUBLIC KEY ----
Comment: no-quotes@example.com
${toBase64(buildKeyBlob('ssh-ed25519', [encodeString(ed25519PublicKey)]))}
---- END SSH2 PUBLIC KEY ----`

const rfcBlankLineBlock = `---- BEGIN SSH2 PUBLIC KEY ----
Comment: 'blank@example.com'

${toBase64(buildKeyBlob('ssh-ed25519', [encodeString(ed25519PublicKey)]))}
---- END SSH2 PUBLIC KEY ----`

const rfcEmptyBlock = `---- BEGIN SSH2 PUBLIC KEY ----
Comment: 'empty@example.com'
---- END SSH2 PUBLIC KEY ----`

const rfcShortBlock = `---- BEGIN SSH2 PUBLIC KEY ----
${toBase64(new Uint8Array([1, 2, 3]))}
---- END SSH2 PUBLIC KEY ----`

const rfcInvalidLengthBlock = `---- BEGIN SSH2 PUBLIC KEY ----
${toBase64(new Uint8Array([0, 0, 0, 10, 1]))}
---- END SSH2 PUBLIC KEY ----`

const messages = {
  en: {
    inputTitle: 'SSH Public Key',
    inputPlaceholder: 'Paste an SSH public key or authorized_keys content...',
    inputHint:
      'Supports OpenSSH public keys, authorized_keys options, and SSH2 public key blocks (RFC4716).',
    resultsTitle: 'Fingerprints',
    resultsEmpty: 'Paste a public key to see fingerprints.',
    errorTitle: 'Parsing Error',
    errorNoKeys: 'No valid SSH public keys found.',
    keyLabel: 'Key {index}',
    keyType: 'Key Type',
    keySize: 'Key Size',
    curve: 'Curve',
    comment: 'Comment',
    fingerprintSha256: 'SHA-256',
    fingerprintMd5: 'MD5',
    bits: 'bits',
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages,
  missingWarn: false,
  fallbackWarn: false,
})

const TestWrapper = {
  render() {
    return h(NMessageProvider, () => h(SshPublicKeyFingerprint))
  },
}

describe('ssh-public-key-fingerprint tool metadata', () => {
  it('exports tool info and routes', async () => {
    expect(toolInfo.toolID).toBe('ssh-public-key-fingerprint')
    expect(toolIndex.toolInfo.toolID).toBe('ssh-public-key-fingerprint')
    const route = routes[0]
    expect(route?.path).toBe('/tools/ssh-public-key-fingerprint')
    const component = route?.component
    if (!component) throw new Error('Missing route component')
    if (typeof component !== 'function') throw new Error('Expected lazy route component')

    const routeModule = await (component as () => Promise<unknown>)()
    expect(routeModule).toBeTruthy()
  })

  it('renders the view layout', () => {
    const wrapper = mount(SshPublicKeyFingerprintView, {
      global: {
        plugins: [i18n],
        stubs: {
          ToolDefaultPageLayout: {
            props: ['info'],
            template: '<div><slot /></div>',
          },
          SshPublicKeyFingerprint: {
            template: '<div data-test="fingerprint" />',
          },
        },
      },
    })

    expect(wrapper.find('[data-test="fingerprint"]').exists()).toBe(true)
  })
})

describe('parseSshPublicKeys', () => {
  it('parses multiple key types and computes sizes', async () => {
    const input = [ed25519Line, rsaLine, dsaLine, ecdsaLine, skEcdsaLine, skEd25519Line].join('\n')
    const entries = await parseSshPublicKeys(input)

    expect(entries).toHaveLength(6)
    expect(entries[0]?.keyType).toBe('ssh-ed25519')
    expect(entries[0]?.keySize).toBe(256)
    expect(entries[1]?.keyType).toBe('ssh-rsa')
    expect(entries[1]?.keySize).toBe(256)
    expect(entries[2]?.keyType).toBe('ssh-dss')
    expect(entries[2]?.keySize).toBe(128)
    expect(entries[3]?.keyType).toBe('ecdsa-sha2-nistp256')
    expect(entries[3]?.curve).toBe('nistp256')
    expect(entries[4]?.keyType).toContain('sk-ecdsa')
    expect(entries[5]?.keyType).toContain('sk-ssh-ed25519')
    expect(entries[5]?.fingerprints.sha256).toMatch(/^SHA256:/)
    expect(entries[5]?.fingerprints.md5).toMatch(/^MD5:/)
  })

  it('parses RFC4716 blocks and keeps comments', async () => {
    const entries = await parseSshPublicKeys(rfcBlock)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.keyType).toBe('ssh-ed25519')
    expect(entries[0]?.comment).toBe('rfc@example.com')
  })

  it('parses unknown key types', async () => {
    const entries = await parseSshPublicKeys(unknownKeyLine)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.keyType).toBe('ssh-unknown')
  })

  it('uses entry key type when blob type is empty', async () => {
    const entries = await parseSshPublicKeys(emptyKeyTypeLine)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.keyType).toBe('ssh-ed25519')
    expect(entries[0]?.comment).toBeUndefined()
  })

  it('falls back to unknown when key type is missing', async () => {
    const entries = await parseSshPublicKeys(emptyKeyTypeRfcBlock)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.keyType).toBe('unknown')
  })

  it('skips empty RFC blocks and blank lines', async () => {
    const input = `${rfcEmptyBlock}\n${rfcBlankLineBlock}`
    const entries = await parseSshPublicKeys(input)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.comment).toBe('blank@example.com')
  })

  it('ignores comment lines', async () => {
    const input = `# comment line\n${ed25519Line}`
    const entries = await parseSshPublicKeys(input)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.keyType).toBe('ssh-ed25519')
  })

  it('handles zero-length mpint values', async () => {
    const entries = await parseSshPublicKeys(rsaZeroModulusLine)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.keySize).toBe(0)
  })

  it('handles authorized_keys options lines', async () => {
    const input = `command="echo hello world",no-pty ${ed25519Line}`
    const entries = await parseSshPublicKeys(input)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.keyType).toBe('ssh-ed25519')
    expect(entries[0]?.comment).toBe('user@host')
  })

  it('returns empty results for empty input', async () => {
    const entries = await parseSshPublicKeys('   ')
    expect(entries).toHaveLength(0)
  })

  it('ignores invalid RFC4716 data', async () => {
    const shortEntries = await parseSshPublicKeys(rfcShortBlock)
    const invalidLengthEntries = await parseSshPublicKeys(rfcInvalidLengthBlock)

    expect(shortEntries).toHaveLength(0)
    expect(invalidLengthEntries).toHaveLength(0)
  })

  it('returns empty results for invalid input', async () => {
    const entries = await parseSshPublicKeys('ssh-ed25519 abc')
    expect(entries).toHaveLength(0)
  })

  it('falls back to Buffer when atob/btoa are unavailable', async () => {
    const originalAtob = globalThis.atob
    const originalBtoa = globalThis.btoa
    try {
      // @ts-expect-error - test fallback behavior
      globalThis.atob = undefined
      // @ts-expect-error - test fallback behavior
      globalThis.btoa = undefined

      const entries = await parseSshPublicKeys(ed25519Line)
      expect(entries).toHaveLength(1)
      expect(entries[0]?.fingerprints.sha256).toMatch(/^SHA256:/)
    } finally {
      globalThis.atob = originalAtob
      globalThis.btoa = originalBtoa
    }
  })

  it('returns empty results when base64 encoder is missing', async () => {
    const originalAtob = globalThis.atob
    const originalBtoa = globalThis.btoa
    const originalBuffer = globalThis.Buffer

    try {
      globalThis.atob =
        originalAtob ?? ((value: string) => BufferRef.from(value, 'base64').toString('binary'))
      // @ts-expect-error - test failure path
      globalThis.btoa = undefined
      // @ts-expect-error - test failure path
      globalThis.Buffer = undefined

      const entries = await parseSshPublicKeys(ed25519Line)
      expect(entries).toHaveLength(0)
    } finally {
      globalThis.atob = originalAtob
      globalThis.btoa = originalBtoa
      globalThis.Buffer = originalBuffer
    }
  })

  it('returns empty results when base64 helpers are missing', async () => {
    const originalAtob = globalThis.atob
    const originalBtoa = globalThis.btoa
    const originalBuffer = globalThis.Buffer

    try {
      // @ts-expect-error - test failure path
      globalThis.atob = undefined
      // @ts-expect-error - test failure path
      globalThis.btoa = undefined
      // @ts-expect-error - test failure path
      globalThis.Buffer = undefined

      const entries = await parseSshPublicKeys(ed25519Line)
      expect(entries).toHaveLength(0)
    } finally {
      globalThis.atob = originalAtob
      globalThis.btoa = originalBtoa
      globalThis.Buffer = originalBuffer
    }
  })

  it('parses RFC4716 blocks without quoted comments', async () => {
    const entries = await parseSshPublicKeys(rfcBlockNoQuotes)

    expect(entries).toHaveLength(1)
    expect(entries[0]?.comment).toBe('no-quotes@example.com')
  })

  it('handles empty md5 output', async () => {
    vi.resetModules()
    vi.doMock('crypto-js/md5', () => ({
      default: () => ({ toString: () => '' }),
    }))

    try {
      const { parseSshPublicKeys: parseWithMock } = await import('../ssh-public-key-fingerprint')
      const entries = await parseWithMock(ed25519Line)

      expect(entries).toHaveLength(1)
      expect(entries[0]?.fingerprints.md5).toBe('MD5:')
    } finally {
      vi.doUnmock('crypto-js/md5')
      vi.resetModules()
    }
  })
})

describe('SshPublicKeyFingerprint component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders fingerprints for the default sample', async () => {
    const wrapper = mount(TestWrapper, {
      global: {
        plugins: [i18n],
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('Fingerprints')
    expect(wrapper.text()).toContain('Key 1')
  })

  it('shows a parsing error for invalid input', async () => {
    const wrapper = mount(TestWrapper, {
      global: {
        plugins: [i18n],
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('invalid')
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('Parsing Error')
    expect(wrapper.text()).toContain('No valid SSH public keys found.')
  })

  it('treats empty input as empty state', async () => {
    const wrapper = mount(TestWrapper, {
      global: {
        plugins: [i18n],
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('')
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('Paste a public key to see fingerprints.')
  })

  it('treats whitespace input as empty state', async () => {
    const wrapper = mount(TestWrapper, {
      global: {
        plugins: [i18n],
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue('   ')
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('Paste a public key to see fingerprints.')
  })

  it('accepts file input', async () => {
    const wrapper = mount(TestWrapper, {
      global: {
        plugins: [i18n],
      },
    })

    const input = wrapper.findComponent(TextOrFileInput)
    const file = new File([ed25519Line], 'id_ed25519.pub', { type: 'text/plain' })

    await input.vm.$emit('update:value', file)
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('ssh-ed25519')
  })

  it('renders unknown keys with placeholders', async () => {
    const wrapper = mount(TestWrapper, {
      global: {
        plugins: [i18n],
      },
    })

    await flushPromises()
    vi.runAllTimers()
    await flushPromises()

    const textarea = wrapper.find('textarea')
    await textarea.setValue(unknownKeyLine)
    vi.runAllTimers()
    await flushPromises()

    expect(wrapper.text()).toContain('ssh-unknown')
  })
})
