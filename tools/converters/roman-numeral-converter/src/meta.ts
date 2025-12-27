import en from './i18n/en.json'
import zh from './i18n/zh.json'
import zhCN from './i18n/zh-CN.json'
import zhTW from './i18n/zh-TW.json'
import zhHK from './i18n/zh-HK.json'
import es from './i18n/es.json'
import fr from './i18n/fr.json'
import de from './i18n/de.json'
import it from './i18n/it.json'
import ja from './i18n/ja.json'
import ko from './i18n/ko.json'
import ru from './i18n/ru.json'
import pt from './i18n/pt.json'
import ar from './i18n/ar.json'
import hi from './i18n/hi.json'
import tr from './i18n/tr.json'
import nl from './i18n/nl.json'
import sv from './i18n/sv.json'
import pl from './i18n/pl.json'
import vi from './i18n/vi.json'
import th from './i18n/th.json'
import id from './i18n/id.json'
import he from './i18n/he.json'
import ms from './i18n/ms.json'
import no from './i18n/no.json'

export const metadata = {
  id: 'roman-numeral-converter',
  path: '/roman-numeral-converter',
  tags: ['converters', 'roman', 'numeral', 'number'],
  features: ['offline'],

  i18n: {
    en,
    zh,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'zh-HK': zhHK,
    es,
    fr,
    de,
    it,
    ja,
    ko,
    ru,
    pt,
    ar,
    hi,
    tr,
    nl,
    sv,
    pl,
    vi,
    th,
    id,
    he,
    ms,
    no,
  },
} as const
