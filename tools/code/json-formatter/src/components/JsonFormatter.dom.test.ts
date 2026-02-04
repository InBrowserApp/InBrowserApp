import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NCode, NInputNumber, NMessageProvider } from 'naive-ui'
import JsonFormatter from './JsonFormatter.vue'

const fileOpenMock = vi.fn()
const objectUrlState = { value: 'available' as 'available' | 'missing' }

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual<typeof import('@vueuse/core')>('@vueuse/core')
  const { computed, isRef } = await import('vue')

  return {
    ...actual,
    useObjectUrl: (source: unknown) =>
      computed(() => {
        if (objectUrlState.value === 'missing') {
          return null
        }
        const value = isRef(source) ? source.value : source
        return value ? 'blob:download' : null
      }),
  }
})

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonFormatter))
  },
}

const mountOptions = {
  global: {
    stubs: {
      NFormItemGi: {
        template: '<div class="form-item"><slot /><slot name="feedback" /></div>',
      },
    },
  },
}

const mountWrapper = () => mount(TestWrapper, mountOptions)

const getFormattedCode = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent(NCode).props('code') as string

describe('JsonFormatter', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    objectUrlState.value = 'available'
  })

  it('formats the default JSON using the default indentation', () => {
    const wrapper = mountWrapper()
    const textarea = wrapper.find('textarea')
    const rawValue = (textarea.element as HTMLTextAreaElement).value
    const expected = JSON.stringify(JSON.parse(rawValue), null, 2)

    expect(getFormattedCode(wrapper)).toBe(expected)
  })

  it('shows an error when JSON is invalid', async () => {
    const wrapper = mountWrapper()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('{')
    await flushPromises()

    const formatter = wrapper.findComponent(JsonFormatter)
    const formatterVm = formatter.vm as unknown as { jsonError: string }
    expect(formatterVm.jsonError).toContain('Invalid JSON')
    expect(getFormattedCode(wrapper)).toMatch(/^# Invalid JSON:/)
  })

  it('clears output and errors when JSON is empty', async () => {
    const wrapper = mountWrapper()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('   ')
    await flushPromises()

    expect(getFormattedCode(wrapper)).toBe('')
    expect(wrapper.text()).not.toContain('Invalid JSON')
  })

  it('uses a fallback message for non-error throws', async () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, 'parse')
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === '__boom__') {
          throw 'boom'
        }
        return originalParse(...args)
      })

    const wrapper = mountWrapper()
    const textarea = wrapper.find('textarea')

    await textarea.setValue('__boom__')
    await flushPromises()

    expect(getFormattedCode(wrapper)).toContain('Unknown error')
    expect(wrapper.text()).toContain('Unknown error')

    parseSpy.mockRestore()
  })

  it('omits download href when no object url is available', () => {
    objectUrlState.value = 'missing'
    const wrapper = mountWrapper()
    const link = wrapper.find('a[download="formatted.json"]')

    expect(link.attributes('href')).toBeUndefined()
  })

  it('updates formatting when indentation changes', async () => {
    const wrapper = mountWrapper()
    const textarea = wrapper.find('textarea')
    const inputNumber = wrapper.findComponent(NInputNumber)

    await inputNumber.vm.$emit('update:value', 4)
    await flushPromises()

    const rawValue = (textarea.element as HTMLTextAreaElement).value
    const expected = JSON.stringify(JSON.parse(rawValue), null, 4)

    expect(getFormattedCode(wrapper)).toBe(expected)
  })

  it('imports JSON from a file selection', async () => {
    fileOpenMock.mockResolvedValue({
      text: async () => '{"name":"demo"}',
    })

    const wrapper = mountWrapper()
    const button = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Import from file'))

    expect(button).toBeTruthy()

    await button!.trigger('click')
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toBe('{"name":"demo"}')
  })
})
