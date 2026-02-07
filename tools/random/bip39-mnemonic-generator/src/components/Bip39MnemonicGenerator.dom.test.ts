import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import Bip39MnemonicGenerator from './Bip39MnemonicGenerator.vue'

const bip39Mocks = vi.hoisted(() => ({
  WORD_COUNTS: [12, 24],
  countMnemonicWords: vi.fn((mnemonic: string) => (mnemonic ? 12 : 0)),
  entropyToMnemonic: vi.fn((entropy: string) => `mnemonic:${entropy}`),
  generateMnemonic: vi.fn(() => ({ mnemonic: 'generated words', entropy: 'deadbeef' })),
  isValidEntropyHex: vi.fn((entropy: string) => entropy === 'valid'),
  mnemonicToEntropy: vi.fn((mnemonic: string) => `entropy:${mnemonic}`),
  normalizeEntropyHex: vi.fn((value: string) => value.trim()),
  normalizeMnemonic: vi.fn((value: string) => value.trim()),
  validateMnemonic: vi.fn((mnemonic: string) => mnemonic === 'valid words'),
  wordCountToStrength: vi.fn(() => 128),
}))

vi.mock('@utils/bip39', () => ({
  WORD_COUNTS: bip39Mocks.WORD_COUNTS,
  countMnemonicWords: bip39Mocks.countMnemonicWords,
  entropyToMnemonic: bip39Mocks.entropyToMnemonic,
  generateMnemonic: bip39Mocks.generateMnemonic,
  isValidEntropyHex: bip39Mocks.isValidEntropyHex,
  mnemonicToEntropy: bip39Mocks.mnemonicToEntropy,
  normalizeEntropyHex: bip39Mocks.normalizeEntropyHex,
  normalizeMnemonic: bip39Mocks.normalizeMnemonic,
  validateMnemonic: bip39Mocks.validateMnemonic,
  wordCountToStrength: bip39Mocks.wordCountToStrength,
}))

const Bip39MnemonicOptionsStub = defineComponent({
  name: 'Bip39MnemonicOptions',
  props: {
    activeTab: { type: String, required: true },
    wordlist: { type: String, required: true },
    wordCount: { type: Number, required: true },
    validationMnemonic: { type: String, required: true },
    entropyInput: { type: String, required: true },
    convertMnemonic: { type: String, required: true },
    wordlistOptions: { type: Array, required: true },
    wordCountOptions: { type: Array, required: true },
    strengthBits: { type: Number, required: true },
  },
  emits: [
    'update:active-tab',
    'update:wordlist',
    'update:word-count',
    'update:validation-mnemonic',
    'update:entropy-input',
    'update:convert-mnemonic',
  ],
  template: '<div class="options" />',
})

const Bip39MnemonicResultsStub = defineComponent({
  name: 'Bip39MnemonicResults',
  props: {
    activeTab: { type: String, required: true },
    generatedMnemonic: { type: String, required: true },
    generatedEntropy: { type: String, required: true },
    validationState: { type: String, required: true },
    validationWordCount: { type: Number, required: true },
    validationEntropy: { type: String, required: true },
    entropyMnemonic: { type: String, required: true },
    mnemonicEntropy: { type: String, required: true },
    entropyHasError: { type: Boolean, required: true },
    mnemonicHasError: { type: Boolean, required: true },
  },
  emits: ['regenerate'],
  template: '<div class="results" />',
})

const NGridStub = {
  template: '<div class="grid"><slot /></div>',
}

const NGiStub = {
  template: '<div class="gi"><slot /></div>',
}

