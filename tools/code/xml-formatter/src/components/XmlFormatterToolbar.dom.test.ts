import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { NCheckbox, NRadioGroup, NSelect } from 'naive-ui'
import XmlFormatterToolbar from './XmlFormatterToolbar.vue'

const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  template: '<button class="copy" :disabled="disabled">{{ content }}</button>',
})

const mountWrapper = () =>
  mount(XmlFormatterToolbar, {
    props: {
      collapseContent: true,
      downloadFileName: 'formatted.xml',
      downloadUrl: 'blob:download',
      errorColumn: undefined,
      errorLine: undefined,
      forceSelfClosingEmptyTag: false,
      hasInvalidXml: false,
      hasValidXml: true,
      outputXml: '<root/>',
      selectedIndentation: '2-spaces',
      selectedLineEnding: 'lf',
      selectedMode: 'formatted',
    },
    global: {
      stubs: {
        CopyToClipboardButton: CopyToClipboardButtonStub,
      },
    },
  })

describe('XmlFormatterToolbar', () => {
  it('emits toolbar actions', async () => {
    const wrapper = mountWrapper()
    const buttons = wrapper.findAll('button')

    await buttons[0]!.trigger('click')
    await buttons[1]!.trigger('click')
    await buttons[2]!.trigger('click')

    expect(wrapper.emitted('import')).toHaveLength(1)
    expect(wrapper.emitted('use-example')).toHaveLength(1)
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('emits option updates and shows valid status', async () => {
    const wrapper = mountWrapper()

    await wrapper.findComponent(NRadioGroup).vm.$emit('update:value', 'minified')
    const selects = wrapper.findAllComponents(NSelect)
    await selects[0]!.vm.$emit('update:value', 'tab')
    await selects[1]!.vm.$emit('update:value', 'crlf')
    const checkboxes = wrapper.findAllComponents(NCheckbox)
    await checkboxes[0]!.vm.$emit('update:checked', false)
    await checkboxes[1]!.vm.$emit('update:checked', true)

    expect(wrapper.emitted('update:selected-mode')?.[0]).toEqual(['minified'])
    expect(wrapper.emitted('update:selected-indentation')?.[0]).toEqual(['tab'])
    expect(wrapper.emitted('update:selected-line-ending')?.[0]).toEqual(['crlf'])
    expect(wrapper.emitted('update:collapse-content')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:force-self-closing-empty-tag')?.[0]).toEqual([true])
    expect(wrapper.text()).toContain('Valid XML')
  })

  it('shows invalid status details', () => {
    const wrapper = mount(XmlFormatterToolbar, {
      props: {
        collapseContent: true,
        downloadFileName: 'formatted.xml',
        downloadUrl: undefined,
        errorColumn: 9,
        errorLine: 4,
        forceSelfClosingEmptyTag: false,
        hasInvalidXml: true,
        hasValidXml: false,
        outputXml: '',
        selectedIndentation: '2-spaces',
        selectedLineEnding: 'lf',
        selectedMode: 'formatted',
      },
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })

    expect(wrapper.text()).toContain('Invalid XML')
    expect(wrapper.text()).toContain('4:9')
  })
})
