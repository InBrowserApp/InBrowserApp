import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import CssGradientOutputPanel from './CssGradientOutputPanel.vue'
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const makeStub = (name: string) =>
    defineComponent({
      name,
      template: '<div><slot /></div>',
    })
  const NButton = defineComponent({
    name: 'NButton',
    props: {
      tag: {
        type: String,
        default: 'button',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['click'],
    template:
      '<component :is="tag" v-bind="$attrs" :disabled="disabled" @click="$emit(\'click\', $event)"><slot /><slot name="icon" /></component>',
  })
  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: 'text',
      },
    },
    template:
      '<textarea v-if="type === \'textarea\'" :value="value" v-bind="$attrs" /><input v-else :value="value" v-bind="$attrs" />',
  })
  const NSelect = defineComponent({
    name: 'NSelect',
    props: {
      value: {
        type: String,
        default: '',
      },
      options: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div />',
  })
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NButton,
    NCard: makeStub('NCard'),
    NIcon: makeStub('NIcon'),
    NInput,
    NSelect,
  }
})
const CopyToClipboardButtonStub = defineComponent({
  name: 'CopyToClipboardButton',
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  template: '<button><slot name="label" /></button>',
})
describe('CssGradientOutputPanel', () => {
  it('renders output controls and toggles blend mode copy button', async () => {
    const wrapper = mount(CssGradientOutputPanel, {
      props: {
        outputFormat: 'hex',
        cssOutput: 'body { }',
        backgroundImageDeclaration: 'background-image: linear-gradient(#000, #fff);',
        backgroundBlendDeclaration: 'background-blend-mode: multiply;',
        backgroundShorthand: 'background: linear-gradient(#000, #fff);',
        hasBlendModes: false,
      },
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })
    expect(wrapper.findAllComponents(CopyToClipboardButtonStub)).toHaveLength(3)
    expect(wrapper.get('[data-testid="download-css"]').attributes('disabled')).toBeDefined()
    expect((wrapper.get('[data-testid="css-output"]').element as HTMLTextAreaElement).value).toBe(
      'body { }',
    )
    await wrapper.setProps({ hasBlendModes: true, cssUrl: 'blob:mock' })
    expect(wrapper.findAllComponents(CopyToClipboardButtonStub)).toHaveLength(4)
    expect(wrapper.get('[data-testid="download-css"]').attributes('href')).toBe('blob:mock')
  })
  it('emits format updates', () => {
    const wrapper = mount(CssGradientOutputPanel, {
      props: {
        outputFormat: 'hex',
        cssOutput: 'body { }',
        backgroundImageDeclaration: 'background-image: linear-gradient(#000, #fff);',
        backgroundBlendDeclaration: 'background-blend-mode: multiply;',
        backgroundShorthand: 'background: linear-gradient(#000, #fff);',
        hasBlendModes: false,
      },
      global: {
        stubs: {
          CopyToClipboardButton: CopyToClipboardButtonStub,
        },
      },
    })
    const select = wrapper.findComponent({ name: 'NSelect' })
    select.vm.$emit('update:value', 'rgba')
    expect(wrapper.emitted('update:outputFormat')?.[0]).toEqual(['rgba'])
  })
})