describe('Bip39MnemonicGenerator', () => {
  beforeEach(() => {
    localStorage.clear()
    bip39Mocks.generateMnemonic.mockClear()
    bip39Mocks.validateMnemonic.mockClear()
    bip39Mocks.mnemonicToEntropy.mockClear()
    bip39Mocks.entropyToMnemonic.mockClear()
  })

  it('generates and propagates mnemonic data', async () => {
    const wrapper = mount(Bip39MnemonicGenerator, {
      global: {
        stubs: {
          NGrid: NGridStub,
          NGi: NGiStub,
          Bip39MnemonicOptions: Bip39MnemonicOptionsStub,
          Bip39MnemonicResults: Bip39MnemonicResultsStub,
        },
      },
    })

    const options = wrapper.findComponent(Bip39MnemonicOptionsStub)
    const results = wrapper.findComponent(Bip39MnemonicResultsStub)

    expect(bip39Mocks.generateMnemonic).toHaveBeenCalledWith({
      wordCount: 12,
      wordlist: 'english',
    })
    expect(results.props('generatedMnemonic')).toBe('generated words')
    expect(results.props('generatedEntropy')).toBe('deadbeef')
    expect(options.props('strengthBits')).toBe(128)

    await options.vm.$emit('update:active-tab', 'convert')
    await options.vm.$emit('update:wordlist', 'spanish')
    await nextTick()

    expect(results.props('activeTab')).toBe('convert')
    expect(options.props('wordlist')).toBe('spanish')

    await options.vm.$emit('update:word-count', 24)
    await nextTick()

    expect(bip39Mocks.generateMnemonic).toHaveBeenCalledWith({
      wordCount: 24,
      wordlist: 'spanish',
    })

    await options.vm.$emit('update:validation-mnemonic', 'valid words')
    await nextTick()

    expect(results.props('validationState')).toBe('valid')
    expect(results.props('validationWordCount')).toBe(12)
    expect(results.props('validationEntropy')).toBe('entropy:valid words')

    await options.vm.$emit('update:validation-mnemonic', 'invalid words')
    await nextTick()

    expect(results.props('validationState')).toBe('invalid')
    expect(results.props('validationEntropy')).toBe('')

    bip39Mocks.validateMnemonic.mockImplementation(
      (mnemonic: string) =>
        mnemonic === 'valid words' ||
        mnemonic === 'throw words' ||
        mnemonic === 'throw convert words',
    )
    bip39Mocks.mnemonicToEntropy.mockImplementation((mnemonic: string) => {
      if (mnemonic === 'throw words' || mnemonic === 'throw convert words') {
        throw new Error('mnemonic conversion failure')
      }
      return `entropy:${mnemonic}`
    })

    await options.vm.$emit('update:validation-mnemonic', 'throw words')
    await nextTick()

    expect(results.props('validationState')).toBe('valid')
    expect(results.props('validationEntropy')).toBe('')

    await options.vm.$emit('update:entropy-input', 'bad')
    await nextTick()

    expect(results.props('entropyHasError')).toBe(true)
    expect(results.props('entropyMnemonic')).toBe('')

    bip39Mocks.isValidEntropyHex.mockImplementation(
      (entropy: string) => entropy === 'valid' || entropy === 'boom',
    )
    bip39Mocks.entropyToMnemonic.mockImplementation((entropy: string) => {
      if (entropy === 'boom') {
        throw new Error('entropy conversion failure')
      }
      return `mnemonic:${entropy}`
    })

    await options.vm.$emit('update:entropy-input', 'boom')
    await nextTick()

    expect(results.props('entropyHasError')).toBe(false)
    expect(results.props('entropyMnemonic')).toBe('')

    await options.vm.$emit('update:entropy-input', 'valid')
    await nextTick()

    expect(results.props('entropyMnemonic')).toBe('mnemonic:valid')

    await options.vm.$emit('update:convert-mnemonic', 'bad words')
    await nextTick()

    expect(results.props('mnemonicHasError')).toBe(true)
    expect(results.props('mnemonicEntropy')).toBe('')

    await options.vm.$emit('update:convert-mnemonic', 'throw convert words')
    await nextTick()

    expect(results.props('mnemonicHasError')).toBe(false)
    expect(results.props('mnemonicEntropy')).toBe('')

    await options.vm.$emit('update:convert-mnemonic', 'valid words')
    await nextTick()

    expect(results.props('mnemonicEntropy')).toBe('entropy:valid words')

    await results.vm.$emit('regenerate')
    await nextTick()

    expect(bip39Mocks.generateMnemonic).toHaveBeenCalledTimes(4)
  })
})
