## Så gör du om en ljudinspelning till text

Dra en mötesinspelning, intervju, föreläsning, podd eller röstanteckning till verktyget. Låt verktyget identifiera språket automatiskt eller välj själv språket i inspelningen. Välj en Whisper-modell och klicka på **Transkribera ljud**. När transkriptionen är klar kan du välja en tidsstämpel för att lyssna på det avsnittet. Rätta vid behov namn, skiljetecken eller ord som uppfattats fel innan du kopierar eller laddar ned texten.

Verktyget kan läsa ljudformat som din webbläsare stöder, till exempel vanliga MP3-, WAV-, M4A-, FLAC-, OGG- och WebM-filer. Stödet för olika kodekar varierar mellan webbläsare. Om en fil inte går att öppna kan du prova att exportera inspelningen som WAV eller MP3.

## Vilken transkriptionsmodell ska jag välja?

Börja med **Snabb (Whisper Base)** för en tydlig röstanteckning eller ett första utkast. **Balanserad (Whisper Small)** kan ge bättre resultat vid samtal och olika accenter. **Högsta precision (Whisper Large V3 Turbo)** är den mest avancerade modellen för ljud där orden är svåra att uppfatta. Den kräver en större nedladdning och mer minne. Alla tre modeller stöder flera språk och transkriberar på det språk som talas i inspelningen.

Whisper använder WebGPU när webbläsaren och grafikhårdvaran stöder det. Verktyget kan även bearbeta ljudet på processorn via WebAssembly. Modellen du valt laddas ned första gången du använder den. Webbläsaren kan återanvända modellfilerna som finns kvar i cacheminnet. Nedladdningsstorleken och bearbetningstiden beror på modell och enhet. Inspelningen läses in och transkriberas på din enhet. Ingen inspelad ljuddata skickas när modellen laddas ned.

## Exportera en transkription med tidsstämplar eller undertexter

- **TXT** ger varje textavsnitt en starttid. Till exempel hänvisar `[00:02:15.320] Nu går vi igenom dagordningen.` till en rad drygt två minuter in i inspelningen. Det passar för mötesanteckningar, intervjucitat och sökbar text.
- **SRT (SubRip)** anger start- och sluttid för varje numrerad undertext. Formatet är vanligt i videoredigeringsprogram.
- **VTT (WebVTT)** anger också start- och sluttid för varje undertext och fungerar i HTML-videospelare med stöd för undertextspår.

Whisper uppskattar när varje talat avsnitt börjar och slutar. Lyssna på viktiga citat och kontrollera att undertexterna ligger rätt i tiden innan du delar dem. Bakgrundsljud och röster som överlappar kan påverka resultatet. Transkriptionen är indelad i avsnitt efter tid.
