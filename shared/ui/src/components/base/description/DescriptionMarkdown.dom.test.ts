import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import DescriptionMarkdown from './DescriptionMarkdown.vue'

const ToolSectionHeaderStub = defineComponent({
  name: 'ToolSectionHeader',
  template: '<h3 class="section-header"><slot /></h3>',
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="section"><slot /></section>',
})

const MarkdownArticleStub = defineComponent({
  name: 'MarkdownArticle',
  props: {
    markdown: {
      type: String,
      default: '',
    },
  },
  template: '<article class="markdown" :data-markdown="markdown" />',
})

describe('DescriptionMarkdown', () => {
  it('renders title and passes markdown to article component', () => {
    const wrapper = mount(DescriptionMarkdown, {
      props: {
        title: 'Overview',
        description: 'Some **markdown** text',
      },
      global: {
        stubs: {
          ToolSectionHeader: ToolSectionHeaderStub,
          ToolSection: ToolSectionStub,
          MarkdownArticle: MarkdownArticleStub,
        },
      },
    })

    expect(wrapper.get('.section-header').text()).toContain('Overview')
    expect(wrapper.get('.markdown').attributes('data-markdown')).toBe('Some **markdown** text')
  })
})
