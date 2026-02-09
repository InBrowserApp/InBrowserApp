import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import SearchPageLabel from './SearchPageLabel.vue'
import { renderSearchActionLabel, useSearchAction } from './useSearchAction'

describe('useSearchAction', () => {
  it('builds a reactive search action option from query text', () => {
    const query = ref('hash')
    const { searchActionOption } = useSearchAction(query)

    expect(searchActionOption.value).toEqual({
      label: 'Search hash',
      value: 'search:hash',
      action: 'search',
      query: 'hash',
    })

    query.value = 'uuid'

    expect(searchActionOption.value.label).toBe('Search uuid')
    expect(searchActionOption.value.value).toBe('search:uuid')
  })

  it('renders the search action label with SearchPageLabel', () => {
    const vnode = renderSearchActionLabel({
      label: 'Search text',
      value: 'search:text',
      action: 'search',
      query: 'text',
    }) as unknown as {
      type: unknown
      props: {
        query: string
      }
    }

    expect(vnode.type).toBe(SearchPageLabel)
    expect(vnode.props.query).toBe('text')
  })
})
