import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { NRadioGroup, NSelect, NSwitch } from 'naive-ui'
import { nextTick } from 'vue'
import MarkdownPreviewerControls from './MarkdownPreviewerControls.vue'

type ControlsVm = {
  downloadHref?: string
  emitImport: () => void
  emitPrint: () => void
}

describe('MarkdownPreviewerControls', () => {
  it('emits model updates, actions, and computes download href', async () => {
    const wrapper = mount(MarkdownPreviewerControls, {
      props: {
        sanitize: true,
        showToc: true,
        viewMode: 'split',
        theme: 'light',
        downloadUrl: null,
      },
    })

    const vm = wrapper.vm as unknown as ControlsVm
    expect(vm.downloadHref).toBeUndefined()

    const switches = wrapper.findAllComponents(NSwitch)
    expect(switches).toHaveLength(2)

    switches[0]!.vm.$emit('update:value', false)
    switches[1]!.vm.$emit('update:value', false)
    wrapper.findComponent(NRadioGroup).vm.$emit('update:value', 'preview')
    wrapper.findComponent(NSelect).vm.$emit('update:value', 'dark')
    await nextTick()

    vm.emitImport()
    vm.emitPrint()

    expect(wrapper.emitted('update:sanitize')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:showToc')?.[0]).toEqual([false])
    expect(wrapper.emitted('update:viewMode')?.[0]).toEqual(['preview'])
    expect(wrapper.emitted('update:theme')?.[0]).toEqual(['dark'])
    expect(wrapper.emitted('import')?.length).toBe(1)
    expect(wrapper.emitted('print')?.length).toBe(1)

    await wrapper.setProps({ downloadUrl: 'blob:export' })
    expect((wrapper.vm as unknown as ControlsVm).downloadHref).toBe('blob:export')
  })
})
