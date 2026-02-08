import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider } from 'naive-ui'

const fileOpenMock = vi.fn()

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

vi.mock('jsonpath-plus', () => ({
  JSONPath: ({ path, resultType }: { path: string; resultType: 'value' | 'path' }) => {
    if (path === '$.forceStringError') {
      throw 'string failure'
    }

    if (resultType === 'path') {
      return ['$.store.book[0].author']
    }

    return ['Nigel Rees']
  },
}))

import JsonPathTester from './JsonPathTester.vue'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(JsonPathTester))
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

describe('JsonPathTester non-error handling', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    localStorage.clear()
  })

  it('stringifies non-Error JSONPath failures', async () => {
    const wrapper = mount(TestWrapper)
    const queryInput = getTextarea(wrapper, 1)

    await queryInput.setValue('$.forceStringError')
    await flushPromises()

    expect(wrapper.text()).toContain('Invalid JSONPath: string failure')
  })
})
