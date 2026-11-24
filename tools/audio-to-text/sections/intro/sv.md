## Så gör du om en ljudinspelning till text

Dra en mötesinspelning, intervju, föreläsning, podd eller röstanteckning till verktyget. Låt verktyget identifiera språket automatiskt eller välj själv språket i inspelningen. Välj en transkriptionsmodell och klicka på **Transkribera ljud**. När transkriptionen är klar kan du välja en tidsstämpel för att lyssna på det avsnittet. Rätta vid behov namn, skiljetecken eller ord som uppfattats fel innan du kopierar eller laddar ned texten.

Verktyget kan läsa ljudformat som din webbläsare stöder, till exempel vanliga MP3-, WAV-, M4A-, FLAC-, OGG- och WebM-filer. Stödet för olika kodekar varierar mellan webbläsare. Om en fil inte går att öppna kan du prova att exportera inspelningen som WAV eller MP3.

## Vilken transkriptionsmodell ska jag välja?

Använd **Whisper Base** för tydliga inspelningar eller ett första utkast. **Whisper Small** kan hjälpa med accenter och samtal. **Whisper Large V3 Turbo** passar för brusiga inspelningar eller tal som är svårt att uppfatta, men kräver en större nedladdning och mer minne. Whisper-modellerna transkriberar flera språk på originalspråket. **SenseVoiceSmall** stöder mandarin, kantonesiska, engelska, japanska och koreanska. **Qwen3-ASR 0.6B** erbjuder ren text eller tidsanpassning för uppspelning och undertexter; tidsanpassning laddar ner en extra modell. Ren text kan exporteras som TXT. Qwen använder WebGPU för igenkänning om det är tillgängligt, annars processorn; tidsanpassningen körs på processorn.

Whisper använder WebGPU när webbläsaren och grafikhårdvaran stöder det. Modellen du valt laddas ned första gången du använder den. Webbläsaren kan återanvända modellfilerna som finns kvar i cacheminnet. Nedladdningsstorleken och bearbetningstiden beror på modell och enhet. Inspelningen läses in och transkriberas på din enhet. Ingen inspelad ljuddata skickas när modellen laddas ned. SenseVoiceSmall körs lokalt på processorn via WebAssembly. Om WebGPU inte är tillgängligt använder Whisper processorn via WebAssembly.

## Exportera en transkription med tidsstämplar eller undertexter

- **TXT** ger varje textavsnitt en starttid. Till exempel hänvisar `[00:02:15.320] Nu går vi igenom dagordningen.` till en rad drygt två minuter in i inspelningen. Det passar för mötesanteckningar, intervjucitat och sökbar text.
- **SRT (SubRip)** anger start- och sluttid för varje numrerad undertext. Formatet är vanligt i videoredigeringsprogram.
- **VTT (WebVTT)** anger också start- och sluttid för varje undertext och fungerar i HTML-videospelare med stöd för undertextspår.

Verktyget uppskattar när varje talat avsnitt börjar och slutar. Lyssna på viktiga citat och kontrollera att undertexterna ligger rätt i tiden innan du delar dem. Bakgrundsljud och röster som överlappar kan påverka resultatet. Transkriptionen är indelad i avsnitt efter tid.
