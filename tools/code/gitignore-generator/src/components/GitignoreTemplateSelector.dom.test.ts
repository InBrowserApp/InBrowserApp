import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref, toRefs, type PropType } from 'vue'
import GitignoreTemplateSelector from './GitignoreTemplateSelector.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSection: {
    name: 'ToolSection',
    template: '<section><slot /></section>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template:
      '<input class="n-input" :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NSpace = defineComponent({
    name: 'NSpace',
    template: '<div class="n-space"><slot /></div>',
  })

  const NText = defineComponent({
    name: 'NText',
    template: '<span class="n-text"><slot /></span>',
  })

  const NTag = defineComponent({
    name: 'NTag',
    props: {
      checked: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:checked'],
    template:
      '<button class="n-tag" :data-checked="checked" @click="$emit(\'update:checked\', !checked)"><slot name="icon" /><slot /></button>',
  })

  const NCollapse = defineComponent({
    name: 'NCollapse',
    props: {
      expandedNames: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:expanded-names'],
    template: '<div class="n-collapse"><slot /></div>',
  })

  const NCollapseItem = defineComponent({
    name: 'NCollapseItem',
    props: {
      name: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '',
      },
    },
    template: '<div class="n-collapse-item" :data-name="name"><slot /></div>',
  })

  const NCheckboxGroup = defineComponent({
    name: 'NCheckboxGroup',
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    emits: ['update:value'],
    template: '<div class="n-checkbox-group"><slot /></div>',
  })

  const NCheckbox = defineComponent({
    name: 'NCheckbox',
    props: {
      value: {
        type: String,
        default: '',
      },
      label: {
        type: String,
        default: '',
      },
    },
    template: '<label class="n-checkbox"><input type="checkbox" /><span>{{ label }}</span></label>',
  })

  const NGrid = defineComponent({
    name: 'NGrid',
    template: '<div class="n-grid"><slot /></div>',
  })

  const NGi = defineComponent({
    name: 'NGi',
    template: '<div class="n-gi"><slot /></div>',
  })

  const NIcon = defineComponent({
    name: 'NIcon',
    template: '<span class="n-icon"><slot /></span>',
  })

  const NDivider = defineComponent({
    name: 'NDivider',
    template: '<hr class="n-divider" />',
  })

  return {
    NInput,
    NSpace,
    NText,
    NTag,
    NCollapse,
    NCollapseItem,
    NCheckboxGroup,
    NCheckbox,
    NGrid,
    NGi,
    NIcon,
    NDivider,
  }
})

const SelectedTemplatesStub = defineComponent({
  name: 'SelectedTemplates',
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    allTemplates: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  template: '<div class="selected-templates" />',
})

const TestHarness = defineComponent({
  name: 'TestHarness',
  components: {
    GitignoreTemplateSelector,
  },
  props: {
    popularTemplateNames: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    allTemplateNames: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    filteredLanguageTemplates: {
      type: Array as PropType<Array<{ name: string; path: string }>>,
      default: () => [],
    },
    filteredGlobalTemplates: {
      type: Array as PropType<Array<{ name: string; path: string }>>,
      default: () => [],
    },
    filteredCommunityTemplates: {
      type: Array as PropType<Array<{ name: string; path: string }>>,
      default: () => [],
    },
    templateIcons: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const searchQuery = ref('')
    const selectedTemplates = ref<string[]>([])
    const expandedNames = ref<string[]>([])

    return {
      ...toRefs(props),
      searchQuery,
      selectedTemplates,
      expandedNames,
    }
  },
  template: `
    <GitignoreTemplateSelector
      v-model:search-query="searchQuery"
      v-model:selected-templates="selectedTemplates"
      v-model:expanded-names="expandedNames"
      :popular-template-names="popularTemplateNames"
      :all-template-names="allTemplateNames"
      :filtered-language-templates="filteredLanguageTemplates"
      :filtered-global-templates="filteredGlobalTemplates"
      :filtered-community-templates="filteredCommunityTemplates"
      :template-icons="templateIcons"
    />
  `,
})

