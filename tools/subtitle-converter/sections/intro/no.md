## Om undertekstkonvertereren

Konverter eksisterende undertekstfiler mellom 19 formater for tidsbestemt tekst, eller eksporter en transkripsjon som ren tekst. Vanlige oppgaver er å endre SRT til VTT for en nettvideo, gjøre dialog fra ASS eller SSA om til SRT, klargjøre undertekster for en videoplattform og samle flere konverterte episoder i én ZIP-fil. Konverteringen skjer i nettleseren; undertekstfiler og innlimt innhold lastes ikke opp.

Verktøyet behandler undertekst og tilhørende tidspunkter. Velg filer eller lim inn undertekster, velg et utdataformat og bruk forhåndsvisningen til å kontrollere resultatet før du laster det ned. Du kan redigere innlimt tekst og konvertere den på nytt uten å endre originalfilen på enheten din.

## Slik konverterer du undertekster

1. Velg **Velg filer** for å åpne én eller flere undertekstfiler, dra filer til inndatafeltet eller lim inn undertekst i tekstfeltet. **Prøv et eksempel** laster inn et kort SRT-eksempel med to tekstlinjer.
2. La **Inndataformat** stå på **Oppdag automatisk** ved vanlig bruk. Gjenkjenningen undersøker innholdet og baserer seg ikke bare på filnavnet. Velg kildeformatet selv hvis en fil er tvetydig.
3. Velg et **Utdataformat**. Velg WebVTT for et vanlig undertekstspor på en nettside, eller SubRip hvis en avspiller eller et redigeringsprogram krever en SRT-fil.
4. Åpne **Konverteringsinnstillinger** når du trenger en annen tegnkoding, bildefrekvens eller tidsforskyvning. Endre disse innstillingene før du konverterer.
5. Velg **Konverter undertekster**. Resultatet viser kilde- og utdataformatet, filnavnet på utdataene og antall konverterte tekstlinjer.
6. Bytt mellom **Forhåndsvisning** og **Filinnhold**, og kopier deretter den konverterte teksten eller last ned filen. Tabellen viser opptil 100 tekstlinjer; filinnholdet og nedlastinger inneholder hele resultatet.

**Tøm** fjerner gjeldende inndata og resultater fra siden. Hvis du velger en ny gruppe filer, erstatter den det forrige utvalget. Konvertereren lagrer ingen underteksthistorikk, så last ned resultatene du vil beholde.

## Støttede formater og presisjon i utdataene

Alle oppføringene nedenfor støtter lesing og skriving, unntatt TXT, som er et eksportformat for lesbare transkripsjoner. Ulike formater lagrer tid på ulike måter; hvis du velger et format med lavere presisjon, avrundes tidsstemplene til enhetene formatet støtter.

| Format                                   | Filendelse | Tidsangivelse i utdataene          |
| ---------------------------------------- | ---------- | ---------------------------------- |
| SubRip                                   | `.srt`     | Millisekunder                      |
| WebVTT                                   | `.vtt`     | Millisekunder                      |
| Advanced SubStation Alpha                | `.ass`     | Hundredels sekunder                |
| SubStation Alpha                         | `.ssa`     | Hundredels sekunder                |
| YouTube SubViewer                        | `.sbv`     | Millisekunder                      |
| MicroDVD                                 | `.sub`     | Videobilder                        |
| SubViewer 2.0                            | `.sub`     | Hundredels sekunder                |
| SAMI                                     | `.smi`     | Millisekunder                      |
| LRC-sangtekster                          | `.lrc`     | Hundredels sekunder for starttider |
| Timed Text                               | `.ttml`    | Millisekunder                      |
| Distribution Format Exchange Profile     | `.dfxp`    | Millisekunder                      |
| YouTube SRV3                             | `.srv3`    | Millisekunder                      |
| YouTube-transkripsjon i XML              | `.xml`     | Sekunder med millisekundpresisjon  |
| MPL2                                     | `.mpl`     | Tidels sekunder                    |
| Spruce Subtitle, tekstformat             | `.stl`     | Videobilder                        |
| QuickTime Text                           | `.qt.txt`  | Millisekunder                      |
| JSON                                     | `.json`    | Tall i millisekunder               |
| CSV                                      | `.csv`     | Tall i millisekunder               |
| TSV                                      | `.tsv`     | Tall i millisekunder               |
| Transkripsjon som ren tekst, kun eksport | `.txt`     | Ingen tidsstempler                 |

