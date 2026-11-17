## Over de ondertitelconverter

Converteer bestaande ondertitelbestanden tussen 19 formaten voor tekst met tijdcodes, of exporteer een transcript als platte tekst. Veelgebruikte toepassingen zijn SRT omzetten naar VTT voor een webvideo, ASS- of SSA-dialoog omzetten naar SRT, ondertitels voorbereiden voor een videoplatform en meerdere geconverteerde afleveringen verzamelen in één ZIP-bestand. De conversie vindt plaats in je browser; ondertitelbestanden en geplakte inhoud worden niet geüpload.

De tool werkt met ondertiteltekst en de bijbehorende timing. Kies bestanden of plak ondertitels, selecteer een uitvoerformaat en bekijk het resultaat in het voorbeeld voordat je het downloadt. Je kunt geplakte invoer bewerken en opnieuw converteren zonder het oorspronkelijke bestand op je apparaat te wijzigen.

## Ondertitels converteren

1. Selecteer **Bestanden kiezen** om een of meer ondertitelbestanden te openen, sleep bestanden naar het invoerpaneel of plak ondertiteltekst in de editor. **Voorbeeld proberen** laadt een kort SRT-voorbeeld met twee ondertitelregels.
2. Laat **Invoerformaat** bij normaal gebruik op **Automatisch herkennen** staan. De herkenning onderzoekt de inhoud en gaat niet alleen af op de bestandsnaam. Selecteer zelf het bronformaat als een bestand niet eenduidig te herkennen is.
3. Kies een **Uitvoerformaat**. Kies WebVTT voor een gebruikelijk ondertitelspoor op een website; kies SubRip voor een speler of editor die een SRT-bestand vereist.
4. Open **Conversie-instellingen** als je een andere bestandscodering, beeldsnelheid of tijdverschuiving nodig hebt. Pas deze instellingen aan voordat je converteert.
5. Selecteer **Ondertitels converteren**. Het resultaat vermeldt het bron- en uitvoerformaat, de bestandsnaam van de uitvoer en het aantal geconverteerde ondertitelregels.
6. Schakel tussen **Voorbeeld** en **Bestandsinhoud** en kopieer vervolgens de geconverteerde tekst of download het bestand. De tabel toont maximaal 100 ondertitelregels; de bestandsinhoud en downloads bevatten het volledige resultaat.

**Wissen** verwijdert de huidige invoer en resultaten van de pagina. Als je een nieuwe groep bestanden kiest, vervangt die de vorige selectie. De converter houdt geen ondertitelgeschiedenis bij, dus download resultaten die je wilt bewaren.

## Ondersteunde formaten en uitvoerprecisie

Alle onderstaande formaten ondersteunen lezen en schrijven, behalve TXT, dat bedoeld is voor het exporteren van leesbare transcripten. Formaten slaan tijd op verschillende manieren op; als je een formaat met een lagere precisie kiest, worden tijdstempels afgerond op de eenheden die het ondersteunt.

| Formaat                                    | Extensie  | Tijdnotatie in de uitvoer                    |
| ------------------------------------------ | --------- | -------------------------------------------- |
| SubRip                                     | `.srt`    | Milliseconden                                |
| WebVTT                                     | `.vtt`    | Milliseconden                                |
| Advanced SubStation Alpha                  | `.ass`    | Honderdsten van een seconde                  |
| SubStation Alpha                           | `.ssa`    | Honderdsten van een seconde                  |
| YouTube SubViewer                          | `.sbv`    | Milliseconden                                |
| MicroDVD                                   | `.sub`    | Videoframes                                  |
| SubViewer 2.0                              | `.sub`    | Honderdsten van een seconde                  |
| SAMI                                       | `.smi`    | Milliseconden                                |
| LRC-songteksten                            | `.lrc`    | Honderdsten van een seconde voor begintijden |
| Timed Text                                 | `.ttml`   | Milliseconden                                |
| Distribution Format Exchange Profile       | `.dfxp`   | Milliseconden                                |
| YouTube SRV3                               | `.srv3`   | Milliseconden                                |
| YouTube transcript XML                     | `.xml`    | Seconden met millisecondeprecisie            |
| MPL2                                       | `.mpl`    | Tienden van een seconde                      |
| Spruce Subtitle, tekstformaat              | `.stl`    | Videoframes                                  |
| QuickTime Text                             | `.qt.txt` | Milliseconden                                |
| JSON                                       | `.json`   | Getallen in milliseconden                    |
| CSV                                        | `.csv`    | Getallen in milliseconden                    |
| TSV                                        | `.tsv`    | Getallen in milliseconden                    |
| Transcript als platte tekst, alleen export | `.txt`    | Geen tijdstempels                            |

TTML-invoer accepteert ook compatibele iTT-bestanden. DFXP behoort tot de TTML-familie. Bij het exporteren naar TTML worden niet alle platformspecifieke profielen, indelingen of opmaakregels gereproduceerd.

