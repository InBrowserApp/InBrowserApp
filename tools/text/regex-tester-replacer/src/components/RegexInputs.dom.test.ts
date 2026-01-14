import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RegexInputs from './RegexInputs.vue'

const baseProps = {
  patternStatus: 'success' as const,
  patternError: '',
  flagOptions: ['g', 'i'],
  textOrFile: 'Order #123-ABC',
  pattern: '#(\\d+)-([A-Z]+)',
  selectedFlags: ['g'],
  replacement: 'ID:$1',
  autoRun: false,
  'onUpdate:textOrFile': vi.fn(),
  'onUpdate:pattern': vi.fn(),
  'onUpdate:selectedFlags': vi.fn(),
  'onUpdate:replacement': vi.fn(),
  'onUpdate:autoRun': vi.fn(),
}

const mountWithI18n = (props = {}) =>
  mount(RegexInputs, {
    props: { ...baseProps, ...props },
  })

describe('RegexInputs', () => {
  it('renders labels and controls', () => {
    const wrapper = mountWithI18n()
    const text = wrapper.text()

    expect(text).toContain('Test Text')
    expect(text).toContain('Regular Expression')
    expect(text).toContain('Replacement')
    expect(text).toContain('Automatically updates results as you type.')
  })

  it('emits run when clicking the run button', async () => {
    const wrapper = mountWithI18n({ autoRun: false })
    const runButton = wrapper.findAll('button').find((button) => button.text().includes('Run'))

    expect(runButton).toBeTruthy()
    await runButton!.trigger('click')

    expect(wrapper.emitted('run')).toBeTruthy()
  })
})
