const pad2 = (value: number) => String(value).padStart(2, '0')

export const formatCountdown = (milliseconds: number): string => {
  const total = Math.max(0, Math.floor(milliseconds))
  const hours = Math.floor(total / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1_000)
  const hundredths = Math.floor((total % 1_000) / 10)
  return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}.${pad2(hundredths)}`
}
