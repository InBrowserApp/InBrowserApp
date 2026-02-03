import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref, defineComponent, nextTick, type Ref } from 'vue'
import RandomPasswordGenerator from './RandomPasswordGenerator.vue'

const storage = vi.hoisted(() => new Map<string, Ref<unknown>>())

vi.mock('@vueuse/core', () => ({
  useStorage: (key: string, initialValue: unknown) => {
    if (!storage.has(key)) {
      storage.set(key, ref(initialValue))
    }
    return storage.get(key) as Ref<unknown>
  },
}))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    template: '<section class="tool-section"><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<h3 class="tool-section-header"><slot /></h3>',
  },
}))

vi.mock('@shared/ui/base', () => ({
  CopyToClipboardTooltip: {
    name: 'CopyToClipboardTooltip',
    props: ['content'],
    template: '<span class="copy-tooltip"><slot :copy="() => {}" /></span>',
  },
  CopyToClipboardButton: {
    name: 'CopyToClipboardButton',
    props: ['content'],
    template: '<button class="copy-button" :data-content="content">Copy</button>',
  },
  RegenerateButton: {
    name: 'RegenerateButton',
    emits: ['click'],
    template: '<button class="regenerate" @click="$emit(\'click\')">Regenerate</button>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')
  const Base = defineComponent({
    template: '<div class="base"><slot /></div>',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  return {
    NTabs: Base,
    NTabPane: Base,
    NText,
    NFlex: Base,
    NIcon: Base,
    NGrid: Base,
    NGi: Base,
  }
})

vi.mock('@vicons/fluent/NumberSymbol16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'PinIcon',
      template: '<svg class="pin-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/TextChangeCase16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'WordsIcon',
      template: '<svg class="words-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/LineHorizontal120Filled', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'SeparatorIcon',
      template: '<svg class="separator-icon" />',
    }),
  }
})

vi.mock('@vicons/fluent/MathSymbols16Regular', async () => {
  const { defineComponent } = await import('vue')
  return {
    default: defineComponent({
      name: 'RandomIcon',
      template: '<svg class="random-icon" />',
    }),
  }
})

const RandomTabStub = defineComponent({
  name: 'RandomTab',
  props: {
    nonce: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  mounted() {
    this.$emit('update:value', 'random-value')
  },
  template: '<div class="random-tab" />',
})

const WordsTabStub = defineComponent({
  name: 'WordsTab',
  props: {
    nonce: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  mounted() {
    this.$emit('update:value', 'words-value')
  },
  template: '<div class="words-tab" />',
})

const SeparatorTabStub = defineComponent({
  name: 'SeparatorTab',
  props: {
    nonce: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  mounted() {
    this.$emit('update:value', 'separator-value')
  },
  template: '<div class="separator-tab" />',
})

const PinTabStub = defineComponent({
  name: 'PinTab',
  props: {
    nonce: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      default: '',
    },
  },
  emits: ['update:value'],
  mounted() {
    this.$emit('update:value', 'pin-value')
  },
  template: '<div class="pin-tab" />',
})

const activeTabKey = 'tools:random-password-generator:activeTab'
const nonceKey = 'tools:random-password-generator:nonce'

const mountGenerator = () =>
  mount(RandomPasswordGenerator, {
    global: {
      stubs: {
        RandomTab: RandomTabStub,
        WordsTab: WordsTabStub,
        SeparatorTab: SeparatorTabStub,
        PinTab: PinTabStub,
      },
    },
  })

describe('RandomPasswordGenerator', () => {
  beforeEach(() => {
    storage.clear()
  })

  it('switches displayed password based on active tab', async () => {
    storage.set(activeTabKey, ref('random'))
    storage.set(nonceKey, ref(0))

    const wrapper = mountGenerator()
    await nextTick()
    const passwordText = () => wrapper.find('.n-text').text()

    expect(passwordText()).toBe('random-value')

    const activeTab = storage.get(activeTabKey) as Ref<string>
    activeTab.value = 'words'
    await nextTick()
    expect(passwordText()).toBe('words-value')

    activeTab.value = 'separator'
    await nextTick()
    expect(passwordText()).toBe('separator-value')

    activeTab.value = 'pin'
    await nextTick()
    expect(passwordText()).toBe('pin-value')

    activeTab.value = 'unknown'
    await nextTick()
    expect(passwordText()).toBe('')
  })

  it('increments nonce when regenerating', async () => {
    storage.set(activeTabKey, ref('random'))
    storage.set(nonceKey, ref(0))

    const wrapper = mountGenerator()
    const nonce = storage.get(nonceKey) as Ref<number>

    await wrapper.find('button.regenerate').trigger('click')

    expect(nonce.value).toBe(1)
  })
})
