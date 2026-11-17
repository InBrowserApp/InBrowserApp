## Vad är en teckensnittsdelmängd?

En teckensnittsdelmängd innehåller tecknen som behövs för en viss text, samt de
stödglyfer som krävs för att visa dem. Att ta bort oanvända glyfer kan minska
teckensnittets nedladdningsstorlek avsevärt, särskilt för stora kinesiska,
japanska och koreanska teckensnitt eller en fast rubrik, logotyp eller kampanjsida.

## Så använder du verktyget

Välj en TTF-, OTF-, WOFF- eller WOFF2-fil och klistra in all text som ska använda
den. Välj WOFF2 för webben eller TTF / OTF för ett okomprimerat teckensnitt och
skapa sedan delmängden. Jämför storlekarna, kontrollera förhandsgranskningen och
ladda ned teckensnittet med dess tillhörande CSS. Teckensnittet bearbetas lokalt
i en Web Worker.

## Vad bevaras?

HarfBuzz behåller glyfberoenden och de OpenType-layoutfunktioner som behövs för
ligaturer, kerning, kombinerande tecken och komplexa skriftsystem. Hintning och
variabla teckensnittsaxlar bevaras. Kanoniskt ekvivalenta sammansatta och
uppdelade textformer tas med när det ursprungliga teckensnittet stöder dem.
Förhandsgranskningen använder det skapade teckensnittet och saknade tecken i
originalet listas separat.

## Praktiska tips

- Ta med blanksteg, skiljetecken, siffror och alla översatta strängar du behöver.
  Lägg till den latinska förinställningen om texten även ska innehålla
  grundläggande latinska tecken.
- Skapa delmängden på nytt när texten ändras. En fast delmängd passar bäst för
  känt innehåll; använd bredare teckentäckning för användargenererad text.
- En delmängd kan inte lägga till tecken som saknas i det ursprungliga
  teckensnittet. Behåll ett reservteckensnitt i CSS för tecken utanför delmängden.
- Använd ett teckensnitt vars licens tillåter ändring och inbäddning på webben.
  Teckensnittssamlingar (`.ttc` / `.otc`) måste först exporteras som enskilda
  teckensnitt.
- Små teckensnitt eller redan skapade delmängder blir kanske inte mindre.
  WOFF2 ger vanligtvis den minsta nedladdningen för webben; antalet glyfer
  omfattar även stödglyfer.
