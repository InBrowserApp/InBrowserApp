## Oudere Excel-werkmappen converteren in je browser

Open een lokaal XLS-bestand of sleep het hierheen. Kies een werkblad, bekijk de celgegevens en download een XLSX-werkmap. Je kunt door het voorbeeld navigeren of een celadres voor de linkerbovenhoek invoeren om naar een ander gebied te gaan. Het voorbeeldvenster beperkt de export niet: alle werkbladen en hun geïmporteerde cellen worden meegenomen.

Namen en volgorde van werkbladen, lege bladen, de verborgen status van bladen, tekst, getallen, booleaanse waarden, spreadsheetfouten, ondersteunde getalnotaties, samengevoegde cellen, rijhoogtes, kolombreedtes en verborgen rijen en kolommen blijven behouden voor zover de parser voor het bronformaat ze ondersteunt. Tekstuele identificatiecodes behouden hun voorloopnullen. Datums behouden de seriële waarden van Excel en het datumsysteem van de werkmap.

## Formules en compatibiliteit

Ondersteunde formule-expressies en hun opgeslagen resultaten blijven behouden. De browser berekent formules niet opnieuw en vernieuwt geen externe gegevens. Een formule zonder opgeslagen resultaat verschijnt met een melding in het voorbeeld; de expressie blijft in de uitvoer staan, zodat een spreadsheetprogramma die kan berekenen. Niet-ondersteunde formule-expressies of externe verwijzingen worden mogelijk niet correct overgenomen bij de conversie.

Dit is een gegevensconversie, geen getrouwe reproductie van alle werkmapfuncties. Grafieken, afbeeldingen, macro’s, draaitabelfuncties en geavanceerde opmaak blijven niet behouden. Het voorbeeld bootst de indeling van samengevoegde cellen en opmaak niet na. Controleer de gedownloade werkmap in je spreadsheetprogramma, vooral als formules of de indeling belangrijk zijn. Macrobladen, grafiekbladen, versleutelde of beschadigde bestanden en bestanden waarvan alleen de extensie naar .xls is gewijzigd, worden niet ondersteund.

## Lokale verwerking

Je werkmap wordt in deze browser verwerkt zonder de inhoud te uploaden. Macro’s worden niet uitgevoerd en gekoppelde bronnen worden niet opgehaald. Als je de werkmap vervangt of sluit, wordt het resultaat verwijderd; annuleren stopt de conversie. Er is geen vaste limiet voor de bestandsgrootte of het aantal werkbladen, maar grote werkmappen blijven afhankelijk van het beschikbare browsergeheugen.

Open de [Spreadsheet-viewer](../xlsx-viewer/) om andere spreadsheetformaten te bekijken.
