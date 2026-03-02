import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MimeTypeIntro from './MimeTypeIntro.vue'
vi.mock('naive-ui', async () => {
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
  }
})
describe('MimeTypeIntro', () => {
  it('renders the title and description', () => {
    const wrapper = mount(MimeTypeIntro, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })
    expect(wrapper.text()).toContain('What is a MIME Type?')
    expect(wrapper.text()).toContain(
      'MIME (Multipurpose Internet Mail Extensions) types are a standard way of indicating the nature and format of a document or file. They are used by web browsers and servers to determine how to handle files. MIME types consist of a type and a subtype, separated by a slash (e.g., text/html). The main categories are:',
    )
  })
})
