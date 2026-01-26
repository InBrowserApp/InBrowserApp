import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

vi.mock('naive-ui', () => {
  const base = (name: string, tag = 'div') => ({
    name,
    inheritAttrs: false,
    template: `<${tag} v-bind="$attrs"><slot /><slot name="icon" /></${tag}>`,
  })

  return {
    NAlert: base('NAlert', 'div'),
    NButton: {
      name: 'NButton',
      inheritAttrs: false,
      emits: ['click'],
      template: `
        <button v-bind="$attrs" @click="$emit('click')">
          <slot /><slot name="icon" />
        </button>
      `,
    },
    NFlex: base('NFlex', 'div'),
    NFormItemGi: base('NFormItemGi', 'div'),
    NGrid: base('NGrid', 'div'),
    NIcon: base('NIcon', 'i'),
    NInputNumber: {
      name: 'NInputNumber',
      inheritAttrs: false,
      emits: ['update:value'],
      template: `<input v-bind="$attrs" />`,
    },
    NSpace: base('NSpace', 'div'),
    NSwitch: {
      name: 'NSwitch',
      inheritAttrs: false,
      emits: ['update:value'],
      template: `<button v-bind="$attrs" @click="$emit('update:value', true)"></button>`,
    },
    NText: {
      name: 'NText',
      inheritAttrs: false,
      template: `<span v-bind="$attrs"><slot /></span>`,
    },
    useThemeVars: () => ({ bodyColor: '#fff' }),
  }
})

const storageKeys = [
  'tools:timer:hours',
  'tools:timer:minutes',
  'tools:timer:seconds',
  'tools:timer:running',
  'tools:timer:remaining-ms',
  'tools:timer:end-time',
  'tools:timer:sound',
  'tools:timer:vibration',
  'tools:timer:notification',
]

const clearStorage = () => {
  storageKeys.forEach((key) => localStorage.removeItem(key))
}

const setStorageValue = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const originalAudioContext = globalThis.AudioContext
const originalNotification = globalThis.Notification
const originalVibrate = navigator.vibrate
const originalRequestFullscreen = HTMLElement.prototype.requestFullscreen
const originalExitFullscreen = document.exitFullscreen
const originalDocumentFullScreen = Object.getOwnPropertyDescriptor(document, 'fullScreen')

const restoreGlobals = () => {
  if (originalAudioContext) {
    Object.defineProperty(globalThis, 'AudioContext', {
      value: originalAudioContext,
      configurable: true,
    })
  } else {
    delete (globalThis as { AudioContext?: unknown }).AudioContext
  }

  if (originalNotification) {
    Object.defineProperty(globalThis, 'Notification', {
      value: originalNotification,
      configurable: true,
    })
  } else {
    delete (globalThis as { Notification?: unknown }).Notification
  }

  if (originalVibrate) {
    Object.defineProperty(navigator, 'vibrate', {
      value: originalVibrate,
      configurable: true,
    })
  } else {
    delete (navigator as { vibrate?: unknown }).vibrate
  }
}

const setVibrate = (value: Navigator['vibrate'] | undefined) => {
  Object.defineProperty(navigator, 'vibrate', {
    value,
    configurable: true,
  })
}
const restoreFullscreen = () => {
  if (originalRequestFullscreen) {
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      value: originalRequestFullscreen,
      configurable: true,
    })
  } else {
    delete (HTMLElement.prototype as { requestFullscreen?: unknown }).requestFullscreen
  }

  if (originalExitFullscreen) {
    Object.defineProperty(document, 'exitFullscreen', {
      value: originalExitFullscreen,
      configurable: true,
    })
  } else {
    delete (document as { exitFullscreen?: unknown }).exitFullscreen
  }

  if (originalDocumentFullScreen) {
    Object.defineProperty(document, 'fullScreen', originalDocumentFullScreen)
  } else {
    delete (document as { fullScreen?: unknown }).fullScreen
  }
}

const setFullscreenUnsupported = () => {
  delete (HTMLElement.prototype as { requestFullscreen?: unknown }).requestFullscreen
  delete (document as { exitFullscreen?: unknown }).exitFullscreen
  delete (document as { fullScreen?: unknown }).fullScreen
}

