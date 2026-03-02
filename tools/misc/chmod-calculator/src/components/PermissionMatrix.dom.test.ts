import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PermissionMatrix from './PermissionMatrix.vue'

vi.mock('naive-ui', async () => {
  const { defineComponent } = await import('vue')

  const NTable = defineComponent({
    name: 'NTable',
    template: '<table class="n-table"><slot /></table>',
  })

  const NCheckbox = defineComponent({
    name: 'NCheckbox',
    props: {
      checked: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:checked'],
    template: '<button class="n-checkbox" :data-checked="String(checked)" />',
  })

  return {
    NTable,
    NCheckbox,
  }
})

describe('PermissionMatrix', () => {
  it('renders matrix labels and emits updates for each checkbox', async () => {
    const wrapper = mount(PermissionMatrix, {
      props: {
        permissions: {
          owner: { read: true, write: true, execute: false },
          group: { read: true, write: false, execute: false },
          others: { read: false, write: false, execute: false },
        },
      },
      global: {
        stubs: {
          ToolSectionHeader: {
            template: '<h3 class="section-header"><slot /></h3>',
          },
          ToolSection: {
            template: '<section class="section"><slot /></section>',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Permission Matrix')
    expect(wrapper.text()).toContain('Owner')
    expect(wrapper.text()).toContain('Group')
    expect(wrapper.text()).toContain('Others')

    const checkboxes = wrapper.findAllComponents({ name: 'NCheckbox' })
    expect(checkboxes).toHaveLength(9)

    const updates: Array<['owner' | 'group' | 'others', 'read' | 'write' | 'execute', boolean]> = [
      ['owner', 'read', false],
      ['owner', 'write', false],
      ['owner', 'execute', true],
      ['group', 'read', false],
      ['group', 'write', true],
      ['group', 'execute', true],
      ['others', 'read', true],
      ['others', 'write', true],
      ['others', 'execute', true],
    ]

    for (const [index, payload] of updates.entries()) {
      const checkbox = checkboxes[index]
      if (!checkbox) {
        throw new Error(`Missing checkbox at index ${index}`)
      }
      checkbox.vm.$emit('update:checked', payload[2])
      await nextTick()
    }

    expect(wrapper.emitted('update')).toEqual(updates)
  })
})
