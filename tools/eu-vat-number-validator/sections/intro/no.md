## Hva er et EU-MVA-nummer?

Et MVA-identifikasjonsnummer utstedes av et EU-medlemsland til virksomheter som er registrert for merverdiavgift. Det begynner med en landkode på to bokstaver (for eksempel `BE` for Belgia eller `EL` for Hellas), etterfulgt av en landspesifikk sekvens av sifre og noen ganger bokstaver. Skattemyndighetene bruker det til å spore grensekryssende handel og refusjonskrav, så feil på fakturaer, kontrakter eller innkjøpsdokumenter kan lett blokkere en betaling eller utløse en revisjon.

## Hva dette verktøyet faktisk sjekker

Denne kontrollen kjører tre uavhengige valideringer, alle i nettleseren din:

1. **Landkode** — de to første bokstavene må samsvare med et EU-medlemsland som deltar i MVA-ordningen (inkludert den spesielle `EL`-koden som brukes for Hellas).
2. **Format** — de gjenværende tegnene må samsvare med landets dokumenterte MVA-format. For eksempel er belgisk MVA nøyaktig ti sifre, østerriksk MVA begynner med `U` etterfulgt av åtte sifre, og nederlandsk MVA har formen `<ni sifre>B<to sifre>`.
3. **Kontrollsiffer** — der det finnes et deterministisk kontrollsiffer i landets MVA-regler (Østerrike, Belgia, Danmark, Finland, Frankrike, Tyskland, Italia, Nederland, Polen, Portugal, Spania, Sverige), beregnes det siste sifferet eller bokstaven på nytt og sammenlignes.

Et nummer som består alle tre er syntaktisk velformet. Det er ikke det samme som å bekrefte at virksomheten faktisk er registrert — for det trenger du fortsatt Europakommisjonens VIES-tjeneste eller den lokale skattemyndigheten. Dette verktøyet brukes best før den endelige kontrollen, for å fange opp skrivefeil, byttede sifre og kopier-og-lim-feil som får et VIES-søk til å feile av feil grunn.

## Vanlige ting det fanger opp

- Nummer som ser riktige ut ved første øyekast, men som mangler et land (for eksempel starter med `US` eller `UK`).
- Innledende nuller fjernet av et regneark, som produserer et nummer som er ett siffer for kort.
- Mellomrom, punktum eller bindestreker som et fakturasystem har limt inn — verktøyet normaliserer dem bort og sjekker resultatet.
- Den klassiske forvekslingen av gresk `GR` mot MVA `EL`, som formatsjekken avviser umiddelbart.

## Hva resultatkortet viser

Utover et enkelt gyldig/ugyldig-merke, bryter resultatet ut landet, det normaliserte nummeret, formatet landet forventer, og om kontrollsifferet ble bestått, feilet eller hoppet over fordi landet ikke publiserer et. Den detaljen er nyttig når du må forklare en avvisning — "formatet er greit, kontrollsifferet stemmer ikke" er mye mer handlingsrettet enn "ugyldig".

## Personvern

Hver kontroll kjøres lokalt i nettleseren din. Ingenting sendes til en server, logges eller lagres andre steder enn i din egen nettlesers localStorage (for den siste inndata du skrev, slik at den overlever en sideinnlasting). Du kan lime inn en kundes MVA-nummer uten å bekymre deg for hvor det havner.
