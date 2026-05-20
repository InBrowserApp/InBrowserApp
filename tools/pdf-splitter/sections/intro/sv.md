## Vad det här verktyget gör

PDF-delaren låter dig öppna en PDF i webbläsaren, välja sidor efter intervall
eller sidnummer och skapa ett mindre dokument. Du kan extrahera valda sidor
till en PDF, dela upp varje angivet intervall till en separat PDF eller dela upp
varje vald sida till en egen fil och ladda ned resultaten som ett ZIP-arkiv.

## Bra användningsfall

- Plocka ut några sidor från ett långt avtal, en rapport, manual eller skanning
  innan du delar den med någon annan.
- Dela upp kapitel, fakturor, formulär eller bilageavsnitt i separata
  PDF-filer.
- Ta bort sidor du inte behöver innan du skickar ett dokument till ett tryckeri,
  en supportavdelning eller ett godkännandeflöde.
- Skapa upprepningsbara delningar med intervallsyntax som `1-3,5,8-10` i
  stället för att klicka på varje sida manuellt.

## Så fungerar sidintervall

Använd kommaseparerade sidnummer och inkluderande intervall. `1-3,5,8-10`
väljer sidorna 1, 2, 3, 5, 8, 9 och 10. En sida får bara förekomma en gång i
uttrycket, och fallande intervall som `7-4` avvisas så att utdataordningen
förblir tydlig och förutsägbar.

För en enda PDF som utdata kopieras de valda sidorna till ett nytt dokument i
den ordning som visas av intervalluttrycket. För flera PDF-filer som utdata
behåller "en fil per intervall" varje angivet segment tillsammans, medan "en fil
per sida" skapar en separat PDF för varje vald sida.

## Integritetsnoteringar

PDF-filen bearbetas lokalt i din webbläsare och laddas inte upp av det här
verktyget. Skapade nedladdningslänkar är tillfälliga objekt-URL:er som bara
finns i den aktuella fliken. Granska de resulterande filerna innan du delar dem,
eftersom kopierade sidor fortfarande kan innehålla inbäddad metadata,
anteckningar, formulärvärden eller dolt innehåll från originaldokumentet.

## Begränsningar

Krypterade, lösenordsskyddade eller skadade PDF-filer kanske inte kan öppnas i
webbläsarens PDF-bibliotek. Den här delaren kopierar sidor till nya PDF:er, men
den är inte ett visuellt maskningsverktyg och garanterar inte borttagning av all
dokumentmetadata. För juridisk maskning, åtgärdande av tillgänglighetsproblem
eller avancerad optimering, använd en särskild PDF-redigerare efter delningen.
