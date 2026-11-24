## Undersök frekvenserna i en ljudfil

Använd spektrumanalysatorn för att hitta ett lågfrekvent brum, jämföra frekvensinnehåll eller se var de höga frekvenserna faller bort i en inspelning. Diagrammet visar frekvens i hertz (Hz) och nivå i decibel relativt digital full skala (dBFS). Topparna visar vilka frekvensband som innehåller mest energi.

## Så visar du ett ljudspektrum

1. Välj en mono- eller stereofil i WAV, MP3, M4A, FLAC eller OGG, eller dra filen till verktyget. Vilka filer som går att avkoda beror på webbläsaren.
2. Leta efter den starkaste frekvensen. Peka eller tryck sedan på diagrammet för att läsa av en annan frekvens och dess nivå. Med reglaget kan du läsa av samma värden med tangentbordet.
3. Växla mellan logaritmisk och linjär skala vid behov. Spela upp originalfilen för att lyssna medan du granskar diagrammet. Analys och uppspelning sker på din enhet.

## Så läser du FFT-diagrammet

Verktyget avkodar ljudet vid 48 kHz och analyserar korta avsnitt fördelade över filen med snabb Fouriertransform (FFT). Avsnitten viktas med ett Hann-fönster före analysen. Verktyget beräknar avsnittens medeleffekt och kombinerar stereokanalernas effekt. Det gör att även ljud med fasskillnad mellan kanalerna syns. Diagrammet sträcker sig till 24 kHz. Nivåerna gäller de enskilda frekvensbanden i FFT-resultatet och skiljer sig därför från total ljudnivå, högsta sampelnivå och integrerad ljudstyrka i LUFS.

En skarp topp omkring 50 eller 60 Hz kan tyda på elektriskt brum. Ett plötsligt fall vid höga frekvenser kan bero på filtrering eller komprimering. En ensam topp kan vara en överton. Kontrollera närliggande toppar innan du använder den för att identifiera tonhöjden.

## När ska jag använda logaritmisk eller linjär skala?

Den logaritmiska skalan ger mer plats åt bas och mellanregister och gör det lättare att följa oktaver. På en linjär skala motsvarar lika stora frekvensskillnader i Hz lika långa avstånd, vilket gör det lättare att jämföra övertoner med jämna mellanrum. Diagrammet sammanfattar frekvensinnehållet i hela inspelningen. Med ett spektrogram kan du se när ett ljud uppstår och hur dess frekvens förändras över tid.
