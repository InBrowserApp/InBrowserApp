## Frequenties in een audiobestand bekijken

Gebruik de audiospectrumanalysator om een lage brom op te sporen, het frequentiespectrum van opnamen te vergelijken of te zien waar hoge frequenties wegvallen. De grafiek toont de frequentie in hertz (Hz) en het niveau in decibel ten opzichte van het digitale maximum (dBFS). Pieken laten zien welke frequentiebanden de meeste energie bevatten.

## Zo bekijk je een audiospectrum

1. Kies of sleep een mono- of stereobestand in WAV, MP3, M4A, FLAC of OGG naar de tool. Welke bestanden je kunt openen, hangt af van je browser.
2. Bekijk de sterkste frequentie. Wijs daarna een ander punt in de grafiek aan of tik erop om de frequentie en het bijbehorende niveau af te lezen. Met de schuifregelaar kun je dezelfde waarden opvragen via je toetsenbord.
3. Wissel zo nodig tussen de logaritmische en lineaire schaal. Speel het originele bestand af om de opname te horen terwijl je de grafiek bekijkt. Analyse en afspelen gebeuren op je apparaat.

## Zo lees je de FFT-grafiek

De tool decodeert de audio op 48 kHz en analyseert korte fragmenten verspreid over het bestand. Op die fragmenten past de tool een Hann-venster en een snelle Fouriertransformatie (FFT) toe. De tool middelt het vermogen van de fragmenten en combineert dat van de stereokanalen. Daardoor blijven geluiden zichtbaar die in de twee kanalen niet in fase lopen. De grafiek loopt tot 24 kHz. De niveaus gelden per frequentieband van de FFT en verschillen daarom van het algemene volume, het piekniveau van de samples en de geïntegreerde luidheid in LUFS.

Een scherpe piek rond 50 of 60 Hz kan op elektrische brom wijzen. Een plotselinge afname bij hoge frequenties kan door filtering of compressie komen. Een afzonderlijke piek kan bij een harmonische horen. Controleer de pieken eromheen voordat je hem gebruikt om de toonhoogte te bepalen.

## Wanneer kies ik een logaritmische of lineaire schaal?

Op een logaritmische schaal is er meer ruimte voor lage en middelhoge frequenties en zijn octaven makkelijker te volgen. Op een lineaire schaal neemt elk gelijk verschil in Hz evenveel ruimte in. Dat helpt bij het vergelijken van gelijkmatig verdeelde harmonischen. Deze grafiek vat de frequenties in de hele opname samen. Gebruik een spectrogram om te zien wanneer een geluid klinkt of hoe de frequentie ervan in de loop van de tijd verandert.
