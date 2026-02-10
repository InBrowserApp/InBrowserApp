import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

vi.mock('jmespath', () => ({
  search: (_json: unknown, expression: string) => {
    if (expression === 'throw-string') {
      throw 'string jmes error'
    }

    if (expression === 'people[*].last') {
      return ['Smith', 'Jones']
    }

    return null
  },
}))

import JmesPathTester from './JmesPathTester.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JmesPathTester))
  },
}

const getTextarea = (wrapper: ReturnType<typeof mount>, index: number) => {
  const textareas = wrapper.findAll('textarea')
  const textarea = textareas[index]

  if (!textarea) {
    throw new Error(`Textarea at index ${index} not found`)
  }

  return textarea
}

describe('JmesPathTester non-error handling', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    localStorage.clear()
  })

  it('stringifies non-Error search failures', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = getTextarea(wrapper, 1)

    await queryInput.setValue('throw-string')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JMESPath: string jmes error')
  })

  it('stringifies non-Error JSON parse failures', async () => {
    const originalParse = JSON.parse
    const parseSpy = vi
      .spyOn(JSON, 'parse')
      .mockImplementation((...args: Parameters<typeof JSON.parse>) => {
        if (args[0] === '__boom__') {
          throw 'boom'
        }

        return originalParse(...args)
      })

    try {
      const wrapper = mount(TestWrapper)
      const jsonInput = getTextarea(wrapper, 0)

      await jsonInput.setValue('__boom__')
      await flushPromises()

      expect(wrapper.text()).toContain('Invalid JSON: boom')
    } finally {
      parseSpy.mockRestore()
    }
  })
})
