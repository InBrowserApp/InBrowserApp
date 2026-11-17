## Hoe bestandstypeherkenning werkt

Deze tool leest maximaal de eerste 64 KiB van een lokaal bestand en controleert
de binaire signatuur met [file-type](https://github.com/sindresorhus/file-type).
Het resultaat bevat een gedetecteerd MIME-type, verwachte extensies en een
voorbeeldweergave van de eerste 256 bytes in hexadecimale vorm en ASCII. Er
wordt niets geüpload.

## Waarom een extensie kan afwijken

Een bestand hernoemen verandert de naam, niet de inhoud. Een PNG met de naam
photo.jpg heeft nog steeds een PNG-signatuur. Gangbare alternatieve extensies
zoals .jpg en .jpeg worden geaccepteerd. Het MIME-type dat de browser meldt,
wordt apart weergegeven, omdat het vaak de bestandsnaam volgt in plaats van
de bytes te onderzoeken.

## Grenzen van de herkenning

Signaturen geven een indicatie en bewijzen niet dat een bestand geldig of
veilig is. Tekstformaten zoals TXT, CSV en SVG worden mogelijk niet herkend.
Een kort onderzocht deel kan ZIP of een andere container herkennen zonder
het subtype te bevestigen, zoals een Office-document. Het hexvoorbeeld toont
de ruwe bestandsinhoud en is geen cryptografische controlesom.
