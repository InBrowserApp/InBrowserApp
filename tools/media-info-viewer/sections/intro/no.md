## Hva denne viseren viser

Medieinformasjonsviser leser tekniske metadata fra lokale lyd- og videofiler,
blant annet MP4, MOV, MKV, WebM, AVI, MP3, FLAC og WAV. Bruk den til å kontrollere
spesifikasjonene til en eksportert fil, sjekke språkmerkingen på en films lydspor
eller samle en teknisk rapport til feilsøking. Analysen starter så snart du velger
eller slipper en fil.

## Detaljer om fil, video, lyd og undertekster

- **Filoversikt:** faktisk containerformat, filstørrelse, varighet, samlet bithastighet,
  tittel og kodeprogram, når dette er tilgjengelig.
- **Videospor:** kodek, profil og bithastighet, oppløsning, bildefrekvens og bildefrekvensmodus,
  sideforhold, rotasjon, bitdybde, fargerom, fargeundersampling og HDR-format.
- **Lydspor:** kodek, bithastighet, språk, sportittel, antall kanaler og kanaloppsett,
  samplingsfrekvens, bitdybde og markeringer for standardspor eller tvunget spor.
  Hvert lydspor vises separat, slik at originallyd, dubbing og kommentarspor
  holdes atskilt.
- **Undertekstspor:** format, språk, tittel, varighet og markeringer for standardspor
  eller tvunget spor når disse finnes i filen.

De viktigste spesifikasjonene vises med en gang. Åpne **Tekniske detaljer** i et
spor for å se flere felt, eller velg en lenke med sporantall for å gå til det første
sporet av den typen. Tilgjengelige felt avhenger av formatet og metadataene.

## Slik undersøker du en fil

1. Velg én lokal lyd- eller videofil, eller dra den inn i filområdet.
2. Se på sammendraget, og undersøk deretter de enkelte video-, lyd- og undertekstsporene.
3. Kopier den lesbare rapporten til en melding eller støttesak, eller last ned JSON
   til en oversikt over mediefiler, et skript eller videre analyse. Begge tar med
   tekniske felt som er skjult i sammenfoldede deler av grensesnittet.
4. Velg **Bytt fil** for å undersøke en annen fil, eller **Fjern fil** for å tømme
   resultatene. Hvis du velger en annen fil eller fjerner den gjeldende filen,
   stoppes også eventuell analyse som fortsatt pågår.

## Slik forstår du tallene

- **Container og kodek beskriver ulike ting.** MP4 og Matroska er
  containere, mens AVC/H.264, HEVC/H.265 og AAC beskriver hvordan strømmene er kodet.
  Én container kan inneholde flere lyd- eller undertekstspor.
- **Samlet bithastighet gjelder hele filen.** Den inkluderer alle strømmer og
  containerens ekstra data. Bithastigheten til et spor gjelder bare den strømmen.
  Bithastigheter oppgis i kb/s eller Mb/s, og filstørrelser i B, KiB, MiB, GiB eller TiB.
- **Varighet inkluderer millisekunder.** Visningen bruker `HH:MM:SS.mmm`. Bildefrekvens
  oppgis i fps, og samplingsfrekvens for lyd i kHz. CFR betyr konstant bildefrekvens,
  mens VFR betyr variabel bildefrekvens.
- **Spormarkeringer beskriver tiltenkt valg av spor.** Standard markerer et foretrukket
  spor. Tvunget brukes ofte for undertekster som skal vises uten at et fullstendig
  undertekstspor er valgt. Dette er separate markeringer som leses fra filen.

Noen containere oppgir ikke en egen bithastighet for hver strøm. Verdier som ikke
finnes, utelates eller merkes som ikke tilgjengelige. De gjettes ikke ut fra
filnavnet. Innebygde omslagsbilder regnes ikke som videospor.

## Vanlige bruksområder

Kontroller oppløsning og bildefrekvens etter eksport av en video, undersøk kanaler
og samplingsfrekvens før lydredigering, identifiser flere språk- eller kommentarspor,
eller samle kodekdetaljer når du undersøker et avspillingsproblem. Med rapporten
kan du dele de relevante spesifikasjonene uten å sende selve mediefilen.

## Lokal behandling og eksport av rapporter

Analysen foregår i nettleseren: mediefilen lastes ikke opp, og innholdet endres ikke.
Analysatoren leser fildeler etter behov og kan derfor undersøke metadata selv om
nettleseren ikke kan spille av containeren eller kodeken.

**Kopier rapport** lager et lesbart tekstsammendrag. **Last ned JSON** eksporterer
metadataene som analysatoren returnerer, sammen med filnavn og størrelse. I JSON
bruker `Duration` sekunder, `BitRate` og `OverallBitRate` bruker bit per sekund,
og `SamplingRate` bruker hertz. Grensesnittet formaterer disse til mer lesbare enheter.
Eksporten beholder også flere metadatafelt enn dem som vises i sporkortene.