describe('GitignoreTemplateSelector', () => {
  it('toggles quick select templates', async () => {
    const wrapper = mount(TestHarness, {
      props: {
        popularTemplateNames: ['Node'],
        allTemplateNames: ['Node'],
        filteredLanguageTemplates: [{ name: 'Node', path: 'Node.gitignore' }],
        filteredGlobalTemplates: [],
        filteredCommunityTemplates: [],
      },
      global: {
        stubs: {
          SelectedTemplates: SelectedTemplatesStub,
        },
      },
    })

    const nodeTag = wrapper
      .findAllComponents({ name: 'NTag' })
      .find((tag) => tag.text().includes('Node'))

    if (!nodeTag) {
      throw new Error('Node tag not found')
    }

    await nodeTag.vm.$emit('update:checked', true)
    await nextTick()

    expect((wrapper.vm as { selectedTemplates: string[] }).selectedTemplates).toEqual(['Node'])

    await nodeTag.vm.$emit('update:checked', true)
    await nextTick()

    expect((wrapper.vm as { selectedTemplates: string[] }).selectedTemplates).toEqual([])
  })

  it('renders only categories with filtered templates', () => {
    const wrapper = mount(TestHarness, {
      props: {
        popularTemplateNames: [],
        allTemplateNames: [],
        filteredLanguageTemplates: [{ name: 'Node', path: 'Node.gitignore' }],
        filteredGlobalTemplates: [],
        filteredCommunityTemplates: [{ name: 'Custom', path: 'custom.gitignore' }],
      },
      global: {
        stubs: {
          SelectedTemplates: SelectedTemplatesStub,
        },
      },
    })

    const names = wrapper.findAll('.n-collapse-item').map((item) => item.attributes('data-name'))

    expect(names).toContain('language')
    expect(names).toContain('community')
    expect(names).not.toContain('global')
  })

  it('updates the search query from the input', async () => {
    const wrapper = mount(TestHarness, {
      props: {
        popularTemplateNames: [],
        allTemplateNames: [],
        filteredLanguageTemplates: [],
        filteredGlobalTemplates: [],
        filteredCommunityTemplates: [],
      },
      global: {
        stubs: {
          SelectedTemplates: SelectedTemplatesStub,
        },
      },
    })

    const input = wrapper.findComponent({ name: 'NInput' })
    input.vm.$emit('update:value', 'node')
    await nextTick()

    expect((wrapper.vm as { searchQuery: string }).searchQuery).toBe('node')
  })

  it('syncs v-model updates across sections', async () => {
    const wrapper = mount(TestHarness, {
      props: {
        popularTemplateNames: ['Node'],
        allTemplateNames: ['Node', 'Windows', 'Custom'],
        filteredLanguageTemplates: [{ name: 'Node', path: 'Node.gitignore' }],
        filteredGlobalTemplates: [{ name: 'Windows', path: 'Global/Windows.gitignore' }],
        filteredCommunityTemplates: [{ name: 'Custom', path: 'community/Custom.gitignore' }],
        templateIcons: { Node: {} },
      },
      global: {
        stubs: {
          SelectedTemplates: SelectedTemplatesStub,
        },
      },
    })

    const selected = wrapper.findComponent({ name: 'SelectedTemplates' })
    await selected.vm.$emit('update:modelValue', ['Node'])
    await nextTick()

    expect((wrapper.vm as { selectedTemplates: string[] }).selectedTemplates).toEqual(['Node'])

    const collapse = wrapper.findComponent({ name: 'NCollapse' })
    await collapse.vm.$emit('update:expanded-names', ['language', 'global'])
    await nextTick()

    expect((wrapper.vm as { expandedNames: string[] }).expandedNames).toEqual([
      'language',
      'global',
    ])

    const groups = wrapper.findAllComponents({ name: 'NCheckboxGroup' })
    await groups[0]!.vm.$emit('update:value', ['Node'])
    await groups[1]!.vm.$emit('update:value', ['Windows'])
    await groups[2]!.vm.$emit('update:value', ['Custom'])
    await nextTick()

    expect((wrapper.vm as { selectedTemplates: string[] }).selectedTemplates).toEqual(['Custom'])
  })
})
