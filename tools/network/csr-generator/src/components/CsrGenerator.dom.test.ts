import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { defineComponent, h } from 'vue'
import CsrGenerator from './CsrGenerator.vue'
import CsrKeySourceSection from './CsrKeySourceSection.vue'
import CsrSanSection from './CsrSanSection.vue'
import CsrSubjectSection from './CsrSubjectSection.vue'
import { CsrGeneratorError, createCsr } from '../utils/csr'

vi.mock('../utils/csr', async () => {
  const actual = await vi.importActual<typeof import('../utils/csr')>('../utils/csr')
  return {
    ...actual,
    createCsr: vi.fn(),
  }
})

const createCsrMock = vi.mocked(createCsr)

const TextOrFileInputStub = defineComponent({
  name: 'TextOrFileInput',
  props: {
    value: { type: [String, Object], default: '' },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    return () =>
      h('textarea', {
        value: typeof props.value === 'string' ? props.value : '',
        onInput: (event: Event) =>
          emit('update:value', (event.target as HTMLTextAreaElement).value),
      })
  },
})

const NInputStub = defineComponent({
  name: 'NInput',
  props: {
    value: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    readonly: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const onInput = (event: Event) => emit('update:value', (event.target as HTMLInputElement).value)
    return () =>
      props.type === 'textarea'
        ? h('textarea', {
            value: String(props.value ?? ''),
            readOnly: props.readonly,
            placeholder: props.placeholder,
            onInput,
          })
        : h('input', {
            value: String(props.value ?? ''),
            readOnly: props.readonly,
            placeholder: props.placeholder,
            onInput,
          })
  },
})

const NButtonStub = defineComponent({
  emits: ['click'],
  setup(_, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          type: 'button',
          onClick: () => emit('click'),
        },
        slots.default?.(),
      )
  },
})

const NRadioGroupStub = defineComponent({
  name: 'NRadioGroup',
  emits: ['update:value'],
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const NSelectStub = defineComponent({
  name: 'NSelect',
  emits: ['update:value'],
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const WrapperStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.())
  },
})

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en: {
      generateCsr: 'Generate CSR',
      errorMissingSubjectOrSan: 'Provide at least one Subject field or SAN entry.',
      errorTitle: 'Error',
      downloadCsr: 'Download CSR',
      downloadKey: 'Download Private Key',
      keyAlgorithmLabel: 'Key: {algorithm}',
      csrOutputTitle: 'CSR Output',
      privateKeyTitle: 'Private Key',
      keySourceTitle: 'Key Source',
      keySourceGenerate: 'Generate New Key',
      keySourceImport: 'Import Private Key',
      keySourceGenerateHint: 'Generate',
      keySourceImportHint: 'Import',
      algorithmLabel: 'Key Algorithm',
      rsaKeySizeLabel: 'RSA Key Size',
      rsaHashLabel: 'RSA Hash',
      ecCurveLabel: 'EC Curve',
      privateKeyPlaceholder: 'Paste a PEM private key',
      privateKeyHint: 'Supported',
      subjectTitle: 'Subject',
      commonName: 'Common Name',
      organization: 'Organization',
      organizationalUnit: 'OU',
      country: 'Country',
      state: 'State',
      locality: 'Locality',
      emailAddress: 'Email',
      subjectHint: 'Subject hint',
      sanTitle: 'SAN',
      sanDnsLabel: 'DNS',
      sanIpLabel: 'IP',
      sanEmailLabel: 'Email',
      sanUriLabel: 'URI',
      sanDnsPlaceholder: 'dns',
      sanIpPlaceholder: 'ip',
      sanEmailPlaceholder: 'email',
      sanUriPlaceholder: 'uri',
      sanHint: 'SAN hint',
      privateKeyWarning: 'warning',
    },
  },
})

