import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import RobotsTxtTesterView from './RobotsTxtTesterView.vue'

const ToolDefaultPageLayoutStub = defineComponent({
  name: 'ToolDefaultPageLayout',
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  template: '<div><slot /></div>',
})

describe('RobotsTxtTesterView', () => {
  it('renders the tester page', () => {
    const wrapper = mount(RobotsTxtTesterView, {
      global: {
        stubs: {
          ToolDefaultPageLayout: ToolDefaultPageLayoutStub,
          CopyToClipboardButton: true,
          DescriptionMarkdown: true,
        },
      },
    })

    expect(wrapper.text()).toContain('robots.txt')
  })
})
