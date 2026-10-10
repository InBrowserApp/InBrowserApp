## OpenDocument-spreadsheets converteren naar Excel

Open een lokaal ODS-bestand of sleep het hierheen, bekijk de cellen en download een XLSX-werkmap. Werkbladnamen en hun volgorde, verborgen werkbladen, tekst, getallen, booleaanse waarden, datums, opgeslagen formuleresultaten en samengevoegde cellen worden meegenomen. Lege werkbladen en lege ruimtes tussen cellen blijven behouden. Het voorbeeldvenster beperkt de geëxporteerde gegevens niet.

## Opgeslagen waarden en compatibiliteit

Formules worden vervangen door hun opgeslagen waarden, niet door Excel-formules. Bij ontbrekende opgeslagen resultaten blijven de cellen leeg en wordt dit gemeld. De browser berekent formules niet opnieuw en vernieuwt geen externe gegevens. Foutresultaten worden algemene spreadsheetfouten. Letterlijke tekst blijft tekst, inclusief identificatiecodes met voorloopnullen, niet-Latijnse tekens en tekst die begint met een gelijkteken.

Datums gebruiken een standaardnotatie voor datum en tijd; bij expliciet opgegeven tijdzones worden ze omgerekend naar UTC. Tijdsduren blijven aantallen dagen en percentages gebruiken een eenvoudige percentagenotatie. Valutawaarden behouden hun numerieke waarde, zonder valuta-aanduiding of oorspronkelijke opmaak. Opmaak, rijhoogtes en kolombreedtes, grafieken, afbeeldingen, opmerkingen, links, macro’s en werkmapinstellingen worden niet gereproduceerd.

Versleutelde bestanden, ongeldige archieven, niet-ondersteunde gegevens en waarden of werkbladnamen buiten de door Excel ondersteunde grenzen geven een duidelijke foutmelding. Platte OpenDocument-bestanden (.fods) worden niet geaccepteerd door deze converter. Controleer belangrijke resultaten na het downloaden in je spreadsheetprogramma.

## Lokale verwerking

De conversie vindt plaats in deze browser zonder het document te uploaden. Als je het bestand vervangt of sluit, wordt het vorige resultaat dat klaarstond om te downloaden verwijderd; annuleren stopt het achtergrondproces. Er geldt geen vaste limiet voor de bestandsgrootte of het aantal werkbladen. Het beschikbare browsergeheugen bepaalt nog steeds welke werkmappen kunnen worden verwerkt.

Open de [Spreadsheet-viewer](../xlsx-viewer/) om ODS en andere spreadsheetformaten te bekijken.
