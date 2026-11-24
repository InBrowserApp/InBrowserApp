## ICS-agenda-afspraken naar CSV exporteren

Kies **ICS naar CSV**, open een iCalendar-bestand of plak de inhoud en klik op **Converteren**. Elke opgeslagen afspraak krijgt een eigen rij met titel, begin, einde, locatie, beschrijving en eventuele herhalingsregel. Download de CSV om de afspraken in Excel of Google Spreadsheets te bekijken of te bewerken. Een afspraak die de hele dag duurt krijgt een datum zonder tijd. De einddatum telt niet mee. Voor een afspraak op 12 mei staat 13 mei als einddatum.

## Een ICS-bestand maken van CSV-rijen

Kies **CSV naar ICS** en klik op **Voorbeeld proberen** om te zien welke kolomnamen je kunt gebruiken. Neem in elk geval `Title` en `Start` op. Gebruik `2026-05-12` voor een afspraak die de hele dag duurt, `2026-05-12T09:00:00` voor lokale tijd of `2026-05-12T09:00:00Z` voor UTC. De converter herkent ook Google Agenda-kolommen zoals `Subject`, `Start Date`, `Start Time` en `All Day Event`. Download het ICS-bestand en importeer de afspraken in je agenda.

## Bewaar het oorspronkelijke agendabestand als volledige back-up

In CSV staan de afspraakgegevens op afzonderlijke rijen. Herhalende afspraken worden bewaard als herhalingsregels. De afzonderlijke datums worden niet gegenereerd. Ingesloten tijdzonedefinities blijven behouden. Bijlagen, herinneringen, deelnemers, overgeslagen herhalingen en de annuleringsstatus blijven in het oorspronkelijke agendabestand. De conversie gebeurt in je browser.
