import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RobotsTxtUserAgentsSection from './RobotsTxtUserAgentsSection.vue'

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
      '<div class="dynamic"><button data-testid="add-user-agent" @click="$emit(\'update:value\', [...value, onCreate()])"><slot name="create-button-default" /></button><slot name="default" :index="0" /></div>',
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

  const NButton = defineComponent({
    name: 'NButton',
    emits: ['click'],
    template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
  })

  return {
    NButton,
    NDynamicInput,
    NFlex: StubWrapper,
    NInput,
    NText: StubWrapper,
  }
})

describe('RobotsTxtUserAgentsSection', () => {
  it('updates user agents and ignores empty preset additions', async () => {
    const userAgents = ['*']
    const wrapper = mount(RobotsTxtUserAgentsSection, {
      props: {
        userAgents,
      },
    })

    expect(wrapper.text()).toContain('Add user-agent')

    const input = wrapper.get('input')
    await input.setValue('Googlebot')
    expect(userAgents[0]).toBe('Googlebot')

    const vm = wrapper.vm as unknown as {
      addUserAgents: (agents: string[]) => void
    }

    expect(typeof vm.addUserAgents).toBe('function')
    vm.addUserAgents(['   '])

    expect(userAgents).toEqual(['Googlebot'])

    await wrapper.get('[data-testid="preset-useragent-search"]').trigger('click')
    expect(userAgents[0]).toBe('Googlebot')
  })
})
