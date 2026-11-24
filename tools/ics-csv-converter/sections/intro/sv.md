## Exportera ICS-kalenderhändelser till CSV

Välj **ICS till CSV**, öppna en iCalendar-fil eller klistra in dess innehåll och välj **Konvertera**. Varje sparad händelse får en rad med titel, start, slut, plats, beskrivning och eventuell upprepningsregel. Ladda ner CSV-filen om du vill granska eller redigera uppgifterna i Excel eller Google Kalkylark. En heldagshändelse skrivs som datum utan klockslag. Slutdatumet räknas inte med. En händelse som pågår den 12 maj får alltså slutdatum den 13 maj.

## Skapa en ICS-fil från CSV-rader

Välj **CSV till ICS** och använd **Prova ett exempel** för att se kolumnrubrikerna. Ta med minst kolumnerna `Title` och `Start`. Använd `2026-05-12` för en heldagshändelse, `2026-05-12T09:00:00` för lokal tid eller `2026-05-12T09:00:00Z` för UTC. Verktyget känner också igen rubriker från Google Kalender, som `Subject`, `Start Date`, `Start Time` och `All Day Event`. Ladda ner ICS-filen för att importera händelserna till kalendern.

## Spara originalkalendern som en komplett säkerhetskopia

I CSV sparas händelseuppgifterna som rader. Återkommande händelser sparas som upprepningsregler, utan att enskilda datum skapas. Inbäddade tidszonsdefinitioner bevaras. Bilagor, påminnelser, deltagare, undantag från upprepningen och avbokningsstatus finns kvar i den ursprungliga kalenderfilen. Konverteringen sker i webbläsaren.
