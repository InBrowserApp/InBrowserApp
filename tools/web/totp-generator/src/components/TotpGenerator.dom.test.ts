import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TotpGenerator from './TotpGenerator.vue'

const writeText = vi.fn()

vi.stubGlobal('navigator', {
  clipboard: {
    writeText,
  },
})

const mountTool = () =>
  mount(TotpGenerator, {
    global: {
      stubs: {
        CopyToClipboardButton: {
          props: ['content', 'disabled'],
          template: '<button class="copy-button" :disabled="disabled">{{ content }}</button>',
        },
      },
    },
  })

type TotpGeneratorExposed = {
  updateAlgorithm: (value: 'SHA-1' | 'SHA-256' | 'SHA-512') => void
  updateDigits: (value: number) => void
  updatePeriod: (value: number) => void
}

describe('TotpGenerator', () => {
  beforeEach(() => {
    writeText.mockReset()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:05Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the empty state by default', () => {
    const wrapper = mountTool()
    expect(wrapper.text()).toContain(
      'Enter a valid Base32 secret or otpauth URI to generate a code.',
    )
    expect((wrapper.vm as { remainingSeconds: number }).remainingSeconds).toBe(0)
    expect((wrapper.vm as { progressPercentage: number }).progressPercentage).toBe(0)
    expect((wrapper.vm as { detailsItems: unknown[] }).detailsItems).toEqual([])
    expect((wrapper.vm as { activeUri: string }).activeUri).toBe('')
    expect((wrapper.vm as { activeDisplayName: string }).activeDisplayName).toBe('')
  })

  it('loads the sample secret config and renders live codes', async () => {
    const wrapper = mountTool()

    const loadSampleButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Load sample'))
    expect(loadSampleButton).toBeDefined()
    await loadSampleButton?.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('demo@example.com')
    expect(wrapper.text()).toContain('InBrowser.App')
    expect(wrapper.find('.totp-tool__code').text()).toMatch(/^\d{6}$/)
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
    expect(wrapper.text()).toContain('otpauth://totp/')
  })

  it('loads the sample otpauth uri in uri mode', async () => {
    const wrapper = mountTool()
    const uriRadio = wrapper.find('input[type="radio"][value="uri"]')
    expect(uriRadio.exists()).toBe(true)

    await uriRadio.setValue()
    await nextTick()

    const loadSampleButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Load sample'))
    await loadSampleButton?.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toContain('otpauth://totp/')
    expect(wrapper.find('.totp-tool__code').text()).toMatch(/^\d{6}$/)
  })

  it('accepts manual otpauth uri input', async () => {
    const wrapper = mountTool()
    const uriRadio = wrapper.find('input[type="radio"][value="uri"]')
    expect(uriRadio.exists()).toBe(true)

    await uriRadio.setValue()
    await nextTick()

    const textarea = wrapper.find('textarea')
    await textarea.setValue(
      'otpauth://totp/InBrowser.App%3Ademo%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=InBrowser.App',
    )
    await flushPromises()

    expect(wrapper.find('.totp-tool__code').text()).toMatch(/^\d{6}$/)
    expect(wrapper.text()).toContain('InBrowser.App')
  })

  it.each([
    ['otpauth://totp/Example', 'A secret is required.'],
    [
      'otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP&algorithm=MD5',
      'The algorithm is not supported.',
    ],
    [
      'otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP&digits=0',
      'Digits must be a positive integer.',
    ],
    [
      'otpauth://totp/Example?secret=JBSWY3DPEHPK3PXP&period=0',
      'Period must be a positive integer.',
    ],
    ['not-a-uri', 'Enter a valid otpauth URI.'],
    ['https://example.com', 'The URI must start with otpauth://.'],
    [
      'otpauth://hotp/Example?secret=JBSWY3DPEHPK3PXP',
      'Only otpauth://totp/... is supported in this tool.',
    ],
  ])('shows the right URI validation message for %s', async (value, expectedMessage) => {
    const wrapper = mountTool()
    const uriRadio = wrapper.find('input[type="radio"][value="uri"]')

    await uriRadio.setValue()
    await nextTick()

    const textarea = wrapper.find('textarea')
    await textarea.setValue(value)
    await flushPromises()

    expect(wrapper.text()).toContain(expectedMessage)
  })

  it('shows validation feedback for an invalid secret', async () => {
    const wrapper = mountTool()
    const secretInput = wrapper.find('input[placeholder="JBSWY3DPEHPK3PXP"]')

    await secretInput.setValue('***')
    await flushPromises()

    expect(wrapper.text()).toContain('Enter a valid Base32 secret.')
  })

  it('accepts manual secret, issuer, and account input', async () => {
    const wrapper = mountTool()
    const textInputs = wrapper
      .findAll('input')
      .filter((input) => input.attributes('type') !== 'radio')

    await textInputs[0]?.setValue('JBSWY3DPEHPK3PXP')
    await textInputs[1]?.setValue('InBrowser.App')
    await textInputs[2]?.setValue('demo@example.com')
    await flushPromises()

    expect(wrapper.find('.totp-tool__code').text()).toMatch(/^\d{6}$/)
    expect(wrapper.text()).toContain('demo@example.com')
  })

  it('updates algorithm, digits, and period from the select controls', async () => {
    const wrapper = mountTool()
    const textInputs = wrapper
      .findAll('input')
      .filter((input) => input.attributes('type') !== 'radio')

    await textInputs[0]?.setValue('JBSWY3DPEHPK3PXP')
    await flushPromises()

    const vm = wrapper.vm as TotpGeneratorExposed
    vm.updateAlgorithm('SHA-256')
    vm.updateDigits(8)
    vm.updatePeriod(60)
    await flushPromises()

    expect(wrapper.find('.totp-tool__code').text()).toMatch(/^\d{8}$/)
    expect(wrapper.text()).toContain('SHA-256')
    expect(wrapper.text()).toContain('60s')
  })

  it('clears previously entered data', async () => {
    const wrapper = mountTool()
    const buttons = wrapper.findAll('button')
    const loadSampleButton = buttons.find((button) => button.text().includes('Load sample'))
    const clearButton = buttons.find((button) => button.text().includes('Clear'))

    await loadSampleButton?.trigger('click')
    await flushPromises()
    expect(wrapper.find('.totp-tool__code').exists()).toBe(true)

    await clearButton?.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain(
      'Enter a valid Base32 secret or otpauth URI to generate a code.',
    )
  })

  it('cleans up its timer when unmounted', async () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const wrapper = mountTool()
    vi.advanceTimersByTime(250)
    await nextTick()

    wrapper.unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
