import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { buildOtpauthUri, OtpauthValidationError, parseOtpauthUri } from '../utils/otpauth'
import {
  generateTotpAtCounter,
  getCounterForTimestamp,
  TotpValidationError,
  type TotpConfig,
  type TotpHashAlgorithm,
  validateTotpConfig,
} from '../utils/totp'

export type InputMode = 'secret' | 'uri'

export type DebugRow = {
  label: string
  code: string
  counter: number
  timeRange: string
}

type ValidationState = {
  value: TotpConfig | null
  errorCode: string | null
}

export const algorithmOptions = [
  { label: 'SHA-1', value: 'SHA-1' },
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-512', value: 'SHA-512' },
]

export const digitsOptions = [
  { label: '6', value: 6 },
  { label: '8', value: 8 },
]

export const periodOptions = [
  { label: '15 s', value: 15 },
  { label: '30 s', value: 30 },
  { label: '60 s', value: 60 },
]

export const sampleConfig: TotpConfig = {
  secret: 'JBSWY3DPEHPK3PXP',
  issuer: 'InBrowser.App',
  accountName: 'demo@example.com',
  algorithm: 'SHA-1',
  digits: 6,
  period: 30,
}

export const sampleUri = buildOtpauthUri(sampleConfig)

export function useTotpGenerator(options: {
  getWindowLabels: () => { previous: string; current: string; next: string }
  parseUri?: typeof parseOtpauthUri
  validateSecretConfig?: typeof validateTotpConfig
}) {
  const parseUri = options.parseUri ?? parseOtpauthUri
  const validateSecretConfig = options.validateSecretConfig ?? validateTotpConfig
  const inputMode = ref<InputMode>('secret')
  const secretInput = ref('')
  const issuerInput = ref('')
  const accountNameInput = ref('')
  const algorithm = ref<TotpHashAlgorithm>('SHA-1')
  const digits = ref(6)
  const period = ref(30)
  const uriInput = ref('')

  const now = ref(Date.now())
  const debugRows = ref<DebugRow[]>([])
  let timer: number | undefined

  const secretState = computed<ValidationState>(() => {
    if (!secretInput.value.trim()) {
      return { value: null, errorCode: null }
    }

    try {
      return {
        value: validateSecretConfig({
          secret: secretInput.value,
          issuer: issuerInput.value,
          accountName: accountNameInput.value,
          algorithm: algorithm.value,
          digits: digits.value,
          period: period.value,
        }),
        errorCode: null,
      }
    } catch (error) {
      if (error instanceof TotpValidationError) {
        return { value: null, errorCode: error.code }
      }
      return { value: null, errorCode: 'invalid_base32' }
    }
  })

  const uriState = computed<ValidationState>(() => {
    if (!uriInput.value.trim()) {
      return { value: null, errorCode: null }
    }

    try {
      return { value: parseUri(uriInput.value), errorCode: null }
    } catch (error) {
      if (error instanceof OtpauthValidationError) {
        return { value: null, errorCode: error.code }
      }
      return { value: null, errorCode: 'invalid_uri' }
    }
  })

  const activeState = computed(() =>
    inputMode.value === 'secret' ? secretState.value : uriState.value,
  )
  const activeConfig = computed(() => activeState.value.value)
  const generatedUri = computed(() =>
    secretState.value.value ? buildOtpauthUri(secretState.value.value) : '',
  )
  const activeUri = computed(() => {
    if (!activeConfig.value) {
      return ''
    }

    return inputMode.value === 'secret' ? generatedUri.value : buildOtpauthUri(activeConfig.value)
  })

  const activeDisplayName = computed(() => {
    if (!activeConfig.value) {
      return ''
    }

    return activeConfig.value.accountName || activeConfig.value.issuer || 'TOTP'
  })

  const currentCounter = computed(() => {
    if (!activeConfig.value) {
      return null
    }

    return getCounterForTimestamp(now.value, activeConfig.value.period)
  })

  const currentCode = computed(() => debugRows.value[1]?.code ?? '')
  const remainingSeconds = computed(() => {
    if (!activeConfig.value) {
      return 0
    }

    const currentSecond = Math.floor(now.value / 1000)
    const elapsed = currentSecond % activeConfig.value.period
    return elapsed === 0 ? activeConfig.value.period : activeConfig.value.period - elapsed
  })

  const progressPercentage = computed(() => {
    if (!activeConfig.value) {
      return 0
    }

    return Math.round(
      ((activeConfig.value.period - remainingSeconds.value) / activeConfig.value.period) * 100,
    )
  })

  watch(
    [activeConfig, currentCounter],
    async ([config, counter], _previous, onCleanup) => {
      let cancelled = false
      onCleanup(() => {
        cancelled = true
      })

      if (!config || counter === null) {
        debugRows.value = []
        return
      }

      const labels = options.getWindowLabels()
      const counters = [counter - 1, counter, counter + 1]
      const rows = await Promise.all(
        counters.map(async (value, index) => {
          const generated = await generateTotpAtCounter(config, value)
          return {
            label: [labels.previous, labels.current, labels.next][index]!,
            code: generated.code,
            counter: generated.counter,
            timeRange: formatWindowRange(generated.counter, config.period),
          }
        }),
      )

      if (!cancelled) {
        debugRows.value = rows
      }
    },
    { immediate: true },
  )

  onMounted(() => {
    timer = window.setInterval(() => {
      now.value = Date.now()
    }, 250)
  })

  onBeforeUnmount(() => {
    window.clearInterval(timer)
  })

  function loadSample(): void {
    if (inputMode.value === 'secret') {
      secretInput.value = sampleConfig.secret
      issuerInput.value = sampleConfig.issuer as string
      accountNameInput.value = sampleConfig.accountName as string
      algorithm.value = sampleConfig.algorithm
      digits.value = sampleConfig.digits
      period.value = sampleConfig.period
      return
    }

    uriInput.value = sampleUri
  }

  function clearAll(): void {
    secretInput.value = ''
    issuerInput.value = ''
    accountNameInput.value = ''
    algorithm.value = 'SHA-1'
    digits.value = 6
    period.value = 30
    uriInput.value = ''
    debugRows.value = []
  }

  return {
    inputMode,
    secretInput,
    issuerInput,
    accountNameInput,
    algorithm,
    digits,
    period,
    uriInput,
    secretState,
    uriState,
    activeConfig,
    generatedUri,
    activeUri,
    activeDisplayName,
    debugRows,
    currentCode,
    remainingSeconds,
    progressPercentage,
    loadSample,
    clearAll,
  }
}

function formatWindowRange(counter: number, period: number): string {
  const start = new Date(counter * period * 1000)
  const end = new Date((counter + 1) * period * 1000 - 1000)
  return `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`
}
