export function languageName(names: Intl.DisplayNames, locale: string) {
  const displayLocale =
    locale === "zh-CN" ? "zh-Hans" : locale === "zh-TW" ? "zh-Hant" : locale
  return names.of(displayLocale) ?? locale
}
