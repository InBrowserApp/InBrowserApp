## Forhåndsvis en Graphviz DOT-graf på nett

Lim inn DOT-kode fra en fil, et skript eller dokumentasjon i **DOT-kildekode**. Grafen oppdateres mens du skriver. Bruk `digraph` og `->` for rettede kanter, eller `graph` og `--` for urettede kanter. De innebygde eksemplene viser hvordan du beskriver avhengigheter, nettverk og klynger i DOT.

## Velg en layoutmotor i Graphviz

Begynn med `dot` for grafer i lag, for eksempel avhengigheter i et byggesystem. Prøv `neato` eller `fdp` for å spre nodene i et urettet nettverk, eller `sfdp` for større nettverk. Velg `circo` for sirkeloppsett, `twopi` for et radialt tre, `osage` for grafer med klynger eller `patchwork` for trekart. DOT-koden blir stående når du bytter motor.

## Forstå meldinger om layout og syntaks

Graphviz kan melde om en feil når kantoperatoren ikke passer til graftypen, eller når det mangler en krøllparentes eller et anførselstegn. Sjekk linjen i feilmeldingen og linjen over. Graphviz kan også vise grafen med merknader om attributter som ikke kunne brukes. Hvis grafen har sitt eget `layout`-attributt, bruker Graphviz motoren som er angitt der. Se [referansen for DOT-språket](https://graphviz.org/doc/info/lang.html) og [veiledningen til Graphviz-layout](https://graphviz.org/docs/layouts/) for detaljer.

## Last ned en graf som SVG

Velg **Last ned SVG** for å lagre det gjeldende oppsettet som et vektorbilde. **Tilpass til visningen** og **Faktisk størrelse** endrer bare forhåndsvisningen. Behold DOT-kildekoden hvis du vil redigere grafen senere.
