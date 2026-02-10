import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h } from 'vue'
import { NMessageProvider, NTag } from 'naive-ui'
import GitignoreGenerator from './GitignoreGenerator.vue'
import { getTemplatesByCategory } from '../templates'

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

    const downloadLink = wrapper
      .findAll('a')
      .find((candidate) => candidate.text().includes('Download'))

    expect(downloadLink).toBeTruthy()
    expect(downloadLink!.attributes('href')).toBeUndefined()
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

  it('filters templates and expands categories when searching', async () => {
    const wrapper = mount(TestWrapper)
    const selector = wrapper.findComponent({ name: 'GitignoreTemplateSelector' })
    const grouped = getTemplatesByCategory()
    const toNames = (list: Array<{ name: string }>) => list.map((item) => item.name)
    const filterNames = (list: Array<{ name: string }>, query: string) =>
      list.filter((item) => item.name.toLowerCase().includes(query)).map((item) => item.name)

    const testQueries = [
      grouped.language[0]?.name,
      grouped.global[0]?.name,
      grouped.community[0]?.name,
    ].filter((name): name is string => Boolean(name))

    for (const name of testQueries) {
      const query = name.toLowerCase()
      await selector.vm.$emit('update:search-query', query)
      await flushPromises()

      const expectedLanguage = filterNames(grouped.language, query)
      const expectedGlobal = filterNames(grouped.global, query)
      const expectedCommunity = filterNames(grouped.community, query)

      expect(
        toNames(
          selector.props('filteredLanguageTemplates') as Array<{
            name: string
          }>,
        ),
      ).toEqual(expectedLanguage)
      expect(
        toNames(
          selector.props('filteredGlobalTemplates') as Array<{
            name: string
          }>,
        ),
      ).toEqual(expectedGlobal)
      expect(
        toNames(
          selector.props('filteredCommunityTemplates') as Array<{
            name: string
          }>,
        ),
      ).toEqual(expectedCommunity)

      const expectedExpanded: string[] = []
      if (expectedLanguage.length) expectedExpanded.push('language')
      if (expectedGlobal.length) expectedExpanded.push('global')
      if (expectedCommunity.length) expectedExpanded.push('community')

      expect(selector.props('expandedNames')).toEqual(expectedExpanded)
    }

    const expandedBeforeClearing = selector.props('expandedNames')
    await selector.vm.$emit('update:search-query', '')
    await flushPromises()

    expect(selector.props('expandedNames')).toEqual(expandedBeforeClearing)
  })

  it('accepts v-model updates from the selector', async () => {
    const wrapper = mount(TestWrapper)
    const selector = wrapper.findComponent({ name: 'GitignoreTemplateSelector' })

    await selector.vm.$emit('update:selected-templates', ['Node'])
    await flushPromises()

    const textarea = wrapper.find('textarea')
    expect((textarea.element as HTMLTextAreaElement).value).toContain('### Node ###')

    await selector.vm.$emit('update:expanded-names', ['global'])
    await flushPromises()

    expect(selector.props('expandedNames')).toEqual(['global'])
  })
})
