const SIZE_UNITS = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"]

export function fileSizeFormatter(language: string) {
  const format = new Intl.NumberFormat(language, { maximumFractionDigits: 2 })
  return (bytes: number) => {
    const unit = Math.min(
      Math.floor(Math.log2(Math.max(1, bytes)) / 10),
      SIZE_UNITS.length - 1
    )
    return `${format.format(bytes / 1024 ** unit)} ${SIZE_UNITS[unit]}`
  }
}
