## Öppna ett WARC-webbarkiv

Välj eller släpp en `.warc`- eller `.warc.gz`-fil, eller prova exempelarkivet. Visaren listar arkivposterna och öppnar den första sparade HTML-sidan den hittar. Filtrera efter webbadress eller posttyp för att hitta rätt post och växla sedan mellan sidans förhandsgranskning och postdetaljerna. Det kan ta en stund att indexera stora arkiv. Filen stannar i din webbläsare.

## Läs arkiveringstider och huvuden

En Web ARChive-fil (WARC) innehåller poster som samlas in när en webbrobot eller ett arkiveringsverktyg besöker en webbplats. Flera poster kan avse samma webbadress. Använd arkiveringstiden i UTC och den ursprungliga HTTP-statusen för att skilja dem åt. En svarspost innehåller serverns svar. En post för en begäran beskriver vad webbroboten skickade, och en återbesökspost kan hänvisa till en annan arkivering utan att spara sidan på nytt. Du kan granska de här posterna även när det saknas en sida att förhandsgranska.

## Vad ingår i förhandsgranskningen?

Den statiska förhandsgranskningen använder HTML samt bilder och stilmallar från samma arkiv i format som stöds. Om resurser saknas kan layouten förändras eller delar av sidan lämnas tomma. Skript är inaktiverade och förhandsgranskningen skickar inga förfrågningar till den ursprungliga webbplatsen. Därför är interaktiva funktioner som inloggning och videouppspelning inte tillgängliga. Visaren stöder WARC 1.0 och 1.1, även gzip-komprimerade poster.

[Specifikation för WARC-formatet](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
