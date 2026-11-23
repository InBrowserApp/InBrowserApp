## Konvertera animerad WebP till GIF

Animerad WebP lagrar flera bildrutor i en `.webp`-fil. Konvertera den till GIF
om ett chattprogram, en dokumentationssida eller en annan mottagare kräver GIF
för animationer. Du kan konvertera både förstörande och förlustfritt
komprimerad animerad WebP. Bearbetningen sker på din enhet.

### Så konverterar du animerad WebP till GIF

1. Välj **Välj fil** eller släpp en animerad WebP i verktyget.
2. Välj **Skapa GIF** för att konvertera bildrutorna med ursprungliga mått.
3. Kontrollera animationen med **Spela upp** och spara filen med **Hämta GIF**.

### Vad händer med bildrutornas visningstid och antalet uppspelningar?

Varje bildruta behåller sin egen visningstid, avrundad till GIF-formatets steg
på 10 ms och med minst 20 ms per bildruta. Om en bildruta visas i 100 ms och
nästa i 250 ms behålls exempelvis båda visningstiderna. En WebP-fil som spelas
upp ett visst antal gånger ger en GIF med samma antal uppspelningar. En
WebP-fil med oändlig uppspelning ger en GIF som också spelas upp i en loop
utan slut.

### Hur hanterar GIF transparens och färg?

GIF använder en indexerad palett med upp till 256 poster per bildruta, varav
en post representerar transparens. WebP kan lagra delvis genomskinliga pixlar,
så halvgenomskinliga skuggor och utjämnade kanter kan se annorlunda ut i
GIF-filen. Färgrika bildrutor kan också få steg i färgövergångarna. Kontrollera
förhandsvisningen mot den bakgrund du tänker använda.

### Vanliga frågor

#### Kan jag konvertera en stillbild i WebP-format?

Verktyget kräver bildrutor från en animation. Både stillbilder och animerade
bilder kan ha filändelsen `.webp`. Använd
[GIF-skaparen](/sv/tools/gif-maker/) om du vill animera flera stillbilder.

#### Varför är GIF-filen större än WebP-filen?

WebP komprimerar färger och områden som ändras mellan bildrutorna effektivt.
En GIF-fil kan därför bli större även när bildmåtten och visningstiderna
är desamma. Kontrollera filstorleken vid förhandsvisningen om
uppladdningsstorleken är begränsad.

### Relaterade animationsverktyg

Använd [GIF till animerad WebP](/sv/tools/gif-to-animated-webp-converter/) för att
konvertera åt andra hållet eller [APNG till GIF](/sv/tools/apng-to-gif-converter/)
för en animerad PNG-källfil.