De extensie `.sub` kan hier zowel tekstgebaseerde MicroDVD als SubViewer betekenen. Binaire VobSub is een ander formaat. Ook het ondersteunde `.stl`-formaat is tekstgebaseerde Spruce STL, in plaats van binaire EBU STL. Kies het formaat op basis van de volledige naam wanneer deze extensies niet eenduidig zijn.

## Kiezen tussen SRT, VTT, ASS en platte tekst

**SRT** is een handige keuze wanneer een videospeler, editor of uploadformulier SubRip-ondertitels vereist. **VTT** is het formaat voor tekstsporen in HTML-video en kan ook webspecifieke instellingen voor ondertitelregels bevatten. Bij conversie tussen deze formaten blijven de ondertiteltekst en timing in milliseconden behouden, terwijl de bestandssyntaxis opnieuw wordt opgebouwd.

Een genummerde SRT-ondertitelregel gebruikt een komma vóór de milliseconden:

```text
1
00:00:01,250 --> 00:00:03,500
Hello, world!
```

Dezelfde ondertitel in WebVTT heeft een bestandskop en tijdstempels met een decimale punt:

```text
WEBVTT

00:00:01.250 --> 00:00:03.500
Hello, world!
```

**ASS en SSA** zijn handige uitwisselingsformaten wanneer je volgende toepassing ze vereist. Ondersteunde opmaak voor vet, cursief en onderstrepen kan worden overgenomen tussen formaten die deze opmaak kunnen weergeven. Lettertypen, schermposities, tekenopdrachten, karaokeanimatie en andere geavanceerde weergavefuncties worden vereenvoudigd; grafische ASS-elementen zonder leesbare dialoog worden overgeslagen. De converter richt zich op leesbare ondertitels en reproduceert geen volledig uitgewerkte animatie of indeling.

**TXT** haalt leesbare dialoog uit de ondertitels zonder tijdstempels of opmaak. Het voorbeeld toont de geëxporteerde tekst in plaats van een tabel met tijden. TXT-export bedenkt geen ondertiteltijden, zet geen spraak om naar tekst en vertaalt de gesproken taal niet.

## Bestandscodering en leesbare tekst

Bij automatische bestandsdecodering wordt UTF-8 gebruikt, of UTF-16 wanneer een bytevolgordemarkering dit aangeeft. Kies voor oudere bestanden de oorspronkelijke codering als tekens er verkeerd uitzien of als het bestand niet kan worden gedecodeerd. Je kunt kiezen uit onder andere Windows-1252, Windows-1251, GB18030, Big5, Shift_JIS en EUC-KR, naast expliciete opties voor UTF-8 en UTF-16.

Probeer bijvoorbeeld GB18030 voor een Chinese ondertitel waarvan je weet dat die in deze codering is opgeslagen, of Shift_JIS voor een Japans bestand uit een oudere toepassing. De codering bepaalt hoe bestaande bytes worden gelezen; ze vertaalt hun betekenis niet. Converteer opnieuw nadat je een andere codering hebt geselecteerd. Gedownloade ondertitelbestanden gebruiken UTF-8, ongeacht de invoercodering.

## Timing en beeldsnelheid aanpassen

### Alle ondertitels eerder of later weergeven

De tijdverschuiving wordt gemeten in milliseconden. Een waarde van `1500` vertraagt elke ondertitelregel met 1,5 seconde; `-500` toont ondertitelregels een halve seconde eerder. Voor een ondertitelregel die begint op `00:00:01.250` leveren deze instellingen respectievelijk `00:00:02.750` en `00:00:00.750` op.

Een tijdverschuiving verplaatst zowel het begin als het einde en behoudt de duur totdat het begin van de tijdlijn wordt bereikt. Ondertitelregels die volledig vóór nul komen te liggen, worden verwijderd; een ondertitelregel die gedeeltelijk vóór nul valt, begint bij nul. Een tijdverschuiving corrigeert een constante vertraging. Ze corrigeert geen ondertitelspoor waarvan de afwijking gedurende een video verandert.

### Beeldsnelheid gebruiken voor tijdstempels op basis van frames

MicroDVD en Spruce STL gebruiken videoframes. De beeldsnelheid bepaalt daarom hoe frames worden omgerekend naar verstreken tijd. TTML kan ook timing op basis van frames bevatten. Gebruik de beeldsnelheid van de bronvideo, zoals `23.976`, `24`, `25` of `29.97`, wanneer deze nodig is om de invoer te interpreteren.

Een ingesloten beeldsnelheid in de invoer heeft voorrang wanneer het formaat er een bevat. Voor uitvoer op basis van frames bepaalt de gekozen instelling de beeldsnelheid die wordt geschreven. Het wijzigen van deze instelling schaalt gewone SRT- of VTT-tijdstempels in kloknotatie niet opnieuw; het verandert hoe tijdstempels op basis van frames worden geïnterpreteerd of geschreven.

### Afronding en ontbrekende eindtijden begrijpen

