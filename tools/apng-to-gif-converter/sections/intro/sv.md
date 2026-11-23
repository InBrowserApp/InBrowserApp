## Konvertera animerad PNG till GIF

APNG lagrar flera bildrutor i en PNG-fil. Konvertera den till GIF om ett
chattprogram, forum eller en dokumentationssida kräver GIF för animationer.
Animerade filer kan ha filändelsen `.apng` eller `.png`. Konverteraren läser
animationen ur filen och bearbetar den på din enhet.

### Så konverterar du APNG till GIF

1. Välj **Välj fil** eller släpp en animerad PNG i verktyget.
2. Välj **Skapa GIF** för att konvertera bildrutorna med ursprungliga mått.
3. Kontrollera animationen med **Spela upp** och spara filen med **Hämta GIF**.

### Vad händer med bildrutornas visningstid och antalet uppspelningar?

Varje bildruta behåller sin egen visningstid, avrundad till GIF-formatets steg
på 10 ms och med minst 20 ms per bildruta. Om en bildruta visas i 100 ms och
nästa i 250 ms behålls exempelvis båda visningstiderna. GIF-filen behåller
källans antal uppspelningar, oavsett om animationen spelas upp en gång, flera
gånger eller i en oändlig loop. Upp till 65 536 uppspelningar totalt stöds för
en animation med slut.

### Hur hanterar GIF transparens och färg?

APNG stöder delvis genomskinliga pixlar och bildrutor med fullt färgdjup.
GIF använder en indexerad palett med upp till 256 poster per bildruta, varav
en post representerar transparens. Mjuka kanter och skuggor kan se skarpare
ut, och jämna färgövergångar kan få synliga steg. Kontrollera förhandsvisningen
innan du delar GIF-filen. Om mottagaren stöder animerad PNG kan du använda
källfilen för att behålla färgdjupet och den partiella transparensen.

### Vanliga frågor

#### Kan jag konvertera en vanlig PNG?

Verktyget kräver att PNG-filen innehåller animationsdata. En fil med ändelsen
`.png` kan vara animerad. Om animationen har en separat reservbild för
PNG-visare som bara visar stillbilder börjar GIF-filen med animationens
första bildruta.

#### Blir GIF-filen mindre än APNG-filen?

Filstorleken beror på bildmåtten, antalet bildrutor och detaljnivån. GIF-filen
kan bli större, särskilt om APNG-filen bara lagrar de små områden som ändras
mellan bildrutorna. Filstorleken visas vid GIF-förhandsvisningen.

### Relaterade animationsverktyg

Använd [GIF till APNG](/sv/tools/gif-to-apng-converter/) för att konvertera åt
andra hållet eller [Animerad WebP till GIF](/sv/tools/animated-webp-to-gif-converter/)
för en WebP-källfil.
