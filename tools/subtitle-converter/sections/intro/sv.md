## Om undertextkonverteraren

Konvertera befintliga undertextfiler mellan 19 tidskodade textformat eller exportera en transkription som ren text. Vanliga uppgifter är att ändra SRT till VTT för en webbvideo, omvandla dialog från ASS eller SSA till SRT, förbereda undertexter för en videoplattform och samla flera konverterade avsnitt i en ZIP-fil. Konverteringen sker i webbläsaren; undertextfiler och inklistrat innehåll laddas inte upp.

Verktyget arbetar med undertexternas text och tider. Välj filer eller klistra in undertexter, välj ett utdataformat och granska resultatet i förhandsgranskningen innan du laddar ned det. Du kan redigera inklistrad text och konvertera den igen utan att ändra originalfilen på enheten.

## Så konverterar du undertexter

1. Välj **Välj filer** för att öppna en eller flera undertextfiler, dra filer till indatapanelen eller klistra in undertext i redigeraren. **Prova ett exempel** laddar ett kort SRT-exempel med två textblock.
2. Låt **Indataformat** stå på **Identifiera automatiskt** vid normal användning. Identifieringen undersöker innehållet och förlitar sig inte enbart på filnamnet. Välj källformatet själv om en fil är tvetydig.
3. Välj ett **Utdataformat**. Välj WebVTT för ett vanligt undertextspår på en webbplats, eller SubRip för en spelare eller redigerare som kräver en SRT-fil.
4. Öppna **Konverteringsinställningar** när du behöver en annan filkodning, en bildfrekvens eller en tidsförskjutning. Ändra inställningarna innan du konverterar.
5. Välj **Konvertera undertexter**. Resultatet visar källformat och utdataformat, utdatafilens namn och antalet konverterade textblock.
6. Växla mellan **Förhandsgranska** och **Filinnehåll** och kopiera sedan den konverterade texten eller ladda ned filen. Tabellen visar upp till 100 textblock; filinnehållet och nedladdningarna innehåller hela resultatet.

**Rensa** tar bort aktuella indata och resultat från sidan. Om du väljer en ny grupp filer ersätter den det tidigare urvalet. Konverteraren sparar ingen undertexthistorik, så ladda ned de resultat du vill behålla.

## Format som stöds och precision vid export

Alla format nedan kan både läsas och skrivas utom TXT, som är en export för läsbara transkriptioner. Olika format lagrar tid på olika sätt; om du väljer ett format med lägre precision avrundas tidsstämplarna till de enheter som formatet stöder.

| Format                                    | Filtillägg | Tid vid export                     |
| ----------------------------------------- | ---------- | ---------------------------------- |
| SubRip                                    | `.srt`     | Millisekunder                      |
| WebVTT                                    | `.vtt`     | Millisekunder                      |
| Advanced SubStation Alpha                 | `.ass`     | Hundradels sekunder                |
| SubStation Alpha                          | `.ssa`     | Hundradels sekunder                |
| YouTube SubViewer                         | `.sbv`     | Millisekunder                      |
| MicroDVD                                  | `.sub`     | Videobildrutor                     |
| SubViewer 2.0                             | `.sub`     | Hundradels sekunder                |
| SAMI                                      | `.smi`     | Millisekunder                      |
| LRC lyrics                                | `.lrc`     | Hundradels sekunder för starttider |
| Timed Text                                | `.ttml`    | Millisekunder                      |
| Distribution Format Exchange Profile      | `.dfxp`    | Millisekunder                      |
| YouTube SRV3                              | `.srv3`    | Millisekunder                      |
| YouTube transcript XML                    | `.xml`     | Sekunder med millisekundsprecision |
| MPL2                                      | `.mpl`     | Tiondels sekunder                  |
| Spruce Subtitle, textformat               | `.stl`     | Videobildrutor                     |
| QuickTime Text                            | `.qt.txt`  | Millisekunder                      |
| JSON                                      | `.json`    | Tal i millisekunder                |
| CSV                                       | `.csv`     | Tal i millisekunder                |
| TSV                                       | `.tsv`     | Tal i millisekunder                |
| Transkription som ren text, endast export | `.txt`     | Inga tidsstämplar                  |

