## Hoe normaliseer je Unicode-tekst?

Typ of plak tekst in **Oorspronkelijke tekst** en kies een normalisatievorm. Het resultaat wordt bijgewerkt terwijl je typt of van vorm wisselt. Met **Resultaat kopiëren** kun je de genormaliseerde tekst in een andere app gebruiken. De omzetting gebeurt in je browser en je invoer blijft op je apparaat.

## Welke Unicode-normalisatievorm moet ik kiezen?

- **NFC (canonieke samenstelling)** is een goede standaard voor gewone tekst. Als er een samengesteld teken bestaat, voegt NFC een letter en het bijbehorende accent samen tot één codepunt. Zo geef je gelijkwaardige tekenreeksen dezelfde vorm voordat je tekst opslaat of vergelijkt.
- **NFD (canonieke ontleding)** splitst tekenreeksen in hun canonieke onderdelen, bijvoorbeeld een basisletter en een combinerend accent. Dat is handig om afzonderlijke accenten te bekijken of te verwerken.
- **NFKC (compatibiliteitssamenstelling)** zet ook compatibiliteitsvarianten om, zoals letters op volle breedte en ligaturen. Dat kan helpen bij zoeken of vergelijken wanneer die verschillen voor je toepassing onbelangrijk zijn.
- **NFKD (compatibiliteitsontleding)** zet dezelfde compatibiliteitsvarianten om en laat het resultaat in ontlede vorm. Dat kan nuttig zijn bij tekstanalyse.

## Waarom kan genormaliseerde tekst er hetzelfde uitzien?

Je kunt de letter **é** opslaan als `U+00E9` of als een **e** gevolgd door een combinerend accent aigu (`U+0065 U+0301`). NFC levert de eerste weergave op, NFD de tweede. Open **Codepunten vergelijken** om de reeks codepunten aan het begin van beide teksten te zien, ook als ze er hetzelfde uitzien.

Kies **Probeer een voorbeeld** om ook tekens te zien die zichtbaar veranderen. Met NFKC wordt **ＡＢＣ ① ﬁ** omgezet in **ABC 1 fi**. NFC behoudt deze compatibiliteitsverschillen.

## Wanneer verandert normalisatie de betekenis?

Bij NFKC en NFKD kunnen opmaakverschillen verdwijnen, zoals een superscript in een formule of een omcirkeld getal in een lijst. Kies NFC als deze verschillen belangrijk zijn. Het aanpassen van hoofdletters, het verwijderen van accenten en het wisselen tussen coderingen zoals UTF-8 en UTF-16 zijn aparte bewerkingen.

Lees meer in de [bijlage van de Unicode-standaard over normalisatievormen](https://www.unicode.org/reports/tr15/).
