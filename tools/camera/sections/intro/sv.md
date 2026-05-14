## Vad gör det här kameraverktyget?

Det här verktyget gör den aktuella webbläsarfliken till en lokal kameravy för att ta bilder och spela in video. Det kan öppna enhetens kamera, ta en stillbild, spela in en kort video när webbläsaren stöder `MediaRecorder`, förhandsvisa det senaste fotot eller videoklippet och ladda ner filen.

## Bra användningsfall

- Ta ett snabbt profilfoto eller en ögonblicksbild från webbkameran utan att öppna en separat app.
- Spela in en kort visuell anteckning när du behöver ett tillfälligt klipp som stannar i webbläsaren.
- Kontrollera hur främre och bakre kameran fungerar, samt stöd för zoom eller ficklampa på en enhet.

## Integritet och webbläsarbegränsningar

Mediaströmmen stannar i webbläsaren och laddas inte upp av det här verktyget. Kamera, mikrofon, ficklampa, zoom, tillgängliga enheter och inspelningsformat beror fortfarande på webbläsaren, operativsystemet, enhetens maskinvara och om sidan levereras från en säker kontext som HTTPS eller localhost.

- Förhandsvisning, fotografering, inspelning och export sker lokalt i den här webbläsaren.
- Foton sparas som JPEG. Videoformatet beror på vad den aktuella webbläsaren kan spela in, vanligtvis WebM eller MP4.
- Behörighetsdialoger för kamera och mikrofon styrs av webbläsaren. Den här sidan kan inte kringgå blockerade behörigheter.
