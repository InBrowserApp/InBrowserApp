## Så fungerar filtypsidentifiering

Det här verktyget läser upp till de första 64 KiB av en lokal fil och kontrollerar
dess binära signatur med [file-type](https://github.com/sindresorhus/file-type).
Resultatet innehåller en identifierad MIME-typ, förväntade filändelser och en
förhandsvisning av de första 256 byten i hexadecimalt format och ASCII. Inget
laddas upp.

## Varför en filändelse kan avvika

När en fil döps om ändras namnet, inte innehållet. En PNG med namnet photo.jpg
har fortfarande en PNG-signatur. Vanliga alternativa ändelser som .jpg och .jpeg
godtas. MIME-typen som webbläsaren rapporterar visas separat eftersom den ofta
utgår från filnamnet i stället för att granska filens byte.

## Identifieringens begränsningar

Signaturer ger indikationer, men bevisar inte att en fil är giltig eller säker.
Textformat som TXT, CSV och SVG kanske inte känns igen. Ett kort utdrag kan
identifiera ZIP eller en annan behållare utan att bekräfta dess underformat,
exempelvis ett Office-dokument. Hex-förhandsvisningen visar filens råa innehåll,
inte en kryptografisk kontrollsumma.
