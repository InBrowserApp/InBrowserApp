import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import IcalEventDetailsSection from './IcalEventDetailsSection.vue'

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({ t: (key: string) => key }),
  }
})

vi.mock('@shared/ui/tool', () => ({
  ToolSectionHeader: {
    template: '<header><slot /></header>',
  },
  ToolSection: {
    template: '<section><slot /></section>',
  },
}))

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const StubBase = defineComponent({
    name: 'StubBase',
    template: '<div><slot /><slot name="icon" /></div>',
  })

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template:
      '<button type="button" @click="$emit(\'click\')"><slot /><slot name="icon" /></button>',
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

  return {
    NButton,
    NFlex: StubBase,
    NFormItemGi: StubBase,
    NGrid: StubBase,
    NIcon: StubBase,
    NInput,
  }
})

describe('IcalEventDetailsSection', () => {
  it('emits updates for details and regenerate uid', async () => {
    const wrapper = mount(IcalEventDetailsSection, {
      props: {
        title: 'Team Sync',
        location: 'Room 1',
        description: 'Line1',
        url: 'https://example.com',
        uid: 'uid@example.com',
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(5)

    await inputs[0]!.setValue('Updated title')
    await inputs[1]!.setValue('Updated location')
    await inputs[2]!.setValue('Updated description')
    await inputs[3]!.setValue('https://example.org')

    expect(wrapper.emitted('update:title')?.[0]).toEqual(['Updated title'])
    expect(wrapper.emitted('update:location')?.[0]).toEqual(['Updated location'])
    expect(wrapper.emitted('update:description')?.[0]).toEqual(['Updated description'])
    expect(wrapper.emitted('update:url')?.[0]).toEqual(['https://example.org'])

    const regenerateButton = wrapper.findAll('button').find((button) => {
      return button.text().includes('new-uid')
    })
    expect(regenerateButton).toBeDefined()
    await regenerateButton!.trigger('click')

    expect(wrapper.emitted('regenerate-uid')).toEqual([[]])
  })
})