const setFullscreenSupport = () => {
  const requestFullscreen = vi.fn(async () => {})
  const exitFullscreen = vi.fn(async () => {})

  Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
    value: requestFullscreen,
    configurable: true,
  })

  Object.defineProperty(document, 'exitFullscreen', {
    value: exitFullscreen,
    configurable: true,
  })

  Object.defineProperty(document, 'fullScreen', {
    value: false,
    configurable: true,
  })

  return { requestFullscreen, exitFullscreen }
}

const createAudioContextMock = () => {
  const createOscillator = vi.fn(() => ({
    type: 'sine',
    frequency: { value: 0 },
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  }))

  const createGain = vi.fn(() => ({
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
    },
    connect: vi.fn(),
  }))

  class MockAudioContext {
    static lastInstance: MockAudioContext | null = null

    state = 'suspended'
    currentTime = 0
    destination = {}
    resume = vi.fn(async () => {
      this.state = 'running'
    })

    constructor() {
      MockAudioContext.lastInstance = this
    }

    createOscillator = createOscillator
    createGain = createGain
  }

  return {
    MockAudioContext,
    createOscillator,
    createGain,
    getLastInstance: () => MockAudioContext.lastInstance,
  }
}

type NotificationFactoryOptions = {
  permission?: NotificationPermission
  requestPermissionImpl?: () => Promise<NotificationPermission> | NotificationPermission
  constructorImpl?: () => void
}

const createNotificationMock = ({
  permission = 'granted',
  requestPermissionImpl,
  constructorImpl,
}: NotificationFactoryOptions = {}) => {
  const notification = vi.fn().mockImplementation(() => {
    if (constructorImpl) {
      constructorImpl()
      return {}
    }
    return {}
  }) as unknown as typeof Notification

  let currentPermission = permission
  Object.defineProperty(notification, 'permission', {
    get: () => currentPermission,
    set: (value) => {
      currentPermission = value as NotificationPermission
    },
    configurable: true,
  })

  const requestPermission = vi.fn()
  if (requestPermissionImpl) {
    requestPermission.mockImplementation(requestPermissionImpl)
  } else {
    requestPermission.mockResolvedValue(permission)
  }

  notification.requestPermission = requestPermission as typeof Notification.requestPermission

  return notification
}

const loadCountdownTimer = async () => {
  const module = await import('./CountdownTimer.vue')
  return module.default
}

const mountedWrappers: ReturnType<typeof mount>[] = []

const unmountWrapper = (wrapper: ReturnType<typeof mount>) => {
  const index = mountedWrappers.indexOf(wrapper)
  if (index >= 0) {
    mountedWrappers.splice(index, 1)
  }
  wrapper.unmount()
}

const baseStubs = {
  ToolSection: {
    template: '<section><slot /></section>',
  },
  ToolSectionHeader: {
    template: '<div><slot /></div>',
  },
  'tool-section': {
    template: '<section><slot /></section>',
  },
  'tool-section-header': {
    template: '<div><slot /></div>',
  },
} satisfies Record<string, { template: string }>

const setSwitchValue = async (wrapper: ReturnType<typeof mount>, index: number, value: boolean) => {
  const switches = wrapper.findAllComponents({ name: 'NSwitch' })
  const target = switches[index]
  if (target) {
    target.vm.$emit('update:value', value)
    await nextTick()
  }
}

const mountCountdownTimer = async () => {
  const CountdownTimer = await loadCountdownTimer()
  const wrapper = mount(CountdownTimer, {
    global: {
      stubs: baseStubs,
    },
  })
  mountedWrappers.push(wrapper)
  return wrapper
}

beforeEach(() => {
  clearStorage()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
})

afterEach(() => {
  mountedWrappers.splice(0).forEach((wrapper) => {
    unmountWrapper(wrapper)
  })
  clearStorage()
  vi.useRealTimers()
  restoreGlobals()
  restoreFullscreen()
  vi.clearAllMocks()
})

