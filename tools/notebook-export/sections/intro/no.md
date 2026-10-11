## Eksporter en lagret Jupyter-notatbok

Åpne en IPYNB-notatbok og velg HTML, Markdown eller kode. HTML og Markdown bevarer cellene i lagret rekkefølge, inkludert lagrede utdata som støttes. Alt forblir i nettleseren din. Ingen kjerne eller kjøremiljø for kode eller widgeter startes.

## Velg et nyttig utdataformat

HTML er en selvstendig lesekopi med tekst som kan markeres, inkluderte bilder som støttes, og lesbare tabeller. Markdown gir dokumentinnhold som kan gjenbrukes. Tabeller kan inneholde trygg HTML, og bilder bruker innebygde data-URL-er som enkelte Markdown-programmer ikke viser. Opprinnelig oppsett og formatering kan endres.

Kodeeksport bevarer kodecellene i rekkefølge og utelater Markdown, råtekstceller og lagrede utdata. Et gjenkjent notatbokspråk bestemmer skriptets filendelse. Ukjente språk bruker TXT. Notatbokens magic-kommandoer og skallsyntaks beholdes som skrevet, så den eksporterte koden kan kreve manuell tilpasning eller den opprinnelige notatbokkjernen. En notatbok uten kodeceller gir en tom kodefil.

## Lagrede resultater og kompatibilitet

Konvertereren leser notatbokformat 4. Resultater kommer fra den lagrede filen og kan være utdaterte. Rikt innhold som ikke støttes, og utilgjengelige bilder markeres. Eksterne ressurser hentes ikke. Skript, widgeter, lyd og video kjøres eller spilles ikke av. LaTeX forblir kildetekst, og råtekstceller eller ukjente celler vises som lesbar tekst i dokumenteksporter.

Nettleserens ressurser bestemmer de praktiske grensene. Det er ingen fast grense for filstørrelse eller antall celler. Bruk [Jupyter-notatbokviser](/tools/notebook-viewer/) for å undersøke den opprinnelige notatboken.
