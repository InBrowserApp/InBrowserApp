import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'

const fileOpenMock = vi.fn()
const disposeSpy = vi.fn()
const osThemeState = vi.hoisted(() => ({ value: 'dark' as 'dark' | 'light' }))
const shouldEmitMount = vi.hoisted(() => ({ value: true }))

if (!(globalThis as { self?: unknown }).self) {
  Object.defineProperty(globalThis, 'self', {
    value: globalThis,
    configurable: true,
  })
}

vi.mock('browser-fs-access', () => ({
  fileOpen: (...args: unknown[]) => fileOpenMock(...args),
}))

vi.mock('monaco-editor', () => ({}))
vi.mock('monaco-editor/esm/vs/editor/editor.worker?worker', () => ({
  default: class EditorWorker {},
}))
vi.mock('monaco-editor/esm/vs/language/json/json.worker?worker', () => ({
  default: class JsonWorker {},
}))
vi.mock('monaco-editor/esm/vs/language/css/css.worker?worker', () => ({
  default: class CssWorker {},
}))
vi.mock('monaco-editor/esm/vs/language/html/html.worker?worker', () => ({
  default: class HtmlWorker {},
}))
vi.mock('monaco-editor/esm/vs/language/typescript/ts.worker?worker', () => ({
  default: class TsWorker {},
}))

vi.mock('@guolao/vue-monaco-editor', async () => {
  const { defineComponent, h, onMounted } = await import('vue')

  const VueMonacoDiffEditor = defineComponent({
    name: 'VueMonacoDiffEditor',
    inheritAttrs: false,
    props: {
      modelValue: {
        type: String,
        default: '',
      },
      original: {
        type: String,
        default: '',
      },
      language: {
        type: String,
        default: '',
      },
      theme: {
        type: String,
        default: '',
      },
      options: {
        type: Object,
        default: () => ({}),
      },
    },
    emits: ['update:modelValue', 'mount'],
    setup(_, { emit }) {
      onMounted(() => {
        if (shouldEmitMount.value) {
          emit('mount', { dispose: disposeSpy })
        }
      })
      return () => h('div', { 'data-test': 'diff-editor' })
    },
  })

  return {
    loader: {
      config: vi.fn(),
    },
    VueMonacoDiffEditor,
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent, ref } = await import('vue')

  const base = (name: string, tag = 'div') =>
    defineComponent({
      name,
      inheritAttrs: false,
      template: `<${tag} v-bind="$attrs"><slot /><slot name="icon" /></${tag}>`,
    })

  const NButton = defineComponent({
    name: 'NButton',
    inheritAttrs: false,
    emits: ['click'],
    template:
      '<button v-bind="$attrs" @click="$emit(\'click\')"><slot name="icon" /><slot /></button>',
  })

  const NSelect = defineComponent({
    name: 'NSelect',
    inheritAttrs: false,
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
    template: '<select v-bind="$attrs"></select>',
  })

  const NSwitch = defineComponent({
    name: 'NSwitch',
    inheritAttrs: false,
    props: {
      value: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:value'],
    template:
      '<button v-bind="$attrs" @click="$emit(\'update:value\', !value)"><slot name="checked" /><slot name="unchecked" /></button>',
  })

  return {
    NButton,
    NIcon: base('NIcon', 'i'),
    NFlex: base('NFlex', 'div'),
    NSelect,
    NSwitch,
    useOsTheme: () => ref(osThemeState.value),
  }
})

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key,
    }),
  }
})

const ToolSectionStub = {
  template: '<section><slot /></section>',
}

const mountTextDiff = async () => {
  const { default: TextDiff } = await import('./TextDiff.vue')
  return mount(TextDiff, {
    global: {
      stubs: {
        ToolSection: ToolSectionStub,
      },
    },
  })
}

const getDiffEditor = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findComponent({ name: 'VueMonacoDiffEditor' })

const findButton = (wrapper: ReturnType<typeof mount>, label: string) =>
  wrapper.findAll('button').find((button) => button.text().includes(label))

const expectedFileExtensions = [
  '.txt',
  '.md',
  '.json',
  '.js',
  '.ts',
  '.html',
  '.css',
  '.xml',
  '.yaml',
  '.yml',
]