TTML-indata accepterar även kompatibla iTT-filer. DFXP tillhör TTML-familjen. Export till TTML återskapar inte alla plattformsspecifika profiler, layouter eller formateringsregler.

Filtillägget `.sub` kan här avse antingen textbaserat MicroDVD eller SubViewer. Binärt VobSub är ett annat format. På samma sätt är det `.stl`-format som stöds textbaserat Spruce STL, snarare än binärt EBU STL. Välj formatet efter dess fullständiga namn när dessa filtillägg är tvetydiga.

## Välja mellan SRT, VTT, ASS och ren text

**SRT** är ett bra val när en videospelare, redigerare eller ett uppladdningsformulär kräver undertexter i SubRip-format. **VTT** är formatet som används för textspår i HTML-video och kan även innehålla webbspecifika inställningar för textblock. Konvertering mellan dem bevarar undertexternas text och tider med millisekundsprecision samtidigt som filsyntaxen byggs om.

Ett numrerat SRT-textblock använder ett kommatecken före millisekunderna:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Samma textblock i WebVTT har ett filhuvud och tidsstämplar med decimalpunkt:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS och SSA** är användbara utbytesformat när nästa program kräver dem. Fetstil, kursiv stil och understrykning som stöds kan följa med mellan format som kan återge dem. Typsnitt, placering på skärmen, ritkommandon, karaokeanimation och andra avancerade visningsfunktioner förenklas; grafiska ASS-händelser utan läsbar dialog hoppas över. Konverteraren fokuserar på läsbara undertexter snarare än att återskapa en utformad animation eller layout.

**TXT** extraherar läsbar dialog utan tidsstämplar eller formatering. Förhandsgranskningen visar den exporterade texten i stället för en tabell med tider. TXT-export skapar inga undertexttider, transkriberar inte tal och översätter inte det talade språket.

## Filkodning och läsbar text

Automatisk filavkodning använder UTF-8, eller UTF-16 när en byteordningsmarkering identifierar det. För äldre filer väljer du den ursprungliga kodningen om tecken ser felaktiga ut eller filen inte kan avkodas. Tillgängliga alternativ är bland annat Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS och EUC-KR, samt uttryckliga alternativ för UTF-8 och UTF-16.

Prova till exempel GB18030 för en kinesisk undertext som du vet har sparats med den kodningen, eller Shift_JIS för en japansk fil från ett äldre program. Kodningen ändrar hur befintliga byte läses; den översätter inte deras betydelse. Konvertera igen efter att du har valt en annan kodning. Nedladdade undertextfiler använder UTF-8, oavsett indatakodningen.

## Justera tider och bildfrekvens

### Flytta alla undertexter tidigare eller senare

Tidsförskjutningen mäts i millisekunder. Värdet `1500` fördröjer varje textblock med 1,5 sekunder; `-500` visar textblocken en halv sekund tidigare. För ett textblock som börjar vid `00:00:01.250` ger dessa inställningar `00:00:02.750` respektive `00:00:00.750`.

En tidsförskjutning flyttar både start och slut och behåller varaktigheten tills början av tidslinjen nås. Textblock som förskjuts helt före noll tas bort; ett textblock som delvis hamnar före noll börjar vid noll. En tidsförskjutning korrigerar en konstant fördröjning. Den korrigerar inte ett undertextspår vars avvikelse förändras under videons gång.

### Använd bildfrekvens för bildrutebaserade tidsstämplar

MicroDVD och Spruce STL använder videobildrutor, så bildfrekvensen avgör hur bildrutorna motsvarar förfluten tid. TTML kan också innehålla bildrutebaserade tider. Använd källvideons bildfrekvens, till exempel `23.976`, `24`, `25` eller `29.97`, när den behövs för att tolka indata.

En inbäddad bildfrekvens i indata har företräde när formatet anger en sådan. För bildrutebaserad utdata avgör den valda inställningen vilken bildfrekvens som skrivs. Om du ändrar inställningen skalas vanliga klocktidsstämplar i SRT eller VTT inte om; den ändrar hur bildrutebaserade tidsstämplar tolkas eller skrivs.

### Förstå avrundning och saknade sluttider

