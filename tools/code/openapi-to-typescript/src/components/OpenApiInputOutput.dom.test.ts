import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
const { registerLanguageMock } = vi.hoisted(() => ({
  registerLanguageMock: vi.fn(),
}))
vi.mock('@shared/ui/tool', async () => {
  const { defineComponent } = await import('vue')
  return {
    ToolSection: defineComponent({
      name: 'ToolSection',
      template: '<section><slot /></section>',
    }),
    ToolSectionHeader: defineComponent({
      name: 'ToolSectionHeader',
      template: '<h2><slot /></h2>',
    }),
  }
})
vi.mock('@shared/ui/base', async () => {
  const { defineComponent } = await import('vue')
  return {
    TextOrFileInput: defineComponent({
      name: 'TextOrFileInput',
      props: {
        value: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          default: undefined,
        },
        placeholder: {
          type: String,
          default: '',
        },
        accept: {
          type: String,
          default: '',
        },
      },
      emits: ['update:value'],
      template:
        '<input data-testid="text-or-file-input" :value="value" :data-status="status" @input="$emit(\'update:value\', $event.target.value)" />',
    }),
  }
})
vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const actual = (await vi.importActual('naive-ui')) as Record<string, unknown>
  return {
    ...actual,
    NAlert: defineComponent({
      name: 'NAlert',
      template: '<div data-testid="alert"><slot /></div>',
    }),
    NCard: defineComponent({
      name: 'NCard',
      template: '<div data-testid="card"><slot /></div>',
    }),
    NCode: defineComponent({
      name: 'NCode',
      props: {
        code: {
          type: String,
          default: '',
        },
      },
      template: '<pre data-testid="code">{{ code }}</pre>',
    }),
    NSpin: defineComponent({
      name: 'NSpin',
      template: '<div><slot /></div>',
    }),
  }
})
vi.mock('highlight.js/lib/core', () => ({
  default: {
    registerLanguage: registerLanguageMock,
  },
}))
vi.mock('highlight.js/lib/languages/typescript', () => ({
  default: {},
}))
import OpenApiInputOutput from './OpenApiInputOutput.vue'
describe('OpenApiInputOutput', () => {
  it('renders output text and external refs', () => {
    const wrapper = mount(OpenApiInputOutput, {
      props: {
        openApiText: 'openapi',
        accept: '.json',
        inputError: '',
        inputStatus: 'success',
        outputError: '',
        outputText: 'types output',
        externalRefs: ['https://example.com/schema'],
        isGenerating: false,
        handleInput: vi.fn(),
      },
    })
    expect(wrapper.text()).toContain('types output')
    expect(wrapper.text()).toContain('https://example.com/schema')
    expect(registerLanguageMock).toHaveBeenCalledWith('typescript', {})
  })
  it('shows the empty state and handles input updates', async () => {
    const handleInput = vi.fn()
    const wrapper = mount(OpenApiInputOutput, {
      props: {
        openApiText: '',
        accept: '.json',
        inputError: '',
        inputStatus: undefined,
        outputError: '',
        outputText: '',
        externalRefs: [],
        isGenerating: false,
        handleInput,
      },
    })
    expect(wrapper.text()).toContain('Provide a valid OpenAPI document to generate types.')
    await wrapper.get('[data-testid="text-or-file-input"]').setValue('new text')
    expect(handleInput).toHaveBeenCalledWith('new text')
  })
  it('shows output error messages', () => {
    const wrapper = mount(OpenApiInputOutput, {
      props: {
        openApiText: 'openapi',
        accept: '.json',
        inputError: '',
        inputStatus: 'success',
        outputError: 'Something went wrong',
        outputText: '',
        externalRefs: [],
        isGenerating: false,
        handleInput: vi.fn(),
      },
    })
    expect(wrapper.text()).toContain('Something went wrong')
    expect(wrapper.find('[data-testid="alert"]').exists()).toBe(true)
  })
  it('renders input validation feedback', () => {
    const wrapper = mount(OpenApiInputOutput, {
      props: {
        openApiText: 'openapi',
        accept: '.json',
        inputError: 'Input error',
        inputStatus: 'error',
        outputError: '',
        outputText: '',
        externalRefs: [],
        isGenerating: false,
        handleInput: vi.fn(),
      },
    })
    expect(wrapper.text()).toContain('Input error')
  })
})