describe('CountdownTimer', () => {
  it('counts down and triggers alerts', async () => {
    const audio = createAudioContextMock()
    Object.defineProperty(globalThis, 'AudioContext', {
      value: audio.MockAudioContext,
      configurable: true,
    })

    const notification = createNotificationMock({ permission: 'granted' })
    Object.defineProperty(globalThis, 'Notification', {
      value: notification,
      configurable: true,
    })

    const vibrate = vi.fn()
    setVibrate(vibrate)

    setStorageValue('tools:timer:hours', 0)
    setStorageValue('tools:timer:minutes', 0)
    setStorageValue('tools:timer:seconds', 1)
    setStorageValue('tools:timer:notification', true)

    vi.resetModules()
    const wrapper = await mountCountdownTimer()

    await setSwitchValue(wrapper, 2, true)

    expect(wrapper.get('[data-testid="timer-display"]').text()).toBe('00:00:01.00')

    await wrapper.get('[data-testid="start"]').trigger('click')
    expect(wrapper.get('[data-testid="timer-status"]').text()).toBe('')

    const audioInstance = audio.getLastInstance()
    expect(audioInstance?.resume).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(500)
    await nextTick()
    expect(wrapper.get('[data-testid="timer-display"]').text()).not.toBe('00:00:01.00')

    await wrapper.get('[data-testid="pause"]').trigger('click')
    expect(wrapper.get('[data-testid="timer-status"]').text()).toBe('Paused')
    expect(wrapper.get('[data-testid="start"]').text()).toContain('Resume')

    const pausedValue = wrapper.get('[data-testid="timer-display"]').text()

    vi.advanceTimersByTime(500)
    await nextTick()
    expect(wrapper.get('[data-testid="timer-display"]').text()).toBe(pausedValue)

    await wrapper.get('[data-testid="start"]').trigger('click')
    vi.advanceTimersByTime(600)
    await nextTick()
    await vi.runAllTicks()

    expect(wrapper.get('[data-testid="timer-status"]').text()).toBe('Completed')
    expect(notification).toHaveBeenCalledTimes(1)
    expect(vibrate).toHaveBeenCalledTimes(1)
    expect(audio.createOscillator).toHaveBeenCalledTimes(3)

    await wrapper.get('[data-testid="reset"]').trigger('click')
    expect(wrapper.get('[data-testid="timer-display"]').text()).toBe('00:00:01.00')
  })

  it('skips sound and vibration when disabled', async () => {
    const audio = createAudioContextMock()
    Object.defineProperty(globalThis, 'AudioContext', {
      value: audio.MockAudioContext,
      configurable: true,
    })

    const notification = createNotificationMock({ permission: 'granted' })
    Object.defineProperty(globalThis, 'Notification', {
      value: notification,
      configurable: true,
    })

    const vibrate = vi.fn()
    setVibrate(vibrate)

    setStorageValue('tools:timer:hours', 0)
    setStorageValue('tools:timer:minutes', 0)
    setStorageValue('tools:timer:seconds', 1)
    setStorageValue('tools:timer:sound', false)
    setStorageValue('tools:timer:vibration', false)
    setStorageValue('tools:timer:notification', false)

    vi.resetModules()
    const wrapper = await mountCountdownTimer()

    await setSwitchValue(wrapper, 0, false)
    await setSwitchValue(wrapper, 1, false)

    const vm = wrapper.vm as unknown as {
      soundEnabled: boolean
      vibrationEnabled: boolean
    }

    expect(vm.soundEnabled).toBe(false)
    expect(vm.vibrationEnabled).toBe(false)

    await wrapper.get('[data-testid="start"]').trigger('click')
    vi.advanceTimersByTime(1100)
    await nextTick()
    await vi.runAllTicks()

    expect(audio.createOscillator).not.toHaveBeenCalled()
    expect(vibrate).not.toHaveBeenCalled()
  })

  it('handles invalid duration, presets, and ignores actions', async () => {
    const audio = createAudioContextMock()
    Object.defineProperty(globalThis, 'AudioContext', {
      value: audio.MockAudioContext,
      configurable: true,
    })

    const notification = createNotificationMock({ permission: 'denied' })
    Object.defineProperty(globalThis, 'Notification', {
      value: notification,
      configurable: true,
    })

    const vibrate = vi.fn()
    setVibrate(vibrate)

    setStorageValue('tools:timer:hours', 0)
    setStorageValue('tools:timer:minutes', 0)
    setStorageValue('tools:timer:seconds', 0)
    setStorageValue('tools:timer:sound', false)
    setStorageValue('tools:timer:vibration', false)
    setStorageValue('tools:timer:notification', false)

    vi.resetModules()
    const wrapper = await mountCountdownTimer()
    const vm = wrapper.vm as unknown as {
      minutes: number
      seconds: number
      hours: number
      running: boolean
      remainingMs: number
      notificationEnabled: boolean
      updateHours: (value: number | null) => void
      updateMinutes: (value: number | null) => void
      updateSeconds: (value: number | null) => void
      applyPreset: (preset: number) => void
      start: () => Promise<void>
      pause: () => void
      reset: () => void
    }

    await setSwitchValue(wrapper, 0, false)
    await setSwitchValue(wrapper, 1, false)
    await setSwitchValue(wrapper, 2, false)

    vm.pause()
    await nextTick()

    await wrapper.get('[data-testid="start"]').trigger('click')
    expect(wrapper.text()).toContain('Set a duration greater than zero.')

    vm.reset()
    await nextTick()
    expect(wrapper.text()).not.toContain('Set a duration greater than zero.')

    await wrapper.get('[data-testid="preset-5"]').trigger('click')
    expect(vm.minutes).toBe(5)

    vm.updateMinutes(90)
    vm.updateSeconds(-5)
    vm.updateHours(2.9)
    await nextTick()

    expect(vm.minutes).toBe(59)
    expect(vm.seconds).toBe(0)
    expect(vm.hours).toBe(2)

    vm.applyPreset(25)
    await nextTick()
    expect(vm.minutes).toBe(25)

    vm.updateHours(null)
    vm.updateMinutes(0)
    vm.updateSeconds(0)
    await nextTick()

    expect(vm.hours).toBe(0)
    expect(vm.remainingMs).toBe(0)

    vm.updateHours(0)
    vm.updateMinutes(0)
    vm.updateSeconds(1)
    await nextTick()

    await vm.start()
    await nextTick()
    expect(vm.running).toBe(true)

    await vm.start()
    vm.applyPreset(5)
    vm.updateSeconds(30)

    vi.advanceTimersByTime(1000)
    await nextTick()
    await vi.runAllTicks()
  })

  it('requests notification permission when enabling notifications', async () => {
    const audio = createAudioContextMock()
    Object.defineProperty(globalThis, 'AudioContext', {
      value: audio.MockAudioContext,
      configurable: true,
    })

    const notification = createNotificationMock({
      permission: 'default',
      requestPermissionImpl: () => 'granted',
    })
    Object.defineProperty(globalThis, 'Notification', {
      value: notification,
      configurable: true,
    })

    vi.resetModules()
    const wrapper = await mountCountdownTimer()

    await setSwitchValue(wrapper, 2, true)

    expect(notification.requestPermission).toHaveBeenCalledTimes(1)
  })

  it('shows notification states and handles permission requests', async () => {
    const audio = createAudioContextMock()
    Object.defineProperty(globalThis, 'AudioContext', {
      value: audio.MockAudioContext,
      configurable: true,
    })

    const notification = createNotificationMock({
      permission: 'default',
      requestPermissionImpl: () => 'granted',
    })
    Object.defineProperty(globalThis, 'Notification', {
      value: notification,
      configurable: true,
    })

    setStorageValue('tools:timer:notification', true)

    vi.resetModules()
    const wrapper = await mountCountdownTimer()
    const vm = wrapper.vm as unknown as {
      requestNotificationPermission: () => Promise<void>
    }

    expect(wrapper.get('[data-testid="notification-hint"]').text()).toContain(
      'Allow notifications to receive alerts.',
    )

    const permissionButton = wrapper.get('[data-testid="notification-permission"]')
    await permissionButton.trigger('click')

    expect(notification.requestPermission).toHaveBeenCalledTimes(1)

    await vm.requestNotificationPermission()
    expect(notification.requestPermission).toHaveBeenCalledTimes(1)

    unmountWrapper(wrapper)
    ;(notification as { permission: NotificationPermission }).permission = 'granted'
    vi.resetModules()
    const grantedWrapper = await mountCountdownTimer()
    const grantedVm = grantedWrapper.vm as unknown as {
      requestNotificationPermission: () => Promise<void>
    }

    await grantedVm.requestNotificationPermission()
    expect(notification.requestPermission).toHaveBeenCalledTimes(1)
    expect(grantedWrapper.get('[data-testid="notification-hint"]').text()).toContain(
      'Notifications are enabled.',
    )
  })

  it('handles permission request errors', async () => {
    const audio = createAudioContextMock()
    Object.defineProperty(globalThis, 'AudioContext', {
      value: audio.MockAudioContext,
      configurable: true,
    })

    const notification = createNotificationMock({
      permission: 'default',
      requestPermissionImpl: () => {
        throw new Error('nope')
      },
    })
    Object.defineProperty(globalThis, 'Notification', {
      value: notification,
      configurable: true,
    })

    setStorageValue('tools:timer:notification', true)

    vi.resetModules()
    const wrapper = await mountCountdownTimer()
    const vm = wrapper.vm as unknown as {
      requestNotificationPermission: () => Promise<void>
    }

    await vm.requestNotificationPermission()
    expect(notification.requestPermission).toHaveBeenCalledTimes(1)
  })

  it('suppresses notifications when denied and handles notification errors', async () => {
    const audio = createAudioContextMock()
    Object.defineProperty(globalThis, 'AudioContext', {
      value: audio.MockAudioContext,
      configurable: true,
    })

    const vibrate = vi.fn()
    setVibrate(vibrate)

    const notificationDenied = createNotificationMock({
      permission: 'denied',
    })
    Object.defineProperty(globalThis, 'Notification', {
      value: notificationDenied,
      configurable: true,
    })

    setStorageValue('tools:timer:hours', 0)
    setStorageValue('tools:timer:minutes', 0)
    setStorageValue('tools:timer:seconds', 1)
    setStorageValue('tools:timer:notification', true)

    vi.resetModules()
    const wrapper = await mountCountdownTimer()

    expect(wrapper.get('[data-testid="notification-hint"]').text()).toContain(
      'Notifications are blocked',
    )

    await setSwitchValue(wrapper, 2, true)

    await wrapper.get('[data-testid="start"]').trigger('click')
    vi.advanceTimersByTime(1100)
    await nextTick()
    await vi.runAllTicks()

    unmountWrapper(wrapper)

    const notificationGranted = createNotificationMock({
      permission: 'granted',
      constructorImpl: () => {
        throw new Error('boom')
      },
    })
    Object.defineProperty(globalThis, 'Notification', {
      value: notificationGranted,
      configurable: true,
    })

    setStorageValue('tools:timer:notification', true)

    vi.resetModules()
    const throwWrapper = await mountCountdownTimer()

    await throwWrapper.get('[data-testid="start"]').trigger('click')
    vi.advanceTimersByTime(1100)
    await nextTick()
    await vi.runAllTicks()

    expect(notificationGranted).toHaveBeenCalledTimes(1)
  })

  it('handles unsupported notification and audio contexts', async () => {
    delete (globalThis as { Notification?: unknown }).Notification
    delete (globalThis as { AudioContext?: unknown }).AudioContext

    const vibrate = vi.fn()
    setVibrate(vibrate)

    setStorageValue('tools:timer:hours', 0)
    setStorageValue('tools:timer:minutes', 0)
    setStorageValue('tools:timer:seconds', 1)

    vi.resetModules()
    const wrapper = await mountCountdownTimer()
    const vm = wrapper.vm as unknown as {
      notificationPermission: string
      notificationHint: string
      requestNotificationPermission: () => Promise<void>
      start: () => Promise<void>
    }

    expect(vm.notificationPermission).toBe('unsupported')
    expect(vm.notificationHint).toContain('Notifications are not supported')
    const formItems = wrapper.findAllComponents({ name: 'NFormItemGi' })
    const notificationItem = formItems[formItems.length - 1]!.element as HTMLElement
    expect(notificationItem.style.display).toBe('none')
    const hint = wrapper.get('[data-testid="notification-hint"]').element as HTMLElement
    expect(hint.style.display).toBe('none')

    await vm.requestNotificationPermission()
    await vm.start()

    vi.advanceTimersByTime(1100)
    await nextTick()
    await vi.runAllTicks()

    expect(wrapper.get('[data-testid="timer-status"]').text()).toBe('Completed')
  })

  it('restores persisted state safely', async () => {
    const audio = createAudioContextMock()
    Object.defineProperty(globalThis, 'AudioContext', {
      value: audio.MockAudioContext,
      configurable: true,
    })

    setStorageValue('tools:timer:hours', 0)
    setStorageValue('tools:timer:minutes', 0)
    setStorageValue('tools:timer:seconds', 10)
    setStorageValue('tools:timer:running', true)
    setStorageValue('tools:timer:end-time', 0)

    vi.resetModules()
    const wrapper = await mountCountdownTimer()
    const vm = wrapper.vm as unknown as { running: boolean }

    expect(vm.running).toBe(false)

    await wrapper.get('[data-testid="start"]').trigger('click')
    await wrapper.get('[data-testid="pause"]').trigger('click')

    unmountWrapper(wrapper)

    setStorageValue('tools:timer:hours', 0)
    setStorageValue('tools:timer:minutes', 0)
    setStorageValue('tools:timer:seconds', 1)
    setStorageValue('tools:timer:running', true)
    setStorageValue('tools:timer:end-time', Date.now() - 1000)

    vi.resetModules()
    const expiredWrapper = await mountCountdownTimer()

    expect(expiredWrapper.get('[data-testid="timer-status"]').text()).toBe('Completed')

    unmountWrapper(expiredWrapper)

    setStorageValue('tools:timer:hours', 0)
    setStorageValue('tools:timer:minutes', 0)
    setStorageValue('tools:timer:seconds', 2)
    setStorageValue('tools:timer:remaining-ms', 2000)
    setStorageValue('tools:timer:running', true)
    setStorageValue('tools:timer:end-time', Date.now() + 2000)

    vi.resetModules()
    const futureWrapper = await mountCountdownTimer()
    const initialDisplay = futureWrapper.get('[data-testid="timer-display"]').text()

    vi.advanceTimersByTime(200)
    await nextTick()

    const updatedDisplay = futureWrapper.get('[data-testid="timer-display"]').text()
    expect(updatedDisplay).not.toBe(initialDisplay)
  })
  it('shows fullscreen controls when entered', async () => {
    const { requestFullscreen, exitFullscreen } = setFullscreenSupport()

    vi.resetModules()
    const wrapper = await mountCountdownTimer()

    await wrapper.get('[data-testid="fullscreen-enter"]').trigger('click')
    await nextTick()

    expect(requestFullscreen).toHaveBeenCalledTimes(1)
    const controls = wrapper.get('[data-testid="fullscreen-controls"]').element as HTMLElement
    expect(controls.style.display).toBe('')

    await wrapper.get('[data-testid="fullscreen-exit"]').trigger('click')
    await nextTick()

    expect(exitFullscreen).toHaveBeenCalledTimes(1)
    expect(controls.style.display).toBe('none')
  })

  it('shows simulated fullscreen controls when fullscreen is unsupported', async () => {
    setFullscreenUnsupported()
    document.body.style.overflow = 'auto'

    vi.resetModules()
    const wrapper = await mountCountdownTimer()

    const enterButton = wrapper.get('[data-testid="fullscreen-enter"]').element as HTMLElement
    expect(enterButton.style.display).toBe('')

    await wrapper.get('[data-testid="fullscreen-enter"]').trigger('click')
    await nextTick()

    const controls = wrapper.get('[data-testid="fullscreen-controls"]').element as HTMLElement
    expect(controls.style.display).toBe('')
    expect(document.body.style.overflow).toBe('hidden')

    const vm = wrapper.vm as unknown as { setBodyOverflow: (locked: boolean) => void }
    vm.setBodyOverflow(true)
    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.get('[data-testid="fullscreen-exit"]').trigger('click')
    await nextTick()

    expect(document.body.style.overflow).toBe('auto')
    expect(controls.style.display).toBe('none')
    document.body.style.overflow = ''
  })
})
