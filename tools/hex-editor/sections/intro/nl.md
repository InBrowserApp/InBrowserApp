## Een binair bestand online bekijken en bewerken

Open een lokaal bestand of sleep het naar de hex-editor. Kies **Probeer een voorbeeld** om te zien hoe de bytes worden weergegeven. Je kunt de header van een bestand inspecteren, een magisch getal zoals `89 50 4E 47` in een PNG controleren, niet-afdrukbare bytes bekijken of een bekende waarde op een specifieke positie aanpassen.

## Offsets, hexadecimale bytes en ASCII lezen

De offset links is de positie van de eerste byte in de rij, geteld vanaf nul. In het midden staat elke byte als twee hexadecimale cijfers, van `00` tot `FF`. De ASCII-kolom toont de afdrukbare tekens die bij die bytes horen en gebruikt een punt voor andere waarden. De bytes `48 65 6C 6C 6F` worden bijvoorbeeld weergegeven als `Hello`.

Voer een hexadecimale offset zoals `1A` of `0x1A` in om direct naar de byte op positie 26 te springen. Blader met de paginaknoppen om bytes in de buurt te bekijken. De editor leest één pagina tegelijk, zodat je ook een klein deel van een groot bestand kunt inspecteren.

## Bytes overschrijven en een kopie opslaan

Selecteer een byte in de hexkolom en voer twee cijfers in. De editor werkt het bijbehorende ASCII-teken bij en gaat naar de volgende byte. Gebruik de pijltjestoetsen om tussen bytes te bewegen. Met **Ongedaan maken** en **Opnieuw uitvoeren** kun je wijzigingen terugdraaien of opnieuw toepassen. Bij het overschrijven blijven de bestandsgrootte en de posities van de andere bytes gelijk.

Kies **Kopie downloaden** om het resultaat op te slaan. Het originele bestand blijft ongewijzigd. Lezen en bewerken gebeurt volledig in je browser.
