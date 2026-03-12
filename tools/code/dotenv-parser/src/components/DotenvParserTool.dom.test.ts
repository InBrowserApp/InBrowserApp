import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { TextOrFileInput } from '@shared/ui/base'
import DotenvParserTool from './DotenvParserTool.vue'

async function flush() {
  await Promise.resolve()
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

function mountTool() {
  return mount(DotenvParserTool, {
    global: {
      stubs: {
        CopyToClipboardButton: {
          template: '<button data-testid="copy-button" />',
        },
      },
    },
  })
}

const InputSectionStub = defineComponent({
  name: 'DotenvInputSection',
  props: {
    value: {
      type: [String, Object],
      required: true,
    },
    status: {
      type: String,
      default: undefined,
    },
  },
  template: `
    <div data-testid="input-section" :data-status="status ?? ''">
      <button class="load-sample" @click="$emit('load-sample')">load</button>
      <button class="set-input" @click="$emit('update:value', 'TOKEN=one\\nTOKEN=two')">set</button>
    </div>
  `,
})

const OptionsSectionStub = defineComponent({
  name: 'DotenvOptionsSection',
  props: {
    mode: {
      type: String,
      required: true,
    },
    duplicateStrategy: {
      type: String,
      required: true,
    },
    maskValues: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    <div
      data-testid="options-section"
      :data-mode="mode"
      :data-duplicate="duplicateStrategy"
      :data-mask="String(maskValues)"
    >
      <button class="set-strict" @click="$emit('update:mode', 'strict')">strict</button>
      <button class="set-first" @click="$emit('update:duplicateStrategy', 'first-wins')">first</button>
      <button class="set-mask" @click="$emit('update:maskValues', true)">mask</button>
    </div>
  `,
})

const SummaryCardsStub = defineComponent({
  name: 'DotenvSummaryCards',
  props: {
    stats: {
      type: Object,
      required: true,
    },
  },
  template:
    '<div data-testid="summary-section" :data-entries="stats.entryCount" :data-duplicates="stats.duplicateCount" />',
})

const DiagnosticsSectionStub = defineComponent({
  name: 'DotenvDiagnosticsSection',
  props: {
    diagnostics: {
      type: Array,
      required: true,
    },
  },
  template: '<div data-testid="diagnostics-section" :data-count="diagnostics.length" />',
})

const ResultsSectionStub = defineComponent({
  name: 'DotenvResultsSection',
  props: {
    activeTab: {
      type: String,
      required: true,
    },
    entries: {
      type: Array,
      required: true,
    },
    duplicateStrategy: {
      type: String,
      required: true,
    },
    maskValues: {
      type: Boolean,
      required: true,
    },
    jsonOutput: {
      type: String,
      required: true,
    },
    normalizedOutput: {
      type: String,
      required: true,
    },
  },
  template: `
    <div
      data-testid="results-section"
      :data-tab="activeTab"
      :data-entries="entries.length"
      :data-duplicate="duplicateStrategy"
      :data-mask="String(maskValues)"
      :data-json="jsonOutput"
      :data-normalized="normalizedOutput"
    >
      <button class="set-json" @click="$emit('update:activeTab', 'json')">json</button>
    </div>
  `,
})

describe('DotenvParserTool', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('parses input, shows diagnostics, and persists only preferences', async () => {
    const wrapper = mountTool()

    expect(wrapper.text()).toContain('Add a .env file or paste text to inspect it.')

    const input = wrapper.findComponent(TextOrFileInput)
    input.vm.$emit(
      'update:value',
      'API_URL=https://example.com\nAPI_URL=https://override.test\nBROKEN',
    )
    await flush()

    expect(wrapper.text()).toContain('Variables')
    expect(wrapper.text()).toContain('2')
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('Duplicate key "API_URL"')
    expect(wrapper.text()).toContain('Expected "=" in assignment.')
    expect(wrapper.text()).toContain('https://override.test')

    const storageKeys = Object.keys(localStorage)
    expect(storageKeys.some((key) => key.includes('dotenv-parser:mode'))).toBe(true)
    expect(storageKeys.some((key) => key.includes('dotenv-parser:duplicate-strategy'))).toBe(true)
    expect(storageKeys.some((key) => key.includes('dotenv-parser:mask-values'))).toBe(true)
    expect(storageKeys.some((key) => key.includes('dotenv-parser:input'))).toBe(false)
  })

  it('loads the sample, masks values, and updates JSON and normalized outputs', async () => {
    const wrapper = mountTool()

    await wrapper.get('button').trigger('click')
    await flush()

    expect(wrapper.text()).toContain('APP_NAME')
    expect(wrapper.text()).toContain('BROKEN_LINE')

    localStorage.setItem('tools:dotenv-parser:mask-values', 'true')
    localStorage.setItem('tools:dotenv-parser:active-tab', 'json')
    const remounted = mountTool()
    await remounted.get('button').trigger('click')
    await flush()

    expect(remounted.text()).toContain('Values are masked in the current output view.')
    expect(remounted.text()).toContain('"APP_NAME": "••••••"')

    localStorage.setItem('tools:dotenv-parser:active-tab', 'normalized')
    const normalizedView = mountTool()
    await normalizedView.get('button').trigger('click')
    await flush()
    expect(normalizedView.text()).toContain('APP_NAME=••••••')
    expect(normalizedView.text()).toContain('Comments and invalid lines are omitted.')
  })

  it('parses uploaded files and supports first-wins duplicate resolution', async () => {
    const wrapper = mountTool()
    const file = new File(['TOKEN=one\nTOKEN=two'], 'example.env', { type: 'text/plain' })

    wrapper.findComponent(TextOrFileInput).vm.$emit('update:value', file)
    await flush()

    expect(wrapper.text()).toContain('TOKEN')
    expect(wrapper.text()).toContain('two')

    localStorage.setItem('tools:dotenv-parser:duplicate-strategy', 'first-wins')
    localStorage.setItem('tools:dotenv-parser:active-tab', 'json')
    const remounted = mountTool()
    remounted.findComponent(TextOrFileInput).vm.$emit('update:value', 'TOKEN=one\nTOKEN=two')
    await flush()

    expect(remounted.text()).toContain('"TOKEN": "one"')
  })

  it('handles file read failures by falling back to empty output', async () => {
    const wrapper = mountTool()

    wrapper.findComponent(TextOrFileInput).vm.$emit('update:value', {
      text: async () => {
        throw new Error('failed')
      },
    })
    await flush()

    expect(wrapper.text()).toContain('Add a .env file or paste text to inspect it.')
  })

  it('wires child section v-models and derived outputs together', async () => {
    const wrapper = mount(DotenvParserTool, {
      global: {
        stubs: {
          DotenvInputSection: InputSectionStub,
          DotenvOptionsSection: OptionsSectionStub,
          DotenvSummaryCards: SummaryCardsStub,
          DotenvDiagnosticsSection: DiagnosticsSectionStub,
          DotenvResultsSection: ResultsSectionStub,
        },
      },
    })

    await wrapper.get('.load-sample').trigger('click')
    await flush()

    expect(wrapper.get('[data-testid="summary-section"]').attributes('data-entries')).toBe('5')
    expect(wrapper.get('[data-testid="diagnostics-section"]').attributes('data-count')).toBe('2')
    expect(wrapper.get('[data-testid="results-section"]').attributes('data-json')).toContain(
      'APP_NAME',
    )

    await wrapper.get('.set-strict').trigger('click')
    await wrapper.get('.set-first').trigger('click')
    await wrapper.get('.set-mask').trigger('click')
    await wrapper.get('.set-json').trigger('click')
    await flush()

    expect(wrapper.get('[data-testid="options-section"]').attributes('data-mode')).toBe('strict')
    expect(wrapper.get('[data-testid="options-section"]').attributes('data-duplicate')).toBe(
      'first-wins',
    )
    expect(wrapper.get('[data-testid="options-section"]').attributes('data-mask')).toBe('true')
    expect(wrapper.get('[data-testid="results-section"]').attributes('data-tab')).toBe('json')
    expect(wrapper.get('[data-testid="results-section"]').attributes('data-json')).toContain(
      '••••••',
    )
    expect(localStorage.getItem('tools:dotenv-parser:mode')).toBe('strict')
    expect(localStorage.getItem('tools:dotenv-parser:duplicate-strategy')).toBe('first-wins')
    expect(localStorage.getItem('tools:dotenv-parser:mask-values')).toBe('true')
    expect(localStorage.getItem('tools:dotenv-parser:active-tab')).toBe('json')
  })
})