const globalStubs = {
  TextOrFileInput: TextOrFileInputStub,
  CopyToClipboardButton: WrapperStub,
  ToolSection: WrapperStub,
  ToolSectionHeader: WrapperStub,
  NAlert: WrapperStub,
  NButton: NButtonStub,
  NFlex: WrapperStub,
  NFormItem: WrapperStub,
  NFormItemGi: WrapperStub,
  'n-form-item-gi': WrapperStub,
  NGrid: WrapperStub,
  NIcon: WrapperStub,
  NInput: NInputStub,
  'n-input': NInputStub,
  NRadioButton: WrapperStub,
  NRadioGroup: NRadioGroupStub,
  'n-radio-group': NRadioGroupStub,
  NSelect: NSelectStub,
  'n-select': NSelectStub,
  NText: WrapperStub,
}

const mountGenerator = () =>
  mount(CsrGenerator, {
    global: {
      plugins: [i18n],
      stubs: globalStubs,
    },
  })

beforeEach(() => {
  localStorage.clear()
  createCsrMock.mockReset()
  if (!globalThis.URL.createObjectURL) {
    Object.defineProperty(globalThis.URL, 'createObjectURL', {
      value: vi.fn(() => 'blob:mock'),
      configurable: true,
    })
  }
  if (!globalThis.URL.revokeObjectURL) {
    Object.defineProperty(globalThis.URL, 'revokeObjectURL', {
      value: vi.fn(),
      configurable: true,
    })
  }
})

