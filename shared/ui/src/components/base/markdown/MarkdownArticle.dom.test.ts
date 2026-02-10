import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MarkdownArticle from './MarkdownArticle.vue'

describe('MarkdownArticle', () => {
  it('renders parsed markdown html and updates when props change', async () => {
    const wrapper = mount(MarkdownArticle, {
      props: {
        markdown: '# Title\n\n[Docs](https://example.com)',
      },
    })

    expect(wrapper.find('.markdown').html()).toContain('<h1')
    expect(wrapper.find('.markdown').html()).toContain('href="https://example.com"')

    await wrapper.setProps({ markdown: '**Updated**' })

    expect(wrapper.find('.markdown').html()).toContain('<strong>Updated</strong>')
  })
})
