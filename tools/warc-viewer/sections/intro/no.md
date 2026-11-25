## Åpne et WARC-nettarkiv

Velg eller slipp en `.warc`- eller `.warc.gz`-fil, eller prøv eksempelarkivet. Viseren lager en liste over arkivpostene og åpner den første lagrede HTML-siden den finner. Filtrer etter nettadresse eller posttype for å finne riktig post, og veksle mellom forhåndsvisningen og postdetaljene. Indeksering av store arkiver kan ta litt tid. Filen blir i nettleseren din.

## Les arkiveringstidspunkt og hoder

En Web ARChive-fil (WARC) inneholder poster som samles inn når en webrobot eller et arkiveringsverktøy besøker et nettsted. Flere poster kan ha samme nettadresse. Se på arkiveringstidspunktet i UTC og den opprinnelige HTTP-statusen for å skille dem fra hverandre. En svarpost inneholder svaret fra serveren. En forespørselspost beskriver hva webroboten sendte, og en post for gjenbesøk kan henvise til en annen arkivering uten å lagre siden på nytt. Du kan undersøke disse postene også når det ikke finnes en side å forhåndsvise.

## Hva viser forhåndsvisningen?

Den statiske forhåndsvisningen bruker HTML og støttede bilder og stilark fra det samme arkivet. Ressurser som mangler, kan endre layouten eller føre til tomme felt. Skript er slått av, og forhåndsvisningen sender ingen forespørsler til det opprinnelige nettstedet. Interaktive funksjoner som innlogging og videoavspilling er derfor utilgjengelige. Viseren støtter WARC 1.0 og 1.1, inkludert gzip-komprimerte poster.

[Spesifikasjon for WARC-formatet](https://iipc.github.io/warc-specifications/specifications/warc-format/warc-1.1/)
