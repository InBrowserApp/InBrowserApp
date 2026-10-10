## Tekst met scheidingstekens converteren naar Excel

Open een lokaal CSV- of TSV-bestand of sleep het hierheen, bekijk de cellen en download een XLSX-werkmap met één werkblad met de naam Sheet1. Kies het scheidingsteken en de tekencodering als de automatische detectie niet overeenkomt met het bestand. TSV-bestanden gebruiken standaard tabs. Het voorbeeldvenster beperkt de geëxporteerde gegevens niet.

## Identificatiecodes en oorspronkelijke tekst behouden

CSV en TSV slaan geen celtypen voor spreadsheets op. Deze converter behoudt elk veld als tekst, inclusief voorloopnullen, lange identificatiecodes, getallen die op decimale waarden lijken, datums en tekst die begint met een gelijkteken. Getallen en datums worden niet automatisch herkend en formules worden niet uitgevoerd. Scheidingstekens tussen aanhalingstekens, geëscapete aanhalingstekens, Unicode, regeleinden binnen velden, lege velden en lege records blijven behouden. Kortere rijen laten lege cellen achter. Een afsluitend regeleinde beëindigt het laatste record in plaats van nog een rij toe te voegen.

Bij de instelling voor de eerste rij kun je kiezen tussen gewone gegevens en een koprij met Excel-filters. Beide behouden de rij precies zoals die is geschreven, inclusief dubbele of lege kolomkoppen. Automatische tekencodering ondersteunt UTF-8 en UTF-16 met een bytevolgordemarkering. Andere coderingen kunnen handmatig worden geselecteerd. Een sep=-instructie aan het begin wordt alleen weggelaten als automatische detectie van het scheidingsteken is geselecteerd of als het scheidingsteken ervan overeenkomt met het geselecteerde scheidingsteken.

Onjuist gevormde velden tussen aanhalingstekens, ongeldige tekencodering en gegevens die de Excel-limieten voor rijen, kolommen of celtekst overschrijden, geven een foutmelding in plaats van een afgekapt werkmapbestand. Controleer belangrijke waarden na het downloaden in een spreadsheetprogramma.

## Lokale verwerking

De conversie vindt plaats in deze browser zonder het bestand te uploaden. Als je de importinstellingen wijzigt of het bestand vervangt of sluit, wordt het vorige resultaat verwijderd. Annuleren stopt het achtergrondproces. Er geldt geen vaste limiet voor de bestandsgrootte; het beschikbare browsergeheugen bepaalt welke bestanden kunnen worden verwerkt.

Open de [Spreadsheet-viewer](../xlsx-viewer/) om spreadsheetbestanden te bekijken.