describe('CsrGenerator', () => {
  it('generates and shows outputs', async () => {
    createCsrMock.mockResolvedValueOnce({
      csrPem: 'CSR-PEM',
      privateKeyPem: 'PRIVATE-KEY',
      keyAlgorithmLabel: 'RSA 2048 (SHA-256)',
    })

    const wrapper = mountGenerator()
    const generateButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Generate CSR'))

    expect(generateButton).toBeDefined()
    await generateButton!.trigger('click')
    await flushPromises()

    expect(createCsrMock).toHaveBeenCalledTimes(1)
    const textareaValues = wrapper.findAll('textarea').map((node) => node.element.value)
    expect(textareaValues).toContain('CSR-PEM')
    expect(textareaValues).toContain('PRIVATE-KEY')
  })

  it('resets outputs when settings change', async () => {
    createCsrMock.mockResolvedValueOnce({
      csrPem: 'CSR-PEM',
      privateKeyPem: 'PRIVATE-KEY',
      keyAlgorithmLabel: 'RSA 2048 (SHA-256)',
    })

    const wrapper = mountGenerator()
    const generateButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Generate CSR'))

    await generateButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('CSR-PEM')

    const vm = wrapper.vm as unknown as { algorithm: string }
    vm.algorithm = 'ecdsa'
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('CSR-PEM')
  })

  it('reads file input and splits SAN values', async () => {
    localStorage.setItem('tools:csr-generator:key-source', 'import')
    localStorage.setItem(
      'tools:csr-generator:san-dns',
      'example.com, test.example.com\nother.example.com',
    )
    localStorage.setItem('tools:csr-generator:san-ip', '192.0.2.1\n198.51.100.2')
    createCsrMock.mockResolvedValueOnce({
      csrPem: 'CSR-PEM',
      privateKeyPem: undefined,
      keyAlgorithmLabel: 'RSA 2048 (SHA-256)',
    })

    const wrapper = mountGenerator()
    const file = new File(['KEYDATA'], 'key.pem', { type: 'application/x-pem-file' })
    const keyInput = wrapper.findComponent(TextOrFileInputStub)

    keyInput.vm.$emit('update:value', file)
    await wrapper.vm.$nextTick()

    const generateButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Generate CSR'))
    await generateButton!.trigger('click')
    await flushPromises()

    expect(createCsrMock).toHaveBeenCalledTimes(1)
    const input = createCsrMock.mock.calls[0]![0]
    expect(input.keyPem).toBe('KEYDATA')
    expect(input.san.dns).toEqual(['example.com', 'test.example.com', 'other.example.com'])
    expect(input.san.ip).toEqual(['192.0.2.1', '198.51.100.2'])
  })

  it('accepts string key input for imports', async () => {
    localStorage.setItem('tools:csr-generator:key-source', 'import')
    createCsrMock.mockResolvedValueOnce({
      csrPem: 'CSR-PEM',
      privateKeyPem: undefined,
      keyAlgorithmLabel: 'RSA 2048 (SHA-256)',
    })

    const wrapper = mountGenerator()
    const keyInput = wrapper.findComponent(TextOrFileInputStub)

    keyInput.vm.$emit('update:value', 'KEYDATA')
    await wrapper.vm.$nextTick()

    const generateButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Generate CSR'))
    await generateButton!.trigger('click')
    await flushPromises()

    expect(createCsrMock).toHaveBeenCalledTimes(1)
    const input = createCsrMock.mock.calls[0]![0]
    expect(input.keyPem).toBe('KEYDATA')
  })

  it('shows errors from CsrGeneratorError', async () => {
    createCsrMock.mockRejectedValueOnce(new CsrGeneratorError('errorMissingSubjectOrSan'))

    const wrapper = mountGenerator()
    const generateButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Generate CSR'))

    await generateButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Provide at least one Subject field or SAN entry.')
  })

  it('shows errors from Error instances', async () => {
    createCsrMock.mockRejectedValueOnce(new Error('Boom'))

    const wrapper = mountGenerator()
    const generateButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Generate CSR'))

    await generateButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Boom')
  })

  it('stringifies non-error throws', async () => {
    createCsrMock.mockRejectedValueOnce('Boom')

    const wrapper = mountGenerator()
    const generateButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Generate CSR'))

    await generateButton!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Boom')
  })

  it('syncs section v-model updates from child components', async () => {
    const wrapper = mountGenerator()
    const vm = wrapper.vm as unknown as {
      keySource: string
      algorithm: string
      rsaKeySize: number
      rsaHash: string
      ecCurve: string
      keyInput: string | File
      subject: {
        commonName: string
        organization: string
        organizationalUnit: string
        country: string
        state: string
        locality: string
        emailAddress: string
      }
      sanDns: string
      sanIp: string
      sanEmail: string
      sanUri: string
    }

    const keySourceSection = wrapper.findComponent(CsrKeySourceSection)

    expect(wrapper.text()).toContain('Generate')

    keySourceSection.vm.$emit('update:keySource', 'import')
    keySourceSection.vm.$emit('update:keyInput', 'IMPORTED-KEY')
    await wrapper.vm.$nextTick()

    expect(vm.keySource).toBe('import')
    expect(vm.keyInput).toBe('IMPORTED-KEY')

    keySourceSection.vm.$emit('update:keySource', 'generate')
    keySourceSection.vm.$emit('update:algorithm', 'ecdsa')
    keySourceSection.vm.$emit('update:rsaKeySize', 4096)
    keySourceSection.vm.$emit('update:rsaHash', 'SHA-512')
    keySourceSection.vm.$emit('update:ecCurve', 'P-521')
    await wrapper.vm.$nextTick()

    expect(vm.keySource).toBe('generate')
    expect(vm.algorithm).toBe('ecdsa')
    expect(vm.rsaKeySize).toBe(4096)
    expect(vm.rsaHash).toBe('SHA-512')
    expect(vm.ecCurve).toBe('P-521')

    const subjectSection = wrapper.findComponent(CsrSubjectSection)
    subjectSection.vm.$emit('update:subject', {
      commonName: 'example.org',
      organization: 'Acme Corp',
      organizationalUnit: 'Security',
      country: 'US',
      state: 'CA',
      locality: 'San Francisco',
      emailAddress: 'security@example.org',
    })
    await wrapper.vm.$nextTick()

    expect(vm.subject).toEqual({
      commonName: 'example.org',
      organization: 'Acme Corp',
      organizationalUnit: 'Security',
      country: 'US',
      state: 'CA',
      locality: 'San Francisco',
      emailAddress: 'security@example.org',
    })

    const sanSection = wrapper.findComponent(CsrSanSection)
    sanSection.vm.$emit('update:sanDns', 'example.org')
    sanSection.vm.$emit('update:sanIp', '192.0.2.55')
    sanSection.vm.$emit('update:sanEmail', 'security@example.org')
    sanSection.vm.$emit('update:sanUri', 'https://example.org')
    await wrapper.vm.$nextTick()

    expect(vm.sanDns).toBe('example.org')
    expect(vm.sanIp).toBe('192.0.2.55')
    expect(vm.sanEmail).toBe('security@example.org')
    expect(vm.sanUri).toBe('https://example.org')
  })

  it('updates form bindings and download links', async () => {
    const wrapper = mountGenerator()
    const vm = wrapper.vm as unknown as {
      keySource: string
      algorithm: string
      rsaKeySize: number
      rsaHash: string
      ecCurve: string
      subject: {
        commonName: string
        organization: string
        organizationalUnit: string
        country: string
        state: string
        locality: string
        emailAddress: string
      }
      sanDns: string
      sanIp: string
      sanEmail: string
      sanUri: string
      keyInput: string | File
      keyInputStatus?: string
      errorMessage: string
      csrOutput: string
      privateKeyOutput: string
      csrDownloadUrl: string | null
      privateKeyDownloadUrl: string | null
    }

    expect(vm.keyInputStatus).toBeUndefined()

    const inputValues = [
      'example.com',
      'Acme',
      'Ops',
      'US',
      'CA',
      'SF',
      'admin@example.com',
      'example.com',
      '192.0.2.1',
      'admin@example.com',
      'https://example.com',
    ]

    vm.subject = {
      commonName: inputValues[0]!,
      organization: inputValues[1]!,
      organizationalUnit: inputValues[2]!,
      country: inputValues[3]!,
      state: inputValues[4]!,
      locality: inputValues[5]!,
      emailAddress: inputValues[6]!,
    }
    vm.sanDns = inputValues[7]!
    vm.sanIp = inputValues[8]!
    vm.sanEmail = inputValues[9]!
    vm.sanUri = inputValues[10]!
    await wrapper.vm.$nextTick()

    expect(vm.subject).toEqual({
      commonName: inputValues[0]!,
      organization: inputValues[1]!,
      organizationalUnit: inputValues[2]!,
      country: inputValues[3]!,
      state: inputValues[4]!,
      locality: inputValues[5]!,
      emailAddress: inputValues[6]!,
    })
    expect(vm.sanDns).toBe(inputValues[7]!)
    expect(vm.sanIp).toBe(inputValues[8]!)
    expect(vm.sanEmail).toBe(inputValues[9]!)
    expect(vm.sanUri).toBe(inputValues[10]!)

    vm.rsaKeySize = 3072
    vm.rsaHash = 'SHA-384'
    vm.ecCurve = 'P-384'
    await wrapper.vm.$nextTick()

    expect(vm.rsaKeySize).toBe(3072)
    expect(vm.rsaHash).toBe('SHA-384')
    expect(vm.ecCurve).toBe('P-384')

    vm.algorithm = 'ecdsa'
    await wrapper.vm.$nextTick()

    expect(vm.algorithm).toBe('ecdsa')

    vm.keySource = 'import'
    await wrapper.vm.$nextTick()

    expect(vm.keySource).toBe('import')
    expect(vm.keyInputStatus).toBeUndefined()

    vm.errorMessage = 'Oops'
    await wrapper.vm.$nextTick()
    expect(vm.keyInputStatus).toBe('error')

    const keyInput = wrapper.findComponent(TextOrFileInputStub)
    keyInput.vm.$emit('update:value', 'KEYDATA')
    await wrapper.vm.$nextTick()
    expect(vm.keyInput).toBe('KEYDATA')

    const originalCreateObjectUrl = globalThis.URL.createObjectURL

    vm.csrOutput = 'CSR'
    vm.privateKeyOutput = 'KEY'
    await wrapper.vm.$nextTick()

    Object.defineProperty(globalThis.URL, 'createObjectURL', {
      value: vi.fn(() => undefined),
      configurable: true,
    })
    vm.csrOutput = 'CSR-2'
    vm.privateKeyOutput = 'KEY-2'
    await wrapper.vm.$nextTick()

    Object.defineProperty(globalThis.URL, 'createObjectURL', {
      value: originalCreateObjectUrl,
      configurable: true,
    })
  })
})
