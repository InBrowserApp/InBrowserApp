import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import RobotsTxtRulesSection from './RobotsTxtRulesSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const StubWrapper = defineComponent({
    name: 'StubWrapper',
    template:
      '<div><slot /><slot name="create-button-default" /><slot name="default" :index="0" /></div>',
  })

  const NDynamicInput = defineComponent({
    name: 'NDynamicInput',
    props: {
      value: {
        type: Array,
        default: () => [],
      },
      onCreate: {
        type: Function,
        required: true,
      },
    },
    emits: ['update:value'],
    template:
      '<div class="dynamic"><button data-testid="add-rule" @click="$emit(\'update:value\', [...value, onCreate()])"><slot name="create-button-default" /></button><slot name="default" :index="0" /></div>',
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
    template:
      '<select :value="value" @change="$emit(\'update:value\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select>',
  })

  const NInput = defineComponent({
    name: 'NInput',
    props: {
      value: {
        type: String,
        default: '',
      },
    },
    emits: ['update:value'],
    template: '<input :value="value" @input="$emit(\'update:value\', $event.target.value)" />',
  })

  const NInputNumber = defineComponent({
    name: 'NInputNumber',
    props: {
      value: {
        type: Number,
        default: null,
      },
    },
    emits: ['update:value'],
    template:
      '<input class="crawl-delay" @input="$emit(\'update:value\', Number($event.target.value))" />',
  })

  return {
    NDynamicInput,
    NFlex: StubWrapper,
    NInput,
    NInputNumber,
    NSelect,
    NText: StubWrapper,
  }
})

describe('RobotsTxtRulesSection', () => {
  it('updates rule fields and creates default rules', async () => {
    const rules = [{ type: 'disallow' as const, path: '/admin/' }]

    const wrapper = mount(RobotsTxtRulesSection, {
      props: {
        advanced: true,
        groupIndex: 0,
        rules,
        crawlDelay: null,
      },
    })

    const select = wrapper.getComponent({ name: 'NSelect' })
    await select.vm.$emit('update:value', 'allow')

    const pathInput = wrapper.getComponent({ name: 'NInput' })
    await pathInput.vm.$emit('update:value', '/public/')

    expect(rules[0]?.type).toBe('allow')
    expect(rules[0]?.path).toBe('/public/')

    const dynamic = wrapper.getComponent({ name: 'NDynamicInput' })
    const onCreate = dynamic.props('onCreate') as () => { type: string; path: string }
    expect(onCreate()).toEqual({ type: 'disallow', path: '' })

    const crawlDelay = wrapper.getComponent({ name: 'NInputNumber' })
    await crawlDelay.vm.$emit('update:value', 1.5)

    expect(wrapper.emitted('update:crawlDelay')?.[0]).toEqual([1.5])
  })
})