SRT och VTT behåller millisekundsprecision. ASS, SSA, SubViewer och LRC avrundar till hundradelar; MPL2 avrundar till tiondelar; bildrutebaserad utdata avrundar till bildrutor. Ett mycket kort textblock behåller en positiv varaktighet efter avrundning. Förhandsgranskningen visar det exporterade formatets tider, snarare än oavrundade tidsstämplar från indata.

LRC kan ange starttider utan sluttider. Saknade sluttider sätts till nästa skilda starttid, eller två sekunder för det sista textblocket. LRC-export kan inte behålla ursprungliga mellanrum och överlappande sluttider, och textblock med flera rader blir enskilda sångtextrader. QuickTime Text använder markörer på tidslinjen; SAMI och QuickTime kan återskapa överlappande textblock som kombinerad text vid varje tidsgräns, så resultatet kan innehålla ett annat antal textsegment.

## Konvertera flera filer och ladda ned som ZIP

Välj eller släpp flera filer för att konvertera dem med samma utdataformat och inställningar. Välj ett resultat i filnamnsmenyn för att granska det. Filer som inte kan konverteras behåller sina egna felmeddelanden, medan lyckade resultat fortfarande kan laddas ned separat.

När minst två filer har konverterats samlar **Ladda ned alla som ZIP** dessa resultat. Arkivet innehåller bara lyckade konverteringar. Granska synliga felmeddelanden, justera indataformatet eller kodningen efter behov och konvertera igen för eventuella återstående filer.

Utdatafiler behåller källfilens basnamn och använder det valda filtillägget: `episode01.srt` blir till exempel `episode01.vtt`. Om flera resultat skulle få samma namn skiljer ett suffix som ` (2)` deras poster i ZIP-filen åt. ZIP är här ett nedladdningsalternativ; välj själva undertextfilerna som indata.

## Datautbyte med JSON, CSV och TSV

JSON använder en array med textblocksobjekt med värdena `start` och `end` i millisekunder och en `text`-sträng:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Läsaren accepterar även JSON i Whisper-stil med en `segments`-array, där segmentens värden för `start` och `end` anges i sekunder. Detta är en separat konvention för indata; vanlig JSON-export använder fortfarande millisekunder.

CSV och TSV använder kolumnnamnen `start`, `end` och `text`. Indatatider kan vara tal i millisekunder eller klocktidsstämplar. CSV omger fält som innehåller kommatecken, citattecken eller radbrytningar med citattecken; TSV använder tabbar mellan kolumnerna. Båda exportformaten skriver tal i millisekunder. Använd dessa format när du överför undertexter till ett kalkylblad eller ett annat arbetsflöde för undertextbearbetning.

## Vanliga frågor

### Varför ser förhandsgranskningen och den nedladdade texten olika ut?

Förhandsgranskningstabellen visar läsbar undertext och målformatets tider. Filinnehåll visar den faktiska serialiserade filen, inklusive filhuvuden, numrering, avgränsare och formateringssyntax som stöds. Nedladdningar innehåller hela detta serialiserade innehåll, även när tabellen slutar efter de första 100 textblocken.

### Varför ändrades formateringen eller placeringen?

Formaten har olika formateringsmodeller. Grundläggande formatering som stöds bevaras där den kan återges; avancerade stilar, placering av webbtextblock, animation och plattformsmetadata återskapas inte fullt ut. Använd vyn Filinnehåll för att granska exporten och testa den i spelaren eller redigeraren där du ska använda den.

### Kan verktyget extrahera undertexter från en video eller ett bildspår?

Börja med en befintlig textbaserad undertextfil. Extrahera först inbäddade undertextspår från videon. Bildbaserade PGS/SUP- och VobSub/IDX-spår behöver OCR för att bli text; binärt EBU STL kräver en undertextredigerare som kan läsa det formatet.

### Var kan jag läsa formatspecifikationerna?

Se [WebVTT-specifikationen](https://www.w3.org/TR/webvtt1/), [TTML-specifikationen](https://www.w3.org/TR/ttml2/) och [YouTubes undertextformat som stöds](https://support.google.com/youtube/answer/2734698) för filsyntax och plattformskrav.