describe('TextDiff', () => {
  beforeEach(() => {
    fileOpenMock.mockReset()
    disposeSpy.mockReset()
    osThemeState.value = 'dark'
    shouldEmitMount.value = true
  })

  it('imports original text and detects the language', async () => {
    fileOpenMock.mockResolvedValue({
      name: 'sample.ts',
      text: async () => 'const original = true',
    })

    const wrapper = await mountTextDiff()
    const button = findButton(wrapper, 'import-original')
    expect(button).toBeTruthy()

    await button!.trigger('click')
    await flushPromises()

    expect(fileOpenMock).toHaveBeenCalledWith({
      description: 'Text files',
      extensions: expectedFileExtensions,
    })

    const diffEditor = getDiffEditor(wrapper)
    expect(diffEditor.props('original')).toBe('const original = true')
    expect(diffEditor.props('language')).toBe('typescript')
  })

  it('keeps language unchanged when imported filename has no extension', async () => {
    fileOpenMock.mockResolvedValue({
      name: 'README',
      text: async () => 'plain text',
    })

    const wrapper = await mountTextDiff()
    const diffEditor = getDiffEditor(wrapper)
    expect(diffEditor.props('language')).toBe('javascript')

    const button = findButton(wrapper, 'import-original')
    expect(button).toBeTruthy()

    await button!.trigger('click')
    await flushPromises()

    expect(diffEditor.props('original')).toBe('plain text')
    expect(diffEditor.props('language')).toBe('javascript')
  })

  it('imports modified text and updates the diff editor', async () => {
    fileOpenMock.mockResolvedValue({
      name: 'sample.md',
      text: async () => '# Modified',
    })

    const wrapper = await mountTextDiff()
    const button = findButton(wrapper, 'import-modified')
    expect(button).toBeTruthy()

    await button!.trigger('click')
    await flushPromises()

    const diffEditor = getDiffEditor(wrapper)
    expect(diffEditor.props('modelValue')).toBe('# Modified')
    expect(diffEditor.props('language')).toBe('markdown')
  })

  it('swaps the original and modified text', async () => {
    const wrapper = await mountTextDiff()
    const diffEditor = getDiffEditor(wrapper)
    const original = diffEditor.props('original') as string
    const modified = diffEditor.props('modelValue') as string

    const button = findButton(wrapper, 'swap')
    expect(button).toBeTruthy()

    await button!.trigger('click')
    await nextTick()

    expect(diffEditor.props('original')).toBe(modified)
    expect(diffEditor.props('modelValue')).toBe(original)
  })

  it('toggles inline view and updates diff options', async () => {
    const wrapper = await mountTextDiff()
    const diffEditor = getDiffEditor(wrapper)

    expect(diffEditor.props('theme')).toBe('vs-dark')
    expect((diffEditor.props('options') as { renderSideBySide?: boolean }).renderSideBySide).toBe(
      true,
    )

    const toggle = wrapper.findComponent({ name: 'NSwitch' })
    toggle.vm.$emit('update:value', true)
    await nextTick()

    expect((diffEditor.props('options') as { renderSideBySide?: boolean }).renderSideBySide).toBe(
      false,
    )
  })

  it('updates language and modified text via v-model', async () => {
    const wrapper = await mountTextDiff()
    const diffEditor = getDiffEditor(wrapper)

    const select = wrapper.findComponent({ name: 'NSelect' })
    select.vm.$emit('update:value', 'json')
    await nextTick()

    expect(diffEditor.props('language')).toBe('json')

    diffEditor.vm.$emit('update:modelValue', 'updated')
    await nextTick()

    expect(diffEditor.props('modelValue')).toBe('updated')
  })

  it('uses the light Monaco theme when OS theme is light', async () => {
    osThemeState.value = 'light'

    const wrapper = await mountTextDiff()
    const diffEditor = getDiffEditor(wrapper)

    expect(diffEditor.props('theme')).toBe('vs')
  })

  it('skips disposing when the editor mount callback did not run', async () => {
    shouldEmitMount.value = false

    const wrapper = await mountTextDiff()
    wrapper.unmount()

    expect(disposeSpy).not.toHaveBeenCalled()
  })

  it('provides Monaco workers for known labels', async () => {
    await mountTextDiff()

    const env = (
      globalThis as {
        self?: {
          MonacoEnvironment?: { getWorker: (moduleId: unknown, label: string) => unknown }
        }
      }
    ).self?.MonacoEnvironment
    expect(env).toBeTruthy()

    const labels = [
      'json',
      'css',
      'scss',
      'less',
      'html',
      'handlebars',
      'razor',
      'typescript',
      'javascript',
      'unknown',
    ]

    for (const label of labels) {
      const worker = env!.getWorker({}, label)
      expect(worker).toBeTruthy()
    }
  })

  it('disposes the editor on unmount', async () => {
    const wrapper = await mountTextDiff()
    wrapper.unmount()

    expect(disposeSpy).toHaveBeenCalledTimes(1)
  })
})