SRT en VTT behouden millisecondeprecisie. ASS, SSA, SubViewer en LRC ronden af op honderdsten; MPL2 rondt af op tienden; uitvoer op basis van frames rondt af op frames. Een zeer korte ondertitelregel behoudt na afronding een positieve duur. Het voorbeeld weerspiegelt de timing van het geëxporteerde formaat en toont dus geen niet-afgeronde invoertijdstempels.

LRC kan begintijden zonder eindtijden bevatten. Ontbrekende eindtijden worden ingesteld op de volgende andere begintijd, of op twee seconden later voor de laatste ondertitelregel. LRC-export kan de oorspronkelijke pauzes en overlappende eindtijden niet behouden, en ondertitels met meerdere regels worden elk tot één songtekstregel samengevoegd. QuickTime Text gebruikt tijdlijnmarkeringen; SAMI en QuickTime kunnen overlappende ondertitels opnieuw opbouwen als gecombineerde tekst bij elk tijdstip waarop een ondertitel begint of eindigt, waardoor het resultaat een ander aantal ondertitelsegmenten kan bevatten.

## Meerdere bestanden converteren en downloaden als ZIP

Kies meerdere bestanden of sleep ze naar het invoerpaneel om ze met hetzelfde uitvoerformaat en dezelfde instellingen te converteren. Selecteer een resultaat in het bestandsnaammenu om het te bekijken. Bestanden die niet kunnen worden geconverteerd, behouden hun eigen foutmelding, terwijl geslaagde resultaten afzonderlijk beschikbaar blijven om te downloaden.

Wanneer ten minste twee bestanden met succes zijn geconverteerd, verzamelt **Alles downloaden als ZIP** deze uitvoerbestanden. Het archief bevat alleen geslaagde conversies. Bekijk de zichtbare foutmeldingen, pas waar nodig het invoerformaat of de codering aan en converteer de resterende bestanden opnieuw.

Uitvoerbestandsnamen behouden de basisnaam van het bronbestand en gebruiken de gekozen extensie: `episode01.srt` wordt bijvoorbeeld `episode01.vtt`. Als meerdere resultaten dezelfde naam zouden krijgen, houdt een achtervoegsel zoals ` (2)` hun vermeldingen in het ZIP-bestand uit elkaar. ZIP is hier een downloadoptie; kies de ondertitelbestanden zelf als invoer.

## Uitwisseling via JSON, CSV en TSV

JSON gebruikt een array met ondertitelobjecten met waarden voor `start` en `end` in milliseconden en een tekenreeks `text`:

```json
[
  { "start": 1250, "end": 3500, "text": "Hello, world!" },
  { "start": 4000, "end": 6000, "text": "Another caption." }
]
```

Bij het inlezen wordt ook JSON in Whisper-stijl geaccepteerd met een array `segments`, waarbij de waarden voor `start` en `end` van segmenten in seconden zijn. Dit is een afzonderlijke invoerconventie; normale JSON-export blijft milliseconden gebruiken.

CSV en TSV gebruiken de kolomnamen `start`, `end` en `text`. Invoertijden kunnen getallen in milliseconden of tijdstempels in kloknotatie zijn. CSV plaatst velden met komma's, aanhalingstekens of regeleinden tussen aanhalingstekens; TSV gebruikt tabs tussen kolommen. Beide exportformaten schrijven getallen in milliseconden. Gebruik deze formaten om ondertitels naar een spreadsheet of een andere workflow voor ondertitelverwerking over te brengen.

## Veelgestelde vragen

### Waarom zien het voorbeeld en de gedownloade tekst er anders uit?

De voorbeeldtabel toont leesbare ondertiteltekst en de timing van het doelformaat. De bestandsinhoud toont het daadwerkelijke bestand zoals het wordt opgeslagen, inclusief koppen, nummering, scheidingstekens en ondersteunde opmaaksyntaxis. Downloads bevatten deze volledige bestandsinhoud, ook wanneer de tabel alleen de eerste 100 ondertitelregels toont.

### Waarom zijn opmaak of positionering veranderd?

Formaten gebruiken niet hetzelfde opmaakmodel. Ondersteunde basisopmaak blijft behouden waar het formaat die kan weergeven; geavanceerde stijlen, webpositionering van ondertitelregels, animatie en platformmetadata worden niet volledig gereproduceerd. Gebruik de weergave van de bestandsinhoud om de export te bekijken en test deze in de speler of editor waarin je de ondertitels gaat gebruiken.

### Kan dit ondertitels uit een video of afbeeldingsspoor halen?

Begin met een bestaand tekstgebaseerd ondertitelbestand. Haal ingesloten ondertitelsporen eerst uit de video. PGS/SUP- en VobSub/IDX-sporen op basis van afbeeldingen hebben OCR nodig om tekst te worden; binaire EBU STL vereist een ondertiteleditor die dat formaat kan lezen.

### Waar kan ik de formaatspecificaties raadplegen?

Zie de [WebVTT-specificatie](https://www.w3.org/TR/webvtt1/), de [TTML-specificatie](https://www.w3.org/TR/ttml2/) en [de door YouTube ondersteunde ondertitelformaten](https://support.google.com/youtube/answer/2734698) voor de bestandssyntaxis en platformvereisten.
