import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider, NTag } from 'naive-ui'
import GitignoreGenerator from './GitignoreGenerator.vue'

const storageKey = 'tools:gitignore-generator:selected'

const TestWrapper = {
  setup() {
    return () => h(NMessageProvider, () => h(GitignoreGenerator))
  },
}

describe('GitignoreGenerator', () => {
  beforeEach(() => {
    localStorage.removeItem(storageKey)
  })

  it('starts with an empty preview and disabled download', () => {
    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')

    expect((textarea.element as HTMLTextAreaElement).value).toBe('')

    const downloadButton = wrapper
      .findAll('button')
      .find((candidate) => candidate.text().includes('Download'))

    expect(downloadButton).toBeTruthy()
    expect(downloadButton!.attributes('disabled')).toBeDefined()
  })

  it('loads stored selections into the preview', () => {
    localStorage.setItem(storageKey, JSON.stringify(['Node', 'Python']))

    const wrapper = mount(TestWrapper)
    const textarea = wrapper.find('textarea')
    const preview = (textarea.element as HTMLTextAreaElement).value

    expect(preview).toContain('### Node ###')
    expect(preview).toContain('### Python ###')
  })

  it('toggles templates from quick select tags', async () => {
    const wrapper = mount(TestWrapper)
    const tags = wrapper.findAllComponents(NTag)
    const nodeTag = tags.find((tag) => tag.text().includes('Node'))

    if (!nodeTag) {
      throw new Error('Node tag not found')
    }

    await nodeTag.vm.$emit('update:checked', true)
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toContain('### Node ###')

    await nodeTag.vm.$emit('update:checked', true)
    await flushPromises()

    expect((textarea.element as HTMLTextAreaElement).value).toBe('')
  })
})