TTML-inndata godtar også kompatible iTT-filer. DFXP tilhører TTML-familien. Eksport til TTML gjenskaper ikke alle plattformspesifikke profiler, oppsett eller stilregler.

Filendelsen `.sub` kan her bety enten tekstbasert MicroDVD eller SubViewer. Binær VobSub er et annet format. På samme måte er det støttede `.stl`-formatet tekstbasert Spruce STL, mens binær EBU STL er et annet format. Velg formatet etter det fullstendige navnet når disse filendelsene er tvetydige.

## Velge mellom SRT, VTT, ASS og ren tekst

**SRT** er et nyttig valg når en videoavspiller, et redigeringsprogram eller et opplastingsskjema krever SubRip-undertekster. **VTT** er formatet som brukes av tekstspor i HTML-video, og kan også inneholde innstillinger for tekstblokker som er spesifikke for nettet. Konvertering mellom dem bevarer undertekst og tidspunkter i millisekunder samtidig som filsyntaksen bygges opp på nytt.

En nummerert SRT-tekstblokk bruker komma før millisekundene:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Den samme underteksten i WebVTT har en filoverskrift og tidsstempler med desimalpunktum:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS og SSA** er nyttige utvekslingsformater når neste program krever dem. Støttet formatering med fet skrift, kursiv og understreking kan overføres mellom formater som kan uttrykke den. Skrifttyper, plassering på skjermen, tegnekommandoer, karaokeanimasjon og andre avanserte visningsfunksjoner forenkles; grafiske ASS-hendelser uten lesbar dialog hoppes over. Konvertereren fokuserer på lesbare undertekster fremfor å gjenskape en utformet animasjon eller et oppsett.

**TXT** trekker ut lesbar dialog uten tidsstempler eller formatering. Forhåndsvisningen viser den eksporterte teksten i stedet for en tabell med tidspunkter. TXT-eksport lager ikke nye tidspunkter for undertekstene, transkriberer ikke tale og oversetter ikke språket som snakkes.

## Tegnkoding og lesbar tekst

Automatisk dekoding av filer bruker UTF-8, eller UTF-16 når et byteordensmerke angir det. For eldre filer velger du den opprinnelige tegnkodingen hvis tegn vises feil eller filen ikke kan dekodes. Tilgjengelige valg inkluderer Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS og EUC-KR, i tillegg til egne alternativer for UTF-8 og UTF-16.

Prøv for eksempel GB18030 for en kinesisk undertekst du vet er lagret med den tegnkodingen, eller Shift_JIS for en japansk fil fra et eldre program. Tegnkoding endrer hvordan eksisterende byte leses; den oversetter ikke betydningen deres. Konverter på nytt etter at du har valgt en annen tegnkoding. Nedlastede undertekstfiler bruker UTF-8, uavhengig av tegnkodingen i inndataene.

## Justere tidspunkter og bildefrekvens

### Flytte alle undertekster tidligere eller senere

Tidsforskyvningen måles i millisekunder. Verdien `1500` forsinker hver tekstlinje med 1,5 sekunder; `-500` viser undertekstene et halvt sekund tidligere. For en tekstlinje som begynner ved `00:00:01.250`, gir disse innstillingene henholdsvis `00:00:02.750` og `00:00:00.750`.

En forskyvning flytter både start- og sluttiden og bevarer varigheten inntil starten av tidslinjen nås. Tekstlinjer som forskyves helt før null, fjernes; en tekstlinje som delvis krysser null, starter ved null. En forskyvning korrigerer en konstant forsinkelse. Den korrigerer ikke et undertekstspor der avviket endrer seg gjennom videoen.

### Bruke bildefrekvens for tidsstempler basert på videobilder

MicroDVD og Spruce STL bruker videobilder, så bildefrekvensen bestemmer hvordan bilder omregnes til medgått tid. TTML kan også inneholde tidspunkter basert på videobilder. Bruk bildefrekvensen til kildevideoen, for eksempel `23.976`, `24`, `25` eller `29.97`, når den trengs for å tolke inndataene.

En innebygd bildefrekvens i inndataene har prioritet når formatet oppgir en. For utdata basert på videobilder bestemmer den valgte innstillingen hvilken bildefrekvens som skrives. Endring av denne innstillingen skalerer ikke vanlige klokketidsstempler i SRT eller VTT; den endrer hvordan tidsstempler basert på videobilder tolkes eller skrives.

### Forstå avrunding og manglende sluttider

