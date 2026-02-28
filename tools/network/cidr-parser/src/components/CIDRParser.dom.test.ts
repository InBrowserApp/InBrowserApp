import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CIDRParser from './CIDRParser.vue'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

const CIDRInputStub = defineComponent({
  name: 'CIDRInputFormItem',
  props: {
    cidr: {
      type: String,
      default: '',
    },
  },
  emits: ['update:cidr'],
  template: '<div class="cidr-input" />',
})

const CIDRParseResultStub = defineComponent({
  name: 'CIDRParseResult',
  props: {
    cidr: {
      type: String,
      default: '',
    },
  },
  template: '<div class="cidr-result" :data-cidr="cidr" />',
})

describe('CIDRParser', () => {
  it('renders input and hides results until CIDR is provided', async () => {
    const wrapper = mount(CIDRParser, {
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
          CIDRInputFormItem: CIDRInputStub,
          CIDRParseResult: CIDRParseResultStub,
        },
      },
    })

    expect(wrapper.text()).toContain('CIDR')
    expect(wrapper.find('.cidr-result').exists()).toBe(false)

    wrapper.findComponent(CIDRInputStub).vm.$emit('update:cidr', '192.168.0.0/24')
    await nextTick()

    const result = wrapper.find('.cidr-result')
    expect(wrapper.text()).toContain('Result')
    expect(result.exists()).toBe(true)
    expect(result.attributes('data-cidr')).toBe('192.168.0.0/24')
  })
})
