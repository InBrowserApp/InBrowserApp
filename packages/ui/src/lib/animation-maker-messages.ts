import ar from "./animation-maker-messages/ar.json"
import de from "./animation-maker-messages/de.json"
import en from "./animation-maker-messages/en.json"
import es from "./animation-maker-messages/es.json"
import fr from "./animation-maker-messages/fr.json"
import he from "./animation-maker-messages/he.json"
import hi from "./animation-maker-messages/hi.json"
import id from "./animation-maker-messages/id.json"
import it from "./animation-maker-messages/it.json"
import ja from "./animation-maker-messages/ja.json"
import ko from "./animation-maker-messages/ko.json"
import ms from "./animation-maker-messages/ms.json"
import nl from "./animation-maker-messages/nl.json"
import no from "./animation-maker-messages/no.json"
import pl from "./animation-maker-messages/pl.json"
import pt from "./animation-maker-messages/pt.json"
import ru from "./animation-maker-messages/ru.json"
import sv from "./animation-maker-messages/sv.json"
import th from "./animation-maker-messages/th.json"
import tr from "./animation-maker-messages/tr.json"
import vi from "./animation-maker-messages/vi.json"
import zh_CN from "./animation-maker-messages/zh-CN.json"
import zh_TW from "./animation-maker-messages/zh-TW.json"

const catalogs: Record<string, typeof en> = {
  ar: ar,
  de: de,
  en: en,
  es: es,
  fr: fr,
  he: he,
  hi: hi,
  id: id,
  it: it,
  ja: ja,
  ko: ko,
  ms: ms,
  nl: nl,
  no: no,
  pl: pl,
  pt: pt,
  ru: ru,
  sv: sv,
  th: th,
  tr: tr,
  vi: vi,
  "zh-CN": zh_CN,
  "zh-TW": zh_TW,
}

export function animationMakerMessages(
  language: string,
  format: string
): typeof en {
  const messages = catalogs[language] ?? en
  return Object.fromEntries(
    Object.entries(messages).map(([key, value]) => [
      key,
      value.replaceAll("{format}", format),
    ])
  ) as typeof en
}
