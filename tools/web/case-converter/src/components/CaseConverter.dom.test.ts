import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import CaseConverter from './CaseConverter.vue'

vi.mock('@vueuse/core', async () => {
  const { ref } = await import('vue')
  return {
    useStorage: (_key: string, initialValue: string) => ref(initialValue),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  return {
    NFlex: defineComponent({
      name: 'NFlex',
      template: '<div class="n-flex"><slot /></div>',
    }),
    NButton: defineComponent({
      name: 'NButton',
      emits: ['click'],
      template: '<button class="n-button" @click="$emit(\'click\')"><slot /></button>',
    }),
    NInput: defineComponent({
      name: 'NInput',
      props: {
        value: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template:
        '<textarea data-testid="case-input" class="n-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
    NGrid: defineComponent({
      name: 'NGrid',
      template: '<div class="n-grid"><slot /></div>',
    }),
    NGi: defineComponent({
      name: 'NGi',
      template: '<div class="n-gi"><slot /></div>',
    }),
  }
})

const ToolSectionStub = defineComponent({
  name: 'ToolSection',
  template: '<section class="tool-section"><slot /></section>',
})

const CaseOutputStub = defineComponent({
  name: 'CaseOutput',
  props: {
    label: { type: String, default: '' },
    value: { type: String, default: '' },
  },
  template: '<div class="case-output" :data-label="label" :data-value="value" />',
})

const stubs = {
  ToolSection: ToolSectionStub,
  CaseOutput: CaseOutputStub,
}

const getOutputs = (wrapper: ReturnType<typeof mount>) =>
  Object.fromEntries(
    wrapper
      .findAll('.case-output')
      .map((node) => [node.attributes('data-label'), node.attributes('data-value')]),
  )

describe('CaseConverter', () => {
  it('renders case outputs for the default input', () => {
    const wrapper = mount(CaseConverter, {
      global: { stubs },
    })

    const outputs = getOutputs(wrapper)
    expect(outputs.camelCase).toBe('helloWorldExample')
    expect(outputs.PascalCase).toBe('HelloWorldExample')
    expect(outputs['snake_case']).toBe('hello_world_example')
    expect(outputs['SCREAMING_SNAKE_CASE']).toBe('HELLO_WORLD_EXAMPLE')
    expect(outputs.UPPERCASE).toBe('HELLO WORLD EXAMPLE')
    expect(outputs.lowercase).toBe('hello world example')
  })

  it('updates outputs when the input changes', async () => {
    const wrapper = mount(CaseConverter, {
      global: { stubs },
    })

    const input = wrapper.get('[data-testid="case-input"]')
    await input.setValue('my sample')
    await nextTick()

    const outputs = getOutputs(wrapper)
    expect(outputs.camelCase).toBe('mySample')
    expect(outputs['Title Case']).toBe('My Sample')
    expect(outputs['Sentence case']).toBe('My sample')
  })

  it('clears the input and outputs', async () => {
    const wrapper = mount(CaseConverter, {
      global: { stubs },
    })

    await wrapper.find('button.n-button').trigger('click')
    await nextTick()

    const input = wrapper.get('[data-testid="case-input"]').element as HTMLTextAreaElement
    expect(input.value).toBe('')

    const outputs = getOutputs(wrapper)
    expect(outputs.camelCase).toBe('')
    expect(outputs['Title Case']).toBe('')
  })
})
