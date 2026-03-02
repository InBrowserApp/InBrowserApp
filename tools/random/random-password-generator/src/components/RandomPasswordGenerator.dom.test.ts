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
  const NTabs = defineComponent({
    name: 'NTabs',
    props: {
      value: {
        type: String,
        default: 'random',
      },
    },
    emits: ['update:value'],
    template: '<div class="n-tabs"><slot /></div>',
  })
  const NTabPane = defineComponent({
    name: 'NTabPane',
    props: {
      name: {
        type: String,
        default: '',
      },
      tab: {
        type: String,
        default: '',
      },
    },
    template: '<section class="n-tab-pane"><slot name="tab" /><slot /></section>',
  })
  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })
  return {
    NTabs,
    NTabPane,
    NText,
    NFlex: Base,
    NIcon: Base,
    NGrid: Base,
    NGi: Base,
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

  it('renders tab labels and updates active tab via tabs v-model', async () => {
    storage.set(activeTabKey, ref('random'))
    storage.set(nonceKey, ref(0))

    const wrapper = mountGenerator()
    await nextTick()

    expect(wrapper.text()).toContain('Random')
    expect(wrapper.text()).toContain('Words')
    expect(wrapper.text()).toContain('Separator')
    expect(wrapper.text()).toContain('PIN')

    wrapper.findComponent({ name: 'NTabs' }).vm.$emit('update:value', 'words')
    await nextTick()

    expect((storage.get(activeTabKey) as Ref<string>).value).toBe('words')
    expect(wrapper.find('.n-text').text()).toBe('words-value')
  })
})
