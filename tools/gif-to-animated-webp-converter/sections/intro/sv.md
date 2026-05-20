Animerad WebP kan behålla rörelsen från en GIF och samtidigt ofta skapa mindre filer för webbplatser, produktförhandsvisningar, dokumentation och resurser som fungerar bra i chattar. Den här konverteraren körs lokalt och skickar, när du behåller standardinställningarna för skala, hastighet och loopning, den ursprungliga GIF-filen genom en förlustfri `gif2webp`-kodare för minsta storlek innan den exporterar `.webp`-filer.

## När du ska använda den

Använd det här verktyget när du har animerade GIF-filer som behöver ett modernare webbformat, särskilt för sidor där filstorlek och laddningshastighet är viktiga. Animerad WebP stöds av dagens större webbläsare och kan bevara transparens, timing och loopbeteende.

## Konverteringsalternativ

Skalning ändrar varje bildruta före kodning, vilket är användbart när en GIF är större än platsen där den ska visas. Hastighet ändrar uppspelningstimingen utan att ta bort bildrutor. Loopbeteende kan följa käll-GIF:en, tvinga oändlig uppspelning eller använda ett eget antal för resurser som ska stoppas efter ett visst antal uppspelningar. Om skalan behålls på 100%, hastigheten på 1x och loopbeteendet är inställt på Follow GIF används den förvalda förlustfria vägen för minsta storlek.

## Integritet och begränsningar

Konverteringen körs i din webbläsare. Förlustfri WebP komprimerar oftast animationer i GIF-stil bättre, men det går inte att garantera att varje resultat blir mindre; mycket små eller redan optimerade GIF-filer kan bli större eftersom WebP-behållaren ändå har overhead. Att ändra skala, hastighet eller loopbeteende kräver bildruteavkodning och kan använda mycket minne för mycket stora GIF-filer. Om käll-GIF:en inte innehåller loopmetadata spelas standardexporten upp en gång om du inte väljer oändlig eller egen loopning.
