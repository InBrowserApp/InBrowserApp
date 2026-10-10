## Exporteer een werkblad naar een uitwisselbaar formaat

Open een lokaal .xlsx-, .xlsm-, .xltx- of .xltm-bestand of sleep het naar de exporttool. Kies een werkblad op basis van de oorspronkelijke naam, ook als het verborgen is, en selecteer CSV, TSV, JSON of Markdown. Bekijk de uitvoer, kopieer deze of download een UTF-8-bestand met een naam op basis van de werkmap en het werkblad. Als je het bestand vervangt of sluit, worden lopende bewerkingen geannuleerd en eerdere downloadbare resultaten verwijderd. De Spreadsheet-viewer biedt ook de actie Werkblad exporteren voor het huidige werkblad.

Het standaardcelbereik is de kleinste rechthoek die opgeslagen waarden of formules bevat. Lege cellen en rijen binnen die rechthoek blijven in de uitvoer staan. Je kunt een ander bereik invoeren, zoals A1:D20, en Bereik toepassen kiezen. Een leeg werkblad levert een leeg tekstbestand of een lege JSON-array op, tenzij je expliciet een bereik kiest.

## Kies hoe waarden en koprijen worden weergegeven

Opgemaakte tekst volgt ondersteunde getalnotaties en behoudt waar mogelijk de weergave van datums en getalnotaties met voorloopnullen. Landinstellingsafhankelijke notaties kunnen afwijken van Excel. Opgeslagen waarden behouden getallen en booleaanse waarden; datums blijven Excel-serienummers en krijgen geen tijdzone. Tekstcellen behouden hun tekst in beide modi. Formules gebruiken hun opgeslagen resultaten zonder herberekening. Een ontbrekend opgeslagen resultaat wordt een lege cel, met een melding in de interface. Spreadsheetfouten blijven leesbare tekenreeksen, zoals #DIV/0!.

CSV en TSV plaatsen velden met scheidingstekens, aanhalingstekens of regeleinden tussen aanhalingstekens. JSON is een array van rijarrays: de eerste rij blijft onderdeel van de gegevens, dubbele of lege kolomkoppen worden geen objectsleutels en lege cellen gebruiken null. Markdown kan de eerste rij als koprij behandelen of een lege koprij boven alle gegevensrijen toevoegen. Markdown-leestekens, HTML, verticale strepen en regeleinden in cellen worden ge-escapet of veilig weergegeven. Downloads gebruiken UTF-8 zonder bytevolgordemarkering; kies UTF-8 bij het importeren in een andere toepassing.

## Lokale verwerking en compatibiliteit

Je werkmap blijft in deze browser en wordt niet door de tool geüpload of opgeslagen. Macro’s en scripts worden niet uitgevoerd en externe gegevensverbindingen worden niet vernieuwd. Verborgen rijen en kolommen worden meegenomen in het geselecteerde bereik. Samengevoegde cellen worden niet uitgebreid tot herhaalde waarden. Grafieken, afbeeldingen, opmerkingen en werkmapopmaak maken geen deel uit van deze tekstformaten.

Bij versleutelde, beschadigde en niet-ondersteunde werkmappen verschijnt een duidelijke foutmelding. Er gelden geen vaste limieten voor de bestandsgrootte of het aantal werkbladen, rijen of kolommen, maar een grote export kan het browsergeheugen overschrijden. Deze tool exporteert opgeslagen gegevens; de werkmap wordt niet bewerkt en er is geen garantie dat een andere spreadsheettoepassing tekstvelden op dezelfde manier interpreteert.