SRT og VTT beholder millisekundpresisjon. ASS, SSA, SubViewer og LRC avrunder til hundredeler; MPL2 avrunder til tideler; utdata basert på videobilder avrundes til hele bilder. En svært kort tekstlinje beholder en positiv varighet etter avrunding. Forhåndsvisningen gjenspeiler tidspunktene i eksportformatet i stedet for å vise uavrundede tidsstempler fra inndataene.

LRC kan oppgi starttider uten sluttider. Manglende sluttider settes til neste ulike starttid, eller to sekunder for den siste tekstlinjen. LRC-eksport kan ikke bevare de opprinnelige oppholdene og overlappende sluttidene, og undertekster over flere linjer blir til én sangtekstlinje. QuickTime Text bruker markører på tidslinjen; SAMI og QuickTime kan bygge opp overlappende undertekster på nytt som kombinert tekst ved hver tidsgrense, slik at resultatet kan inneholde et annet antall tekstsegmenter.

## Konvertere flere filer og laste ned ZIP-filer

Velg eller slipp flere filer for å konvertere dem med samme utdataformat og innstillinger. Velg et resultat fra filnavnmenyen for å kontrollere det. Filer som ikke kan konverteres, beholder sin egen feilmelding, mens vellykkede resultater fortsatt kan lastes ned enkeltvis.

Når minst to filer er konvertert, samler **Last ned alle som ZIP** disse resultatene. Arkivet inneholder bare vellykkede konverteringer. Se gjennom synlige feilmeldinger, juster inndataformatet eller tegnkodingen etter behov, og konverter eventuelle gjenværende filer på nytt.

Utdatafilene beholder kildens grunnnavn og bruker den valgte filendelsen: `episode01.srt` blir for eksempel `episode01.vtt`. Hvis flere resultater ville fått samme navn, holder et suffiks som ` (2)` oppføringene i ZIP-filen atskilt. ZIP er et nedlastingsalternativ her; velg selve undertekstfilene som inndata.

## Utveksling med JSON, CSV og TSV

JSON bruker en matrise av undertekstobjekter med `start`- og `end`-verdier i millisekunder og en `text`-streng:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Leseren godtar også JSON i Whisper-stil som inneholder en `segments`-matrise, der segmentenes `start`- og `end`-verdier er i sekunder. Dette er en egen konvensjon for inndata; vanlig JSON-eksport bruker fortsatt millisekunder.

CSV og TSV bruker kolonnenavnene `start`, `end` og `text`. Tidspunkter i inndataene kan være tall i millisekunder eller klokketidsstempler. CSV setter anførselstegn rundt felt som inneholder komma, anførselstegn eller linjeskift; TSV bruker tabulatorer mellom kolonnene. Begge eksportformatene skriver tall i millisekunder. Bruk disse formatene når du flytter undertekster til et regneark eller en annen arbeidsflyt for behandling av undertekster.

## Vanlige spørsmål

### Hvorfor ser forhåndsvisningen og den nedlastede teksten forskjellige ut?

Forhåndsvisningstabellen viser lesbar undertekst og tidspunktene i målformatet. Filinnholdet viser den faktiske serialiserte filen, inkludert overskrifter, nummerering, skilletegn og støttet formateringssyntaks. Nedlastinger inneholder hele det serialiserte innholdet, selv om tabellen stopper etter de første 100 tekstlinjene.

### Hvorfor ble formateringen eller plasseringen endret?

Formatene har ikke samme formateringsmodell. Støttet enkel formatering bevares der den kan uttrykkes; avanserte stiler, plassering av tekstblokker på nettet, animasjon og plattformmetadata gjenskapes ikke fullt ut. Bruk visningen av filinnhold til å kontrollere eksporten, og test den i avspilleren eller redigeringsprogrammet du skal bruke den i.

### Kan dette trekke ut undertekster fra en video eller et bildespor?

Begynn med en eksisterende tekstbasert undertekstfil. Trekk først ut innebygde undertekstspor fra videoen. Bildebaserte PGS/SUP- og VobSub/IDX-spor trenger OCR for å bli tekst; binær EBU STL krever et undertekstredigeringsprogram som kan lese formatet.

### Hvor kan jeg finne formatspesifikasjonene?

Se [WebVTT-spesifikasjonen](https://www.w3.org/TR/webvtt1/), [TTML-spesifikasjonen](https://www.w3.org/TR/ttml2/) og [YouTubes støttede undertekstformater](https://support.google.com/youtube/answer/2734698) for filsyntaks og plattformkrav.
