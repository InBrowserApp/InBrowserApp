## Vad det här verktyget visar

Enhetsinformation samlar in de uppgifter som webbläsaren kan se om enheten du använder just nu. Det grupperar resultaten i avsnitt för webbläsare, skärm, hårdvara, nätverk, lagring och funktionsstöd så att du snabbt kan se vad en webbplats kan upptäcka utan att installera diagnostikprogram.

## När det hjälper

Använd det när du behöver felsöka responsiva layouter, återskapa supportärenden, jämföra webbläsare, bekräfta om cookies eller lokal lagring är tillgängliga, kontrollera skärmdimensioner eller fånga en kompakt JSON-ögonblicksbild för en felrapport. Det är också användbart innan du testar canvas, WebGL, urklipp, service worker eller funktioner som är beroende av lagring.

## Integritet och noggrannhet

Verktyget körs helt i din webbläsare och laddar inte upp ögonblicksbilden. Webbläsare döljer eller avrundar avsiktligt vissa värden, särskilt minne, CPU, GPU, nätverk och User-Agent-detaljer. Saknade värden betyder vanligtvis att webbläsaren inte exponerar API:t, att sidan inte körs i en säker kontext eller att en sekretessinställning blockerade åtkomsten.

## Så läser du resultaten

Behandla uppgifterna som webbläsarens aktuella bild av din miljö, inte som en garanterad hårdvaruinventering. Ändra fönsterstorleken eller rotera enheten och uppdatera sedan ögonblicksbilden för att uppdatera viewport-, orienterings- och skärmvärden. Använd åtgärden Kopiera JSON när du behöver dela de exakta observerade värdena med en utvecklare eller ett supportteam.
