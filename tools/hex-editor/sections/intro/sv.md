## Visa och redigera binärfiler online

Öppna en lokal fil i hexredigeraren eller dra och släpp den här. Välj **Ladda exempel** för att prova hur bytevärdena visas. Med redigeraren kan du granska ett filhuvud, kontrollera en filsignatur som `89 50 4E 47` i en PNG-fil, undersöka värden utan utskrivbara tecken eller ändra ett känt värde på en viss position.

## Så läser du offset, hexvärden och ASCII

Offset i vänsterkolumnen visar positionen för radens första byte, med noll som filens start. I mitten visas varje byte med två hexadecimala siffror, från `00` till `FF`. ASCII-kolumnen visar motsvarande utskrivbara tecken och använder en punkt för övriga värden. Till exempel visas `48 65 6C 6C 6F` som `Hello`.

Ange ett hexadecimalt offset som `1A` eller `0x1A` för att hoppa direkt till position 26. Använd sidknapparna för att bläddra till närliggande värden. Redigeraren läser en sida i taget, så du kan granska en liten del av en stor fil.

## Skriv över bytevärden och spara en kopia

Markera en byte i hexkolumnen och skriv två hexsiffror. Redigeraren uppdaterar motsvarande ASCII-tecken och flyttar markeringen till nästa byte. Använd piltangenterna för att flytta mellan bytevärden. Med **Ångra** och **Gör om** kan du gå bakåt och framåt bland ändringarna. Vid överskrivning behålls filens längd och de övriga bytevärdenas positioner.

Välj **Ladda ner kopia** för att spara resultatet. Originalfilen förblir oförändrad. All läsning och redigering sker i webbläsaren.
