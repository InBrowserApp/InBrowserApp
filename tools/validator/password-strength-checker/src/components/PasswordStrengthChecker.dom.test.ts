import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PasswordStrengthChecker from './PasswordStrengthChecker.vue'

describe('PasswordStrengthChecker', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows empty state by default', () => {
    const wrapper = mount(PasswordStrengthChecker)
    const vm = wrapper.vm as unknown as {
      strengthLabel: string
      scorePercent: number
      scoreTagType: string
      entropyBits: string
      log10Guesses: string
      characterTags: string[]
      warningMessages: string[]
      suggestionMessages: string[]
      offlineTimeLabel: string
      onlineTimeLabel: string
    }

    expect(wrapper.text()).toContain('Enter a password to check its strength.')
    expect(vm.strengthLabel).toBe('')
    expect(vm.scorePercent).toBe(0)
    expect(vm.scoreTagType).toBe('default')
    expect(vm.entropyBits).toBe('0')
    expect(vm.log10Guesses).toBe('0')
    expect(vm.characterTags).toEqual([])
    expect(vm.warningMessages).toEqual([])
    expect(vm.suggestionMessages).toEqual([])
    expect(vm.offlineTimeLabel).toBe('')
    expect(vm.onlineTimeLabel).toBe('')
  })

  it('toggles password visibility', async () => {
    const wrapper = mount(PasswordStrengthChecker)
    const input = wrapper.find('input')
    expect(input.element.type).toBe('password')
    expect(wrapper.text()).toContain('Show')

    const toggle = wrapper.find('button')
    await toggle.trigger('click')

    expect(wrapper.find('input').element.type).toBe('text')
    expect(wrapper.text()).toContain('Hide')
  })

  it('renders warnings and fast crack time for weak passwords', async () => {
    const wrapper = mount(PasswordStrengthChecker)
    await wrapper.find('input').setValue('123456')

    const text = wrapper.text()
    expect(text).toContain('Very weak')
    expect(text).toContain('This is a very common password')
    expect(text).toContain('Use a longer password or passphrase')
    expect(text).toContain('Less than 1 second')
    const alerts = wrapper.findAll('.n-alert')
    expect(alerts).toHaveLength(2)
    expect(alerts.every((alert) => (alert.element as HTMLElement).style.display !== 'none')).toBe(
      true,
    )
  })

  it('renders strong results for complex passwords', async () => {
    const wrapper = mount(PasswordStrengthChecker)
    await wrapper.find('input').setValue('Str0ng!Passw0rd-Example')

    const text = wrapper.text()
    expect(text).toContain('Very strong')
    expect(text).toContain('Entropy')
    expect(text).toContain('Character sets')
    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('hides digit tags when no numbers are present', async () => {
    const wrapper = mount(PasswordStrengthChecker)
    await wrapper.find('input').setValue('Abc!defg')

    const text = wrapper.text()
    expect(text).toContain('a-z')
    expect(text).toContain('A-Z')
    expect(text).toContain('#@$')
    expect(text).not.toContain('0-9')
  })
})
