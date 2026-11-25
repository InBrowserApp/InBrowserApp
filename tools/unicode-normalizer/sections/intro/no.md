## Slik normaliserer du Unicode-tekst

Skriv eller lim inn tekst i **Originaltekst**, og velg en normaliseringsform. Resultatet oppdateres når du skriver eller bytter form. Velg **Kopier resultatet** for å bruke den normaliserte teksten i en annen app. Omformingen skjer i nettleseren, og teksten du legger inn, blir på enheten din.

## Hvilken Unicode-normaliseringsform bør jeg velge?

- **NFC (kanonisk sammensetting)** er et godt standardvalg for vanlig tekst. Der det finnes et sammensatt tegn, setter NFC bokstaven og aksenten sammen til ett kodepunkt. Da kan du gi likeverdige tegnsekvenser samme form før du lagrer eller sammenligner tekst.
- **NFD (kanonisk oppdeling)** deler tegnsekvenser opp i de kanoniske delene, for eksempel en grunnbokstav og en kombinerende aksent. Det er nyttig når du skal se nærmere på eller behandle enkeltaksenter.
- **NFKC (kompatibilitetssammensetting)** omformer også kompatibilitetsvarianter som bokstaver i full bredde og ligaturer. Det kan være nyttig ved søk og sammenligning når disse forskjellene ikke spiller noen rolle.
- **NFKD (kompatibilitetsoppdeling)** gjør de samme kompatibilitetsomformingene og lar resultatet bli stående i oppdelt form. Det kan være nyttig for tekstanalyse.

## Hvorfor kan normalisert tekst se lik ut?

Bokstaven **é** kan lagres som `U+00E9` eller som en **e** etterfulgt av en kombinerende akutt aksent (`U+0065 U+0301`). NFC gir den første representasjonen, og NFD gir den andre. Åpne **Sammenlign kodepunkter** for å se rekkefølgen på kodepunktene i starten av hver tekst, selv om tekstene ser like ut.

Velg **Prøv et eksempel** for også å se tegn som endrer utseende. Med NFKC blir **ＡＢＣ ① ﬁ** til **ABC 1 fi**. NFC bevarer disse kompatibilitetsforskjellene.

## Når kan normalisering endre betydningen?

Med NFKC og NFKD kan formateringsforskjeller forsvinne, for eksempel et hevet tegn i en formel eller et tall med ring rundt i en liste. Velg NFC hvis slike forskjeller er viktige. Å bytte mellom store og små bokstaver, fjerne aksenter og konvertere mellom kodinger som UTF-8 og UTF-16 er egne operasjoner.

Les mer i [vedlegget til Unicode-standarden om normaliseringsformer](https://www.unicode.org/reports/tr15/).
